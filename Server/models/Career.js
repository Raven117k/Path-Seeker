const mongoose = require('mongoose');

const roadmapStepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, default: '' },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' }
});

const careerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    domain: { type: String, required: true, enum: ['Technology', 'Healthcare', 'Business & Finance', 'Creative & Design', 'Engineering', 'Education', 'Legal & Policy'] },
    description: { type: String, required: true },
    overview: { type: String, required: true },
    requiredSkills: { type: [String], required: true },
    educationPath: { type: String, required: true },
    salaryRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'PKR' }
    },
    jobDemand: { type: String, enum: ['High', 'Very High', 'Moderate', 'Explosive Growth', 'Emerging'], default: 'High' },
    targetAudience: { type: [String], default: ['student', 'graduate', 'professional'] },
    roadmap: [roadmapStepSchema],
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    icon: { type: String, default: 'Briefcase' },
    viewsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Career', careerSchema);
