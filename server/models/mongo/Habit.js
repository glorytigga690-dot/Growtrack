const mongoose = require('mongoose');
const { getModel } = require('./dbHelper');

const habitSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: '',
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily',
  },
  target_days: {
    type: Number,
    min: 1,
    max: 7,
    default: 7,
  },
  color: {
    type: String,
    default: '#6C63FF',
  },
  icon: {
    type: String,
    default: 'check-circle',
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'archived'],
    default: 'active',
  },
  current_streak: {
    type: Number,
    default: 0,
  },
  best_streak: {
    type: Number,
    default: 0,
  },
  total_completions: {
    type: Number,
    default: 0,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

// Compound index for user queries
habitSchema.index({ user_id: 1, status: 1 });
habitSchema.index({ user_id: 1, created_at: -1 });

module.exports = getModel('Habit', habitSchema);
