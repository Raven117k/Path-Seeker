const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    category: { type: String, enum: ['bug', 'suggestion', 'query', 'general'], required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    sentiment: { type: String, enum: ['Positive', 'Neutral', 'Constructive', 'Urgent'], default: 'Neutral' },
    status: { type: String, enum: ['pending', 'in_review', 'resolved'], default: 'pending' },
    adminResponse: { type: String, default: '' },
    respondedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
