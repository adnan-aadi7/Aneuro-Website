//logs model
import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  user: {
    id: { type: String, required: true },
    email: { type: String, required: true },
    ipAddress: { type: String, required: true }
  },
  action: { type: String, enum: ['CREATE', 'UPLOAD', 'EDIT', 'DELETE'], required: true },
  contentType: { type: String, required: true },
  affectedAsset: { type: String, required: true },
  severity: { type: String, enum: ['info', 'warning', 'error'], default: 'info' },
  description: { type: String }
});

export default mongoose.model('Log', logSchema);
