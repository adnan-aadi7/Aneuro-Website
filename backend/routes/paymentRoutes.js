import express from 'express';
import { 
  createSubscription, 
  createPaymentIntent, 
  getPlans, 
  getUserPayments, 
  getUserSubscription, 
  getAllPayments,
  getStripeProducts,
  upgradeSubscription,
  getUserCardInfo,
  getUserPaymentMethods
} from '../controller/PaymentController.js';

const router = express.Router();

// Create subscription
router.post('/create-subscription', createSubscription);

// Create one-time payment intent
router.post('/create-payment-intent', createPaymentIntent);

// Get available plans
router.get('/plans', getPlans);

// Get Stripe products and prices (dynamic)
router.get('/stripe-products', getStripeProducts);

// Get user payment history
router.get('/user-payments/:userId', getUserPayments);

// Get user subscription status
router.get('/user-subscription/:userId', getUserSubscription);

// Get user card information
router.get('/user-card-info/:userId', getUserCardInfo);

// Get user payment methods (all types)
router.get('/user-payment-methods/:userId', getUserPaymentMethods);

// Get all payments (admin route)
router.get('/all-payments', getAllPayments);

// Add this route for upgrading subscription
router.post('/upgrade-subscription', upgradeSubscription);

export default router;