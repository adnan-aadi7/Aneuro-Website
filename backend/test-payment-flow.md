# Payment Flow Testing Guide

## 1. Create a User First
```bash
POST http://localhost:3000/api/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

## 2. Create Payment Intent
```bash
POST http://localhost:3000/api/payments/create-plan-payment
Content-Type: application/json

{
  "plan": "starter",
  "userId": "USER_ID_FROM_STEP_1",
  "email": "test@example.com"
}
```

## 3. Check Available Plans
```bash
GET http://localhost:3000/api/payments/plans
```

## 4. Check User Subscription Status
```bash
GET http://localhost:3000/api/payments/user-subscription/USER_ID
```

## 5. Check User Payment History
```bash
GET http://localhost:3000/api/payments/user-payments/USER_ID
```

## 6. Check All Payments (Admin)
```bash
GET http://localhost:3000/api/payments/all-payments
```

## Environment Variables Needed
Add these to your `.env` file:
```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Webhook Setup
1. Use Stripe CLI to forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

2. The webhook will automatically update the database when payments succeed/fail.

## Database Collections
- **Users**: Contains user info and subscription details
- **Payments**: Contains all payment records with status

## What Gets Tracked
- User registration
- Payment attempts (pending, succeeded, failed, canceled)
- Subscription plan and status
- Payment amounts and receipts
- User subscription start/end dates 