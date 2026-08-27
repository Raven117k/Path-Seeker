const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  domainWeights: {
    Technology: { type: Number, default: 0 },
    Healthcare: { type: Number, default: 0 },
    'Business & Finance': { type: Number, default: 0 },
    'Creative & Design': { type: Number, default: 0 },
    Engineering: { type: Number, default: 0 },
    Education: { type: Number, default: 0 },
    'Legal & Policy': { type: Number, default: 0 }
  }
});

const quizQuestionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    type: { type: String, enum: ['single_choice', 'slider', 'likert_scale', 'multi_select'], default: 'single_choice' },
    category: { type: String, required: true },
    timeLimitSeconds: { type: Number, default: 30 },
    options: [optionSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
