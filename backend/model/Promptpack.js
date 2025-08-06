// models/PromptPack.js
import mongoose from 'mongoose';

const PromptSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['analytical', 'creative', 'empathic', 'strategic', 'practical'],
    required: true,
  },
});

const PromptPackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String, // e.g., 'Content', 'Sales', 'Business'
    required: true,
  },
  tier: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'scheduled'],
    default: 'scheduled', // 👈 default value set here
    required: true,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  prompts: [PromptSchema], // Embedded documents
});

export default mongoose.models.PromptPack || mongoose.model('PromptPack', PromptPackSchema);
