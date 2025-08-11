//schdule realse route
import express from "express";
import {
  getAllScheduled,
  scheduleContent,
  updateSchedule,
  deleteSchedule,
  getScheduledStats
} from "../controller/scheduleController.js";


const router = express.Router();
/**
 * @swagger
 * /api/schedule/stats:
 *   get:
 *     summary: Get scheduled releases statistics
 *     description: Returns counts for upcoming, this week, this month, and overdue scheduled releases across Email Sequences, Prompt Packs, and Funnel Templates.
 *     tags:
 *       - Scheduled Releases
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
 */
router.get('/stats', getScheduledStats);


/**
 * @swagger
 * /api/schedule:
 *   get:
 *     summary: Get all scheduled content with stats
 *     tags: [Scheduled Releases]
 *     responses:
 *       200:
 *         description: Successful response
 *   post:
 *     summary: Schedule content by ID and type
 *     tags: [Scheduled Releases]
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
router.get("/", getAllScheduled);
router.post("/", scheduleContent);
router.put("/", updateSchedule);
router.delete("/", deleteSchedule);

export default router;
