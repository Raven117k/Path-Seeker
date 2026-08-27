const SuccessStory = require('../models/SuccessStory');

const getApprovedStories = async (req, res) => {
  try {
    const { domain, userType } = req.query;
    let filter = { approved: true };

    if (domain && domain !== 'All') filter.domain = domain;
    if (userType && userType !== 'all') filter.userType = userType;

    const stories = await SuccessStory.find(filter).sort({ featured: -1, createdAt: -1 });
    res.status(200).json({ count: stories.length, stories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching success stories' });
  }
};

const submitStory = async (req, res) => {
  try {
    const { name, role, domain, userType, avatar, summary, timeline } = req.body;

    const story = await SuccessStory.create({
      name: name || req.user.name,
      role,
      domain,
      userType: userType || req.user.role || 'graduate',
      avatar: avatar || req.user.avatar || '',
      summary,
      timeline: timeline || [],
      submittedBy: req.user._id,
      approved: false // Requires admin approval
    });

    res.status(201).json({
      message: 'Story submitted successfully! It will be published after admin review.',
      story
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting success story' });
  }
};

// Admin controllers
const getAllStoriesAdmin = async (req, res) => {
  try {
    const stories = await SuccessStory.find().populate('submittedBy', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ stories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories for admin' });
  }
};

const toggleApproveStory = async (req, res) => {
  try {
    const { approved, featured } = req.body;
    const story = await SuccessStory.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    if (approved !== undefined) {
      story.approved = approved;
      story.approvedAt = approved ? new Date() : null;
    }
    if (featured !== undefined) {
      story.featured = featured;
    }

    await story.save();
    res.status(200).json({ message: `Story status updated to ${story.approved ? 'Approved' : 'Pending'}`, story });
  } catch (error) {
    res.status(500).json({ message: 'Error updating story status' });
  }
};

const deleteStory = async (req, res) => {
  try {
    const deleted = await SuccessStory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Story not found' });
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting story' });
  }
};

module.exports = {
  getApprovedStories,
  submitStory,
  getAllStoriesAdmin,
  toggleApproveStory,
  deleteStory
};
