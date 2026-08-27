const Career = require('../models/Career');

const getAllCareers = async (req, res) => {
  try {
    const { domain, demand, minSalary, maxSalary, search, skill, targetAudience, featured, trending } = req.query;
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 24, 1), 100);

    let filter = {};

    if (domain && domain !== 'All') {
      filter.domain = domain;
    }

    if (demand && demand !== 'All') {
      filter.jobDemand = demand;
    }

    if (minSalary || maxSalary) {
      filter['salaryRange.min'] = { $gte: Number(minSalary) || 0 };
      if (maxSalary) {
        filter['salaryRange.max'] = { $lte: Number(maxSalary) };
      }
    }

    if (skill) {
      filter.requiredSkills = { $in: [new RegExp(skill, 'i')] };
    }

    if (targetAudience && targetAudience !== 'all') {
      filter.targetAudience = { $in: [targetAudience] };
    }

    if (featured === 'true') filter.featured = true;
    if (trending === 'true') filter.trending = true;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { overview: searchRegex },
        { domain: searchRegex },
        { requiredSkills: { $in: [searchRegex] } }
      ];
    }

    const [careers, count] = await Promise.all([
      Career.find(filter).sort({ viewsCount: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Career.countDocuments(filter)
    ]);
    res.status(200).json({ count, page, limit, pages: Math.ceil(count / limit), careers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching careers', error: error.message });
  }
};

const getCareerById = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, { $inc: { viewsCount: 1 } }, { new: true });
    if (!career) {
      return res.status(404).json({ message: 'Career profile not found' });
    }
    res.status(200).json({ career });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching career details' });
  }
};

const createCareer = async (req, res) => {
  try {
    const newCareer = await Career.create(req.body);
    res.status(201).json({ message: 'Career created successfully', career: newCareer });
  } catch (error) {
    res.status(500).json({ message: 'Error creating career profile', error: error.message });
  }
};

const updateCareer = async (req, res) => {
  try {
    const updatedCareer = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCareer) return res.status(404).json({ message: 'Career profile not found' });
    res.status(200).json({ message: 'Career updated successfully', career: updatedCareer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating career profile' });
  }
};

const deleteCareer = async (req, res) => {
  try {
    const deleted = await Career.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Career profile not found' });
    res.status(200).json({ message: 'Career profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting career profile' });
  }
};

const getCareerSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.length < 2) return res.status(200).json({ suggestions: [] });

    const regex = new RegExp(query, 'i');
    const matches = await Career.find(
      { $or: [{ title: regex }, { requiredSkills: { $in: [regex] } }, { domain: regex }] },
      'title domain requiredSkills'
    ).limit(8);

    res.status(200).json({ suggestions: matches });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch suggestions' });
  }
};

module.exports = {
  getAllCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer,
  getCareerSuggestions
};
