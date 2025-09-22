import Review from "../model/review.js";
import { logAction } from "../config/logAction.js";
import User from "../model/User.js";
/**
 * @desc Create a new review
 * @route POST /api/reviews
 * @access Private
 */
export const createReview = async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating (1-5) is required" });
    }

    const { id, name, email } = req.user;

    const newReview = new Review({
      userId: id,
      name,
      email,
      rating,
      review,
    });

    await newReview.save();

    // ✅ Log the action
    await logAction({
      userId: id,
      action: "CREATE_REVIEW",
      description: `User ${name} (${email}) submitted a review with ${rating} stars.`,
    });

    res.json({
      success: true,
      message: "Review submitted successfully",
      data: newReview,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};


function formatMemberSince(date) {
  const now = Date.now();
  const diffMs = now - new Date(date).getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `Member since ${years} years ago`;
  if (months > 0) return `Member since ${months} months ago`;
  if (days > 0) return `Member since ${days} days ago`;
  if (hours > 0) return `Member since ${hours} hours ago`;
  if (minutes > 0) return `Member since ${minutes} minutes ago`;
  return "Member just now";
}
/**
 * @desc Get all reviews with membership year + profile image
 * @route GET /api/reviews
 * @access Public
 */
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    const enrichedReviews = await Promise.all(
      reviews.map(async (rev) => {
        const user = await User.findById(rev.userId).select("createdAt name profileImage");
        let memberSince = "Unknown";

        if (user?.createdAt) {
          // ✅ show year only instead of months/days
          memberSince = `User since ${new Date(user.createdAt).getFullYear()}`;
        }

        return {
          ...rev.toObject(),
          memberSince,
          profileImage: user?.profileImage || null,
          userName: user?.name || "Anonymous",
        };
      })
    );

    res.json({
      success: true,
      count: enrichedReviews.length,
      data: enrichedReviews,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
