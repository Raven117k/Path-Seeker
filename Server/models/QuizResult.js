const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    domainScores: {
      Technology: { type: Number, default: 0 },
      Healthcare: { type: Number, default: 0 },
      'Business & Finance': { type: Number, default: 0 },
      'Creative & Design': { type: Number, default: 0 },
      Engineering: { type: Number, default: 0 },
      Education: { type: Number, default: 0 },
      'Legal & Policy': { type: Number, default: 0 }
    },
    topDomain: { type: String, required: true },
    recommendedCareers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Career' }],
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizQuestion' },
        selectedOptionIndex: Number,
        sliderValue: Number
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuizResult', quizResultSchema);
