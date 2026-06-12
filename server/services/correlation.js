const HabitLog = require('../models/mongo/HabitLog');
const MoodLog = require('../models/mongo/MoodLog');

/**
 * Mood-Habit Correlation Engine
 * Groups habit completion rate by mood score (1-5)
 * Generates insight strings for the dashboard
 */

/**
 * Calculate correlation between mood scores and habit completion rates
 * @param {Number} userId
 * @param {Number} days - Number of days to analyze
 * @returns {Object} Correlation data and insights
 */
const calculateCorrelation = async (userId, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get all mood logs and habit logs in period
  const moodLogs = await MoodLog.find({
    user_id: userId,
    date: { $gte: startDate },
  }).sort({ date: 1 });

  const habitLogs = await HabitLog.find({
    user_id: userId,
    date: { $gte: startDate },
  });

  if (moodLogs.length === 0 || habitLogs.length === 0) {
    return {
      correlation: null,
      by_mood_score: {},
      insights: ['Log more moods and habits to see correlations.'],
      data_points: 0,
    };
  }

  // Build a date → mood_score map
  const dateMoodMap = {};
  moodLogs.forEach(m => {
    const d = m.date instanceof Date ? m.date : new Date(m.date);
    const key = d.toISOString().split('T')[0];
    dateMoodMap[key] = m.mood_score;
  });

  // Group habit completion by mood score
  const byMoodScore = { 1: { total: 0, completed: 0 }, 2: { total: 0, completed: 0 }, 3: { total: 0, completed: 0 }, 4: { total: 0, completed: 0 }, 5: { total: 0, completed: 0 } };

  habitLogs.forEach(log => {
    const d = log.date instanceof Date ? log.date : new Date(log.date);
    const dateKey = d.toISOString().split('T')[0];
    const moodScore = dateMoodMap[dateKey];
    if (moodScore) {
      byMoodScore[moodScore].total++;
      if (log.completed) {
        byMoodScore[moodScore].completed++;
      }
    }
  });

  // Calculate completion rates per mood level
  const completionRates = {};
  for (let score = 1; score <= 5; score++) {
    const data = byMoodScore[score];
    completionRates[score] = data.total > 0
      ? Math.round((data.completed / data.total) * 100)
      : null;
  }

  // Generate insights
  const insights = generateInsights(completionRates, byMoodScore);

  // Calculate simple correlation coefficient
  const validPairs = [];
  for (let score = 1; score <= 5; score++) {
    if (completionRates[score] !== null) {
      validPairs.push({ mood: score, rate: completionRates[score] });
    }
  }

  let correlation = 0;
  if (validPairs.length >= 2) {
    const n = validPairs.length;
    const sumX = validPairs.reduce((s, p) => s + p.mood, 0);
    const sumY = validPairs.reduce((s, p) => s + p.rate, 0);
    const sumXY = validPairs.reduce((s, p) => s + p.mood * p.rate, 0);
    const sumX2 = validPairs.reduce((s, p) => s + p.mood * p.mood, 0);
    const sumY2 = validPairs.reduce((s, p) => s + p.rate * p.rate, 0);

    const denom = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    correlation = denom > 0 ? (n * sumXY - sumX * sumY) / denom : 0;
  }

  return {
    correlation: Math.round(correlation * 100) / 100,
    completion_rates: completionRates,
    by_mood_score: byMoodScore,
    insights,
    data_points: moodLogs.length,
  };
};

/**
 * Generate human-readable insight strings
 */
function generateInsights(rates, raw) {
  const insights = [];

  const highMood = rates[4] || rates[5];
  const lowMood = rates[1] || rates[2];

  if (highMood !== null && lowMood !== null && highMood > lowMood) {
    const diff = highMood - lowMood;
    insights.push(`You complete ${diff}% more habits on high-mood days (4-5) vs low-mood days (1-2).`);
  }

  // Best mood level for productivity
  let bestScore = null;
  let bestRate = -1;
  for (let score = 1; score <= 5; score++) {
    if (rates[score] !== null && rates[score] > bestRate) {
      bestRate = rates[score];
      bestScore = score;
    }
  }

  if (bestScore) {
    const moodEmoji = ['', '😢', '😕', '😐', '😊', '🤩'][bestScore];
    insights.push(`Your most productive mood level is ${bestScore}/5 ${moodEmoji} with a ${bestRate}% completion rate.`);
  }

  // Consistency insight
  const allRates = Object.values(rates).filter(r => r !== null);
  if (allRates.length > 0) {
    const avg = allRates.reduce((a, b) => a + b, 0) / allRates.length;
    if (avg >= 70) {
      insights.push('Great consistency! You maintain habits well regardless of mood. 💪');
    } else if (avg >= 50) {
      insights.push('Moderate consistency. Try habit stacking to build stronger routines.');
    } else {
      insights.push('Your habits are mood-dependent. Start with 1-2 tiny habits to build momentum.');
    }
  }

  return insights;
}

module.exports = { calculateCorrelation };
