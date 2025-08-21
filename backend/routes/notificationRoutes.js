import express from "express";
import {
  createNotification,
  getUserNotifications,
  updateNotificationPreferences,
  markNotificationAsRead,
  getPreferences
} from "../controller/notificationController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API endpoints for managing notifications
 */


router.post("/", createNotification);

/**
 * @swagger
 * /api/notifications/{userId}:
 *   get:
 *     summary: Get notifications for a user (includes public + user-specific)
 *     tags: [Notifications]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Server error
 */
router.get("/:userId", getUserNotifications);

/**
 * @swagger
 * /api/notifications/{userId}/preferences:
 *   put:
 *     summary: Update a user's notification preferences
 *     tags: [Notifications]
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
 *                 example: false
 *               quiz:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/:userId/preferences", updateNotificationPreferences);

/**
 * @swagger
 * /api/notifications/{notificationId}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
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
 *                   example: Notification marked as read
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
router.put("/:notificationId/read", markNotificationAsRead);

/**
 * @swagger
 * /api/notifications/{userId}/preferences:
 *   get:
 *     summary: Get a user's notification preferences
 *     tags: [Notifications]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     newtool:
 *                       type: boolean
 *                       example: true
 *                     quiz:
 *                       type: boolean
 *                       example: false
 *       404:
 *         description: Preferences not found
 *       500:
 *         description: Internal server error
 */

router.get("/:userId/preferences", getPreferences);

export default router;
