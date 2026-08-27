const mongoose = require('mongoose');

const storyTimelineSchema = new mongoose.Schema({
  stage: { type: String, required: true }, // e.g. 'Educational Path', 'Challenges Faced', 'Career Breakthrough'
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const successStorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true }, // e.g. 'Senior AI Engineer at Tech Corp'
    domain: { type: String, required: true },
    userType: { type: String, enum: ['student', 'graduate', 'professional'], default: 'graduate' },
    avatar: { type: String, default: '' },
    summary: { type: String, required: true },
    timeline: [storyTimelineSchema],
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approved: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    approvedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SuccessStory', successStorySchema);
