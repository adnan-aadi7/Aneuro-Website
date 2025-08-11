import QuizSession from '../model/quiz.js';
import nodemailer from 'nodemailer';
import { incompleteQuizTemplate } from '../config/emailTemplates.js';
import Reminder from '../model/reminder.js';

const TOTAL_QUESTIONS = 10;
// Confirming from your doc — you mentioned 1, 5, 8 in “Optional Weighting”
const ANCHOR_QUESTIONS = [1, 5, 8];

// Brain Type Answer Key
const optionToBrainType = {
  A: "Architect",   // Logical, structured, detail-oriented
  B: "Reflector",   // Emotional, intuitive, connection-based
  C: "Catalyst",    // Fast-paced, instinct-driven
  D: "Synthesizer"  // Depth-seeking, data-driven
};

/**
 * Save a user's answer to a quiz question
 */
export const saveAnswer = async (req, res) => {
  try {
    const { user_id, question_number, selected_option } = req.body;

    if (!user_id || !question_number || !selected_option) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Map the selected option to a brain type
    const mapped_brain_type = optionToBrainType[selected_option];
    if (!mapped_brain_type) {
      return res.status(400).json({ success: false, message: "Invalid selected_option" });
    }

    // Find or create quiz session
    let session = await QuizSession.findOne({ user_id });
    if (!session) {
      session = new QuizSession({ 
        user_id, 
        answers: [], 
        is_completed: false, 
        is_subscriber_quiz: true // Mark this as subscriber quiz
      });
    } else {
      // If session exists, ensure this flag is set for subscriber quiz
      session.is_subscriber_quiz = true;
    }

    // Replace or add the answer
    const existingIndex = session.answers.findIndex(a => a.question_number === question_number);
    if (existingIndex >= 0) {
      session.answers[existingIndex] = { question_number, selected_option, mapped_brain_type };
    } else {
      session.answers.push({ question_number, selected_option, mapped_brain_type });
    }

    // If quiz is completed, calculate the final result
    if (session.answers.length === TOTAL_QUESTIONS) {
      const result = QuizSession.calculateResult(session.answers);
      session.is_completed = true;
      session.brain_type = result.brainType;
      session.score_breakdown = result.scores;
      session.challenger_detected = result.challenger;

      // Push brain type to dashboard analytics (no display to user)
      pushToAnalytics({
        user_id,
        timestamp: new Date(),
        brain_type: result.brainType,
        score_breakdown: result.scores
      });
    }

    await session.save();
    return res.status(200).json({ success: true, data: session });

  } catch (error) {
    console.error("Error saving answer:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


/**
 * Calculate the quiz result
 */
function calculateResult(answers) {
  const scores = { Architect: 0, Reflector: 0, Catalyst: 0, Synthesizer: 0 };

  // Score each answer, with double points for anchor questions
  answers.forEach(ans => {
    let points = ANCHOR_QUESTIONS.includes(ans.question_number) ? 2 : 1;
    scores[ans.mapped_brain_type] += points;
  });

  const maxScore = Math.max(...Object.values(scores));
  let topTypes = Object.entries(scores)
    .filter(([_, score]) => score === maxScore)
    .map(([type]) => type);

  let brainType = topTypes.length === 1
    ? topTypes[0]
    : breakTie(topTypes, answers);

  // Challenger detection:
  // - Broad distribution of answers OR
  // - All brain types have at least 2 points (conflicting traits)
  const scoreValues = Object.values(scores);
  const evenlyDistributed = new Set(scoreValues).size === scoreValues.length;
  const allAboveThreshold = scoreValues.every(s => s >= 2);
  const challenger = evenlyDistributed || allAboveThreshold;

  // If challenger detected, override brain type
  if (challenger) {
    brainType = "Challenger";
  }

  return { brainType, scores, challenger };
}

/**
 * Tie-breaking logic: Use anchor questions
 */
function breakTie(tiedTypes, answers) {
  for (let q of ANCHOR_QUESTIONS) {
    const ans = answers.find(a => a.question_number === q);
    if (ans && tiedTypes.includes(ans.mapped_brain_type)) {
      return ans.mapped_brain_type;
    }
  }
  return tiedTypes[0]; // fallback
}

/**
 * Push analytics data
 */
function pushToAnalytics(data) {
  // Stub: Replace with real analytics integration
  console.log("Analytics Event →", data);
}

/**
 * Get quiz progress for a user
 */
export const getProgress = async (req, res) => {
  try {
    const { user_id } = req.params;

    const session = await QuizSession.findOne({ user_id, is_completed: false });

    if (!session) {
      return res.status(404).json({ error: 'No active quiz session found' });
    }

    const answeredCount = session.answers.length;
    const percentCompleted = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

    return res.status(200).json({
      progress: `${percentCompleted}% completed`,
      answeredCount,
      totalQuestions: TOTAL_QUESTIONS
    });
  } catch (error) {
    console.error('Error fetching quiz progress:', error);
    return res.status(500).json({ error: error.message });
  }
};


export const createAudience = async (req, res) => {
  try {
    const { user_id, name, email, question_number, selected_option } = req.body;

    if (!user_id || !name || !email || !question_number || !selected_option) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (typeof question_number !== 'number' || question_number < 1 || question_number > TOTAL_QUESTIONS) {
      return res.status(400).json({ success: false, message: 'Invalid question number' });
    }

    const mapped_brain_type = optionToBrainType[selected_option];
    if (!mapped_brain_type) {
      return res.status(400).json({ success: false, message: "Invalid selected_option" });
    }

    // Find existing session by user_id AND email (tie audience to subscriber)
    let session = await QuizSession.findOne({ user_id, email });

    if (!session) {
      session = new QuizSession({
        user_id,
        name,
        email,
        answers: [],
        is_completed: false,
      });
    } else {
      if (name) session.name = name;
    }

    session.answers = session.answers || [];

    const existingIndex = session.answers.findIndex(a => a.question_number === question_number);
    const answerObj = { question_number, selected_option, mapped_brain_type, answeredAt: new Date() };

    if (existingIndex >= 0) {
      session.answers[existingIndex] = answerObj;
    } else {
      session.answers.push(answerObj);
    }

    if (session.answers.length === TOTAL_QUESTIONS) {
      const result = calculateResult(session.answers);
      session.is_completed = true;
      session.brain_type = result.brainType;
      session.score_breakdown = result.scores;
      session.challenger_detected = result.challenger;

      pushToAnalytics({
        user_id,
        audience_email: email,
        timestamp: new Date(),
        brain_type: result.brainType,
        score_breakdown: result.scores,
      });
    }

    await session.save();

    // Add questions_completed count to the response
    const responseData = {
      ...session.toObject(),
      questions_completed: session.answers.length
    };

    return res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error saving answer:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAudienceSessions = async (req, res) => {
  try {
    const { user_id, is_completed } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, message: "user_id query parameter is required" });
    }

    // Build base query
    const query = {
      user_id,
      is_subscriber_quiz: { $ne: true }
    };

    // Apply completion filter if provided
    if (is_completed !== undefined) {
      // Convert string to boolean
      const completedBool = is_completed === "true";
      query.is_completed = completedBool;
    }

    let sessions = await QuizSession.find(query);

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ success: false, message: "No audience quiz sessions found for this user_id" });
    }

    // Fetch reminders for these sessions
    const sessionIds = sessions.map(s => s._id);
    const reminders = await Reminder.find({ quizSessionId: { $in: sessionIds } });

    // Attach progress & reminders to each session
    let sessionsWithData = sessions.map(session => {
      const sessionObj = session.toObject();
      sessionObj.questions_completed = session.answers ? session.answers.length : 0;
      sessionObj.reminders = reminders.filter(r => r.quizSessionId.toString() === session._id.toString());
      return sessionObj;
    });

    // Sort by is_completed (completed first)
    sessionsWithData.sort((a, b) => {
      return (b.is_completed === true) - (a.is_completed === true);
    });

    return res.status(200).json({ success: true, data: sessionsWithData });
  } catch (error) {
    console.error("Error fetching quiz sessions:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const sendIncompleteQuizNotifications = async (req, res) => {
  try {
    const { user_id, audienceEmails, quizId } = req.body;

    if (!user_id || !audienceEmails || !Array.isArray(audienceEmails) || audienceEmails.length === 0 || !quizId) {
      return res.status(400).json({ success: false, message: "user_id, quizId, and audienceEmails array are required" });
    }

    const quizSession = await QuizSession.findOne({ _id: quizId, user_id });
    if (!quizSession) {
      return res.status(404).json({ success: false, message: "Quiz not found for this user" });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const sendPromises = audienceEmails.map(async (email) => {
      const htmlContent = incompleteQuizTemplate(
        '', 
        quizSession.quiz_title || 'Your Quiz',
        `${process.env.FRONTEND_URL}/quiz/${quizId}`
      );

      await transporter.sendMail({
        from: `"Quiz Notifications" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Reminder: Complete the quiz "${quizSession.quiz_title}"`,
        html: htmlContent,
      });

      // Save reminder in DB
      await Reminder.create({
        quizSessionId: quizId,
        sentTo: email,
        sentBy: user_id
      });
    });

    await Promise.all(sendPromises);

    return res.status(200).json({ success: true, message: "Emails sent & reminders saved successfully" });
  } catch (error) {
    console.error("Error sending emails:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};