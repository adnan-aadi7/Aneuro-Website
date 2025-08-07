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
      // automatic_tax: { enabled: true },
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
    // Map createdAt to billingDate for each payment
    const paymentsWithBillingDate = payments.map(payment => {
      const obj = payment.toObject();
      obj.billingDate = payment.createdAt;
      return obj;
    });
    res.json({ payments: paymentsWithBillingDate });
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

// ✅ 7. Get Stripe products and prices
export const getStripeProducts = async (req, res) => {
  try {
    // Fetch products from Stripe
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price']
    });

    // Map to your plan structure
    const plans = products.data.map(product => {
      const price = product.default_price;
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        plan: product.metadata?.plan || product.name.toLowerCase(),
        price: price.unit_amount / 100, // Convert cents to dollars
        priceId: price.id,
        currency: price.currency,
        interval: price.recurring?.interval || 'month',
        features: product.metadata?.features ? JSON.parse(product.metadata.features) : []
      };
    });

    res.json({ plans });
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

/**
 * Upgrade a user's Stripe subscription to a new plan
 * Expects: { userId, newPlan }
 */
export const upgradeSubscription = async (req, res) => {
  const { userId, newPlan } = req.body;
  if (!userId || !newPlan) {
    return res.status(400).json({ error: 'userId and newPlan are required.' });
  }
  try {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    if (!user.subscription || !user.subscription.stripeSubscriptionId) {
      return res.status(400).json({ error: 'User does not have an active subscription.' });
    }
    const stripeSubscriptionId = user.subscription.stripeSubscriptionId;

    // Fetch all Stripe products to get the priceId for the new plan
    const products = await stripe.products.list({ active: true, expand: ['data.default_price'] });
    const planProduct = products.data.find(
      p => (p.metadata?.plan || p.name.toLowerCase()) === newPlan
    );
    if (!planProduct) {
      return res.status(400).json({ error: 'Invalid plan selected.' });
    }
    
    const newPriceId = planProduct.default_price.id;
    const newPriceAmount = planProduct.default_price.unit_amount / 100; // Convert cents to dollars
    
    console.log(`Found plan product: ${planProduct.name}, price: $${newPriceAmount}, priceId: ${newPriceId}`);

    // Retrieve the current subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    if (!subscription) {
      return res.status(404).json({ error: 'Stripe subscription not found.' });
    }
    
    // Check if subscription is active
    if (subscription.status !== 'active') {
      return res.status(400).json({ error: 'Subscription is not active. Cannot upgrade.' });
    }
    
    const currentItem = subscription.items.data[0];
    if (!currentItem) {
      return res.status(400).json({ error: 'No subscription item found.' });
    }

    console.log(`Upgrading subscription ${stripeSubscriptionId} from ${user.subscription.plan} to ${newPlan} ($${newPriceAmount})`);

    // Update the subscription to the new price with immediate payment
    const updatedSubscription = await stripe.subscriptions.update(stripeSubscriptionId, {
      items: [{ id: currentItem.id, price: newPriceId }],
      proration_behavior: 'create_prorations',
      billing_cycle_anchor: 'now', // Start new billing cycle immediately
      metadata: {
        ...subscription.metadata,
        plan: newPlan,
        upgradedAt: new Date().toISOString(),
        previousPlan: user.subscription.plan,
      },
    });

    console.log(`Subscription updated in Stripe: ${updatedSubscription.id}, status: ${updatedSubscription.status}`);

    // Verify the subscription was updated successfully
    if (updatedSubscription.status !== 'active') {
      throw new Error(`Subscription update failed. Status: ${updatedSubscription.status}`);
    }

    // Check if there are any pending payments or invoices
    const invoices = await stripe.invoices.list({
      subscription: stripeSubscriptionId,
      limit: 1,
      status: 'open',
    });

    if (invoices.data.length > 0) {
      console.log(`Found ${invoices.data.length} pending invoices for subscription ${stripeSubscriptionId}`);
      // Attempt to pay any pending invoices
      for (const invoice of invoices.data) {
        try {
          await stripe.invoices.pay(invoice.id);
          console.log(`Paid invoice ${invoice.id}`);
        } catch (payError) {
          console.error(`Failed to pay invoice ${invoice.id}:`, payError.message);
        }
      }
    }

    // Update user document with new subscription details
    user.subscription.plan = newPlan;
    user.subscription.status = 'active';
    user.subscription.startDate = new Date();
    user.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 1 month from now
    user.subscription.stripeSubscriptionId = updatedSubscription.id;
    await user.save();

    console.log(`User ${userId} subscription upgraded to ${newPlan}`);

    // Create a payment record for the upgrade (without stripePaymentIntentId to avoid unique constraint)
    try {
      const paymentData = {
        userId: user._id,
        amount: newPriceAmount,
        currency: planProduct.default_price.currency,
        plan: newPlan,
        status: 'succeeded',
        customerEmail: user.email,
        stripeSubscriptionId: updatedSubscription.id,
        // Use a unique identifier for subscription upgrades to avoid duplicate key error
        stripePaymentIntentId: `upgrade_${updatedSubscription.id}_${Date.now()}`,
        metadata: {
          type: 'upgrade',
          previousPlan: user.subscription.plan,
          newPlan: newPlan,
          upgradedAt: new Date(),
          stripePriceId: newPriceId,
          stripeProductId: planProduct.id,
        },
      };
      
      const payment = new Payment(paymentData);
      await payment.save();
      console.log(`Payment record created for upgrade: ${payment._id}`);
    } catch (paymentError) {
      console.error('Failed to create payment record:', paymentError);
      // Don't fail the upgrade if payment record creation fails
    }

    res.json({
      message: 'Subscription upgraded successfully.',
      subscriptionId: updatedSubscription.id,
      plan: newPlan,
      price: newPriceAmount,
      currency: planProduct.default_price.currency,
      status: updatedSubscription.status,
      stripeSubscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        current_period_end: updatedSubscription.current_period_end,
        current_period_start: updatedSubscription.current_period_start,
      },
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to upgrade subscription.',
      details: error.type || 'unknown_error'
    });
  }
};

