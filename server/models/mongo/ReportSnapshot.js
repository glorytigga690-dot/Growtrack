const mongoose = require('mongoose');
const { getModel } = require('./dbHelper');

const reportSnapshotSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    index: true,
  },
  period: {
    type: String,
    enum: ['weekly', 'monthly'],
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  growth_score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  consistency: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  mood_avg: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  mood_stability: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  streak_bonus: {
    type: Number,
    default: 0,
  },
  total_habits_tracked: {
    type: Number,
    default: 0,
  },
  total_habits_completed: {
    type: Number,
    default: 0,
  },
  total_goals_active: {
    type: Number,
    default: 0,
  },
  total_goals_completed: {
    type: Number,
    default: 0,
  },
  insights: [{
    type: { type: String },
    message: String,
    value: Number,
  }],
  generated_at: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

reportSnapshotSchema.index({ user_id: 1, period: 1, start_date: -1 });

module.exports = getModel('ReportSnapshot', reportSnapshotSchema);
