const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/mysql/User');
const Subscription = require('../models/mysql/Subscription');

/**
 * Generate JWT access and refresh tokens
 */
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, plan: user.plan },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

/**
 * POST /api/v1/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password_hash,
      role: 'client',
      plan: 'free',
    });

    // Create default free subscription
    await Subscription.create({
      user_id: user.id,
      plan_type: 'free',
      status: 'active',
    });

    // Generate tokens
    const tokens = generateTokens(user);

    // Update last login
    await user.update({ last_login: new Date() });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/login
 * Auto-registers users if they don't exist (prototype mode)
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    let user = await User.findOne({ where: { email } });

    // Auto-register if user doesn't exist
    if (!user) {
      const salt = await bcrypt.genSalt(12);
      const password_hash = await bcrypt.hash(password, salt);
      const displayName = email.split('@')[0] || email;

      user = await User.create({
        name: displayName,
        email,
        password_hash,
        role: 'client',
        plan: 'free',
      });

      // Create default free subscription
      try {
        await Subscription.create({
          user_id: user.id,
          plan_type: 'free',
          status: 'active',
        });
      } catch (subErr) {
        console.warn('⚠️ Subscription creation skipped:', subErr.message);
      }

      // Generate tokens
      const tokens = generateTokens(user);
      await user.update({ last_login: new Date() });

      return res.status(201).json({
        success: true,
        message: 'Account auto-created & logged in!',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            plan: user.plan,
          },
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account has been suspended. Contact support.',
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate tokens
    const tokens = generateTokens(user);

    // Update last login
    await user.update({ last_login: new Date() });

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/refresh
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required.',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(token, config.jwt.refreshSecret);

    // Fetch current user data
    const user = await User.findByPk(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token.',
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired. Please login again.',
        code: 'REFRESH_EXPIRED',
      });
    }
    next(error);
  }
};

/**
 * GET /api/v1/auth/me
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'plan', 'avatar_url', 'created_at', 'last_login'],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Get subscription info
    const subscription = await Subscription.findOne({
      where: { user_id: user.id, status: 'active' },
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        subscription: subscription ? subscription.toJSON() : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/auth/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar_url } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) user.name = name;
    if (avatar_url !== undefined) user.avatar_url = avatar_url;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated.',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/logout
 */
const logout = async (req, res) => {
  // Since JWT is stateless, we just tell the client to discard the token
  // In a production app, you'd add the token to a blacklist in Redis
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};

module.exports = { register, login, refreshToken, getProfile, updateProfile, logout };
