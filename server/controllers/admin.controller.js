const User = require('../models/mysql/User');
const Subscription = require('../models/mysql/Subscription');
const Payment = require('../models/mysql/Payment');
const AdminLog = require('../models/mysql/AdminLog');
const Habit = require('../models/mongo/Habit');
const HabitLog = require('../models/mongo/HabitLog');
const Goal = require('../models/mongo/Goal');
const MoodLog = require('../models/mongo/MoodLog');
const { Op } = require('sequelize');

/**
 * GET /api/v1/admin/users — List all users with pagination & search
 */
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', role, plan, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (role) where.role = role;
    if (plan) where.plan = plan;
    if (status === 'active') where.is_active = true;
    if (status === 'suspended') where.is_active = false;

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: ['id', 'name', 'email', 'role', 'plan', 'is_active', 'last_login', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/users/:id — Get user details
 */
const getUserDetail = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const subscription = await Subscription.findOne({
      where: { user_id: user.id },
      order: [['created_at', 'DESC']],
    });

    // Get user stats from MongoDB
    const habitCount = await Habit.countDocuments({ user_id: user.id });
    const goalCount = await Goal.countDocuments({ user_id: user.id });
    const moodCount = await MoodLog.countDocuments({ user_id: user.id });
    const logCount = await HabitLog.countDocuments({ user_id: user.id });

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        subscription: subscription ? subscription.toJSON() : null,
        stats: { habits: habitCount, goals: goalCount, mood_logs: moodCount, habit_logs: logCount },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/admin/users/:id/suspend — Suspend user
 */
const suspendUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot suspend admin users.' });

    user.is_active = false;
    await user.save();

    await AdminLog.create({
      admin_id: req.user.id,
      action: 'user_suspended',
      target_user_id: user.id,
      ip_address: req.ip,
      details: JSON.stringify({ reason: req.body.reason || 'No reason provided' }),
    });

    res.json({ success: true, message: `User ${user.email} suspended.` });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/admin/users/:id/activate — Activate user
 */
const activateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.is_active = true;
    await user.save();

    await AdminLog.create({
      admin_id: req.user.id,
      action: 'user_activated',
      target_user_id: user.id,
      ip_address: req.ip,
    });

    res.json({ success: true, message: `User ${user.email} activated.` });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/admin/users/:id — Delete user and all data
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin users.' });

    // Delete MongoDB data
    const habits = await Habit.find({ user_id: user.id });
    const habitIds = habits.map(h => h._id);
    await HabitLog.deleteMany({ habit_id: { $in: habitIds } });
    await Habit.deleteMany({ user_id: user.id });
    await Goal.deleteMany({ user_id: user.id });
    await MoodLog.deleteMany({ user_id: user.id });

    // Delete MySQL data
    await Payment.destroy({ where: { user_id: user.id } });
    await Subscription.destroy({ where: { user_id: user.id } });

    await AdminLog.create({
      admin_id: req.user.id,
      action: 'user_deleted',
      target_user_id: user.id,
      ip_address: req.ip,
      details: JSON.stringify({ email: user.email, name: user.name }),
    });

    await user.destroy();

    res.json({ success: true, message: `User ${user.email} and all data deleted.` });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/analytics — System-wide analytics
 */
const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { is_active: true } });
    const suspendedUsers = await User.count({ where: { is_active: false } });

    // Plan distribution
    const freePlan = await User.count({ where: { plan: 'free' } });
    const proPlan = await User.count({ where: { plan: 'pro' } });
    const teamPlan = await User.count({ where: { plan: 'team' } });

    // Last 30 days registrations
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSignups = await User.count({
      where: { created_at: { [Op.gte]: thirtyDaysAgo } },
    });

    // Last 7 days active (logged in)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyActive = await User.count({
      where: { last_login: { [Op.gte]: sevenDaysAgo } },
    });

    // MongoDB stats
    const totalHabits = await Habit.countDocuments();
    const totalGoals = await Goal.countDocuments();
    const totalMoodLogs = await MoodLog.countDocuments();
    const totalHabitLogs = await HabitLog.countDocuments();

    // Revenue
    const totalRevenue = await Payment.sum('amount', {
      where: { status: 'succeeded' },
    }) || 0;

    res.json({
      success: true,
      data: {
        users: { total: totalUsers, active: activeUsers, suspended: suspendedUsers, recent_signups: recentSignups, weekly_active: weeklyActive },
        plans: { free: freePlan, pro: proPlan, team: teamPlan },
        activity: { habits: totalHabits, goals: totalGoals, mood_logs: totalMoodLogs, habit_logs: totalHabitLogs },
        revenue: { total: parseFloat(totalRevenue) },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/audit-logs — Audit log history
 */
const getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await AdminLog.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserDetail, suspendUser, activateUser, deleteUser, getAnalytics, getAuditLogs };
