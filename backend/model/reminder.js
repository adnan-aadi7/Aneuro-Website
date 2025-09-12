// models/reminder.js
import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  quizSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizSession',
    required: true
  },
  sentTo: { type: String, required: true }, // email address
  sentAt: { type: Date, default: Date.now },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Reminder', reminderSchema);
