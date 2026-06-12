const Habit = require('../models/mongo/Habit');
const HabitLog = require('../models/mongo/HabitLog');
const MoodLog = require('../models/mongo/MoodLog');

/**
 * Growth Score Algorithm
 * ========================
 * Growth Score = (Habit Consistency × 0.5) + (Mood Stability × 0.3) + (Streak Bonus × 0.2)
 * 
 * Where:
 *   Habit Consistency = (Total Completed Days / Total Target Days) × 100
 *   Mood Stability    = max(0, 100 - (StdDev(mood_scores) × 10))
 *   Streak Bonus      = min(10, max_current_streak) × 10  (normalized to 0-100)
 */

/**
 * Calculate growth score for a user over a date range
 * @param {Number} userId - MySQL user ID
 * @param {Date} startDate - Start of period
 * @param {Date} endDate - End of period
 * @returns {Object} Growth score breakdown
 */
const calculateGrowthScore = async (userId, startDate, endDate) => {
  // ===== 1. HABIT CONSISTENCY =====
  const habits = await Habit.find({ user_id: userId, status: 'active' });

  let totalTargetDays = 0;
  let totalCompletedDays = 0;

  for (const habit of habits) {
    const logs = await HabitLog.find({
      habit_id: habit._id,
      user_id: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Calculate target days in this period
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const targetInPeriod = Math.min(daysDiff, habit.target_days * Math.ceil(daysDiff / 7));
    totalTargetDays += targetInPeriod;

    // Count completed days
    const completedInPeriod = logs.filter(l => l.completed).length;
    totalCompletedDays += completedInPeriod;
  }

  const habitConsistency = totalTargetDays > 0
    ? Math.min(100, (totalCompletedDays / totalTargetDays) * 100)
    : 0;

  // ===== 2. MOOD STABILITY =====
  const moodLogs = await MoodLog.find({
    user_id: userId,
    date: { $gte: startDate, $lte: endDate },
  });

  let moodStability = 50; // Default if no mood data
  let moodAvg = 0;

  if (moodLogs.length > 0) {
    const scores = moodLogs.map(m => m.mood_score);
    moodAvg = scores.reduce((a, b) => a + b, 0) / scores.length;

    const variance = scores.reduce((sum, s) => sum + Math.pow(s - moodAvg, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    moodStability = Math.max(0, 100 - (stdDev * 10));
  }

  // ===== 3. STREAK BONUS =====
  let maxStreak = 0;
  for (const habit of habits) {
    if (habit.current_streak > maxStreak) {
      maxStreak = habit.current_streak;
    }
  }
  const streakBonus = Math.min(10, maxStreak) * 10; // Normalize to 0-100

  // ===== FINAL SCORE =====
  const growthScore = Math.round(
    (habitConsistency * 0.5) + (moodStability * 0.3) + (streakBonus * 0.2)
  );

  return {
    growth_score: Math.min(100, Math.max(0, growthScore)),
    breakdown: {
      habit_consistency: Math.round(habitConsistency * 100) / 100,
      mood_stability: Math.round(moodStability * 100) / 100,
      streak_bonus: streakBonus,
      mood_avg: Math.round(moodAvg * 100) / 100,
    },
    meta: {
      total_habits: habits.length,
      total_target_days: totalTargetDays,
      total_completed_days: totalCompletedDays,
      total_mood_logs: moodLogs.length,
      max_streak: maxStreak,
      period: {
        start: startDate,
        end: endDate,
      },
    },
  };
};

module.exports = { calculateGrowthScore };
