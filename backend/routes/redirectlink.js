import express from "express";
import jwt from "jsonwebtoken";
import QuizSession from "../model/quiz.js"; 

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

/**
 * @swagger
 * tags:
 *   name: Redirect Link
 *   description: Manage client redirect URLs for audience quizzes (tokens are generated dynamically, not saved in DB)
 */

/**
 * @swagger
 * /api/redirectlink/set:
 *   post:
 *     summary: Save a client redirect link and generate a tokenized URL
 *     tags: [Redirect Link]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - redirectLink
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 650c1f2ab6c0c3f4e81a1234
 *               redirectLink:
 *                 type: string
 *                 example: https://clientsite.com/thank-you
 *     responses:
 *       200:
 *         description: Redirect link saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ✅ Redirect link saved
 *                 redirectLink:
 *                   type: string
 *                   example: https://clientsite.com/thank-you
 *                 redirectToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 tokenizedUrl:
 *                   type: string
 *                   example: http://localhost:5173/Audience-quiz/650c1f2ab6c0c3f4e81a1234/eyJhbGciOiJIUzI1...
 *       400:
 *         description: Missing userId or redirectLink
 *       500:
 *         description: Server error
 */
router.post("/set", async (req, res) => {
  try {
    const { userId, redirectLink } = req.body;

    if (!userId || !redirectLink) {
      return res.status(400).json({ error: "User ID and redirect link are required" });
    }

    // Save only redirect_link
    let session = await QuizSession.findOneAndUpdate(
      { user_id: userId },
      { redirect_link: redirectLink },
      { new: true, upsert: true }
    );

    // Generate token dynamically
    const token = jwt.sign({ redirectLink, userId }, JWT_SECRET, { expiresIn: "30d" });

    res.status(200).json({
      message: "✅ Redirect link saved",
      redirectLink: session.redirect_link,
      redirectToken: token,
      tokenizedUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/Audience-quiz/${userId}/${token}`,
    });
  } catch (err) {
    console.error("Error setting redirect link:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /api/redirectlink/{userId}:
 *   get:
 *     summary: Get the saved redirect link and generate a new tokenized URL
 *     description: The token is generated fresh each time and is not stored in DB.
 *     tags: [Redirect Link]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved redirect link and tokenized URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 redirectLink:
 *                   type: string
 *                   example: https://clientsite.com/thank-you
 *                 redirectToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 tokenizedUrl:
 *                   type: string
 *                   example: http://localhost:5173/Audience-quiz/650c1f2ab6c0c3f4e81a1234/eyJhbGciOiJIUzI1...
 *       404:
 *         description: No redirect link found for this user
 *       500:
 *         description: Server error
 */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const session = await QuizSession.findOne({ user_id: userId });

    if (!session || !session.redirect_link) {
      return res.status(404).json({ error: "No redirect link found for this user" });
    }

    // Generate token dynamically
    const token = jwt.sign({ redirectLink: session.redirect_link, userId }, JWT_SECRET, { expiresIn: "30d" });

    res.status(200).json({
      redirectLink: session.redirect_link,
      redirectToken: token,
      tokenizedUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/Audience-quiz/${userId}/${token}`,
    });
  } catch (err) {
    console.error("Error fetching redirect link:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
