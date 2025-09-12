import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  content: { type: String },
  type: {
    type: String,
    enum: ['Architect', 'Challenger', 'Synthesizer', 'Reflector', 'Catalyst'],
  },
    totalOpens: { type: Number, default: 0 },
      uniqueClicks: { type: Number, default: 0 }, // new field
  clickedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
});

const EmailSequenceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    tier: {
      type: String,
      enum: ["starter", "growth", "enterprise"],
      required: true,
    },
category: {
    type: String, 
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

    brainType: {
      type: String,
      enum: ['Architect', 'Challenger', 'Synthesizer', 'Reflector', 'Catalyst'],
      required: true,
    },

    fileUrl: { type: String },

    emails: [EmailSchema],

    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.EmailSequence ||
  mongoose.model('EmailSequence', EmailSequenceSchema);
