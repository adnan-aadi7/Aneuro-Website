import express from 'express';
import { saveAnswer, getProgress, createAudience, getAudienceSessions } from '../controller/quizController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quiz
 *   description: Quiz answer saving and progress tracking
 */

/**
 * @swagger
 * /api/quiz/start:
 *   post:
 *     summary: Start or continue a quiz session by saving audience answer tied to subscriber user ID
 *     tags: [Quiz]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - name
 *               - email
 *               - question_number
 *               - selected_option
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: Subscriber's user ID to tie audience to
 *                 example: 64f3bc9f1234567890abcdef
 *               name:
 *                 type: string
 *                 description: Audience participant's name
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Audience participant's email (unique per subscriber)
 *                 example: jane.doe@example.com
 *               question_number:
 *                 type: integer
 *                 description: The quiz question number being answered
 *                 example: 1
 *               selected_option:
 *                 type: string
 *                 enum: [A, B, C, D]
 *                 description: Selected answer option
 *                 example: B
 *     responses:
 *       200:
 *         description: Quiz answer saved successfully, tied to subscriber user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: The saved quiz session data
 *       400:
 *         description: Missing or invalid fields in request
 *       500:
 *         description: Server error
 */

router.post('/start', createAudience);
/**
 * @swagger
 * /api/quiz/sessions:
 *   get:
 *     summary: Get all audience quiz sessions tied to a subscriber's user ID excluding subscriber's own quiz sessions
 *     tags: [Quiz]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Subscriber's user ID to filter audience sessions
 *         example: 64f3bc9f1234567890abcdef
 *     responses:
 *       200:
 *         description: List of audience quiz sessions found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   description: Array of audience quiz session objects
 *                   items:
 *                     type: object
 *       400:
 *         description: Missing user_id query parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: user_id query parameter is required
 *       404:
 *         description: No audience quiz sessions found for this user_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No audience quiz sessions found for this user_id
 *       500:
 *         description: Server error
 */
router.get('/sessions', getAudienceSessions);


/**
 * @swagger
 * /api/quiz/save:
 *   post:
 *     summary: Save or update a quiz answer
 *     tags: [Quiz]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - question_number
 *               - selected_option
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "64d2fbc8a9a7f8d6f98f1234"
 *               question_number:
 *                 type: integer
 *                 example: 1
 *               selected_option:
 *                 type: string
 *                 example: "A"
 *     responses:
 *       200:
 *         description: Answer saved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Answer saved"
 *               progress: "30% completed"
 *               answeredCount: 3
 *               totalQuestions: 10
 *               session:
 *                 _id: "64d2fbc8a9a7f8d6f98f1234"
 *                 user_id: "64d2fbc8a9a7f8d6f98f5678"
 *                 answers:
 *                   - question_number: 1
 *                     selected_option: "A"
 *                     mapped_brain_type: "Analytical"
 *       500:
 *         description: Server error
 */
router.post('/save', saveAnswer);

/**
 * @swagger
 * /api/quiz/progress/{user_id}:
 *   get:
 *     summary: Get quiz completion progress for a user
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *         example: "64d2fbc8a9a7f8d6f98f1234"
 *     responses:
 *       200:
 *         description: Progress retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               user_id: "64d2fbc8a9a7f8d6f98f1234"
 *               progress: "30% completed"
 *               answeredCount: 3
 *               totalQuestions: 10
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
router.get('/progress/:user_id', getProgress);

export default router;
