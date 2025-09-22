// models/quizSession.js
import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  question_number: { type: Number, required: true },
  selected_option: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  mapped_brain_type: { 
    type: String, 
    enum: ['Architect', 'Reflector', 'Catalyst', 'Synthesizer'], 
    required: true 
  }
}, { timestamps: true }); 


const quizSessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: { type: String }, 
  email: { type: String }, 
  answers: [answerSchema],
  is_completed: { type: Boolean, default: false },
  is_subscriber_quiz: { type: Boolean, default: false },

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

  redirect_link: { type: String, default: null },
  //redirect_token: { type: String, default: null, unique: false, sparse: true },

  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

quizSessionSchema.statics.calculateResult = function(answers) {
  const scores = { Architect: 0, Reflector: 0, Catalyst: 0, Synthesizer: 0 };
  const anchorQuestions = [1, 5, 9];

  answers.forEach(({ question_number, mapped_brain_type }) => {
    const weight = anchorQuestions.includes(question_number) ? 2 : 1;
    scores[mapped_brain_type] += weight;
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  let brainType = sorted[0][0];

  const topScore = sorted[0][1];
  const ties = Object.entries(scores).filter(([_, score]) => score === topScore);
  if (ties.length > 1) {
    for (let q of anchorQuestions) {
      const ans = answers.find(a => a.question_number === q);
      if (ans && ties.some(t => t[0] === ans.mapped_brain_type)) {
        brainType = ans.mapped_brain_type;
        break;
      }
    }
  }

  const challenger = Object.values(scores).every(score => score <= 3);

  return { brainType, scores, challenger };
};



export default mongoose.model('QuizSession', quizSessionSchema);
