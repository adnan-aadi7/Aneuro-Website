//email routes

import express from 'express';
import {
  create,
  getAll,
  getById,
  update,
  deleteSequence,
  bulkDelete,
  getStats
} from '../controller/emailSequenceController.js';
import upload from '../middleware/multer.js';
import { authUser } from "../middleware/userTracker.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: EmailSequences
 *   description: Manage email automation sequences
 */

/**
 * @swagger
 * /api/email-sequences:
 *   post:
 *     summary: Create a new email sequence
 *     tags: [EmailSequences]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - tier
 *               - type
 *               - brainType
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Welcome Campaign"
 *               tier:
 *                 type: string
 *                 enum: [basic, premium, enterprise]
 *                 example: "premium"
 *               releaseDateTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-15T10:00:00Z"
 *               status:
 *                 type: string
 *                 enum: [active, scheduled]
 *                 default: scheduled
 *                 example: "scheduled"
 *               type:
 *                 type: string
 *                 enum: [manual, file]
 *                 example: "manual"
 *               brainType:
 *                 type: string
 *                 enum: [Architect, Challenger, Synthesizer, Reflector, Catalyst]
 *                 example: "Architect"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload when type is "file"
 *               emails:
 *                 type: array
 *                 description: Required when type is "manual". Array of email objects with content and type.
 *                 items:
 *                   type: object
 *                   required:
 *                     - content
 *                     - type
 *                   properties:
 *                     content:
 *                       type: string
 *                       description: Email body text, HTML, or file URL
 *                       example: "Welcome to our platform!"
 *                     type:
 *                       type: string
 *                       enum: [Architect, Challenger, Synthesizer, Reflector, Catalyst]
 *                       description: Brain type for this email
 *                       example: "Architect"
 *     responses:
 *       201:
 *         description: Email sequence created successfully
 *       400:
 *         description: Missing or invalid required fields
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */

router.post("/", upload.single("file"), authUser, create);


/**
 * @swagger
 * /api/email-sequences:
 *   get:
 *     summary: Get all email sequences with filters
 *     tags: [EmailSequences]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: tier
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of email sequences
 *       500:
 *         description: Server error
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/email-sequences/stats:
 *   get:
 *     summary: Get email sequence statistics
 *     tags: [EmailSequences]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/stats', getStats);
/**
 * @swagger
 * /api/email-sequences/{id}:
 *   get:
 *     summary: Get a single email sequence by ID
 *     tags: [EmailSequences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email sequence found
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getById);

/**
 * @swagger
 * /api/email-sequences/{id}:
 *   put:
 *     summary: Update an email sequence by ID
 *     tags: [EmailSequences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the email sequence
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               tier:
 *                 type: string
 *                 enum: [basic, premium, enterprise]
 *               status:
 *                 type: string
 *                 enum: [active, scheduled]
 *               type:
 *                 type: string
 *                 enum: [manual, file]
 *               brainType:
 *                 type: string
 *                 enum: [Architect, Challenger, Synthesizer, Reflector, Catalyst]
 *               releaseDateTime:
 *                 type: string
 *                 format: date-time
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Required if type is "file"
 *               emails:
 *                 type: string
 *                 description: >
 *                   Required if type is "manual".
 *                   JSON array string of objects, each with `content` and optional `type`.
 *                   Example:
 *                   `[{"content":"Welcome to our platform!","type":"Challenger"}]`
 *     responses:
 *       200:
 *         description: Email sequence updated successfully
 *       400:
 *         description: Invalid input or missing required fields
 *       404:
 *         description: Email sequence not found
 *       500:
 *         description: Server error
 */

router.put(
  '/:id',
  upload.single('file'), 
  update
);

/**
 * @swagger
 * /api/email-sequences/{id}:
 *   delete:
 *     summary: Delete a single email sequence by ID
 *     tags: [EmailSequences]
 *     security:
 *       - bearerAuth: []   # <-- Require JWT token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64f12c5b8d7a2c1f2a9b4567"
 *         description: MongoDB ObjectId of the email sequence
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.delete('/:id', authUser, deleteSequence);


/**
 * @swagger
 * /api/email-sequences/bulk/delete:
 *   delete:
 *     summary: Bulk delete email sequences by IDs
 *     tags: [EmailSequences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Sequences deleted
 *       400:
 *         description: Invalid IDs
 *       500:
 *         description: Server error
 */
router.delete('/bulk/delete', bulkDelete);



export default router;
