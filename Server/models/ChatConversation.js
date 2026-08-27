const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true, maxlength: 12000 }
  },
  { timestamps: true, _id: true }
);

const chatConversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    messages: { type: [chatMessageSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatConversation', chatConversationSchema);