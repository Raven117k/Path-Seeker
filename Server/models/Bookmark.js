const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemType: { type: String, enum: ['career', 'multimedia', 'resource', 'story'], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    stickyNote: { type: String, default: '' },
    category: { type: String, default: 'General' }
  },
  { timestamps: true }
);

bookmarkSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
