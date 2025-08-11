// authRoutes.js
import express from "express";
import { 
  Signup,
  Login, 
  getAllUsers,
  getUserById, 
  deleteUser, 
  updateUser, 
  changePassword,
  sendOtp, 
  verifyOtp, 
  resetPassword,
  handleGoogleCallback,
  getGoogleAuthUrl,
  googleAuthWithCode,
  handleFacebookCallback,
  getFacebookAuthUrl,
  facebookAuthWithCode,
  suspendUser,
  reactivateUser
} from "../controller/authController.js";
import upload from "../middleware/multer.js";
import { authenticateGoogle, authenticateGoogleCallback } from "../services/googlePassport.js";
import { authenticateFacebook, authenticateFacebookCallback } from "../services/facebookPassport.js";
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
 * /api/users:
 *   get:
 *     summary: Get all users with pagination and optional filters
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: accountStatus
 *         schema:
 *           type: string
 *           enum: [active, suspended]
 *         description: Filter users by account status
 *       - in: query
 *         name: userType
 *         schema:
 *           type: string
 *           enum: [admin, user]
 *         description: Filter users by user type
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Internal server error
 */

router.get("/users", async (req, res) => {
  try {
const { page, limit, accountStatus, userType } = req.query;
const result = await getAllUsers({ page, limit, accountStatus, userType });
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

/**
 * @swagger
 * /api/suspend/{id}:
 *   put:
 *     summary: Suspend a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to suspend
 *     responses:
 *       200:
 *         description: User suspended successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/suspend/:id", async (req, res) => {
  try {
    const result = await suspendUser(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message === "User not found" ? 404 : 500;
    res.status(statusCode).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/reactivate/{id}:
 *   put:
 *     summary: Reactivate a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to reactivate
 *     responses:
 *       200:
 *         description: User reactivated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/reactivate/:id", async (req, res) => {
  try {
    const result = await reactivateUser(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message === "User not found" ? 404 : 500;
    res.status(statusCode).json({ error: error.message });
  }
});


/**
 * @swagger
 * /api/update/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               accountStatus:
 *                 type: string
 *                 enum: [active, suspended]
 *               profileImage:
 *                 type: string
 *                 format: binary
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
router.put("/update/:id", upload.single("profileImage"), async (req, res) => {
  try {
    const result = await updateUser(req.params.id, req.body, req.file);
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


/**
 * @swagger
 * /api/forgot-password:
 *   post:
 *     summary: Send OTP to user's email for password reset
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       404:
 *         description: User not found
 */
router.post("/forgot-password", sendOtp);

/**
 * @swagger
 * /api/verify-otp:
 *   post:
 *     summary: Verify OTP sent to user's email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *             example:
 *               email: user@example.com
 *               otp: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/verify-otp", verifyOtp);
/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Reset user password after OTP verification
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *               newPassword:
 *                 type: string
 *                 example: NewPass@123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Server error
 */

router.post("/reset-password", resetPassword);

// Google OAuth2 Routes

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth2 authentication
 *     tags: [Google Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth2
 *       500:
 *         description: Authentication failed
 */
router.get("/auth/google", (req, res, next) => {
  console.log('🔍 DEBUG: /auth/google route hit');
  console.log('Environment variables:');
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING');
  console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
  console.log('Full callback URL:', process.env.GOOGLE_CALLBACK_URL);
  console.log('URL length:', process.env.GOOGLE_CALLBACK_URL?.length);
  
  // Log the strategy configuration
  const strategy = passport._strategies.google;
  console.log('Strategy callback URL:', strategy._callbackURL);
  console.log('Strategy client ID:', strategy._clientID);
  
  next();
}, authenticateGoogle);

/**
 * @swagger
 * /api/auth/google/url:
 *   get:
 *     summary: Get Google OAuth2 authorization URL
 *     tags: [Google Auth]
 *     responses:
 *       200:
 *         description: Google auth URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authUrl:
 *                   type: string
 *                   description: Google OAuth2 authorization URL
 *       500:
 *         description: Failed to generate auth URL
 */
router.get("/auth/google/url", getGoogleAuthUrl);

// Debug route to see what URL Passport generates
router.get("/auth/google/debug", (req, res) => {
  try {
    const strategy = passport._strategies.google;
    
   
    
    res.json({
      clientID: strategy._clientID,
      callbackURL: strategy._callbackURL,
      envCallbackURL: process.env.GOOGLE_CALLBACK_URL,
      envCallbackURLLength: process.env.GOOGLE_CALLBACK_URL?.length,
      envCallbackURLTrimmed: process.env.GOOGLE_CALLBACK_URL?.trim()
    });
  } catch (error) {
    console.error('Debug route error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback endpoint
 *     tags: [Google Auth]
 *     responses:
 *       200:
 *         description: Google authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Google authentication failed
 *       500:
 *         description: Internal server error
 */
router.get("/auth/google/callback", authenticateGoogleCallback, handleGoogleCallback);

/**
 * @swagger
 * /api/auth/google/code:
 *   post:
 *     summary: Authenticate with Google using authorization code
 *     description: For mobile apps or custom OAuth flows
 *     tags: [Google Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Authorization code from Google OAuth2
 *     responses:
 *       200:
 *         description: Google authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid authorization code
 *       500:
 *         description: Google authentication failed
 */
router.post("/auth/google/code", googleAuthWithCode);

// Facebook OAuth2 Routes

/**
 * @swagger
 * /api/auth/facebook:
 *   get:
 *     summary: Initiate Facebook OAuth2 authentication
 *     tags: [Facebook Auth]
 *     responses:
 *       302:
 *         description: Redirects to Facebook OAuth2
 *       500:
 *         description: Authentication failed
 */
router.get("/auth/facebook", authenticateFacebook);

/**
 * @swagger
 * /api/auth/facebook/url:
 *   get:
 *     summary: Get Facebook OAuth2 authorization URL
 *     tags: [Facebook Auth]
 *     responses:
 *       200:
 *         description: Facebook auth URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authUrl:
 *                   type: string
 *                   description: Facebook OAuth2 authorization URL
 *       500:
 *         description: Failed to generate auth URL
 */
router.get("/auth/facebook/url", getFacebookAuthUrl);

/**
 * @swagger
 * /api/auth/facebook/callback:
 *   get:
 *     summary: Facebook OAuth2 callback endpoint
 *     tags: [Facebook Auth]
 *     responses:
 *       200:
 *         description: Facebook authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Facebook authentication failed
 *       500:
 *         description: Internal server error
 */
router.get("/auth/facebook/callback", authenticateFacebookCallback, handleFacebookCallback);

/**
 * @swagger
 * /api/auth/facebook/code:
 *   post:
 *     summary: Authenticate with Facebook using authorization code
 *     description: For mobile apps or custom OAuth flows
 *     tags: [Facebook Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Authorization code from Facebook OAuth2
 *     responses:
 *       200:
 *         description: Facebook authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid authorization code
 *       500:
 *         description: Facebook authentication failed
 */
router.post("/auth/facebook/code", facebookAuthWithCode);

export default router;
