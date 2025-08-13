import express from 'express';
import { createOrUpdateCustomization, getMyCustomization } from '../controller/customizationController.js';
import upload from '../middleware/multer.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customization
 *   description: Manage user customization settings
 */

/**
 * @swagger
 * /api/customization:
 *   post:
 *     summary: Create or update customization for a user
 *     tags: [Customization]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 68822989187f3b6de0a546ce
 *               logo:
 *                 type: string
 *                 format: binary
 *               primaryColor:
 *                 type: string
 *                 example: "#00AEEF"
 *               secondaryColor:
 *                 type: string
 *                 example: "#211D1D"
 *               textColor:
 *                 type: string
 *                 example: "#FFFFFF"
 *               borderColor:
 *                 type: string
 *                 example: "#CCCCCC"
 *     responses:
 *       200:
 *         description: Customization created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Customization'
 *       500:
 *         description: Internal server error
 */
router.post('/', upload.single('logo'), createOrUpdateCustomization);

/**
 * @swagger
 * /api/customization/{userId}:
 *   get:
 *     summary: Get customization for a specific user
 *     tags: [Customization]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "64a1f07d5c1234567890abcd"
 *     responses:
 *       200:
 *         description: Customization fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Customization'
 *       404:
 *         description: Customization not found
 *       500:
 *         description: Server error
 */
router.get('/:userId', getMyCustomization);

export default router;
