import { 
    createTicket, 
    getTickets, 
    getTicketById, 
    updateTicket, 
    updateTicketStatus, 
    deleteTicket, 
    addReplyToTicket, 
    assignTicket, 
    getFeedbackTickets, 
    getLatestTickets 
} from "../controller/Tickets.js";
import upload from "../middleware/multer.js";
import express from 'express';
import { authUser } from "../middleware/userTracker.js";
const router = express.Router();


/**
 * @swagger
 * /api/ticket/create:
 *   post:
 *     summary: Create a new support ticket
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []   # Require Bearer token
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               mobileNumber:
 *                 type: string
 *                 example: 1234567890
 *               category:
 *                 type: string
 *                 enum: [Sign In Problem, Registration Request, Billing Issue, Login/Logout Issues, Feedback, Other]
 *               message:
 *                 type: string
 *                 example: I can't log into my account.
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/create', authUser, upload.single('file'), createTicket);

/**
 * @swagger
 * /api/ticket:
 *   get:
 *     summary: Get all tickets or filter by status
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []   # Require Bearer token
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, closed]
 *         description: Filter tickets by status
 *     responses:
 *       200:
 *         description: A list of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 tickets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       mobileNumber:
 *                         type: string
 *                       category:
 *                         type: string
 *                       message:
 *                         type: string
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Server error
 */
router.get('/', authUser, getTickets);


/**
 * @swagger
 * /api/ticket/feedback:
 *   get:
 *     summary: Get all tickets with category "feedback"
 *     description: Retrieves all tickets where the category contains "feedback".
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []   # Require Bearer token
 *     responses:
 *       200:
 *         description: List of feedback tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 tickets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/feedback', authUser, getFeedbackTickets);


/**
 * @swagger
 * /api/ticket/latest:
 *   get:
 *     summary: Get the latest 5 tickets
 *     description: Returns the latest 5 tickets with human-readable created time (e.g., "2 hours ago").
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []   # Require Bearer token
 *     responses:
 *       200:
 *         description: A list of latest tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tickets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 66be05a111f0a8a0d1df9823
 *                       name:
 *                         type: string
 *                         example: John Deo
 *                       message:
 *                         type: string
 *                         example: Issue with the latest update
 *                       timeAgo:
 *                         type: string
 *                         example: 2 hours ago
 */
router.get("/latest", authUser, getLatestTickets);


/**
 * @swagger
 * /api/ticket/{id}:
 *   get:
 *     summary: Get a single ticket by its ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []   # Require Bearer token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ticket ID
 *     responses:
 *       200:
 *         description: Ticket found
 *       404:
 *         description: Ticket not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id', authUser, getTicketById);



/**
 * @swagger
 * /api/ticket/{id}:
 *   put:
 *     summary: Update a ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []   # Require Bearer token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *               category:
 *                 type: string
 *               message:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [OPEN, CLOSED]
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       404:
 *         description: Ticket not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/:id', authUser, updateTicket);


/**
 * @swagger
 * /api/ticket/{id}/status:
 *   put:
 *     summary: Update the status of a ticket (OPEN or CLOSED)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [OPEN, CLOSED]
 *     responses:
 *       200:
 *         description: Ticket status updated
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */
router.put('/:id/status', authUser, updateTicketStatus);


/**
 * @swagger
 * /api/ticket/{id}:
 *   delete:
 *     summary: Delete a ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ticket ID
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authUser, deleteTicket);



/**
 * @swagger
 * /api/ticket/{id}/reply:
 *   post:
 *     summary: Add a reply to a ticket (only if status is OPEN)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Ticket ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Reply message
 *                 example: Here is my reply with an optional document
 *               repliedBy:
 *                 type: string
 *                 description: Name of the person replying
 *                 example: admin
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional file to upload (PDF/image)
 *     responses:
 *       200:
 *         description: Reply added successfully
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
 *                   example: Reply added successfully
 *                 ticket:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Bad request (e.g., missing message or ticket is closed)
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.post('/:id/reply', authUser, upload.single('file'), addReplyToTicket);



/**
 * @swagger
 * /api/ticket/{id}/assign:
 *   put:
 *     summary: Assign a ticket to another user
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignedTo:
 *                 type: string
 *                 example: support-agent@example.com
 *     responses:
 *       200:
 *         description: Ticket assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ticket:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Missing assignedTo in body
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */
router.put('/:id/assign', authUser, assignTicket);



export default router;

