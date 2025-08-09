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
  getStatistics
} from '../controller/promptPackController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PromptPacks
 *   description: Prompt pack management APIs
 */

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
 *   patch:
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
router.patch('/:id/usage', incrementUsage);

export default router;
