const Habit = require('../models/mongo/Habit');
const HabitLog = require('../models/mongo/HabitLog');
const MoodLog = require('../models/mongo/MoodLog');
const Goal = require('../models/mongo/Goal');

/**
 * POST /api/v1/sync — Process batched offline data
 */
const processBatchSync = async (req, res, next) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;
    const results = { success: 0, failed: 0, errors: [] };

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items to sync.' });
    }

    // Max 100 items per batch
    const batch = items.slice(0, 100);

    for (const item of batch) {
      try {
        switch (item.type) {
          case 'habit_log': {
            const logDate = new Date(item.data.date);
            logDate.setHours(0, 0, 0, 0);

            await HabitLog.findOneAndUpdate(
              { habit_id: item.data.habit_id, date: logDate },
              {
                habit_id: item.data.habit_id,
                user_id: userId,
                date: logDate,
                completed: item.data.completed,
                synced_from: 'offline',
              },
              { upsert: true, new: true }
            );
            results.success++;
            break;
          }

          case 'mood_log': {
            const moodDate = new Date(item.data.date);
            moodDate.setHours(0, 0, 0, 0);

            await MoodLog.findOneAndUpdate(
              { user_id: userId, date: moodDate },
              {
                user_id: userId,
                date: moodDate,
                mood_score: item.data.mood_score,
                note: item.data.note || '',
                tags: item.data.tags || [],
                synced_from: 'offline',
              },
              { upsert: true, new: true }
            );
            results.success++;
            break;
          }

          default:
            results.failed++;
            results.errors.push({ item: item.type, message: 'Unknown sync type' });
        }
      } catch (err) {
        results.failed++;
        results.errors.push({ item: item.type, message: err.message });
      }
    }

    res.json({
      success: true,
      message: `Synced ${results.success} items. ${results.failed} failed.`,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { processBatchSync };
