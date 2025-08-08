import mongoose from 'mongoose';

const FunnelTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pages: { type: Number, required: true },
  category: { type: String, required: true },
  tier: { type: String, enum: ['basic', 'premium', 'enterprise'], required: true },
  status: { type: String, enum: ['active', 'scheduled', 'inactive'], required: true },
  usage: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.FunnelTemplate || mongoose.model('FunnelTemplate', FunnelTemplateSchema);
