const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin.controller');
const { authenticate } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');

// All admin routes require authentication + admin role
router.use(authenticate);
router.use(roleCheck('admin'));

// User management
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetail);
router.put('/users/:id/suspend', adminController.suspendUser);
router.put('/users/:id/activate', adminController.activateUser);
router.delete('/users/:id', adminController.deleteUser);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// Audit logs
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
