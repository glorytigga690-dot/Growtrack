const mongoose = require('mongoose');
const { getModel } = require('./dbHelper');

const habitLogSchema = new mongoose.Schema({
  habit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
    index: true,
  },
  user_id: {
    type: Number,
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  synced_from: {
    type: String,
    enum: ['online', 'offline'],
    default: 'online',
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

// Prevent duplicate logs for same habit on same day
habitLogSchema.index({ habit_id: 1, date: 1 }, { unique: true });
// Fast lookups for user's daily/weekly/monthly logs
habitLogSchema.index({ user_id: 1, date: -1 });

module.exports = getModel('HabitLog', habitLogSchema);
