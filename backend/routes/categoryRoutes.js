import express from "express";
import {
  createCategory,
  updateCategory,
  getCategories,
  getUniqueEmailCategories,
  getUniquePromptCategories,
  getUniqueFunnelCategories
} from "../controller/categoryController.js";
import { authUser } from "../middleware/userTracker.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing categories
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Technology"
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Missing category name
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.post("/", authUser, createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Business"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.put("/:id", authUser, updateCategory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.get("/", authUser, getCategories);

/**
 * @swagger
 * /api/categories/email-sequences:
 *   get:
 *     summary: Get all unique categories from EmailSequence
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unique categories
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.get("/email-sequences", authUser, getUniqueEmailCategories);

/**
 * @swagger
 * /api/categories/prompts:
 *   get:
 *     summary: Get all unique categories from Prompts
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unique categories
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.get("/prompts", authUser, getUniquePromptCategories);

/**
 * @swagger
 * /api/categories/funnel-templates:
 *   get:
 *     summary: Get all unique categories from Funnel Templates
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unique categories
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.get("/funnel-templates", authUser, getUniqueFunnelCategories);

export default router;
