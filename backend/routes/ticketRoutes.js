import { createTicket, getTickets, getTicketById, updateTicket, updateTicketStatus, deleteTicket, addReplyToTicket, assignTicket } from "../controller/Tickets.js";
import upload from "../middleware/multer.js";
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /api/ticket/create:
 *   post:
 *     summary: Create a new support ticket
 *     tags:
 *       - Tickets
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
 *          description: Bad request
 *       500:
 *         description: Server error
 */

router.post('/create', upload.single('file'), createTicket);

/**
 * @swagger
 * /api/ticket:
 *   get:
 *     summary: Get all tickets or filter by status
 *     tags: [Tickets]
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

router.get('/', getTickets);

/**
 * @swagger
 * /api/ticket/{id}:
 *   get:
 *     summary: Get a single ticket by its ID
 *     tags: [Tickets]
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
 *       500:
 *         description: Server error
 */
router.get('/:id', getTicketById);


/**
 * @swagger
 * /api/ticket/{id}:
 *   put:
 *     summary: Update a ticket by ID
 *     tags: [Tickets]
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
 *       500:
 *         description: Server error
 */

router.put('/:id', updateTicket);

/**
 * @swagger
 * /api/ticket/{id}/status:
 *   put:
 *     summary: Update the status of a ticket (OPEN or CLOSED)
 *     tags: [Tickets]
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
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */

router.put('/:id/status', updateTicketStatus);

/**
 * @swagger
 * /api/ticket/{id}:
 *   delete:
 *     summary: Delete a ticket by ID
 *     tags: [Tickets]
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
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */

router.delete('/:id', deleteTicket);


/**
 * @swagger
 * /api/ticket/{id}/reply:
 *   post:
 *     summary: Add a reply to a ticket (only if status is OPEN)
 *     tags: [Tickets]
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
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */

router.post('/:id/reply', upload.single('file'), addReplyToTicket);


/**
 * @swagger
 * /api/ticket/{id}/assign:
 *   put:
 *     summary: Assign a ticket to another user
 *     tags: [Tickets]
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
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */

router.put('/:id/assign', assignTicket);


export default router;

