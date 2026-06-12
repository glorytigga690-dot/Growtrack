const mongoose = require('mongoose');
const { getModel } = require('./dbHelper');

const goalSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: '',
  },
  target_date: {
    type: Date,
    required: [true, 'Target date is required'],
  },
  progress_percent: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active',
  },
  milestones: [{
    title: { type: String, maxlength: 200 },
    completed: { type: Boolean, default: false },
    completed_at: { type: Date },
  }],
  color: {
    type: String,
    default: '#FF6B6B',
  },
  category: {
    type: String,
    enum: ['health', 'career', 'education', 'personal', 'financial', 'social', 'other'],
    default: 'personal',
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

goalSchema.index({ user_id: 1, status: 1 });
goalSchema.index({ user_id: 1, target_date: 1 });

module.exports = getModel('Goal', goalSchema);
