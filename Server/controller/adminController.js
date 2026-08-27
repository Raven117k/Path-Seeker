const User = require('../models/User');
const Career = require('../models/Career');
const QuizResult = require('../models/QuizResult');
const Multimedia = require('../models/Multimedia');
const SuccessStory = require('../models/SuccessStory');
const Resource = require('../models/Resource');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');

const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalCareers = await Career.countDocuments();
    const totalQuizAttempts = await QuizResult.countDocuments();
    const totalMedia = await Multimedia.countDocuments();
    const pendingStories = await SuccessStory.countDocuments({ approved: false });
    const totalResources = await Resource.countDocuments();
    const totalFeedbacks = await Feedback.countDocuments();

    // User breakdown by role
    const usersByRole = {
      student: await User.countDocuments({ role: 'student' }),
      graduate: await User.countDocuments({ role: 'graduate' }),
      professional: await User.countDocuments({ role: 'professional' })
    };

    // Quiz popular domains
    const quizResults = await QuizResult.find();
    const topDomainCounts = {};
    quizResults.forEach((r) => {
      topDomainCounts[r.topDomain] = (topDomainCounts[r.topDomain] || 0) + 1;
    });

    // Recent activity logs
    const recentQuizAttempts = await QuizResult.find()
      .populate('userId', 'name role email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentFeedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      stats: {
        totalUsers,
        totalCareers,
        totalQuizAttempts,
        totalMedia,
        pendingStories,
        totalResources,
        totalFeedbacks
      },
      usersByRole,
      topDomainCounts,
      recentQuizAttempts,
      recentFeedbacks
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin dashboard statistics', error: error.message });
  }
};

const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

const updateUserRoleOrStatus = async (req, res) => {
  try {
    const {
      name, email, password, contact, role, avatar, educationLevel,
      institution, fieldOfStudy, skills, interests, workExperience,
      resumeUrl, isActive
    } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (password !== undefined && password.trim()) {
      user.password = await bcrypt.hash(password, 10);
      user.markModified('password');
    }
    if (contact !== undefined) user.contact = contact;
    if (role && ['student', 'graduate', 'professional', 'admin'].includes(role)) {
      user.role = role;
    }
    if (avatar !== undefined) user.avatar = avatar;
    if (educationLevel !== undefined) user.educationLevel = educationLevel;
    if (institution !== undefined) user.institution = institution;
    if (fieldOfStudy !== undefined) user.fieldOfStudy = fieldOfStudy;
    if (Array.isArray(skills)) user.skills = skills;
    if (Array.isArray(interests)) user.interests = interests;
    if (workExperience !== undefined) user.workExperience = workExperience;
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;
    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    await user.save();
    const safeUser = user.toObject();
    delete safeUser.password;
    res.status(200).json({ message: 'User updated successfully', user: safeUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

const broadcastAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Announcement message is required' });
    }
    const users = await User.find({ role: { $ne: 'admin' } });

    const notifications = users.map((u) => ({
      userId: u._id,
      title: title || 'System Announcement',
      message,
      type: 'announcement'
    }));

    await Notification.insertMany(notifications);
    res.status(200).json({ message: `Announcement broadcast to ${users.length} users` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to broadcast announcement' });
  }
};

module.exports = {
  getAdminDashboardStats,
  getAllUsersAdmin,
  updateUserRoleOrStatus,
  broadcastAnnouncement
};
