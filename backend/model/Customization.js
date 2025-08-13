import mongoose from 'mongoose';

const LogoVariantSchema = new mongoose.Schema({
  url: { type: String, required: true },
});

const CustomizationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  logoVariants: { type: [LogoVariantSchema], default: [] },
  primaryColor: { type: String, default: '#00AEEF' },
  secondaryColor: { type: String, default: '#211D1D' },
  textColor: { type: String, default: '#FFFFFF' },
  borderColor: { type: String, default: '#CCCCCC' },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Customization', CustomizationSchema);
