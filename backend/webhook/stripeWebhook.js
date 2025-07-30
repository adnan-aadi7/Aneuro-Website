import Stripe from 'stripe';
import connectDB from '../config/db.js';
import Payment from '../model/Payment.js';
import User from '../model/User.js';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  await connectDB();

  // Handle the event
  switch (event.type) {
  case 'invoice.payment_succeeded': {
    const invoice = event.data.object;
    const subscriptionId = invoice.subscription;
    const paymentIntentId = invoice.payment_intent;
    const customerEmail = invoice.customer_email || (invoice.customer && invoice.customer.email);
    const userId = invoice.metadata && invoice.metadata.userId;
    const plan = invoice.metadata && invoice.metadata.plan;
    
    console.log('Processing invoice.payment_succeeded:', {
      subscriptionId,
      paymentIntentId,
      customerEmail,
      userId,
      plan
    });
    
    // Find payment intent details
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (e) {
      paymentIntent = null;
    }
    
    // Check if payment record already exists to avoid duplicates
    let payment = await Payment.findOne({ 
      $or: [
        { stripePaymentIntentId: paymentIntentId },
        { stripeSubscriptionId: subscriptionId, amount: invoice.amount_paid }
      ]
    });
    
    if (!payment) {
      // Create new payment record only if it doesn't exist
      payment = new Payment({
        userId: userId || null,
        stripePaymentIntentId: paymentIntentId,
        stripeSubscriptionId: subscriptionId,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        plan: plan || 'custom',
        status: 'paid',
        customerEmail: customerEmail || '',
        receiptUrl: paymentIntent && paymentIntent.charges && paymentIntent.charges.data[0] ? paymentIntent.charges.data[0].receipt_url : '',
        metadata: invoice.metadata,
      });
      await payment.save();
      console.log('New payment record created:', payment._id);
    } else {
      // Update existing payment record
      payment.status = 'paid';
      payment.stripeSubscriptionId = subscriptionId;
      payment.receiptUrl = paymentIntent && paymentIntent.charges && paymentIntent.charges.data[0] ? paymentIntent.charges.data[0].receipt_url : '';
      await payment.save();
      console.log('Existing payment record updated:', payment._id);
    }
    
    // Update user subscription
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.subscription = {
          plan: plan || user.subscription?.plan || 'custom',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
          stripeSubscriptionId: subscriptionId,
        };
        await user.save();
        console.log('User subscription updated:', user.email);
      }
    }
    break;
  }
  case 'invoice.payment_failed': {
    const invoice = event.data.object;
    const paymentIntentId = invoice.payment_intent;
    const userId = invoice.metadata && invoice.metadata.userId;
    
    console.log('Processing invoice.payment_failed:', { paymentIntentId, userId });
    
    // Update payment record
    let payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
    if (payment) {
      payment.status = 'failed';
      await payment.save();
      console.log('Payment marked as failed:', payment._id);
    }
    
    // Update user subscription
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.subscription) {
        user.subscription.status = 'inactive';
        await user.save();
        console.log('User subscription marked as inactive:', user.email);
      }
    }
    break;
  }
  case 'customer.subscription.deleted': {
    const subscription = event.data.object;
    const userId = subscription.metadata && subscription.metadata.userId;
    
    console.log('Processing customer.subscription.deleted:', { subscriptionId: subscription.id, userId });
    
    // Update user subscription
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.subscription) {
        user.subscription.status = 'canceled';
        await user.save();
        console.log('User subscription canceled:', user.email);
      }
    }
    
    // Update all payments for this subscription
    await Payment.updateMany(
      { stripeSubscriptionId: subscription.id }, 
      { status: 'canceled' }
    );
    console.log('All payments for subscription canceled:', subscription.id);
    break;
  }
  case 'customer.subscription.updated': {
    const subscription = event.data.object;
    const userId = subscription.metadata && subscription.metadata.userId;
    
    console.log('Processing customer.subscription.updated:', { subscriptionId: subscription.id, userId });
    
    // Update user subscription status based on Stripe subscription status
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.subscription) {
        user.subscription.status = subscription.status;
        await user.save();
        console.log('User subscription status updated:', user.email, subscription.status);
      }
    }
    break;
  }
  default:
    console.log('Unhandled event type:', event.type);
  }

  res.json({ received: true });
};

const handlePaymentSucceeded = async (paymentIntent) => {
  try {
    console.log('Payment succeeded:', paymentIntent.id);
    
    // Find or create payment record
    let payment = await Payment.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (!payment) {
      // Create new payment record if it doesn't exist
      payment = new Payment({
        userId: paymentIntent.metadata.userId || null,
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        plan: paymentIntent.metadata.plan || 'custom',
        status: 'paid',
        customerEmail: paymentIntent.metadata.customerEmail || paymentIntent.receipt_email,
        receiptUrl: paymentIntent.charges?.data[0]?.receipt_url,
        metadata: paymentIntent.metadata,
      });
    } else {
      // Update existing payment record
      payment.status = 'paid';
      payment.receiptUrl = paymentIntent.charges?.data[0]?.receipt_url;
    }

    await payment.save();

    // Update user subscription if userId is provided
    if (paymentIntent.metadata.userId && paymentIntent.metadata.plan) {
      const user = await User.findById(paymentIntent.metadata.userId);
      if (user) {
        user.subscription = {
          plan: paymentIntent.metadata.plan,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        };
        await user.save();
        console.log(`User ${user.email} subscription updated to ${paymentIntent.metadata.plan}`);
      }
    }

    console.log('Payment processed successfully');
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
};

const handlePaymentFailed = async (paymentIntent) => {
  try {
    console.log('Payment failed:', paymentIntent.id);
    
    let payment = await Payment.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (payment) {
      payment.status = 'failed';
      await payment.save();
    }

    console.log('Payment failed status updated');
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
};

const handlePaymentCanceled = async (paymentIntent) => {
  try {
    console.log('Payment canceled:', paymentIntent.id);
    
    let payment = await Payment.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (payment) {
      payment.status = 'canceled';
      await payment.save();
    }

    console.log('Payment canceled status updated');
  } catch (error) {
    console.error('Error handling payment canceled:', error);
  }
}; 