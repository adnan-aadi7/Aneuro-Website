// routes/authRoutes.js
import express from "express";
import { Signup, Login, getAllUsers, getUserById, deleteUser, updateUser, changePassword  } from "../controller/authController.js";

const router = express.Router();

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               userType:
 *                 type: string
 *                 default: user
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 * 
 */
router.post("/signup", async (req, res) => {
  try {
    const result = await Signup(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", async (req, res) => {
  try {
    const result = await Login(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users with pagination and optional accountStatus filter
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 10
 *       - in: query
 *         name: accountStatus
 *         schema:
 *           type: string
 *           enum: [active, suspended]
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Internal server error
 */
router.get("/users", async (req, res) => {
  try {
    const { page, limit, accountStatus } = req.query;
    const result = await getAllUsers({ page, limit, accountStatus });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user by ID with optional accountStatus filter
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: accountStatus
 *         schema:
 *           type: string
 *           enum: [active, suspended]
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { accountStatus } = req.query;
    const user = await getUserById({ id, accountStatus });
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


/**
 * @swagger
 * /api/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:id", async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message === "User not found" ? 404 : 500;
    res.status(statusCode).json({ error: error.message });
  }
});
export default router;

/**
 * @swagger
 * /api/update/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
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
 *               password:
 *                 type: string
 *               accountStatus:
 *                 type: string
 *                 enum: [active, suspended]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/update/:id", async (req, res) => {
  try {
    const result = await updateUser(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message === "User not found" ? 404 : 500;
    res.status(statusCode).json({ error: error.message });
  }
});



/**
 * @swagger
 * /api/change-password:
 *   put:
 *     summary: Change user password
 *     description: User can change their password by providing current and new password.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               userId:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Current password is incorrect
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/change-password", changePassword);
