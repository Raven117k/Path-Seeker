const Bookmark = require('../models/Bookmark');
const Notification = require('../models/Notification');

const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ bookmarks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookmarks' });
  }
};

const addBookmark = async (req, res) => {
  try {
    const { itemType, itemId, title, subtitle, stickyNote, category } = req.body;

    const existing = await Bookmark.findOne({ userId: req.user._id, itemType, itemId });
    if (existing) {
      return res.status(400).json({ message: 'Item is already bookmarked' });
    }

    const bookmark = await Bookmark.create({
      userId: req.user._id,
      itemType,
      itemId,
      title,
      subtitle: subtitle || '',
      stickyNote: stickyNote || '',
      category: category || 'General'
    });

    res.status(201).json({ message: 'Item bookmarked successfully', bookmark });
  } catch (error) {
    res.status(500).json({ message: 'Error creating bookmark' });
  }
};

const updateStickyNote = async (req, res) => {
  try {
    const { stickyNote } = req.body;
    const bookmark = await Bookmark.findOne({ _id: req.params.id, userId: req.user._id });
    if (!bookmark) return res.status(404).json({ message: 'Bookmark not found' });

    bookmark.stickyNote = stickyNote;
    await bookmark.save();

    res.status(200).json({ message: 'Note saved successfully', bookmark });
  } catch (error) {
    res.status(500).json({ message: 'Error updating note' });
  }
};

const removeBookmark = async (req, res) => {
  try {
    const deleted = await Bookmark.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Bookmark not found' });

    res.status(200).json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing bookmark' });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications' });
  }
};

module.exports = {
  getBookmarks,
  addBookmark,
  updateStickyNote,
  removeBookmark,
  getUserNotifications,
  markNotificationRead
};
