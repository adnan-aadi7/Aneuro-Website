import express from 'express';
import {
     saveAnswer, 
    getProgress, 
    createAudience, 
    getAudienceSessions,
    sendIncompleteQuizNotifications, 
    getQuizAnalytics, 
    getAudienceBrainTypeAnalyticsByUser, 
    getUserWeeklyBrainTypeStats, 
    getAudienceQuizReport 
} from '../controller/quizController.js';
import { authUser } from "../middleware/userTracker.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quiz
 *   description: Quiz answer saving and progress tracking
 */

/**
 * @swagger
 * tags:
 *   name: Audience Quiz
 *   description: APIs for managing audience quiz sessions
 *
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
 *     security:
 *       - bearerAuth: []   # Require Bearer token security
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

router.get('/sessions', authUser, getAudienceSessions);


/**
 * @swagger
 * /api/quiz/quiz-report:
 *   get:
 *     summary: Get a specific audience's quiz report with brain type percentages and reminders
 *     tags: [Audience Quiz]
 *     security:
 *       - bearerAuth: []   # Require Bearer token security
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *       - in: query
 *         name: audience_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the audience
 *     responses:
 *       200:
 *         description: Successfully retrieved audience quiz report
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               user_id: "123"
 *               audience_id: "456"
 *               report:
 *                 total_answers: 40
 *                 brain_types:
 *                   Architect: "35.00"
 *                   Challenger: "25.00"
 *                   Synthesizer: "20.00"
 *                   Reflector: "10.00"
 *                   Catalyst: "10.00"
 *               sessions:
 *                 - _id: "64f8a1c2e21..."
 *                   user_id: "123"
 *                   audience_id: "456"
 *                   is_completed: true
 *                   answers: [...]
 *                   questions_completed: 10
 *                   reminders:
 *                     - _id: "6501b2f3f9..."
 *                       quizSessionId: "64f8a1c2e21..."
 *                       message: "Don’t forget to review your results"
 *                       date: "2023-09-25T12:00:00Z"
 *       400:
 *         description: Missing required parameters
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "user_id and audience_id query parameters are required"
 *       404:
 *         description: No quiz sessions found for the given user and audience
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No completed quiz sessions found for this audience/user"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal server error"
 */

router.get("/quiz-report", authUser, getAudienceQuizReport);


/**
 * @swagger
 * /api/quiz/save:
 *   post:
 *     summary: Save or update a quiz answer
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []   # Require Bearer token security
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

router.post('/save', authUser, saveAnswer);


/**
 * @swagger
 * /api/quiz/progress/{user_id}:
 *   get:
 *     summary: Get quiz completion progress for a user
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []   # Require Bearer token security
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

router.get('/progress/:user_id', authUser, getProgress);



/**
 * @swagger
 * /api/quiz/send-incomplete-reminders:
 *   post:
 *     summary: Send reminder emails for incomplete quizzes and save reminders in DB
 *     tags: [Audience Quiz]
 *     security:
 *       - bearerAuth: []   # Require Bearer token security
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
 *                 example: ["test1@example.com"]
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

router.post('/send-incomplete-reminders', authUser, sendIncompleteQuizNotifications);


/**
 * @swagger
 * /api/quiz/analytics/{userId}:
 *   get:
 *     summary: Get quiz completion stats and audience breakdown by brain type for a specific user
 *     tags:
 *       - Quiz Analytics
 *     security:
 *       - bearerAuth: []   # Require Bearer token security
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to filter the quiz analytics
 *     responses:
 *       200:
 *         description: Successfully retrieved quiz analytics for the user
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
 *                   properties:
 *                     quizCompletion:
 *                       type: object
 *                       properties:
 *                         lastWeek:
 *                           type: integer
 *                           description: Number of quizzes completed last week
 *                           example: 15
 *                         thisWeek:
 *                           type: integer
 *                           description: Number of quizzes completed this week
 *                           example: 20
 *                     audienceBreakdown:
 *                       type: object
 *                       description: Breakdown of audiences by brain type
 *                       properties:
 *                         Architect:
 *                           type: integer
 *                           example: 10
 *                         Reflector:
 *                           type: integer
 *                           example: 5
 *                         Catalyst:
 *                           type: integer
 *                           example: 3
 *                         Synthesizer:
 *                           type: integer
 *                           example: 2
 *                         Challenger:
 *                           type: integer
 *                           example: 1
 *       500:
 *         description: Internal server error
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
 *                   example: "Internal server error"
 */

router.get('/analytics/:userId', authUser, getQuizAnalytics);



/**
 * @swagger
 * /api/quiz/analytics/brain-types/{userId}:
 *   get:
 *     summary: Get audience brain type analytics (counts and percentages)
 *     tags:
 *       - Quiz Analytics
 *     security:
 *       - bearerAuth: []   # Require Bearer token security
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional user ID to filter analytics for a specific user
 *     responses:
 *       200:
 *         description: Successfully retrieved brain type analytics
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
 *                   properties:
 *                     Architect:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           example: 10
 *                         percentage:
 *                           type: number
 *                           format: float
 *                           example: 25.0
 *                     Reflector:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           example: 5
 *                         percentage:
 *                           type: number
 *                           format: float
 *                           example: 12.5
 *                     Catalyst:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           example: 8
 *                         percentage:
 *                           type: number
 *                           format: float
 *                           example: 20.0
 *                     Synthesizer:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           example: 12
 *                         percentage:
 *                           type: number
 *                           format: float
 *                           example: 30.0
 *                     Challenger:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           example: 5
 *                         percentage:
 *                           type: number
 *                           format: float
 *                           example: 12.5
 *       500:
 *         description: Internal server error
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
 *                   example: Internal server error
 */

router.get('/analytics/brain-types/:userId', authUser, getAudienceBrainTypeAnalyticsByUser);


/**
 * @swagger
 * /api/quiz/{userId}/weekly-brain-types:
 *   get:
 *     summary: Get weekly brain type stats for a specific user's audience
 *     tags: [Quiz Analytics]
 *     security:
 *       - bearerAuth: []   # Require Bearer token security
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose audience data you want
 *     responses:
 *       200:
 *         description: Weekly brain type stats for the given user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   year:
 *                     type: integer
 *                     example: 2025
 *                   week:
 *                     type: integer
 *                     example: 32
 *                   counts:
 *                     type: object
 *                     properties:
 *                       Architect:
 *                         type: integer
 *                         example: 5
 *                       Reflector:
 *                         type: integer
 *                         example: 3
 *                       Catalyst:
 *                         type: integer
 *                         example: 2
 *                       Synthesizer:
 *                         type: integer
 *                         example: 4
 *                       Challenger:
 *                         type: integer
 *                         example: 1
 *       404:
 *         description: No stats found for the given user
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
 *                   example: "No weekly brain type stats found for this user"
 *       500:
 *         description: Internal server error
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
 *                   example: "Internal server error"
 */

router.get('/:userId/weekly-brain-types', authUser, getUserWeeklyBrainTypeStats);


export default router;
