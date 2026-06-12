const config = require('../config/config');
const User = require('../models/mysql/User');
const Subscription = require('../models/mysql/Subscription');
const Payment = require('../models/mysql/Payment');
const AdminLog = require('../models/mysql/AdminLog');

/**
 * POST /api/v1/payments/create-checkout — Create checkout session (sandbox)
 */
const createCheckout = async (req, res, next) => {
  try {
    const { plan } = req.body; // 'pro' or 'team'

    if (!['pro', 'team'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan. Choose pro or team.' });
    }

    if (config.paymentMode === 'sandbox') {
      // Sandbox mode: simulate Stripe checkout
      const mockSessionId = `sandbox_session_${Date.now()}_${req.user.id}`;

      return res.json({
        success: true,
        message: 'Sandbox mode — Checkout session simulated.',
        data: {
          session_id: mockSessionId,
          checkout_url: `${config.clientUrl}/#/upgrade/success?session=${mockSessionId}&plan=${plan}`,
          mode: 'sandbox',
        },
      });
    }

    // Production Stripe checkout would go here
    // const stripe = require('stripe')(config.stripe.secretKey);
    // const session = await stripe.checkout.sessions.create({ ... });

    res.status(501).json({ success: false, message: 'Production payments not configured.' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/payments/sandbox-activate — Activate plan in sandbox mode
 */
const sandboxActivate = async (req, res, next) => {
  try {
    if (config.paymentMode !== 'sandbox') {
      return res.status(403).json({ success: false, message: 'Sandbox mode not enabled.' });
    }

    const { plan } = req.body;
    if (!['pro', 'team'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan.' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    // Update user plan
    user.plan = plan;
    await user.save();

    // Create/update subscription
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    await Subscription.create({
      user_id: user.id,
      plan_type: plan,
      status: 'active',
      start_date: new Date(),
      end_date: endDate,
      provider_ref: `sandbox_${Date.now()}`,
    });

    // Record payment
    const amount = plan === 'pro' ? 2.99 : 4.99;
    await Payment.create({
      user_id: user.id,
      amount,
      currency: 'USD',
      status: 'succeeded',
      transaction_id: `sandbox_txn_${Date.now()}`,
      provider: 'sandbox',
      description: `Sandbox: ${plan} plan activation`,
    });

    res.json({
      success: true,
      message: `Plan upgraded to ${plan}! (Sandbox mode)`,
      data: {
        plan,
        expires: endDate,
        mode: 'sandbox',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/payments/webhook — Stripe webhook handler
 */
const handleWebhook = async (req, res, next) => {
  try {
    if (config.paymentMode === 'sandbox') {
      return res.json({ received: true, mode: 'sandbox' });
    }

    // Production webhook verification would go here
    // const sig = req.headers['stripe-signature'];
    // const event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret);

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/payments/billing-history — User's payment history
 */
const getBillingHistory = async (req, res, next) => {
  try {
    const payments = await Payment.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
      limit: 50,
    });

    const subscription = await Subscription.findOne({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        payments,
        current_subscription: subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/payments/cancel — Cancel subscription
 */
const cancelSubscription = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const subscription = await Subscription.findOne({
      where: { user_id: user.id, status: 'active' },
      order: [['created_at', 'DESC']],
    });

    if (!subscription || subscription.plan_type === 'free') {
      return res.status(400).json({ success: false, message: 'No active paid subscription.' });
    }

    subscription.status = 'cancelled';
    subscription.cancel_at_period_end = true;
    await subscription.save();

    // Don't downgrade immediately — let them keep until end_date
    res.json({
      success: true,
      message: `Subscription cancelled. You'll retain ${subscription.plan_type} features until ${subscription.end_date}.`,
      data: { expires: subscription.end_date },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCheckout, sandboxActivate, handleWebhook, getBillingHistory, cancelSubscription };
