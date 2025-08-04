import express from 'express';
import {
  create,
  getAll,
  getById,
  update,
  deleteSequence,
  bulkDelete
} from '../controller/emailSequenceController.js';
import upload from '../middleware/multer.js';
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
 *             properties:
 *               name:
 *                 type: string
 *               emailCount:
 *                 type: number
 *               emails:
 *                 type: number
 *               tier:
 *                 type: string
 *                 enum: [basic, premium, enterprise]
 *               status:
 *                 type: string
 *                 enum: [active, scheduled]
 *               type:
 *                 type: string
 *                 enum: [manual, file]
 *               manualContent:
 *                 type: string
 *               emailTemplate:
 *                 type: string
 *                 description: JSON string of the email template, e.g. {"subject":"...","body":"...","footer":"..."}
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload when type is "file"
 *     responses:
 *       201:
 *         description: Email sequence created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

router.post('/', upload.single('file'), create);

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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *               fileUrl:
 *                 type: string
 *               manualContent:
 *                 type: string
 *               emailTemplate:
 *                 type: object
 *                 properties:
 *                   subject:
 *                     type: string
 *                   body:
 *                     type: string
 *                   footer:
 *                     type: string
 *     responses:
 *       200:
 *         description: Email sequence updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.put('/:id', update);

/**
 * @swagger
 * /api/email-sequences/{id}:
 *   delete:
 *     summary: Delete a single email sequence by ID
 *     tags: [EmailSequences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteSequence);

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
