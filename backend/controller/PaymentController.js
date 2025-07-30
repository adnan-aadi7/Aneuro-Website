import Stripe from 'stripe';
import connectDB from '../config/db.js';
import Payment from '../model/Payment.js';
import User from '../model/User.js';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_SECRET_KEY');

const PLAN_PRICE_IDS = {
  starter: 'price_1RqBDNHHuap1a33PXASQqDj4',
  growth: 'price_1RqBDcHHuap1a33PvAJEFgPE',
  enterprise: 'price_1RqBDwHHuap1a33PwVa9QS7D',
};

// ✅ 1. Create Subscription
export const createSubscription = async (req, res) => {
  const { plan, userId, email, paymentMethodId } = req.body;

  if (!paymentMethodId) {
    return res.status(400).json({ error: 'No payment method provided.' });
  }

  try {
    await connectDB();
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if user already has an active subscription
    if (user.subscription && user.subscription.status === 'active') {
      return res.status(400).json({ 
        error: 'User already has an active subscription. Please cancel the existing subscription first.' 
      });
    }

    const priceId = PLAN_PRICE_IDS[plan];
    if (!priceId) return res.status(400).json({ error: 'Invalid plan' });

    let customer;
    const existing = await stripe.customers.list({ email, limit: 1 });
    customer = existing.data.length > 0
      ? existing.data[0]
      : await stripe.customers.create({ 
          email, 
          metadata: { userId } 
        });

    try {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });
    } catch (err) {
      if (err.code !== 'resource_already_attached') {
        return res.status(400).json({ error: 'Attach failed: ' + err.message });
      }
    }

    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Check if customer already has an active subscription
    const existingSubscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1
    });

    if (existingSubscriptions.data.length > 0) {
      return res.status(400).json({ 
        error: 'Customer already has an active subscription. Please cancel the existing subscription first.' 
      });
    }

    // Create subscription - Stripe will automatically charge the payment method
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      metadata: { 
        userId, 
        plan,
        customerEmail: email 
      },
      collection_method: 'charge_automatically',
      automatic_tax: { enabled: true },
    });

    console.log('Stripe subscription created:', subscription.id);

    // Update user subscription in database
    user.subscription = {
      plan: plan,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
      stripeSubscriptionId: subscription.id,
    };
    await user.save();

    res.json({ 
      subscriptionId: subscription.id,
      message: 'Subscription created successfully. Payment will be processed automatically.'
    });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ 2. Create one-time payment intent
export const createPaymentIntent = async (req, res) => {
  const { amount, currency = 'usd', userId, email } = req.body;
  try {
    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { userId, email },
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 3. Get available plan amounts
const PLAN_AMOUNTS = {
  starter: 1000,
  growth: 2000,
  enterprise: 3000,
};

export const getPlans = (req, res) => {
  const plans = Object.entries(PLAN_AMOUNTS).map(([plan, amount]) => ({
    plan,
    amount: amount / 100,
    amountInCents: amount,
  }));
  res.json({ plans });
};

// ✅ 4. User payment history
export const getUserPayments = async (req, res) => {
  try {
    await connectDB();
    const payments = await Payment.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    res.json({ payments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 5. User subscription status
export const getUserSubscription = async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.params.userId).select('subscription name email');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 6. Admin - all payments
export const getAllPayments = async (req, res) => {
  try {
    await connectDB();
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};

    const payments = await Payment.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
