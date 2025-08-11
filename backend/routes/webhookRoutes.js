import express from 'express';
import { handleStripeWebhook } from '../webhook/stripeWebhook.js';

const router = express.Router();

// Stripe webhook endpoint
router.post('/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);


export default router; 