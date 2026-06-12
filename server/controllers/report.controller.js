const { calculateGrowthScore } = require('../services/growthScore');
const { calculateCorrelation } = require('../services/correlation');
const ReportSnapshot = require('../models/mongo/ReportSnapshot');
const Habit = require('../models/mongo/Habit');
const HabitLog = require('../models/mongo/HabitLog');
const Goal = require('../models/mongo/Goal');
const MoodLog = require('../models/mongo/MoodLog');

/**
 * GET /api/v1/reports/growth-score
 */
const getGrowthScore = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const result = await calculateGrowthScore(req.user.id, startDate, endDate);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/reports/correlation
 */
const getCorrelation = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const result = await calculateCorrelation(req.user.id, parseInt(days));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/reports/weekly
 */
const getWeeklyReport = async (req, res, next) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const report = await generateReport(req.user.id, startDate, endDate, 'weekly');

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/reports/monthly
 */
const getMonthlyReport = async (req, res, next) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    const report = await generateReport(req.user.id, startDate, endDate, 'monthly');

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/reports/dashboard-summary — Quick stats for dashboard
 */
const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Today's habits
    const activeHabits = await Habit.countDocuments({ user_id: userId, status: 'active' });
    const todayLogs = await HabitLog.find({
      user_id: userId,
      date: { $gte: today, $lt: tomorrow },
      completed: true,
    });

    // Active goals
    const activeGoals = await Goal.countDocuments({ user_id: userId, status: 'active' });
    const completedGoals = await Goal.countDocuments({ user_id: userId, status: 'completed' });

    // Today's mood
    const todayMood = await MoodLog.findOne({ user_id: userId, date: today });

    // Week's growth score
    const growthResult = await calculateGrowthScore(userId, weekAgo, new Date());

    // Recent activity (last 5 habit logs)
    const recentActivity = await HabitLog.find({ user_id: userId, completed: true })
      .sort({ created_at: -1 })
      .limit(5)
      .populate('habit_id', 'name color icon');

    res.json({
      success: true,
      data: {
        habits: {
          active: activeHabits,
          completed_today: todayLogs.length,
        },
        goals: {
          active: activeGoals,
          completed: completedGoals,
        },
        mood: {
          today: todayMood ? todayMood.mood_score : null,
          logged: !!todayMood,
        },
        growth_score: growthResult.growth_score,
        growth_breakdown: growthResult.breakdown,
        recent_activity: recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/reports/history — Past report snapshots
 */
const getReportHistory = async (req, res, next) => {
  try {
    const { period = 'weekly', limit = 12 } = req.query;

    const snapshots = await ReportSnapshot.find({
      user_id: req.user.id,
      period,
    }).sort({ start_date: -1 }).limit(parseInt(limit));

    res.json({ success: true, data: snapshots });
  } catch (error) {
    next(error);
  }
};

/**
 * Internal: Generate and optionally save a report
 */
async function generateReport(userId, startDate, endDate, period) {
  const growthResult = await calculateGrowthScore(userId, startDate, endDate);
  const correlationResult = await calculateCorrelation(userId, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));

  // Habit details
  const habits = await Habit.find({ user_id: userId, status: 'active' });
  const habitDetails = [];

  for (const habit of habits) {
    const logs = await HabitLog.find({
      habit_id: habit._id,
      date: { $gte: startDate, $lte: endDate },
    });

    const completed = logs.filter(l => l.completed).length;
    const total = logs.length;

    habitDetails.push({
      name: habit.name,
      color: habit.color,
      completed,
      total,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      current_streak: habit.current_streak,
    });
  }

  // Goals progress
  const goals = await Goal.find({ user_id: userId });
  const goalDetails = goals.map(g => ({
    title: g.title,
    progress: g.progress_percent,
    status: g.status,
    target_date: g.target_date,
  }));

  // Mood trend
  const moods = await MoodLog.find({
    user_id: userId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });

  const moodTrend = moods.map(m => ({
    date: m.date,
    score: m.mood_score,
  }));

  const report = {
    period,
    start_date: startDate,
    end_date: endDate,
    growth_score: growthResult.growth_score,
    growth_breakdown: growthResult.breakdown,
    habits: habitDetails,
    goals: goalDetails,
    mood_trend: moodTrend,
    correlation: correlationResult,
    insights: correlationResult.insights || [],
  };

  // Save snapshot
  try {
    await ReportSnapshot.create({
      user_id: userId,
      period,
      start_date: startDate,
      end_date: endDate,
      growth_score: growthResult.growth_score,
      consistency: growthResult.breakdown.habit_consistency,
      mood_avg: growthResult.breakdown.mood_avg,
      mood_stability: growthResult.breakdown.mood_stability,
      streak_bonus: growthResult.breakdown.streak_bonus,
      total_habits_tracked: habits.length,
      total_habits_completed: habitDetails.reduce((s, h) => s + h.completed, 0),
      total_goals_active: goals.filter(g => g.status === 'active').length,
      total_goals_completed: goals.filter(g => g.status === 'completed').length,
      insights: correlationResult.insights.map((msg, i) => ({
        type: 'correlation',
        message: msg,
        value: i,
      })),
    });
  } catch (e) {
    // Non-critical — log but don't fail
    console.warn('Failed to save report snapshot:', e.message);
  }

  return report;
}

module.exports = { getGrowthScore, getCorrelation, getWeeklyReport, getMonthlyReport, getDashboardSummary, getReportHistory };
