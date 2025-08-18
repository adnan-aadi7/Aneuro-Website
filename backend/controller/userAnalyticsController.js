import User from "../model/User.js";
import QuizSession from "../model/quiz.js";
import Payment from "../model/Payment.js";
import Stripe from 'stripe';
import Ticket from "../model/Ticket.js";

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

// ✅ 5. Total Revenue (Stripe authoritative)
export const getTotalRevenue = async (req, res) => {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    // Fallback to DB if Stripe key is missing
    try {
      const result = await Payment.aggregate([
        { $match: { status: { $in: ["succeeded", "paid"] } } },
        { $group: { _id: null, totalCents: { $sum: "$amount" } } }
      ]);
      const totalCents = result[0]?.totalCents || 0;
      const totalDollars = totalCents / 100;
      return res.json({
        success: true,
        source: 'db',
        message: "Total revenue (DB fallback)",
        totalCents,
        totalDollars,
        formatted: `$${totalDollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  try {
    const stripe = new Stripe(stripeSecret);

    // Optional date range
    const { startDate, endDate } = req.query;
    const created = {};
    if (startDate) created.gte = Math.floor(new Date(startDate).getTime() / 1000);
    if (endDate) created.lte = Math.floor(new Date(endDate).getTime() / 1000);

    let totalCents = 0;
    let hasMore = true;
    let startingAfter = undefined;

    while (hasMore) {
      const params = { limit: 100 };
      if (startingAfter) params.starting_after = startingAfter;
      if (Object.keys(created).length > 0) params.created = created;

      const charges = await stripe.charges.list(params);

      for (const ch of charges.data) {
        // Include partial refunds by subtracting amount_refunded
        if (ch.paid && ch.status === 'succeeded') {
          const netAmount = (ch.amount || 0) - (ch.amount_refunded || 0);
          totalCents += Math.max(netAmount, 0);
        }
      }

      hasMore = charges.has_more;
      startingAfter = charges.data.length ? charges.data[charges.data.length - 1].id : undefined;
    }

    const totalDollars = totalCents / 100;
    res.json({
      success: true,
      source: 'stripe',
      message: "Total revenue (Stripe)",
      totalCents,
      totalDollars,
      formatted: `$${totalDollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    });
  } catch (error) {
    // On Stripe failure, fallback to DB
    try {
      const result = await Payment.aggregate([
        { $match: { status: { $in: ["succeeded", "paid"] } } },
        { $group: { _id: null, totalCents: { $sum: "$amount" } } }
      ]);
      const totalCents = result[0]?.totalCents || 0;
      const totalDollars = totalCents / 100;
      res.json({
        success: true,
        source: 'db',
        message: "Total revenue (DB fallback)",
        totalCents,
        totalDollars,
        formatted: `$${totalDollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      });
    } catch (dbError) {
      res.status(500).json({ success: false, message: error.message || dbError.message });
    }
  }
};

// ✅ 6. Stripe Balance (matches dashboard Available/Pending)
export const getStripeBalance = async (req, res) => {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return res.status(400).json({ success: false, message: 'Missing STRIPE_SECRET_KEY' });
    }
    const stripe = new Stripe(stripeSecret);
    const balance = await stripe.balance.retrieve();

    const availableUSD = (balance.available || []).find(b => b.currency === 'usd');
    const pendingUSD = (balance.pending || []).find(b => b.currency === 'usd');

    const availableCents = availableUSD?.amount || 0;
    const pendingCents = pendingUSD?.amount || 0;

    const availableDollars = availableCents / 100;
    const pendingDollars = pendingCents / 100;

    return res.json({
      success: true,
      message: 'Stripe balance',
      available: {
        cents: availableCents,
        dollars: availableDollars,
        formatted: `$${availableDollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
      pending: {
        cents: pendingCents,
        dollars: pendingDollars,
        formatted: `$${pendingDollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ 7. Inbox - latest tickets/messages for admin dashboard
export const getLatestInboxMessages = async (req, res) => {
  try {
    const limit = 5;
    const tickets = await Ticket.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name email message createdAt');

    const emails = tickets
      .map(t => (t.email || '').toLowerCase())
      .filter(e => e);

    const users = emails.length
      ? await User.find({ email: { $in: emails } }).select('email profileImage')
      : [];

    const emailToUser = new Map(users.map(u => [u.email.toLowerCase(), u]));

    const timeAgo = (date) => {
      const diff = Date.now() - new Date(date).getTime();
      const sec = Math.floor(diff / 1000);
      const min = Math.floor(sec / 60);
      const hr = Math.floor(min / 60);
      const day = Math.floor(hr / 24);
      if (day > 0) return `${day} day${day > 1 ? 's' : ''} ago`;
      if (hr > 0) return `${hr} hour${hr > 1 ? 's' : ''} ago`;
      if (min > 0) return `${min} min ago`;
      return `${sec} sec ago`;
    };

    const messages = tickets.map(t => {
      const user = emailToUser.get((t.email || '').toLowerCase());
      const avatar = (user?.profileImage && user.profileImage.trim() !== '')
        ? user.profileImage
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=0D8ABC&color=fff`;

      return {
        id: t._id,
        name: t.name,
        avatar,
        subject: t.message?.length > 60 ? `${t.message.slice(0, 57)}...` : t.message,
        time: timeAgo(t.createdAt)
      };
    });

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};