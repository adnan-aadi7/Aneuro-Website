import express from "express";
import {
  getNewSubscribersPerWeek,
  getDelinquentSubscribers,
  getAvgQuizCompletionTime,
  getUserAudienceStats,
  getTotalRevenue,
  getStripeBalance,
  getLatestInboxMessages,
  getDashboardAnalytics,
  getNewSubscribersAnalytics,
  getDelinquentSubscribersAnalytics,
  getAvgQuizCompletionTimeAnalytics,
  getRevenueAnalytics
} from "../controller/userAnalyticsController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User Analytics
 *   description: Analytics for subscribers
 */

/**
 * @swagger
 * /api/user-analytics/subscribers/new-per-week:
 *   get:
 *     summary: Get number of new subscribers grouped by week
 *     tags: [Admin Dashboard]
 *     responses:
 *       200:
 *         description: Weekly new subscribers data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: object
 *                         properties:
 *                           year:
 *                             type: integer
 *                           week:
 *                             type: integer
 *                       count:
 *                         type: integer
 */
router.get("/subscribers/new-per-week", getNewSubscribersPerWeek);

/**
 * @swagger
 * /api/user-analytics/subscribers/delinquent:
 *   get:
 *     summary: Get delinquent subscribers (inactive or canceled)
 *     tags: [Admin Dashboard]
 *     responses:
 *       200:
 *         description: List of delinquent subscribers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       subscription:
 *                         type: object
 *                         properties:
 *                           status:
 *                             type: string
 *                             enum: [active, inactive, canceled]
 *                           plan:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
router.get("/subscribers/delinquent", getDelinquentSubscribers);

/**
 * @swagger
 * /api/user-analytics/avg-completion-time:
 *   get:
 *     summary: Get average quiz completion time
 *     description: Returns the average time (in minutes) it takes users to complete a quiz.
 *     tags: [Admin Dashboard]
 *     responses:
 *       200:
 *         description: Successfully retrieved average quiz completion time
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Average quiz completion time (minutes)
 *                 avgTime:
 *                   type: number
 *                   example: 9.75
 *       500:
 *         description: Internal server error
 */
router.get("/avg-completion-time", getAvgQuizCompletionTime);

/**
 * @swagger
 * /api/user-analytics/user/{userId}/audience-stats:
 *   get:
 *     summary: Get quiz audience stats for a specific user
 *     tags: [Admin Dashboard]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose audience stats you want
 *     responses:
 *       200:
 *         description: Stats about the user's audience quizzes
 */
router.get("/user/:userId/audience-stats", getUserAudienceStats);

/**
 * @swagger
 * /api/user-analytics/total-revenue:
 *   get:
 *     summary: Get total revenue from successful charges (Stripe)
 *     tags: [Admin Dashboard]
 *     responses:
 *       200:
 *         description: Total revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 totalCents:
 *                   type: integer
 *                 totalDollars:
 *                   type: number
 *                 formatted:
 *                   type: string
 */
router.get("/total-revenue", getTotalRevenue);

/**
 * @swagger
 * /api/user-analytics/stripe-balance:
 *   get:
 *     summary: Get Stripe balance (available and pending) to match dashboard
 *     tags: [Admin Dashboard]
 *     responses:
 *       200:
 *         description: Stripe balance summary
 */
router.get("/stripe-balance", getStripeBalance);

/**
 * @swagger
 * /api/user-analytics/inbox/latest:
 *   get:
 *     summary: Get latest inbox messages (tickets)
 *     tags: [Admin Dashboard]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: Latest messages
 */
router.get('/inbox/latest', getLatestInboxMessages);

/**
 * @swagger
 * /api/user-analytics/dashboard:
 *   get:
 *     summary: Get comprehensive dashboard analytics with dynamic percentages and this week values
 *     tags: [Admin Dashboard]
 *     responses:
 *       200:
 *         description: Complete dashboard analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     newSubscribers:
 *                       type: object
 *                       properties:
 *                         thisWeek:
 *                           type: integer
 *                         percentage:
 *                           type: number
 *                         thisWeekFormatted:
 *                           type: string
 *                         trend:
 *                           type: string
 *                           enum: [up, down]
 *                     delinquentSubscribers:
 *                       type: object
 *                       properties:
 *                         thisWeek:
 *                           type: integer
 *                         percentage:
 *                           type: number
 *                         thisWeekFormatted:
 *                           type: string
 *                         trend:
 *                           type: string
 *                           enum: [up, down]
 *                     avgQuizCompletionTime:
 *                       type: object
 *                       properties:
 *                         thisWeek:
 *                           type: number
 *                         percentage:
 *                           type: number
 *                         thisWeekFormatted:
 *                           type: string
 *                         trend:
 *                           type: string
 *                           enum: [up, down]
 *                         formatted:
 *                           type: string
 *                     revenue:
 *                       type: object
 *                       properties:
 *                         thisWeek:
 *                           type: integer
 *                         percentage:
 *                           type: number
 *                         thisWeekFormatted:
 *                           type: string
 *                         trend:
 *                           type: string
 *                           enum: [up, down]
 *                         formatted:
 *                           type: string
 */
router.get('/dashboard', getDashboardAnalytics);

/**
 * @swagger
 * /api/user-analytics/new-subscribers-analytics:
 *   get:
 *     summary: Get new subscribers analytics with dynamic percentage and this week value
 *     tags: [Admin Dashboard]
 *     responses:
 *       200:
 *         description: New subscribers analytics
 */
router.get('/new-subscribers-analytics', getNewSubscribersAnalytics);

/**
 * @swagger
 * /api/user-analytics/delinquent-subscribers-analytics:
 *   get:
 *     summary: Get delinquent subscribers analytics with dynamic percentage and this week value
 *     tags: [Admin Dashboard]
 *     responses:
 *       200:
 *         description: Delinquent subscribers analytics
 */
router.get('/delinquent-subscribers-analytics', getDelinquentSubscribersAnalytics);

/**
 * @swagger
 * /api/user-analytics/avg-completion-time-analytics:
 *   get:
 *     summary: Get average quiz completion time analytics with dynamic percentage and this week value
 *     tags: [Admin Dashboard]
 *     responses:
 *       200:
 *         description: Average quiz completion time analytics
 */
router.get('/avg-completion-time-analytics', getAvgQuizCompletionTimeAnalytics);

/**
 * @swagger
 * /api/user-analytics/revenue-analytics:
 *   get:
 *     summary: Get revenue analytics with dynamic percentage and this week value
 *     tags: [Admin Dashboard]
 *     responses:
 *       200:
 *         description: Revenue analytics
 */
router.get('/revenue-analytics', getRevenueAnalytics);

export default router;
