//prompt routes
import express from 'express';
import {
  create,
  getAll,
  getById,
  update,
  deletePromptPack,
  bulkDelete,
  addPrompt,
  removePrompt,
  incrementUsage,
  getStatistics,
  uploadPromptPack
} from '../controller/promptPackController.js';
import upload from '../middleware/multer.js';

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
 *       Uploads a `.txt`, `.json`, or `.md` file containing prompts.  
 *       The file will be uploaded to Cloudinary, parsed, and stored in the database  
 *       with the provided tier. Other fields like `name`, `category`, and `status`  
 *       are set automatically by the server.
 *     tags: [PromptPacks]
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
 *               - tier
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The prompt pack file to upload (.txt, .json, .md)
 *               tier:
 *                 type: string
 *                 enum: [basic, premium, enterprise]
 *                 description: Access tier for the prompt pack
 *                 example: basic
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
 *                   type: object
 *                   description: The saved prompt pack object, including Cloudinary file URL
 *       400:
 *         description: Bad request (e.g., missing file or tier, invalid file format)
 *       500:
 *         description: Server error while uploading prompt pack
 */
router.post('/upload', upload.single('file'), uploadPromptPack);



/**
 * @swagger
 * /api/prompt-packs:
 *   post:
 *     summary: Create a new prompt pack
 *     tags: [PromptPacks]
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
 */
router.post('/', create);

/**
 * @swagger
 * /api/prompt-packs:
 *   get:
 *     summary: Get all prompt packs with filters
 *     tags: [PromptPacks]
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
router.get('/', getAll);

/**
 * @swagger
 * /api/prompt-packs/statistics:
 *   get:
 *     summary: Get prompt pack usage statistics
 *     tags: [PromptPacks]
 *     responses:
 *       200:
 *         description: Statistics fetched successfully
 */
router.get('/statistics', getStatistics);

/**
 * @swagger
 * /api/prompt-packs/{id}:
 *   get:
 *     summary: Get prompt pack by ID
 *     tags: [PromptPacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prompt pack details
 */
router.get('/:id', getById);

/**
 * @swagger
 * /api/prompt-packs/{id}:
 *   put:
 *     summary: Update a prompt pack
 *     tags: [PromptPacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Prompt pack updated successfully
 */
router.put('/:id', update);

/**
 * @swagger
 * /api/prompt-packs/{id}:
 *   delete:
 *     summary: Delete a prompt pack by ID
 *     tags: [PromptPacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prompt pack deleted
 */
router.delete('/:id', deletePromptPack);

/**
 * @swagger
 * /api/prompt-packs:
 *   delete:
 *     summary: Bulk delete prompt packs
 *     tags: [PromptPacks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Prompt packs deleted successfully
 */
router.delete('/', bulkDelete);

/**
 * @swagger
 * /api/prompt-packs/{id}/prompts:
 *   post:
 *     summary: Add a prompt to a prompt pack
 *     tags: [PromptPacks]
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
 *             required: [content, type]
 *             properties:
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prompt added successfully
 */
router.post('/:id/prompts', addPrompt);

/**
 * @swagger
 * /api/prompt-packs/{id}/prompts/{promptId}:
 *   delete:
 *     summary: Remove a prompt from a prompt pack
 *     tags: [PromptPacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: promptId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prompt removed successfully
 */
router.delete('/:id/prompts/:promptId', removePrompt);

/**
 * @swagger
 * /api/prompt-packs/{id}/usage:
 *   put:
 *     summary: Increment usage count of a prompt pack
 *     tags: [PromptPacks]
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
router.put('/:id/usage', incrementUsage);

export default router;
