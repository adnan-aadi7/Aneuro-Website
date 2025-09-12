import express from "express";
import {
  createNotification,
  getUserNotifications,
  updateNotificationPreferences,
  markNotificationAsRead,
  getPreferences
} from "../controller/notificationController.js";
import { authUser } from "../middleware/userTracker.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API endpoints for managing notifications
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       500:
 *         description: Server error
 */
router.post("/", authUser, createNotification);

/**
 * @swagger
 * /api/notifications/{userId}:
 *   get:
 *     summary: Get notifications for a user (includes public + user-specific)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB User ID
 *     responses:
 *       200:
 *         description: List of notifications
 *       500:
 *         description: Server error
 */
router.get("/:userId", authUser, getUserNotifications);

/**
 * @swagger
 * /api/notifications/{userId}/preferences:
 *   put:
 *     summary: Update a user's notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newtool:
 *                 type: boolean
 *               quiz:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/:userId/preferences", authUser, updateNotificationPreferences);

/**
 * @swagger
 * /api/notifications/{notificationId}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the notification to mark as read
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
router.put("/:notificationId/read", authUser, markNotificationAsRead);

/**
 * @swagger
 * /api/notifications/{userId}/preferences:
 *   get:
 *     summary: Get a user's notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User preferences fetched successfully
 *       404:
 *         description: Preferences not found
 *       500:
 *         description: Internal server error
 */
router.get("/:userId/preferences", authUser, getPreferences);

export default router;
