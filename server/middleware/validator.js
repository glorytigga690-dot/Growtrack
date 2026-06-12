const { body, param, query, validationResult } = require('express-validator');

/**
 * Process validation results — returns 400 with error details if validation fails
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// ===== AUTH VALIDATORS =====

const registerRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email or username is required'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email or username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// ===== HABIT VALIDATORS =====

const createHabitRules = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Habit name is required (max 100 chars)'),
  body('frequency')
    .isIn(['daily', 'weekly', 'custom'])
    .withMessage('Frequency must be daily, weekly, or custom'),
  body('target_days')
    .isInt({ min: 1, max: 7 })
    .withMessage('Target days must be between 1 and 7'),
];

const logHabitRules = [
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO date'),
  body('completed')
    .isBoolean()
    .withMessage('Completed must be true or false'),
];

// ===== GOAL VALIDATORS =====

const createGoalRules = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Goal title is required (max 200 chars)'),
  body('target_date')
    .isISO8601()
    .withMessage('Target date must be a valid ISO date'),
];

const updateProgressRules = [
  body('progress_percent')
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
];

// ===== MOOD VALIDATORS =====

const logMoodRules = [
  body('mood_score')
    .isInt({ min: 1, max: 5 })
    .withMessage('Mood score must be between 1 and 5'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note must be under 500 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
];

// ===== PAGINATION =====

const paginationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  createHabitRules,
  logHabitRules,
  createGoalRules,
  updateProgressRules,
  logMoodRules,
  paginationRules,
};
