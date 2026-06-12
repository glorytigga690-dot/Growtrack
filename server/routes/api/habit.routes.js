const express = require('express');
const router = express.Router();
const habitController = require('../../controllers/habit.controller');
const { authenticate } = require('../../middleware/auth');
const { createHabitRules, logHabitRules, validate } = require('../../middleware/validator');

// All routes require authentication
router.use(authenticate);

router.get('/', habitController.getHabits);
router.get('/:id', habitController.getHabit);
router.post('/', createHabitRules, validate, habitController.createHabit);
router.put('/:id', habitController.updateHabit);
router.delete('/:id', habitController.deleteHabit);
router.post('/:id/log', logHabitRules, validate, habitController.logHabit);

module.exports = router;
