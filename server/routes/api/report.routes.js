const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/report.controller');
const { authenticate } = require('../../middleware/auth');
const { requireFeature } = require('../../middleware/roleCheck');

router.use(authenticate);

// Free tier
router.get('/growth-score', reportController.getGrowthScore);
router.get('/dashboard-summary', reportController.getDashboardSummary);
router.get('/weekly', reportController.getWeeklyReport);

// Pro tier features
router.get('/monthly', requireFeature('monthly_reports'), reportController.getMonthlyReport);
router.get('/correlation', requireFeature('correlation_analytics'), reportController.getCorrelation);
router.get('/history', reportController.getReportHistory);

module.exports = router;
