import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'Sign In Problem',
      'Registration Request',
      'Billing Issue',
      'Login/Logout Issues',
      'Feedback',
      'Other'
    ],
    required: true
  },
  message: { type: String, required: true },
  fileUrl: { type: String },
  filePublicId: { type: String },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED'],
    default: 'OPEN'
  },
  assignedTo: {
    type: String,
    default: 'admin'  // 👈 Set default value here
  },
  replies: [
    {
      message: String,
      repliedAt: { type: Date, default: Date.now },
      repliedBy: String,
      fileUrl: String,
      filePublicId: String,
    },
  ],
}, { timestamps: true });

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
