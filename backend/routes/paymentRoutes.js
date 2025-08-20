//payment routes

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

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Subscription and payment management
 */

/**
 * @swagger
 * /api/payments/create-subscription:
 *   post:
 *     summary: Create a subscription for a user
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - priceId
 *               - paymentMethodId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to subscribe
 *                 example: "64f3bc9f1234567890abcdef"
 *               priceId:
 *                 type: string
 *                 description: Stripe price ID for the plan
 *                 example: "price_1Q2W3E4R5T6Y7U8I9O"
 *               paymentMethodId:
 *                 type: string
 *                 description: Stripe payment method ID
 *                 example: "pm_1Q2W3E4R5T6Y7U8I9O"
 *     responses:
 *       200:
 *         description: Subscription created successfully
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Server error
 */
router.post('/create-subscription', createSubscription);

/**
 * @swagger
 * /api/payments/create-payment-intent:
 *   post:
 *     summary: Create a one-time payment intent
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: Amount in smallest currency unit (e.g., cents)
 *                 example: 4999
 *               currency:
 *                 type: string
 *                 example: "usd"
 *               metadata:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       200:
 *         description: Payment intent created
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/create-payment-intent', createPaymentIntent);

/**
 * @swagger
 * /api/payments/plans:
 *   get:
 *     summary: Get available subscription plans
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of plans
 *       500:
 *         description: Server error
 */
router.get('/plans', getPlans);

/**
 * @swagger
 * /api/payments/stripe-products:
 *   get:
 *     summary: Get Stripe products and prices
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Stripe products and prices
 *       500:
 *         description: Server error
 */
router.get('/stripe-products', getStripeProducts);

/**
 * @swagger
 * /api/payments/user-payments/{userId}:
 *   get:
 *     summary: Get a user's payment history
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of payments
 *       404:
 *         description: User not found or no payments
 *       500:
 *         description: Server error
 */
router.get('/user-payments/:userId', getUserPayments);

/**
 * @swagger
 * /api/payments/user-subscription/{userId}:
 *   get:
 *     summary: Get a user's subscription status
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Subscription details
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/user-subscription/:userId', getUserSubscription);

/**
 * @swagger
 * /api/payments/user-card-info/{userId}:
 *   get:
 *     summary: Get user's saved card information
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card info
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/user-card-info/:userId', getUserCardInfo);

/**
 * @swagger
 * /api/payments/user-payment-methods/{userId}:
 *   get:
 *     summary: Get user's payment methods
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of payment methods
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/user-payment-methods/:userId', getUserPaymentMethods);

/**
 * @swagger
 * /api/payments/all-payments:
 *   get:
 *     summary: Get all payments (admin)
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of all payments
 *       500:
 *         description: Server error
 */
router.get('/all-payments', getAllPayments);

/**
 * @swagger
 * /api/payments/upgrade-subscription:
 *   post:
 *     summary: Upgrade a user's subscription plan
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - newPriceId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64f3bc9f1234567890abcdef"
 *               newPriceId:
 *                 type: string
 *                 example: "price_1Q9Z8X7C6V5B4N3M2"
 *     responses:
 *       200:
 *         description: Subscription upgraded
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/upgrade-subscription', upgradeSubscription);

export default router;