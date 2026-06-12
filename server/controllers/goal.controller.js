const Goal = require('../models/mongo/Goal');
const config = require('../config/config');

/**
 * GET /api/v1/goals
 */
const getGoals = async (req, res, next) => {
  try {
    const { status = 'active' } = req.query;
    const filter = { user_id: req.user.id };
    if (status !== 'all') filter.status = status;

    const goals = await Goal.find(filter).sort({ target_date: 1, created_at: -1 });

    res.json({
      success: true,
      data: goals,
      count: goals.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/goals/:id
 */
const getGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found.' });
    }
    res.json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/goals
 */
const createGoal = async (req, res, next) => {
  try {
    // Check tier limits
    const tierLimits = config.tiers[req.user.plan];
    const currentCount = await Goal.countDocuments({ user_id: req.user.id, status: 'active' });

    if (currentCount >= tierLimits.maxGoals) {
      return res.status(403).json({
        success: false,
        message: `Your ${req.user.plan} plan allows up to ${tierLimits.maxGoals} active goal(s). Upgrade for unlimited.`,
        code: 'GOAL_LIMIT_REACHED',
        currentPlan: req.user.plan,
      });
    }

    const { title, description, target_date, color, category, milestones } = req.body;

    const goal = await Goal.create({
      user_id: req.user.id,
      title,
      description,
      target_date,
      color: color || '#FF6B6B',
      category: category || 'personal',
      milestones: milestones || [],
    });

    res.status(201).json({
      success: true,
      message: 'Goal created!',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/goals/:id
 */
const updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found.' });
    }

    const { title, description, target_date, color, category, status, milestones } = req.body;

    if (title !== undefined) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (target_date !== undefined) goal.target_date = target_date;
    if (color !== undefined) goal.color = color;
    if (category !== undefined) goal.category = category;
    if (status !== undefined) goal.status = status;
    if (milestones !== undefined) goal.milestones = milestones;

    await goal.save();

    res.json({ success: true, message: 'Goal updated.', data: goal });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/goals/:id/progress
 */
const updateProgress = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found.' });
    }

    const { progress_percent } = req.body;
    goal.progress_percent = progress_percent;

    // Auto-complete if 100%
    if (progress_percent >= 100) {
      goal.status = 'completed';
    }

    await goal.save();

    res.json({
      success: true,
      message: progress_percent >= 100 ? 'Goal completed! 🎉' : 'Progress updated.',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/goals/:id
 */
const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found.' });
    }

    await goal.deleteOne();
    res.json({ success: true, message: 'Goal deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getGoals, getGoal, createGoal, updateGoal, updateProgress, deleteGoal };
