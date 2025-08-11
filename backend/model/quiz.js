import mongoose from 'mongoose';

const quizSessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [
    {
      question_number: { type: Number, required: true },
      selected_option: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
      mapped_brain_type: { type: String, enum: ['Architect', 'Reflector', 'Catalyst', 'Synthesizer'], required: true }
    }
  ],
  is_completed: { type: Boolean, default: false },
  brain_type: {
    type: String,
    enum: ['Architect', 'Reflector', 'Catalyst', 'Synthesizer', 'Challenger']
  },
  score_breakdown: {
    Architect: { type: Number, default: 0 },
    Reflector: { type: Number, default: 0 },
    Catalyst: { type: Number, default: 0 },
    Synthesizer: { type: Number, default: 0 }
  },
  challenger_detected: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('QuizSession', quizSessionSchema);
