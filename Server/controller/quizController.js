const QuizQuestion = require('../models/QuizQuestion');
const QuizResult = require('../models/QuizResult');
const Career = require('../models/Career');

const getQuestions = async (req, res) => {
  try {
    const questions = await QuizQuestion.find().sort({ createdAt: 1 });
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz questions' });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionId, selectedOptionIndex, sliderValue }
    const userId = req.user._id;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'At least one quiz answer is required' });
    }

    const questionIds = [...new Set(answers.map((answer) => answer?.questionId).filter(Boolean))];
    const questions = await QuizQuestion.find({ _id: { $in: questionIds } });
    const questionMap = new Map(questions.map((question) => [String(question._id), question]));
    if (questionMap.size !== questionIds.length) {
      return res.status(400).json({ message: 'One or more quiz questions are invalid' });
    }

    let domainScores = {
      Technology: 0,
      Healthcare: 0,
      'Business & Finance': 0,
      'Creative & Design': 0,
      Engineering: 0,
      Education: 0,
      'Legal & Policy': 0
    };

    for (const ans of answers) {
      const question = questionMap.get(String(ans.questionId));
      const selectedIndexes = question.type === 'multi_select'
        ? (Array.isArray(ans.selectedOptionIndexes) ? ans.selectedOptionIndexes : [])
        : [ans.selectedOptionIndex];

      if (question.type === 'slider' && !Number.isInteger(ans.sliderValue)) {
        return res.status(400).json({ message: 'Slider answers must include an integer value' });
      }
      if (selectedIndexes.some((index) => !Number.isInteger(index) || index < 0 || index >= question.options.length)) {
        return res.status(400).json({ message: 'One or more selected quiz options are invalid' });
      }
      if (selectedIndexes.length === 0) {
        return res.status(400).json({ message: 'All quiz questions must be answered' });
      }

      for (const index of selectedIndexes) {
        const selectedWeights = question.options[index].domainWeights;
        for (const [domain, weight] of Object.entries(selectedWeights)) {
          if (domainScores[domain] !== undefined) domainScores[domain] += Number(weight) || 0;
        }
      }
    }

    // Determine top domain
    let topDomain = 'Technology';
    let maxScore = -1;
    for (const [domain, score] of Object.entries(domainScores)) {
      if (score > maxScore) {
        maxScore = score;
        topDomain = domain;
      }
    }

    // Fetch recommended careers based on top domain
    const recommendedCareers = await Career.find({ domain: topDomain }).limit(4);

    const result = await QuizResult.create({
      userId,
      domainScores,
      topDomain,
      recommendedCareers: recommendedCareers.map((c) => c._id),
      answers
    });

    const populatedResult = await QuizResult.findById(result._id).populate('recommendedCareers');

    res.status(201).json({
      message: 'Quiz submitted successfully',
      result: populatedResult
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ message: 'Failed to evaluate quiz submission', error: error.message });
  }
};

const getUserQuizHistory = async (req, res) => {
  try {
    const history = await QuizResult.find({ userId: req.user._id })
      .populate('recommendedCareers')
      .sort({ createdAt: -1 });

    res.status(200).json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz history' });
  }
};

// Admin controllers for Quiz Questions
const createQuestion = async (req, res) => {
  try {
    const question = await QuizQuestion.create(req.body);
    res.status(201).json({ message: 'Question created successfully', question });
  } catch (error) {
    res.status(500).json({ message: 'Error creating question' });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const updated = await QuizQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json({ message: 'Question updated successfully', question: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating question' });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const deleted = await QuizQuestion.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question' });
  }
};

module.exports = {
  getQuestions,
  submitQuiz,
  getUserQuizHistory,
  createQuestion,
  updateQuestion,
  deleteQuestion
};
