const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');

const submitFeedback = async (req, res) => {
  try {
    const { category, subject, message } = req.body;

    // Simple sentiment classifier simulation
    let sentiment = 'Neutral';
    const lower = (message + ' ' + subject).toLowerCase();
    if (lower.includes('great') || lower.includes('awesome') || lower.includes('love') || lower.includes('excellent')) {
      sentiment = 'Positive';
    } else if (lower.includes('bug') || lower.includes('error') || lower.includes('broken') || lower.includes('urgent')) {
      sentiment = 'Urgent';
    } else if (lower.includes('suggest') || lower.includes('improve') || lower.includes('add')) {
      sentiment = 'Constructive';
    }

    const newFeedback = await Feedback.create({
      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      category: category || 'general',
      subject,
      message,
      sentiment
    });

    res.status(201).json({
      message: 'Feedback submitted successfully! Our team will review your message.',
      feedback: newFeedback
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback' });
  }
};

const getUserFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user feedbacks' });
  }
};

// Admin feedback response & analytics
const getAllFeedbacksAdmin = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    // Sentiment breakdown analytics
    const sentimentStats = {
      Positive: feedbacks.filter((f) => f.sentiment === 'Positive').length,
      Neutral: feedbacks.filter((f) => f.sentiment === 'Neutral').length,
      Constructive: feedbacks.filter((f) => f.sentiment === 'Constructive').length,
      Urgent: feedbacks.filter((f) => f.sentiment === 'Urgent').length
    };

    const categoryStats = {
      bug: feedbacks.filter((f) => f.category === 'bug').length,
      suggestion: feedbacks.filter((f) => f.category === 'suggestion').length,
      query: feedbacks.filter((f) => f.category === 'query').length,
      general: feedbacks.filter((f) => f.category === 'general').length
    };

    res.status(200).json({ feedbacks, sentimentStats, categoryStats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin feedbacks' });
  }
};

const respondToFeedback = async (req, res) => {
  try {
    const { adminResponse, status } = req.body;
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback item not found' });

    feedback.adminResponse = adminResponse;
    feedback.status = status || 'resolved';
    feedback.respondedAt = new Date();
    await feedback.save();

    // Send in-app notification to the user
    await Notification.create({
      userId: feedback.userId,
      title: `Response to your feedback: ${feedback.subject}`,
      message: adminResponse,
      type: 'feedback_reply'
    });

    res.status(200).json({ message: 'Response sent and user notified!', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Error sending feedback response' });
  }
};

module.exports = {
  submitFeedback,
  getUserFeedbacks,
  getAllFeedbacksAdmin,
  respondToFeedback
};
