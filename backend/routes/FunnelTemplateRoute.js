import express from 'express';
import {
  createFunnelTemplate,
  createFunnelTemplateWithFile,
  getAllFunnelTemplates,
  getFunnelTemplateById,
  updateFunnelTemplate,
  deleteFunnelTemplate,
  getFunnelTemplateStats
} from '../controller/funnelTemplateController.js';
import upload from '../middleware/multer.js';
import { authUser } from '../middleware/userTracker.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: FunnelTemplates
 *   description: Funnel Template Management
 */


/**
 * @swagger
 * /api/funnel-templates/file:
 *   post:
 *     summary: Create a new funnel template with file upload, tier, status, category, and brainType
 *     description: >
 *       Uploads a file (.pdf, .docx, .md, .html, .txt) to Cloudinary and creates a new funnel template.  
 *       Requires `name` and `tier`.  
 *       Optionally accepts `status`, `category`, and `brainType`.
 *     tags: [FunnelTemplates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - tier
 *               - file
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My New Funnel"
 *               tier:
 *                 type: string
 *                 enum: [starter, growth, enterprise]
 *                 example: "growth"
 *               status:
 *                 type: string
 *                 enum: [scheduled, active]
 *                 example: "scheduled"
 *               category:
 *                 type: string
 *                 example: "Marketing Automation"
 *               brainType:
 *                 type: string
 *                 example: "Reflector"
 *                 description: Brain type for which this funnel template is intended
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Upload file (.pdf, .docx, .md, .html, .txt)
 *     responses:
 *       201:
 *         description: Funnel template created successfully
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
 *                   example: Funnel Template created successfully
 *                 data:
 *                   $ref: '#/components/schemas/FunnelTemplate'
 *       400:
 *         description: Bad request (missing required fields or invalid file)
 *       401:
 *         description: Unauthorized (user must be logged in)
 *       500:
 *         description: Server error
 */
router.post('/file', authUser, upload.single('file'), createFunnelTemplateWithFile);

/**
 * @swagger
 * /api/funnel-templates:
 *   post:
 *     summary: Create a new funnel template with direct content
 *     tags: [FunnelTemplates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - tier
 *             properties:
 *               name:
 *                 type: string
 *               pages:
 *                 type: number
 *               category:
 *                 type: string
 *               tier:
 *                 type: string
 *                 enum: [starter, growth, enterprise]
 *               status:
 *                 type: string
 *                 enum: [active, scheduled, inactive]
 *               brainType:
 *                 type: string
 *                 enum: [Architect, Challenger, Synthesizer, Reflector, Catalyst]
 *               content:
 *                 type: string
 *               fileUrl:
 *                 type: string
 *               userRating:
 *                 type: number
 *               releaseDateTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Funnel template created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authUser, createFunnelTemplate);

/**
 * @swagger
 * /api/funnel-templates:
 *   get:
 *     summary: Get all funnel templates
 *     tags: [FunnelTemplates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of funnel templates
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
router.get('/', authUser, getAllFunnelTemplates);

/**
 * @swagger
 * /api/funnel-templates/stats:
 *   get:
 *     summary: Get funnel template statistics
 *     tags: [FunnelTemplates]
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
router.get('/stats', authUser, getFunnelTemplateStats);

/**
 * @swagger
 * /api/funnel-templates/{id}:
 *   get:
 *     summary: Get a funnel template by ID
 *     tags: [FunnelTemplates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Funnel template ID
 *     responses:
 *       200:
 *         description: Funnel template found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Template not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authUser, getFunnelTemplateById);

/**
 * @swagger
 * /api/funnel-templates/{id}:
 *   put:
 *     summary: Update a funnel template
 *     tags: [FunnelTemplates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Funnel template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               pages:
 *                 type: number
 *               category:
 *                 type: string
 *               tier:
 *                 type: string
 *                 enum: [starter, growth, enterprise]
 *               status:
 *                 type: string
 *                 enum: [active, scheduled, inactive]
 *               brainType:
 *                 type: string
 *                 enum: [Architect, Challenger, Synthesizer, Reflector, Catalyst]
 *               usage:
 *                 type: number
 *               conversions:
 *                 type: number
 *               content:
 *                 type: string
 *               fileUrl:
 *                 type: string
 *               userRating:
 *                 type: number
 *               releaseDateTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Funnel template updated successfully
 *       404:
 *         description: Template not found
 */
router.put('/:id', authUser, updateFunnelTemplate);

/**
 * @swagger
 * /api/funnel-templates/{id}:
 *   delete:
 *     summary: Delete a funnel template
 *     tags: [FunnelTemplates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Funnel template ID
 *     responses:
 *       200:
 *         description: Funnel template deleted successfully
 *       404:
 *         description: Template not found
 */
router.delete('/:id', authUser, deleteFunnelTemplate);

export default router;
