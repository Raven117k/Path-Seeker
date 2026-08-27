const Multimedia = require('../models/Multimedia');

const getAllMultimedia = async (req, res) => {
  try {
    const { type, tag, audience, search } = req.query;
    let filter = {};

    if (type && type !== 'all') filter.type = type;
    if (tag) filter.tags = { $in: [tag] };
    if (audience && audience !== 'all') filter.targetAudience = { $in: [audience] };

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { description: regex }, { tags: { $in: [regex] } }];
    }

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 24, 1), 100);
    const [items, count] = await Promise.all([
      Multimedia.find(filter).sort({ ratingAvg: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Multimedia.countDocuments(filter)
    ]);
    res.status(200).json({ count, page, limit, pages: Math.ceil(count / limit), items });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching multimedia content' });
  }
};

const getMultimediaById = async (req, res) => {
  try {
    const item = await Multimedia.findByIdAndUpdate(req.params.id, { $inc: { viewsCount: 1 } }, { new: true });
    if (!item) return res.status(404).json({ message: 'Multimedia content not found' });
    res.status(200).json({ item });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content detail' });
  }
};

const rateMultimedia = async (req, res) => {
  try {
    const { rating } = req.body; // number 1-5 or 5 for thumbs up
    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer from 1 to 5' });
    }

    const item = await Multimedia.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Media item not found' });

    const previousRating = item.ratings.find((entry) => String(entry.userId) === String(req.user._id));
    if (previousRating) {
      item.ratingSum += numRating - previousRating.rating;
      previousRating.rating = numRating;
    } else {
      item.ratings.push({ userId: req.user._id, rating: numRating });
      item.ratingSum += numRating;
      item.ratingCount += 1;
    }
    item.ratingAvg = Number((item.ratingSum / item.ratingCount).toFixed(1));
    await item.save();

    res.status(200).json({ message: 'Rating submitted successfully', ratingAvg: item.ratingAvg, ratingCount: item.ratingCount });
  } catch (error) {
    res.status(500).json({ message: 'Error rating multimedia item' });
  }
};

const createMultimedia = async (req, res) => {
  try {
    const newItem = await Multimedia.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ message: 'Multimedia item added successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Error adding multimedia item' });
  }
};

const updateMultimedia = async (req, res) => {
  try {
    const updated = await Multimedia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Media item not found' });
    res.status(200).json({ message: 'Multimedia item updated', item: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating multimedia item' });
  }
};

const deleteMultimedia = async (req, res) => {
  try {
    const deleted = await Multimedia.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Media item not found' });
    res.status(200).json({ message: 'Multimedia item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting multimedia item' });
  }
};

module.exports = {
  getAllMultimedia,
  getMultimediaById,
  rateMultimedia,
  createMultimedia,
  updateMultimedia,
  deleteMultimedia
};
