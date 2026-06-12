const express = require('express');
const router = express.Router();
const goalController = require('../../controllers/goal.controller');
const { authenticate } = require('../../middleware/auth');
const { createGoalRules, updateProgressRules, validate } = require('../../middleware/validator');

router.use(authenticate);

router.get('/', goalController.getGoals);
router.get('/:id', goalController.getGoal);
router.post('/', createGoalRules, validate, goalController.createGoal);
router.put('/:id', goalController.updateGoal);
router.put('/:id/progress', updateProgressRules, validate, goalController.updateProgress);
router.delete('/:id', goalController.deleteGoal);

module.exports = router;
