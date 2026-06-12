const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/payment.controller');
const { authenticate } = require('../../middleware/auth');

// Webhook doesn't need auth (called by Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

// Protected routes
router.post('/create-checkout', authenticate, paymentController.createCheckout);
router.post('/sandbox-activate', authenticate, paymentController.sandboxActivate);
router.get('/billing-history', authenticate, paymentController.getBillingHistory);
router.post('/cancel', authenticate, paymentController.cancelSubscription);

module.exports = router;
