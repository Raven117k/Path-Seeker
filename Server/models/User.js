const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['student', 'graduate', 'professional', 'admin'],
      default: 'student'
    },
    avatar: {
      type: String,
      default: ''
    },
    // Enhanced profile fields
    educationLevel: {
      type: String,
      default: 'High School'
    },
    institution: {
      type: String,
      default: ''
    },
    fieldOfStudy: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    interests: {
      type: [String],
      default: []
    },
    workExperience: {
      type: String,
      default: ''
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    resetOtp: {
      type: String,
      default: null
    },
    resetOtpExpire: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);