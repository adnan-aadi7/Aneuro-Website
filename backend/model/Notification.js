import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["reminder", "feedback", "plan", "quiz", "newtool", "general", 'ticket'],
    default: "general",
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
 targetTier: {
  type: [String],
  enum: ["all", "starter", "growth", "enterprise"],
  default: ["all"],   
},
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Notification", notificationSchema);
