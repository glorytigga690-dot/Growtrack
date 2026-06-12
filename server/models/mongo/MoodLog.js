const mongoose = require('mongoose');
const { getModel } = require('./dbHelper');

const moodLogSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
  },
  mood_score: {
    type: Number,
    required: [true, 'Mood score is required'],
    min: 1,
    max: 5,
  },
  note: {
    type: String,
    trim: true,
    maxlength: 500,
    default: '',
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50,
  }],
  synced_from: {
    type: String,
    enum: ['online', 'offline'],
    default: 'online',
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

// One mood log per user per day
moodLogSchema.index({ user_id: 1, date: -1 });
// For mood-habit correlation queries
moodLogSchema.index({ user_id: 1, mood_score: 1 });

module.exports = getModel('MoodLog', moodLogSchema);
