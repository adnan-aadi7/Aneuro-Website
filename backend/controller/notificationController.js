import Notification from "../model/Notification.js";
import User from "../model/User.js";

// CREATE notification
export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, targetTier } = req.body;

    let notificationData = {
      title,
      message,
      type,
      isPublic: false,
      targetTier: targetTier || "all",
    };

    switch (type) {
      case "newtool":
        notificationData.isPublic = true; // make public
        break;

      case "feedback":
        // Notify all admins
        const admins = await User.find({ userType: "admin" }).select("_id");
        const adminNotifications = admins.map((admin) => ({
          ...notificationData,
          userId: admin._id,
        }));
        await Notification.insertMany(adminNotifications);
        return res.status(201).json({
          success: true,
          message: "Feedback notifications sent to admins",
        });

      case "plan":
      case "reminder":
        if (!userId) {
          return res.status(400).json({
            success: false,
            message: "userId is required for plan or reminder notifications",
          });
        }
        notificationData.userId = userId;
        break;

      default:
        break;
    }

    const notification = new Notification(notificationData);
    const savedNotification = await notification.save();

    console.log("Notification saved to DB:", savedNotification);

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: savedNotification,
    });
  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("subscription.plan notificationPreferences");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userPlan = user.subscription?.plan || "starter"; // fallback to starter

    // Fetch notifications filtered by userId and tier
    let notifications = await Notification.find({
      $and: [
        {
          $or: [
            { isPublic: true },
            { userId: user._id }
          ]
        },
        {
          $or: [
            { targetTier: "all" },
            { targetTier: userPlan }
          ]
        }
      ]
    }).sort({ createdAt: -1 });

    // Apply user preferences
    const prefs = user.notificationPreferences || {};
    notifications = notifications.filter((notif) => {
      if (notif.type === "newtool" && prefs.newtool === false) return false;
      if (notif.type === "quiz" && prefs.quiz === false) return false;
      if (notif.type === "reminder" && prefs.reminder === false) return false;
      if (notif.type === "plan" && prefs.plan === false) return false;
      return true;
    });

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// UPDATE (mark notification as read)
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE notification preferences
export const updateNotificationPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newtool, quiz, reminder, plan } = req.body;

    const updateData = {};
    if (typeof newtool === "boolean") updateData["notificationPreferences.newtool"] = newtool;
    if (typeof quiz === "boolean") updateData["notificationPreferences.quiz"] = quiz;
    if (typeof reminder === "boolean") updateData["notificationPreferences.reminder"] = reminder;
    if (typeof plan === "boolean") updateData["notificationPreferences.plan"] = plan;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("notificationPreferences");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notification preferences updated successfully",
      data: user.notificationPreferences,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getPreferences = async (req, res) => {
  try {
    const { userId } = req.params;

    // find user by _id or userId depending on schema
    const prefs = await User.findOne({ _id: userId }).select("notificationPreferences");

    if (!prefs || !prefs.notificationPreferences) {
      return res.status(404).json({
        success: false,
        message: "Notification preferences not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        newtool: prefs.notificationPreferences.newtool ?? false,
        quiz: prefs.notificationPreferences.quiz ?? false,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
