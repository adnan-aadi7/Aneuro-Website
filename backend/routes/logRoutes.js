// routes/logRoutes.js
import { Router } from 'express';
import { getLogs } from '../controller/logController.js';

const router = Router();


/**
 * @swagger
 * tags:
 *   name: System Logs
 *   description: API for monitoring system activities (read-only)
 */

/**
 * @swagger
 * /api/system-logs:
 *   get:
 *     summary: Get system logs
 *     description: Retrieve system logs with optional filters for action type, user, time range, and search keywords.
 *     tags: [System Logs]
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [UPLOAD, EDIT, DELETE]
 *         description: Filter logs by action type.
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Filter logs by user email.
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [last_24h, last_7d, last_30d, all_time]
 *         description: Filter logs by a time period.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword for content type, asset, or description.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page.
 *     responses:
 *       200:
 *         description: List of system logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           email:
 *                             type: string
 *                       action:
 *                         type: string
 *                         example: UPLOAD
 *                       contentType:
 *                         type: string
 *                       affectedAsset:
 *                         type: string
 *                       severity:
 *                         type: string
 *                         example: info
 *                       description:
 *                         type: string
 *       500:
 *         description: Server error
 */
router.get('/', getLogs);

export default router;
