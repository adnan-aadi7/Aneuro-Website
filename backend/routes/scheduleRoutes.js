//schdule realse route
import express from "express";
import {
  getAllScheduled,
  scheduleContent,
  updateSchedule,
  deleteSchedule,
  getScheduledStats,
  getAllScheduledWithoutRelease
} from "../controller/scheduleController.js";
import { authUser } from "../middleware/userTracker.js";

const router = express.Router();
/**
 * @swagger
 * /api/schedule/stats:
 *   get:
 *     summary: Get scheduled releases statistics
 *     description: Returns counts for upcoming, this week, this month, and overdue scheduled releases across Email Sequences, Prompt Packs, and Funnel Templates.
 *     tags:
 *       - Scheduled Releases
 *     security:
 *       - bearerAuth: []   # Require Bearer token
 *     responses:
 *       200:
 *         description: Successfully retrieved scheduled releases statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   type: object
 *                   properties:
 *                     upcoming:
 *                       type: integer
 *                       description: Number of releases scheduled for the next 30 days
 *                       example: 8
 *                     thisWeek:
 *                       type: integer
 *                       description: Number of releases scheduled for the current week
 *                       example: 3
 *                     thisMonth:
 *                       type: integer
 *                       description: Number of releases scheduled for the current month
 *                       example: 12
 *                     overdue:
 *                       type: integer
 *                       description: Number of scheduled releases past their date
 *                       example: 1
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/stats', authUser, getScheduledStats);


/**
 * @swagger
 * /api/schedule:
 *   get:
 *     summary: Get all scheduled content with stats
 *     tags: [Scheduled Releases]
 *     security:
 *       - bearerAuth: []   # Require Bearer token
 *     responses:
 *       200:
 *         description: Successful response
 *   post:
 *     summary: Schedule content by ID and type
 *     tags: [Scheduled Releases]
 *     security:
 *       - bearerAuth: []   # Require Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               modelType:
 *                 type: string
 *                 enum: [EmailSequence, PromptPack, FunnelTemplate]
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *               scheduledTime:
 *                 type: string
 *                 example: "09:00"
 *     responses:
 *       200:
 *         description: Content scheduled successfully
 *   put:
 *     summary: Update scheduled content
 *     tags: [Scheduled Releases]
 *     security:
 *       - bearerAuth: []   # Require Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               modelType:
 *                 type: string
 *                 enum: [EmailSequence, PromptPack, FunnelTemplate]
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *               scheduledTime:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [scheduled, active, expired]
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *   delete:
 *     summary: Delete scheduled content
 *     tags: [Scheduled Releases]
 *     security:
 *       - bearerAuth: []   # Require Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               modelType:
 *                 type: string
 *                 enum: [EmailSequence, PromptPack, FunnelTemplate]
 *     responses:
 *       200:
 *         description: Content deleted successfully
 */
router.get("/", authUser, getAllScheduled);
router.post("/", authUser, scheduleContent);
router.put("/", authUser, updateSchedule);
router.delete("/", authUser, deleteSchedule);


/**
 * @swagger
 * /api/schedule/no-release-scheduled:
 *   get:
 *     summary: Get all scheduled items without a releaseDateTime
 *     description: Returns FunnelTemplates, EmailSequences, and PromptPacks that have status = "scheduled" but no releaseDateTime defined.
 *     tags: [Scheduled Releases]
 *     security:
 *       - bearerAuth: []   # Require Bearer token
 *     responses:
 *       200:
 *         description: Successfully fetched scheduled items without releaseDateTime
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 funnels:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FunnelTemplate'
 *                 emailSequences:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EmailSequence'
 *                 promptPacks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PromptPack'
 *       500:
 *         description: Server error
 */
router.get("/no-release-scheduled", authUser, getAllScheduledWithoutRelease);

export default router;
