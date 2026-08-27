const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['PDF', 'Checklist', 'Infographic', 'Template', 'Guide', 'Worksheet'], required: true },
    description: { type: String, required: true },
    fileUrl: { type: String, required: true },
    previewContent: { type: String, default: '' },
    tags: { type: [String], default: [] }, // e.g. ["Beginner", "Scholarship", "Skill-Building", "Resume"]
    targetAudience: { type: [String], default: ['student', 'graduate', 'professional'] },
    downloadCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
