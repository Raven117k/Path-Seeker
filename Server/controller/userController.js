const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const { sendPasswordResetOtp } = require('../services/emailService');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email address or user not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated. Please contact support.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        role: user.role,
        avatar: user.avatar,
        educationLevel: user.educationLevel,
        institution: user.institution,
        fieldOfStudy: user.fieldOfStudy,
        skills: user.skills,
        interests: user.interests,
        workExperience: user.workExperience,
        resumeUrl: user.resumeUrl
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};

const Registration = async (req, res) => {
  try {
    const { name, email, password, contact, role, educationLevel, fieldOfStudy, skills, interests, workExperience } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email address already exists' });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const validRole = ['student', 'graduate', 'professional'].includes(role) ? role : 'student';

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashPassword,
      contact: contact || '',
      role: validRole,
      educationLevel: educationLevel || 'High School',
      fieldOfStudy: fieldOfStudy || '',
      skills: Array.isArray(skills) ? skills : skills ? skills.split(',').map((s) => s.trim()) : [],
      interests: Array.isArray(interests) ? interests : interests ? interests.split(',').map((i) => i.trim()) : [],
      workExperience: workExperience || ''
    });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        contact: newUser.contact,
        role: newUser.role,
        educationLevel: newUser.educationLevel,
        fieldOfStudy: newUser.fieldOfStudy,
        skills: newUser.skills,
        interests: newUser.interests,
        workExperience: newUser.workExperience
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, contact, educationLevel, institution, fieldOfStudy, skills, interests, workExperience } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (contact) user.contact = contact;
    if (educationLevel) user.educationLevel = educationLevel;
    if (institution) user.institution = institution;
    if (fieldOfStudy) user.fieldOfStudy = fieldOfStudy;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim());
    if (interests) user.interests = Array.isArray(interests) ? interests : interests.split(',').map((i) => i.trim());
    if (workExperience !== undefined) user.workExperience = workExperience;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Simulation of Password Reset via OTP / Token
const forgotPassword = async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!email) return res.status(400).json({ message: 'A valid email address is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If an account exists, a password reset code has been sent' });

    const otp = crypto.randomInt(100000, 1000000).toString();
    user.resetOtp = await bcrypt.hash(otp, 10);
    user.resetOtpExpire = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    if (process.env.RESEND_API_KEY || process.env.NODE_ENV === 'production') {
      await sendPasswordResetOtp({ to: user.email, otp });
    }

    const response = { message: 'If an account exists, a password reset code has been sent' };
    if (!process.env.RESEND_API_KEY && process.env.NODE_ENV !== 'production') response.simulatedOtp = otp;
    res.status(200).json(response);
  } catch (error) {
    console.error('Password reset email error:', error.message);
    res.status(500).json({ message: 'Failed to send password reset email' });
  }
};

const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ message: 'Email, OTP, and a password of at least 8 characters are required' });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase(), resetOtpExpire: { $gt: Date.now() } });

    if (!user || !(await bcrypt.compare(otp, user.resetOtp))) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.markModified('password');
    user.resetOtp = null;
    user.resetOtpExpire = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }
    const resumeUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { resumeUrl }, { new: true });
    res.status(200).json({ message: 'Resume uploaded successfully', resumeUrl, user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload resume' });
  }
};

module.exports = {
  login,
  Registration,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPasswordWithOtp,
  uploadResume
};