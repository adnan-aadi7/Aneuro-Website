import mongoose from 'mongoose';

const EmailSequenceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    emailCount: { type: Number, default: 0 },
    emails: { type: Number, default: 0 },
    opens: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },

    tier: {
      type: String,
      enum: ['basic', 'premium', 'enterprise'],
      required: true,
    },

    releaseDateTime: { type: Date },

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

    // Brain type with your given values
    brainType: {
      type: String,
      enum: ['Architect', 'Challenger', 'Synthesizer', 'Reflector', 'Catalyst'],
      required: true,
    },

    fileUrl: { type: String },

     emailTemplate: { type: String, default: '' }

  },
  { timestamps: true }
);

const EmailSequence =
  mongoose.models.EmailSequence ||
  mongoose.model('EmailSequence', EmailSequenceSchema);

export default EmailSequence;