/**
 * Get card information for a specific user
 * Expects: userId in params
 */
export const getUserCardInfo = async (req, res) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  try {
    await connectDB();
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if user has a subscription
    if (!user.subscription || !user.subscription.stripeSubscriptionId) {
      return res.status(404).json({ 
        error: 'User does not have an active subscription.',
        hasSubscription: false 
      });
    }

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(user.subscription.stripeSubscriptionId);
    if (!subscription) {
      return res.status(404).json({ error: 'Stripe subscription not found.' });
    }

    // Get customer details
    const customer = await stripe.customers.retrieve(subscription.customer);
    if (!customer) {
      return res.status(404).json({ error: 'Stripe customer not found.' });
    }

    // Get payment methods for the customer
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: 'card',
    });

    // Get default payment method
    const defaultPaymentMethod = customer.invoice_settings?.default_payment_method;
    
    // Format card information
    const cardInfo = paymentMethods.data.map(pm => ({
      id: pm.id,
      type: pm.type,
      card: {
        brand: pm.card.brand,
        last4: pm.card.last4,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year,
        country: pm.card.country,
        funding: pm.card.funding,
      },
      billingDetails: {
        name: pm.billing_details.name,
        email: pm.billing_details.email,
        phone: pm.billing_details.phone,
        address: pm.billing_details.address,
      },
      isDefault: pm.id === defaultPaymentMethod,
      created: pm.created,
    }));

    // Get subscription details
    const subscriptionInfo = {
      id: subscription.id,
      status: subscription.status,
      plan: user.subscription.plan,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      defaultPaymentMethod: defaultPaymentMethod,
    };

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      subscription: subscriptionInfo,
      cards: cardInfo,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
      },
      hasCards: cardInfo.length > 0,
    });

  } catch (error) {
    console.error('Error getting user card info:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get user card information.',
      details: error.type || 'unknown_error'
    });
  }
};

/**
 * Get all payment methods for a specific user (including cards, bank accounts, etc.)
 * Expects: userId in params
 */
export const getUserPaymentMethods = async (req, res) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  try {
    await connectDB();
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if user has a subscription
    if (!user.subscription || !user.subscription.stripeSubscriptionId) {
      return res.status(404).json({ 
        error: 'User does not have an active subscription.',
        hasSubscription: false 
      });
    }

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(user.subscription.stripeSubscriptionId);
    if (!subscription) {
      return res.status(404).json({ error: 'Stripe subscription not found.' });
    }

    // Get customer details
    const customer = await stripe.customers.retrieve(subscription.customer);
    if (!customer) {
      return res.status(404).json({ error: 'Stripe customer not found.' });
    }

    // Get all payment methods for the customer
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
    });

    // Get default payment method
    const defaultPaymentMethod = customer.invoice_settings?.default_payment_method;
    
    // Format payment methods information
    const paymentMethodsInfo = paymentMethods.data.map(pm => {
      const baseInfo = {
        id: pm.id,
        type: pm.type,
        isDefault: pm.id === defaultPaymentMethod,
        created: pm.created,
        billingDetails: {
          name: pm.billing_details.name,
          email: pm.billing_details.email,
          phone: pm.billing_details.phone,
          address: pm.billing_details.address,
        },
      };

      // Add type-specific details
      if (pm.type === 'card') {
        baseInfo.card = {
          brand: pm.card.brand,
          last4: pm.card.last4,
          expMonth: pm.card.exp_month,
          expYear: pm.card.exp_year,
          country: pm.card.country,
          funding: pm.card.funding,
        };
      } else if (pm.type === 'bank_account') {
        baseInfo.bankAccount = {
          bankName: pm.bank_account.bank_name,
          last4: pm.bank_account.last4,
          routingNumber: pm.bank_account.routing_number,
          country: pm.bank_account.country,
        };
      }

      return baseInfo;
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
      },
      paymentMethods: paymentMethodsInfo,
      defaultPaymentMethod: defaultPaymentMethod,
      totalPaymentMethods: paymentMethodsInfo.length,
    });

  } catch (error) {
    console.error('Error getting user payment methods:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get user payment methods.',
      details: error.type || 'unknown_error'
    });
  }
};
