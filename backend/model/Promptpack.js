import mongoose from 'mongoose';

const PromptRatingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  value: { type: Number, min: 1, max: 5, required: true },
});

const PromptSchema = new mongoose.Schema({
  content: { type: String },
  type: {
    type: String,
    enum: ["Architect", "Challenger", "Synthesizer", "Reflector", "Catalyst"],
  },

  // ⭐ Individual ratings for each prompt
  ratings: [PromptRatingSchema],
  averageRating: { type: Number, default: 0 },
});

const PromptPackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String, 
    required: true,
  },
    tier: {
    type: [String], 
    enum: ["starter", "growth", "enterprise"],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length >= 1 && arr.length <= 3; // allow 1–3 tiers
      },
      message: "Tier must contain between 1 and 3 values."
    }
  },
    releaseDateTime: { type: Date },

  status: {
    type: String,
    enum: ['active', 'scheduled'],
    default: 'scheduled', 
    required: true,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  fileUrl: {
  type: String,
},

  createdDate: {
    type: Date,
    default: Date.now,
  },
  prompts: [PromptSchema], // Embedded documents
});

export default mongoose.models.PromptPack || mongoose.model('PromptPack', PromptPackSchema);
