const Habit = require('../models/mongo/Habit');
const HabitLog = require('../models/mongo/HabitLog');
const config = require('../config/config');

/**
 * GET /api/v1/habits — List user's habits
 */
const getHabits = async (req, res, next) => {
  try {
    const { status = 'active' } = req.query;
    const filter = { user_id: req.user.id };
    if (status !== 'all') filter.status = status;

    const habits = await Habit.find(filter).sort({ order: 1, created_at: -1 });

    // Get today's logs for completion status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLogs = await HabitLog.find({
      user_id: req.user.id,
      date: { $gte: today, $lt: tomorrow },
    });

    const logMap = {};
    todayLogs.forEach(log => {
      logMap[log.habit_id.toString()] = log.completed;
    });

    const habitsWithStatus = habits.map(h => ({
      ...h.toObject(),
      completed_today: logMap[h._id.toString()] || false,
    }));

    res.json({
      success: true,
      data: habitsWithStatus,
      count: habitsWithStatus.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/habits/:id — Get single habit with recent logs
 */
const getHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found.' });
    }

    // Get last 30 days of logs
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await HabitLog.find({
      habit_id: habit._id,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 });

    res.json({
      success: true,
      data: { ...habit.toObject(), recent_logs: logs },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/habits — Create a new habit
 */
const createHabit = async (req, res, next) => {
  try {
    // Check tier limits
    const tierLimits = config.tiers[req.user.plan];
    const currentCount = await Habit.countDocuments({ user_id: req.user.id, status: 'active' });

    if (currentCount >= tierLimits.maxHabits) {
      return res.status(403).json({
        success: false,
        message: `Your ${req.user.plan} plan allows up to ${tierLimits.maxHabits} active habits. Upgrade for unlimited.`,
        code: 'HABIT_LIMIT_REACHED',
        currentPlan: req.user.plan,
      });
    }

    const { name, description, frequency, target_days, color, icon } = req.body;

    const habit = await Habit.create({
      user_id: req.user.id,
      name,
      description,
      frequency: frequency || 'daily',
      target_days: target_days || 7,
      color: color || '#6C63FF',
      icon: icon || 'check-circle',
      order: currentCount,
    });

    res.status(201).json({
      success: true,
      message: 'Habit created!',
      data: habit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/habits/:id — Update a habit
 */
const updateHabit = async (req, res, next) => {
  try {
    const { name, description, frequency, target_days, color, icon, status, order } = req.body;
    const habit = await Habit.findOne({ _id: req.params.id, user_id: req.user.id });

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found.' });
    }

    if (name !== undefined) habit.name = name;
    if (description !== undefined) habit.description = description;
    if (frequency !== undefined) habit.frequency = frequency;
    if (target_days !== undefined) habit.target_days = target_days;
    if (color !== undefined) habit.color = color;
    if (icon !== undefined) habit.icon = icon;
    if (status !== undefined) habit.status = status;
    if (order !== undefined) habit.order = order;

    await habit.save();

    res.json({
      success: true,
      message: 'Habit updated.',
      data: habit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/habits/:id — Delete a habit and its logs
 */
const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found.' });
    }

    // Delete associated logs
    await HabitLog.deleteMany({ habit_id: habit._id });
    await habit.deleteOne();

    res.json({
      success: true,
      message: 'Habit and associated logs deleted.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/habits/:id/log — Log habit completion for a date
 */
const logHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found.' });
    }

    const { date, completed, synced_from } = req.body;
    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    // Upsert: create or update log for this date
    const existingLog = await HabitLog.findOne({ habit_id: habit._id, date: logDate });

    if (existingLog) {
      existingLog.completed = completed;
      existingLog.synced_from = synced_from || 'online';
      await existingLog.save();
    } else {
      await HabitLog.create({
        habit_id: habit._id,
        user_id: req.user.id,
        date: logDate,
        completed,
        synced_from: synced_from || 'online',
      });
    }

    // Update streak and completion count
    if (completed) {
      habit.total_completions += 1;
      // Calculate current streak
      const streak = await calculateStreak(habit._id);
      habit.current_streak = streak;
      if (streak > habit.best_streak) {
        habit.best_streak = streak;
      }
    } else {
      habit.current_streak = await calculateStreak(habit._id);
    }

    await habit.save();

    res.json({
      success: true,
      message: completed ? 'Habit completed! 🎉' : 'Habit log updated.',
      data: {
        habit_id: habit._id,
        date: logDate,
        completed,
        current_streak: habit.current_streak,
        best_streak: habit.best_streak,
        total_completions: habit.total_completions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate current streak for a habit (consecutive days completed going backwards from today)
 */
async function calculateStreak(habitId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const logs = await HabitLog.find({
    habit_id: habitId,
    completed: true,
    date: { $lte: today },
  }).sort({ date: -1 }).limit(365);

  if (logs.length === 0) return 0;

  let streak = 0;
  let checkDate = new Date(today);

  for (const log of logs) {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);

    const diff = Math.floor((checkDate - logDate) / (1000 * 60 * 60 * 24));

    if (diff === 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (diff === 1) {
      streak++;
      checkDate = new Date(logDate);
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

module.exports = { getHabits, getHabit, createHabit, updateHabit, deleteHabit, logHabit };
