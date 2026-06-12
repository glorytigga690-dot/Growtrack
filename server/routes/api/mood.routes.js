const express = require('express');
const router = express.Router();
const moodController = require('../../controllers/mood.controller');
const { authenticate } = require('../../middleware/auth');
const { logMoodRules, validate } = require('../../middleware/validator');

router.use(authenticate);

router.post('/', logMoodRules, validate, moodController.logMood);
router.get('/', moodController.getMoods);
router.get('/stats', moodController.getMoodStats);
router.get('/today', moodController.getTodayMood);
router.delete('/:id', moodController.deleteMood);

module.exports = router;
