const Resource = require('../models/Resource');

const getAllResources = async (req, res) => {
  try {
    const { type, tag, audience, search } = req.query;
    let filter = {};

    if (type && type !== 'all') filter.type = type;
    if (tag && tag !== 'all') filter.tags = { $in: [tag] };
    if (audience && audience !== 'all') filter.targetAudience = { $in: [audience] };

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { description: regex }, { tags: { $in: [regex] } }];
    }

    const resources = await Resource.find(filter).sort({ downloadCount: -1, createdAt: -1 });
    res.status(200).json({ count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document resources' });
  }
};

const trackDownload = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } }, { new: true });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.status(200).json({ message: 'Download tracked', downloadCount: resource.downloadCount });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking download' });
  }
};

const createResource = async (req, res) => {
  try {
    const resource = await Resource.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ message: 'Resource created successfully', resource });
  } catch (error) {
    res.status(500).json({ message: 'Error creating resource' });
  }
};

const updateResource = async (req, res) => {
  try {
    const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Resource not found' });
    res.status(200).json({ message: 'Resource updated', resource: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating resource' });
  }
};

const deleteResource = async (req, res) => {
  try {
    const deleted = await Resource.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Resource not found' });
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resource' });
  }
};

module.exports = {
  getAllResources,
  trackDownload,
  createResource,
  updateResource,
  deleteResource
};
