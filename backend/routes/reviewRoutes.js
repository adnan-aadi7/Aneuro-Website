import express from "express";
import { createReview, getReviews } from "../controller/reviewController.js";
import { authUser } from "../middleware/userTracker.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API endpoints for managing user reviews
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     description: Users can submit a review with rating and optional text. Requires JWT authentication.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: Star rating (1–5)
 *                 example: 5
 *               review:
 *                 type: string
 *                 description: Optional review text
 *                 example: Excellent service and support!
 *     responses:
 *       200:
 *         description: Review submitted successfully
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
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid rating value
 *       401:
 *         description: Unauthorized (no or invalid token)
 *
 *   get:
 *     summary: Get all reviews
 *     description: Fetch all reviews submitted by users
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 */
router.post("/", authUser, createReview);
router.get("/", getReviews);

export default router;
