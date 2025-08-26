//prompt routes
import express from 'express';
import {
  create,
  getAll,
  getById,
  update,
  deletePromptPack,
  removePrompt,
  incrementUsage,
  getStatistics,
  uploadPromptPack,
  editPromptInPromptPack,
  getGroupedPromptsByTier
} from '../controller/promptPackController.js';
import upload from '../middleware/multer.js';
import { authUser } from "../middleware/userTracker.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PromptPacks
 *   description: Prompt pack management APIs
 */

/**
 * @swagger
 * /api/prompt-packs/upload:
 *   post:
 *     summary: Upload a prompt pack file
 *     description: >
 *       Uploads a `.pdf`, `.docx`, `.md`, or `.html` file containing prompts.  
 *       The file will be uploaded to Cloudinary, stored in the database with  
 *       the provided `name`, `category`, `tier`, and `status`.  
 *       Optionally accepts `releaseDateTime` and `type` for prompts.
 *     tags: [PromptPacks]
 *     security:
 *       - bearerAuth: []   # Requires authentication
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - name
 *               - category
 *               - tier
 *               - status
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The prompt pack file (.pdf, .docx, .md, .html)
 *               name:
 *                 type: string
 *                 description: Name of the prompt pack
 *                 example: "AI Architect Guide"
 *               category:
 *                 type: string
 *                 description: Category of the prompt pack
 *                 example: "Technology"
 *               tier:
 *                 type: string
 *                 enum: [starter, growth, enterprise]
 *                 description: Access tier for the prompt pack
 *                 example: starter
 *               status:
 *                 type: string
 *                 enum: [active, scheduled]
 *                 description: Status of the prompt pack
 *                 example: scheduled
 *               releaseDateTime:
 *                 type: string
 *                 format: date-time
 *                 description: Optional release date and time
 *                 example: "2025-08-15T10:00:00Z"
 *               type:
 *                 type: string
 *                 enum: [Architect, Challenger, Synthesizer, Reflector, Catalyst]
 *                 description: Type of the prompt inside the pack
 *                 example: Architect
 *     responses:
 *       201:
 *         description: Prompt pack uploaded successfully
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
 *                   example: Prompt pack uploaded successfully
 *                 data:
 *                   $ref: '#/components/schemas/PromptPack'
 *       400:
 *         description: Bad request (missing required fields or invalid file format)
 *       401:
 *         description: Unauthorized (user must be logged in)
 *       500:
 *         description: Server error while uploading prompt pack
 */
router.post('/upload', authUser, upload.single('file'), uploadPromptPack);


/**
 * @swagger
 * /api/prompt-packs:
 *   post:
 *     summary: Create a new prompt pack
 *     tags: [PromptPacks]
 *     security:
 *       - bearerAuth: []   # Added for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, tier, status]
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               tier:
 *                 type: string
 *               status:
 *                 type: string
 *               prompts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                     type:
 *                       type: string
 *     responses:
 *       201:
 *         description: Prompt pack created successfully
 *       401:
 *         description: Unauthorized (user must be authenticated)
 */
router.post('/', authUser, create);


/**
 * @swagger
 * /api/prompt-packs/grouped:
 *   get:
 *     summary: Get grouped prompts by tier and optional category
 *     tags: [PromptPacks]
 *     security:
 *       - bearerAuth: []   
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
 *         description: Prompts grouped by brain type for the given tier (and category if provided)
 *       400:
 *         description: Missing or invalid parameters
 *       404:
 *         description: No prompt packs found
 *       500:
 *         description: Server error
 */
router.get("/grouped", authUser, getGroupedPromptsByTier);


/**
 * @swagger
 * /api/prompt-packs:
 *   get:
 *     summary: Get all prompt packs with filters
 *     tags: [PromptPacks]
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
 *         name: category
 *         schema:
 *           type: string
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
 *         name: minUsage
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxUsage
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of prompt packs
 */
router.get('/', authUser, getAll);

/**
 * @swagger
 * /api/prompt-packs/statistics:
 *   get:
 *     summary: Get prompt pack usage statistics
 *     tags: [PromptPacks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics fetched successfully
 */
router.get('/statistics', authUser, getStatistics);

/**
 * @swagger
 * /api/prompt-packs/{id}:
 *   get:
 *     summary: Get prompt pack by ID
 *     tags: [PromptPacks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the prompt pack
 *     responses:
 *       200:
 *         description: Prompt pack details
 *       404:
 *         description: Prompt pack not found
 */
router.get('/:id', authUser, getById);


/**
 * @swagger
 * /api/prompt-packs/{id}:
 *   put:
 *     summary: Update a prompt pack
 *     tags: [PromptPacks]
 *     security:
 *       - bearerAuth: []   # Authentication required
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f123abc4567890def12345
 *         description: The ID of the prompt pack to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               tier:
 *                 type: string
 *                 enum: [basic, premium, enterprise]
 *               status:
 *                 type: string
 *                 enum: [active, scheduled]
 *               releaseDateTime:
 *                 type: string
 *                 format: date-time
 *               prompts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                     type:
 *                       type: string
 *     responses:
 *       200:
 *         description: Prompt pack updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Prompt pack not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authUser, update);

/**
 * @swagger
 * /api/prompt-packs/{id}:
 *   delete:
 *     summary: Delete a prompt pack by ID
 *     tags: [PromptPacks]
 *     security:
 *       - bearerAuth: []   # Authentication required
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f123abc4567890def12345
 *         description: The ID of the prompt pack to delete
 *     responses:
 *       200:
 *         description: Prompt pack deleted successfully
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
 *                   example: Prompt pack deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedId:
 *                       type: string
 *                     deletedName:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Prompt pack not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authUser, deletePromptPack);



/**
 * @swagger
 * /api/prompt-packs/{id}/prompts/{promptId}:
 *   delete:
 *     summary: Remove a prompt from a prompt pack
 *     tags: [PromptPacks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the prompt pack
 *       - in: path
 *         name: promptId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the prompt to remove
 *     responses:
 *       200:
 *         description: Prompt removed successfully
 *       404:
 *         description: Prompt pack or prompt not found
 *       500:
 *         description: Failed to remove prompt
 */
router.delete('/:id/prompts/:promptId', authUser, removePrompt);

/**
 * @swagger
 * /api/prompt-packs/{id}/usage:
 *   put:
 *     summary: Increment usage count of a prompt pack
 *     tags: [PromptPacks]
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
 *         description: Usage count incremented
 */
router.put('/:id/usage', authUser, incrementUsage);

/**
 * @swagger
 * /api/prompt-packs/{packId}/prompts/{promptId}:
 *   put:
 *     summary: Edit a specific prompt inside a prompt pack
 *     description: Update the content or type of a prompt inside a given prompt pack.
 *     tags:
 *       - PromptPacks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the prompt pack
 *       - in: path
 *         name: promptId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the prompt to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated content for the prompt"
 *               type:
 *                 type: string
 *                 enum: [Architect, Challenger, Synthesizer, Reflector, Catalyst]
 *                 example: "Challenger"
 *     responses:
 *       200:
 *         description: Prompt updated successfully
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
 *                   example: Prompt updated successfully
 *                 data:
 *                   type: object
 *                   description: The updated prompt pack
 *       400:
 *         description: Invalid input (no fields provided)
 *       404:
 *         description: Prompt pack or prompt not found
 *       500:
 *         description: Failed to update prompt
 */
router.put("/:packId/prompts/:promptId", authUser, editPromptInPromptPack);


export default router;
