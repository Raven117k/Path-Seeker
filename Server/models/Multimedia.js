const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true }
}, { _id: false });

const multimediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'podcast', 'anim_explainer'], required: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    description: { type: String, required: true },
    transcript: { type: String, default: '' },
    duration: { type: String, default: '10:00' },
    tags: { type: [String], default: [] },
    targetAudience: { type: [String], default: ['student', 'graduate', 'professional'] },
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    ratingAvg: { type: Number, default: 4.8 },
    ratings: { type: [ratingSchema], default: [] },
    likesCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Multimedia', multimediaSchema);
