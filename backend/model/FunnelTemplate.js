// funnel model
import mongoose from 'mongoose';

const FunnelTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pages: { type: Number },
  category: { type: String },
  tier: { 
    type: String, 
    enum: ['basic', 'premium', 'enterprise'], 
    required: true 
  },
  brainType: {
    type: String,
    enum: ['Architect', 'Challenger', 'Synthesizer', 'Reflector', 'Catalyst']
  },
  status: { 
    type: String, 
    enum: ['active', 'scheduled', 'inactive']
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
