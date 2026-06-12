/**
 * Role-Based Access Control Middleware
 * Usage: roleCheck('admin') or roleCheck('client', 'admin')
 */
const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
      });
    }

    next();
  };
};

/**
 * Plan-based feature gating middleware
 * Usage: requireFeature('pdf_export') or requirePlan('pro')
 */
const config = require('../config/config');

const requirePlan = (...allowedPlans) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!allowedPlans.includes(req.user.plan)) {
      return res.status(403).json({
        success: false,
        message: `This feature requires a ${allowedPlans.join(' or ')} plan.`,
        code: 'PLAN_REQUIRED',
        requiredPlan: allowedPlans[0],
        currentPlan: req.user.plan,
      });
    }

    next();
  };
};

const requireFeature = (featureName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const userTier = config.tiers[req.user.plan];
    if (!userTier || !userTier.features.includes(featureName)) {
      return res.status(403).json({
        success: false,
        message: `The "${featureName}" feature requires a plan upgrade.`,
        code: 'FEATURE_LOCKED',
        feature: featureName,
        currentPlan: req.user.plan,
      });
    }

    next();
  };
};

module.exports = { roleCheck, requirePlan, requireFeature };
