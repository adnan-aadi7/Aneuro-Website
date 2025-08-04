import mongoose from 'mongoose';

const EmailSequenceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    emailCount: { type: Number, default: 0 },
    emails: { type: Number, default: 0 },

    tier: {
      type: String,
      enum: ['basic', 'premium', 'enterprise'],
      required: true,
    },

    status: {
      type: String,
      enum: ['active', 'scheduled'],
      default: 'scheduled',
    },

    usage: {
      count: { type: Number, default: 0 },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },

    type: {
      type: String,
      enum: ['manual', 'file'],
      required: true,
    },

    fileUrl: { type: String },
    manualContent: { type: String },

    emailTemplate: {
      subject: { type: String, default: '' },
      body: { type: String, default: '' },
      footer: { type: String, default: '' }
    },
  },
  { timestamps: true }
);

const EmailSequence =
  mongoose.models.EmailSequence ||
  mongoose.model('EmailSequence', EmailSequenceSchema);

export default EmailSequence;
