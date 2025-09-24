import express from "express";
import { getWeeklyTools } from "../controller/recentlyaddedtoolsController.js";
import { authUser } from '../middleware/userTracker.js';



const router = express.Router();

/**
 * @swagger
 * /api/recently-added-tools/weekly-tools:
 *   get:
 *     summary: Get weekly tools statistics
 *     description: Returns how many Email Sequences, Funnel Templates, and Prompt Packs were created in the current week.
 *     tags:
 *       - Tools
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly tools statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 weekRange:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-09-22T00:00:00.000Z
 *                     end:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-09-29T00:00:00.000Z
 *                 data:
 *                   type: object
 *                   properties:
 *                     emailSequences:
 *                       type: integer
 *                       example: 4
 *                     funnelTemplates:
 *                       type: integer
 *                       example: 2
 *                     promptPacks:
 *                       type: integer
 *                       example: 5
 *                     total:
 *                       type: integer
 *                       example: 11
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Server error
 */
router.get("/weekly-tools", authUser, getWeeklyTools);

export default router;
