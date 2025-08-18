import Notification from "../model/Notification.js";

export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, isPublic } = req.body;

    if (!isPublic && !userId) {
      return res.status(400).json({ success: false, message: "userId required for private notification" });
    }

    const notification = new Notification({
      userId: isPublic ? null : userId,
      title,
      message,
      type,
      isPublic,
    });

    await notification.save();

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 25 } = req.query;

    const notifications = await Notification.find({
      $or: [
        { isPublic: true },   
        { userId }           
      ]
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Notification.countDocuments({
      $or: [{ isPublic: true }, { userId }]
    });

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};