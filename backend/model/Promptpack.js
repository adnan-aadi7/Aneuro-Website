//prompt model
import mongoose from 'mongoose';

const PromptSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  type: {
    type: String,
    enum: ['Architect', 'Challenger', 'Synthesizer', 'Reflector', 'Catalyst'],
    required: true,
  },
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
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    required: true,
  },
    releaseDateTime: { type: Date, required: true },

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
