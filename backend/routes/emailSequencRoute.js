//email routes

import express from 'express';
import {
  create,
  getAll,
  getById,
  update,
  deleteSequence,
  getStats,
  editEmailInSequence,
  deleteEmailInSequence,
  getGroupedEmailsByTier
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
 *                 enum: [starter, growth, enterprise]
 *                 example: "growth"
 *               releaseDateTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-15T10:00:00Z"
 *               status:
 *                 type: string
 *                 enum: [active, scheduled]
 *                 default: scheduled
 *                 example: "scheduled"
 *               category:
 *                 type: string
 *                 description: Category for grouping email sequences
 *                 example: "Onboarding"
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

router.post("/", authUser, upload.single("file"), create);

/**
 * @swagger
 * /api/email-sequences/grouped:
 *   get:
 *     summary: Get grouped emails by tier and optional category
 *     tags: [EmailSequences]
 *     security:
 *       - bearerAuth: []   # 🔒 Requires JWT token
 *     parameters:
 *       - in: query
 *         name: tier
 *         schema:
 *           type: string
 *           enum: [starter, growth, enterprise]
 *         required: true
 *         description: Tier filter
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: (Optional) Filter by category within the given tier
 *     responses:
 *       200:
 *         description: Emails grouped by brain type for the given tier (and category if provided)
 *       400:
 *         description: Missing or invalid parameters
 *       404:
 *         description: No email sequences found
 *       500:
 *         description: Server error
 */
router.get("/grouped", authUser, getGroupedEmailsByTier);


/**
 * @swagger
 * /api/email-sequences:
 *   get:
 *     summary: Get all email sequences with filters
 *     tags: [EmailSequences]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
router.get('/', authUser, getAll);

/**
 * @swagger
 * /api/email-sequences/stats:
 *   get:
 *     summary: Get email sequence statistics
 *     tags: [EmailSequences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
router.get('/stats', authUser, getStats);

/**
 * @swagger
 * /api/email-sequences/{id}:
 *   get:
 *     summary: Get a single email sequence by ID
 *     tags: [EmailSequences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email sequence found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authUser, getById);

/**
 * @swagger
 * /api/email-sequences/{id}:
 *   put:
 *     summary: Update an email sequence by ID (append emails instead of overwrite)
 *     tags: [EmailSequences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the email sequence (24-character MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the email sequence
 *               tier:
 *                 type: string
 *                 enum: [starter, growth, enterprise]
 *                 description: Subscription tier for the sequence
 *               status:
 *                 type: string
 *                 enum: [active, scheduled]
 *                 description: Current status of the sequence
 *               type:
 *                 type: string
 *                 enum: [manual, file]
 *                 description: Upload method — manual entry or file upload
 *               brainType:
 *                 type: string
 *                 enum: [Architect, Challenger, Synthesizer, Reflector, Catalyst]
 *                 description: Brain type classification for the sequence
 *               category:
 *                 type: string
 *                 description: Category for grouping email sequences
 *               releaseDateTime:
 *                 type: string
 *                 format: date-time
 *                 description: Scheduled release date/time
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload (required if `type` is "file")
 *               emails:
 *                 type: string
 *                 description: >
 *                   Required if type is "manual".
 *                   JSON array string of objects, each with `content` (string) and optional `type` (string).
 *                   Example:
 *                   `[{"content":"Welcome to our platform!","type":"Challenger"}]`
 *     responses:
 *       200:
 *         description: Email sequence updated successfully
 *       400:
 *         description: Invalid ID, invalid JSON, or missing required fields
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
 * /api/email-sequences/{sequenceId}/emails/{emailId}:
 *   put:
 *     summary: Edit a specific email in a sequence by emailId
 *     description: Update the content or brain type of an email inside an email sequence.  
 *                  Requires authentication.
 *     tags: [EmailSequences]
 *     security:
 *       - bearerAuth: []   # 🔐 Require JWT
 *     parameters:
 *       - in: path
 *         name: sequenceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the email sequence
 *       - in: path
 *         name: emailId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the email inside the sequence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Welcome to our updated platform!"
 *               type:
 *                 type: string
 *                 enum: [Architect, Challenger, Synthesizer, Reflector, Catalyst]
 *                 example: "Challenger"
 *     responses:
 *       200:
 *         description: Email updated successfully
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
 *                   example: Email updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f2c13eb89f1a222c33de46
 *                     type:
 *                       type: string
 *                       example: Challenger
 *                     content:
 *                       type: string
 *                       example: Welcome to our updated platform!
 *       400:
 *         description: Invalid brain type
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Email or sequence not found
 *       500:
 *         description: Server error
 */

router.put("/:sequenceId/emails/:emailId", authUser, editEmailInSequence);

/**
 * @swagger
 * /api/email-sequences/{sequenceId}/emails/{emailId}:
 *   delete:
 *     summary: Delete a specific email in a sequence by emailId
 *     description: Removes an email from the given email sequence. Requires authentication.
 *     tags: [EmailSequences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sequenceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the email sequence
 *       - in: path
 *         name: emailId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the email inside the sequence
 *     responses:
 *       200:
 *         description: Email deleted successfully
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
 *                   example: Email deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     emailId:
 *                       type: string
 *                       example: 64f2c13eb89f1a222c33de46
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Email or sequence not found
 *       500:
 *         description: Server error
 */
router.delete("/:sequenceId/emails/:emailId", authUser, deleteEmailInSequence);


export default router;
