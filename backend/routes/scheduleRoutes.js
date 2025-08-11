import express from "express";
import {
  getAllScheduled,
  scheduleContent,
  updateSchedule,
  deleteSchedule
} from "../controller/scheduleController.js";

const router = express.Router();

/**
 * @swagger
 * /api/schedule:
 *   get:
 *     summary: Get all scheduled content with stats
 *     tags: [Schedule]
 *     responses:
 *       200:
 *         description: Successful response
 *   post:
 *     summary: Schedule content by ID and type
 *     tags: [Schedule]
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
 *     tags: [Schedule]
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
 *     tags: [Schedule]
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
