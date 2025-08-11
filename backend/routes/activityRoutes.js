import express from "express";
import { getRecentActivities } from "../controller/activityController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: System activity tracking
 */

/**
 * @swagger
 * /api/activities/recent:
 *   get:
 *     summary: Get recent activities from PromptPack, EmailSequence, and FunnelTemplate
 *     tags: [Activities]
 *     responses:
 *       200:
 *         description: Recent activities list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 activities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: PromptPack
 *                       name:
 *                         type: string
 *                         example: Welcome Email Pack
 *                       status:
 *                         type: string
 *                         example: Scheduled
 *                       action:
 *                         type: string
 *                         example: Welcome Email Pack is scheduled
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-08-09T14:30:00.000Z
 *       500:
 *         description: Server error
 */
router.get("/recent", getRecentActivities);

export default router;
