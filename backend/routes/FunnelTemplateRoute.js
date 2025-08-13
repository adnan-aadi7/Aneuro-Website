//funnel templates routes
import express from 'express';
import {
  createFunnelTemplate,
  getAllFunnelTemplates,
  getFunnelTemplateById,
  updateFunnelTemplate,
  deleteFunnelTemplate,
  getFunnelTemplateStats,
  createFunnelTemplateWithFile
} from '../controller/funnelTemplateController.js';
import upload from '../middleware/multer.js';

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
 *     summary: Create a new funnel template with file upload and tier
 *     tags:
 *       - FunnelTemplates
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
 *                 example: "Premium"
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Funnel template created successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Server error
 */
router.post('/file', upload.single('file'), createFunnelTemplateWithFile);

/**
 * @swagger
 * /api/funnel-templates:
 *   post:
 *     summary: Create a new funnel template
 *     tags: [FunnelTemplates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - pages
 *               - category
 *               - tier
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *               pages:
 *                 type: number
 *               category:
 *                 type: string
 *               tier:
 *                 type: string
 *                 enum: [basic, premium, enterprise]
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
 *               fileUrl:
 *                 type: string
 *               userRating:
 *                 type: number
 *               releaseDateTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Funnel template created
 *       400:
 *         description: Bad request
 */
router.post('/', createFunnelTemplate);

/**
 * @swagger
 * /api/funnel-templates:
 *   get:
 *     summary: Get all funnel templates
 *     tags: [FunnelTemplates]
 *     responses:
 *       200:
 *         description: List of funnel templates
 *       500:
 *         description: Server error
 */
router.get('/', getAllFunnelTemplates);

/**
 * @swagger
 * /api/funnel-templates/stats:
 *   get:
 *     summary: Get funnel template statistics
 *     tags: [FunnelTemplates]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/stats', getFunnelTemplateStats);


/**
 * @swagger
 * /api/funnel-templates/{id}:
 *   get:
 *     summary: Get a funnel template by ID
 *     tags: [FunnelTemplates]
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
 *       404:
 *         description: Template not found
 */
router.get('/:id', getFunnelTemplateById);

/**
 * @swagger
 * /api/funnel-templates/{id}:
 *   put:
 *     summary: Update a funnel template
 *     tags: [FunnelTemplates]
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
 *                 enum: [basic, premium, enterprise]
 *               status:
 *                 type: string
 *                 enum: [active, scheduled, inactive]
 *     responses:
 *       200:
 *         description: Funnel template updated
 *       404:
 *         description: Template not found
 */
router.put('/:id', updateFunnelTemplate);

/**
 * @swagger
 * /api/funnel-templates/{id}:
 *   delete:
 *     summary: Delete a funnel template
 *     tags: [FunnelTemplates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Funnel template ID
 *     responses:
 *       200:
 *         description: Funnel template deleted
 *       404:
 *         description: Template not found
 */
router.delete('/:id', deleteFunnelTemplate);

export default router;
