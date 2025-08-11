import express from 'express';
import { saveAnswer, getProgress, createAudience, getAudienceSessions,sendIncompleteQuizNotifications } from '../controller/quizController.js';

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
 *     tags: [Audience Quiz]
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
 *     summary: Get audience quiz sessions (with optional completion filter)
 *     description: >
 *       Returns quiz sessions for a specific user, excluding the subscriber's own quizzes.  
 *       Optionally filter by completion status (`true` or `false`).  
 *       Results are sorted by completion status (completed first).
 *     tags: [Audience Quiz]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose audience quiz sessions you want to fetch.
 *       - in: query
 *         name: is_completed
 *         required: false
 *         schema:
 *           type: boolean
 *         description: >
 *           Filter sessions by completion status.  
 *           - `true` → only completed quizzes  
 *           - `false` → only incomplete quizzes  
 *           - Omit this parameter to get all quizzes (sorted by completed first)
 *     responses:
 *       200:
 *         description: List of audience quiz sessions with progress and reminders.
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
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64e5d4a2b0a97f4a12345678"
 *                       user_id:
 *                         type: string
 *                         example: "64e5d4a2b0a97f4a12345600"
 *                       quiz_title:
 *                         type: string
 *                         example: "General Knowledge Quiz"
 *                       is_completed:
 *                         type: boolean
 *                         example: false
 *                       questions_completed:
 *                         type: integer
 *                         example: 5
 *                       reminders:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: "64e5d4a2b0a97f4a12345690"
 *                             quizSessionId:
 *                               type: string
 *                               example: "64e5d4a2b0a97f4a12345678"
 *                             sentTo:
 *                               type: string
 *                               example: "user@example.com"
 *                             sentBy:
 *                               type: string
 *                               example: "64e5d4a2b0a97f4a12345600"
 *       400:
 *         description: Missing required parameters.
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
 *                   example: "user_id query parameter is required"
 *       404:
 *         description: No quiz sessions found.
 *       500:
 *         description: Internal server error.
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



/**
 * @swagger
 * /api/quiz/send-incomplete-reminders:
 *   post:
 *     summary: Send reminder emails for incomplete quizzes and save reminders in DB
 *     tags: [Audience Quiz]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - quizId
 *               - audienceEmails
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "64f5a1b9d1d4c9a123456789"
 *               quizId:
 *                 type: string
 *                 example: "64f5a2b1d1d4c9a987654321"
 *               audienceEmails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["test1@example.com", "test2@example.com"]
 *     responses:
 *       200:
 *         description: Emails sent and reminders saved
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Internal server error
 */

router.post('/send-incomplete-reminders', sendIncompleteQuizNotifications);

export default router;
