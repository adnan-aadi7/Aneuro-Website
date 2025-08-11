import mongoose from 'mongoose';

const FunnelTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pages: { type: Number, required: true },
  category: { type: String, required: true },
  tier: { type: String, enum: ['basic', 'premium', 'enterprise'], required: true },
  status: { type: String, enum: ['active', 'scheduled', 'inactive'], required: true },
  usage: { type: Number, default: 0 },         
  conversions: { type: Number, default: 0 },   
  userRating: { type: Number, min: 0, max: 5 }, 
  createdAt: { type: Date, default: Date.now },
    releaseDateTime: { type: Date, required: true },

});

export default mongoose.models.FunnelTemplate ||
  mongoose.model('FunnelTemplate', FunnelTemplateSchema);
