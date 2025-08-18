import User from "../model/User.js";
import QuizSession from "../model/quiz.js";

// ✅ 1. New Subscribers Per Week
export const getNewSubscribersPerWeek = async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            week: { $isoWeek: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.week": -1 } }
    ]);

    res.json({
      success: true,
      message: "New subscribers per week",
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getDelinquentSubscribers = async (req, res) => {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const delinquent = await User.find({
      $or: [
        { "subscription.status": { $in: ["inactive", "canceled"] } },
        { lastLogin: { $exists: true, $lt: ninetyDaysAgo } }
      ]
    }).select("name email subscription lastLogin createdAt");

    res.json({
      success: true,
      message: "Delinquent subscribers",
      count: delinquent.length,
      data: delinquent
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAvgQuizCompletionTime = async (req, res) => {
  try {
    const result = await QuizSession.aggregate([
      {
        $match: { is_completed: true } 
      },
      {
        $project: {
          duration: {
            $divide: [
              { $subtract: ["$updatedAt", "$createdAt"] }, // ms
              1000 // convert to seconds first
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgCompletionTimeSec: { $avg: "$duration" } // avg in seconds
        }
      }
    ]);

    const avgSeconds = result[0]?.avgCompletionTimeSec || 0;

    // Convert to minutes + seconds
    const minutes = Math.floor(avgSeconds / 60);
    const seconds = Math.round(avgSeconds % 60);

    res.json({
      success: true,
      message: "Average quiz completion time",
      avgTime: `${minutes} min ${seconds} sec`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getUserAudienceStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all quizzes for this user
    const allQuizzes = await QuizSession.find({ user_id: userId });
    const totalQuizzes = allQuizzes.length;

    if (totalQuizzes === 0) {
      return res.json({
        success: true,
        message: "No quizzes found for this user",
        stats: {
          totalQuizzes: 0,
          completedQuizzes: 0,
          completionRate: "0%",
          brainTypeDistribution: {}
        }
      });
    }

    // Completed quizzes
    const completedQuizzes = allQuizzes.filter(q => q.is_completed).length;
    const completionRate = ((completedQuizzes / totalQuizzes) * 100).toFixed(2) + "%";

    // Brain type distribution (only from completed ones with brain_type set)
    const brainCounts = {};
    allQuizzes.forEach(q => {
      if (q.is_completed && q.brain_type) {
        brainCounts[q.brain_type] = (brainCounts[q.brain_type] || 0) + 1;
      }
    });

    // Convert to percentage
    const brainTypeDistribution = {};
    Object.keys(brainCounts).forEach(type => {
      brainTypeDistribution[type] = ((brainCounts[type] / completedQuizzes) * 100).toFixed(2) + "%";
    });

    res.json({
      success: true,
      message: "User audience quiz stats",
      stats: {
        totalQuizzes,
        completedQuizzes,
        completionRate,
        brainTypeDistribution
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};