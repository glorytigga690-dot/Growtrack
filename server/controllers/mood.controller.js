const MoodLog = require('../models/mongo/MoodLog');

/**
 * POST /api/v1/moods — Log mood for today
 */
const logMood = async (req, res, next) => {
  try {
    const { mood_score, note, tags, date, synced_from } = req.body;

    const logDate = date ? new Date(date) : new Date();
    logDate.setHours(0, 0, 0, 0);

    // Check for existing mood log today (update if exists)
    const existing = await MoodLog.findOne({
      user_id: req.user.id,
      date: logDate,
    });

    if (existing) {
      existing.mood_score = mood_score;
      if (note !== undefined) existing.note = note;
      if (tags !== undefined) existing.tags = tags;
      existing.synced_from = synced_from || 'online';
      await existing.save();

      return res.json({
        success: true,
        message: 'Mood updated for today.',
        data: existing,
      });
    }

    const moodLog = await MoodLog.create({
      user_id: req.user.id,
      date: logDate,
      mood_score,
      note: note || '',
      tags: tags || [],
      synced_from: synced_from || 'online',
    });

    res.status(201).json({
      success: true,
      message: 'Mood logged! 🌟',
      data: moodLog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/moods — Get mood history with optional date range
 */
const getMoods = async (req, res, next) => {
  try {
    const { start, end, limit = 30 } = req.query;

    const filter = { user_id: req.user.id };

    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = new Date(start);
      if (end) filter.date.$lte = new Date(end);
    }

    const moods = await MoodLog.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: moods,
      count: moods.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/moods/stats — Get mood statistics
 */
const getMoodStats = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const moods = await MoodLog.find({
      user_id: req.user.id,
      date: { $gte: startDate },
    }).sort({ date: -1 });

    if (moods.length === 0) {
      return res.json({
        success: true,
        data: {
          average: 0,
          stability: 0,
          total_logs: 0,
          best_day: null,
          worst_day: null,
          trend: 'neutral',
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        },
      });
    }

    const scores = moods.map(m => m.mood_score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Standard deviation
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    const stability = Math.max(0, 100 - (stdDev * 10));

    // Distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    scores.forEach(s => distribution[s]++);

    // Trend (compare first half vs second half)
    const mid = Math.floor(scores.length / 2);
    const recentAvg = scores.slice(0, mid).reduce((a, b) => a + b, 0) / mid || 0;
    const olderAvg = scores.slice(mid).reduce((a, b) => a + b, 0) / (scores.length - mid) || 0;
    let trend = 'neutral';
    if (recentAvg - olderAvg > 0.3) trend = 'improving';
    else if (olderAvg - recentAvg > 0.3) trend = 'declining';

    // Best/worst days
    const best = moods.reduce((a, b) => a.mood_score >= b.mood_score ? a : b);
    const worst = moods.reduce((a, b) => a.mood_score <= b.mood_score ? a : b);

    // Most common tags
    const tagCount = {};
    moods.forEach(m => {
      (m.tags || []).forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    res.json({
      success: true,
      data: {
        average: Math.round(avg * 100) / 100,
        stability: Math.round(stability * 100) / 100,
        total_logs: moods.length,
        best_day: { date: best.date, score: best.mood_score },
        worst_day: { date: worst.date, score: worst.mood_score },
        trend,
        distribution,
        top_tags: topTags,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/moods/today — Get today's mood
 */
const getTodayMood = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mood = await MoodLog.findOne({
      user_id: req.user.id,
      date: today,
    });

    res.json({
      success: true,
      data: mood || null,
      logged: !!mood,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/moods/:id
 */
const deleteMood = async (req, res, next) => {
  try {
    const mood = await MoodLog.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!mood) {
      return res.status(404).json({ success: false, message: 'Mood log not found.' });
    }
    await mood.deleteOne();
    res.json({ success: true, message: 'Mood log deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { logMood, getMoods, getMoodStats, getTodayMood, deleteMood };
