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
  content: { type: String, default: '' },
  
  // ⭐ Ratings array to track multiple user ratings
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, min: 0, max: 5, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  
  // ⭐ Computed average rating
  averageRating: { type: Number, min: 0, max: 5, default: 0 },

  createdAt: { type: Date, default: Date.now },
  releaseDateTime: { type: Date },
});

// ⭐ Method to add a rating and update averageRating
FunnelTemplateSchema.methods.addRating = function(userId, rating) {
  // Remove previous rating by same user
  this.ratings = this.ratings.filter(r => r.userId.toString() !== userId.toString());

  // Add new rating
  this.ratings.push({ userId, rating });

  // Update average
  const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
  this.averageRating = sum / this.ratings.length;

  return this.save();
};

export default mongoose.models.FunnelTemplate || mongoose.model('FunnelTemplate', FunnelTemplateSchema);
