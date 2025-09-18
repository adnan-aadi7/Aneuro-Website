// funnel model
import mongoose from 'mongoose';

const FunnelTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pages: { type: Number },
  category: { type: String },
  tier: {
    type: [String],
    enum: ["starter", "growth", "enterprise"],
    required: true,
    validate: {
      validator: function (value) {
        return Array.isArray(value) && value.length >= 1 && value.length <= 3;
      },
      message: "Tier must be an array with 1 to 3 values."
    }
  },

  brainType: {
    type: String,
    enum: ['Architect', 'Challenger', 'Synthesizer', 'Reflector', 'Catalyst']
  },
  status: { 
    type: String, 
    enum: ['active', 'scheduled']
  },
  usage: { type: Number, default: 0 },         
  conversions: { type: Number, default: 0 },
  fileUrl: { type: String },
  content: { 
    type: String,
    default: '', 
  },
  userRating: { type: Number, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now },
  releaseDateTime: { type: Date },
});

export default mongoose.models.FunnelTemplate ||
  mongoose.model('FunnelTemplate', FunnelTemplateSchema);
