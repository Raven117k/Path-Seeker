const Career = require('../models/Career');
const QuizResult = require('../models/QuizResult');
const Resource = require('../models/Resource');
const ChatConversation = require('../models/ChatConversation');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSearchTerms(message) {
  return message
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((term) => term.length > 2 && !['what', 'which', 'how', 'should', 'could', 'career', 'careers', 'best', 'for', 'the', 'and', 'with'].includes(term))
    .slice(0, 6);
}

async function getPathSeekerContext(user, message, currentPage) {
  const terms = getSearchTerms(message);
  const searchRegex = terms.length ? new RegExp(terms.map(escapeRegex).join('|'), 'i') : null;
  const careerFilter = searchRegex
    ? { $or: [{ title: searchRegex }, { domain: searchRegex }, { description: searchRegex }, { requiredSkills: searchRegex }] }
    : {};
  const resourceFilter = searchRegex
    ? { $or: [{ title: searchRegex }, { description: searchRegex }, { tags: searchRegex }] }
    : {};

  const [quiz, careers, resources] = await Promise.all([
    QuizResult.findOne({ userId: user._id }).populate('recommendedCareers').sort({ createdAt: -1 }).lean(),
    Career.find(careerFilter).limit(8).lean(),
    Resource.find(resourceFilter).sort({ downloadCount: -1, createdAt: -1 }).limit(6).lean()
  ]);

  return {
    currentPage: currentPage || '/',
    user: {
      name: user.name,
      role: user.role,
      educationLevel: user.educationLevel,
      institution: user.institution,
      fieldOfStudy: user.fieldOfStudy,
      skills: user.skills || [],
      interests: user.interests || [],
      workExperience: user.workExperience
    },
    latestQuiz: quiz
      ? { topDomain: quiz.topDomain, domainScores: quiz.domainScores, recommendedCareers: quiz.recommendedCareers }
      : null,
    matchingCareers: careers.map((career) => ({
      id: career._id,
      title: career.title,
      domain: career.domain,
      description: career.description,
      requiredSkills: career.requiredSkills,
      educationPath: career.educationPath,
      salaryRange: career.salaryRange,
      jobDemand: career.jobDemand,
      roadmap: career.roadmap
    })),
    matchingResources: resources.map((resource) => ({
      id: resource._id,
      title: resource.title,
      type: resource.type,
      description: resource.description,
      tags: resource.tags
    }))
  };
}

function fallbackAnswer(context) {
  const { user, latestQuiz, matchingCareers, matchingResources } = context;
  const name = user.name ? ` ${user.name.split(' ')[0]}` : '';
  const careerLines = matchingCareers.slice(0, 3).map((career, index) => `${index + 1}. ${career.title} (${career.domain})`);
  const resourceLines = matchingResources.slice(0, 3).map((resource) => `- ${resource.title}`);

  return `Hi${name}. I can help you turn your PathSeeker profile into a practical next step.\n\n${latestQuiz ? `Your latest assessment points toward **${latestQuiz.topDomain}**.` : 'You have not completed a PathSeeker assessment yet, so the quiz would give us a stronger starting point.'}\n\n${careerLines.length ? `Relevant careers in the live Career Bank:\n${careerLines.join('\n')}` : 'I could not find matching careers in the live Career Bank for that question.'}${resourceLines.length ? `\n\nUseful PathSeeker resources:\n${resourceLines.join('\n')}` : ''}\n\nAdd your specific target or compare two career names, and I will narrow this into an actionable plan.`;
}

async function askGemini(message, context, history = []) {
  if (!process.env.GEMINI_API_KEY) return fallbackAnswer(context);

  const prompt = `You are PathSeeker AI, a practical career copilot for Pakistani students, graduates, and professionals.
Use only the trusted PathSeeker context below for platform data. Never invent careers, quiz results, salaries, resources, or user information. Clearly label general guidance as general guidance. Be concise, structured, honest, and finish with one useful next action.

TRUSTED PATHSEEKER CONTEXT:
${JSON.stringify(context, null, 2)}

USER MESSAGE:
${message}

RECENT CONVERSATION:
${history.map((item) => `${item.role.toUpperCase()}: ${item.content}`).join('\n') || 'No previous conversation.'}`;

  let completeText = '';
  let continuationPrompt = prompt;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    let response;
    try {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: continuationPrompt }] }],
          generationConfig: { temperature: 0.35, maxOutputTokens: 2048 }
        })
      });
    } catch (error) {
      console.warn('Gemini unavailable; using grounded fallback:', error.message);
      return completeText || fallbackAnswer(context);
    }

    if (!response.ok) {
      console.warn(`Gemini returned ${response.status}; using grounded fallback.`);
      return completeText || fallbackAnswer(context);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const nextText = candidate?.content?.parts?.map((part) => part.text || '').join('').trim();
    if (nextText) completeText = `${completeText}${completeText ? '\n' : ''}${nextText}`;

    if (candidate?.finishReason !== 'MAX_TOKENS') break;
    continuationPrompt = `${prompt}\n\nYour previous answer ended mid-response. Continue it from exactly where it stopped without repeating anything. Previous answer:\n${completeText}`;
  }

  return completeText || fallbackAnswer(context);
}

const chat = async (req, res) => {
  try {
    const { message, currentPage } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'A message is required' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ message: 'Please keep messages under 2,000 characters' });
    }

    const conversation = await ChatConversation.findOneAndUpdate(
      { userId: req.user._id },
      { $setOnInsert: { userId: req.user._id } },
      { new: true, upsert: true }
    );
    const history = conversation.messages.slice(-12).map((item) => ({ role: item.role, content: item.content }));
    const context = await getPathSeekerContext(req.user, message.trim(), currentPage);
    const answer = await askGemini(message.trim(), context, history);

    conversation.messages.push({ role: 'user', content: message.trim() });
    conversation.messages.push({ role: 'assistant', content: answer });
    if (conversation.messages.length > 40) conversation.messages = conversation.messages.slice(-40);
    await conversation.save();

    res.status(200).json({ success: true, message: answer, grounded: Boolean(process.env.GEMINI_API_KEY) });
  } catch (error) {
    console.error('AI chat error:', error.message);
    res.status(502).json({ message: 'The career copilot is temporarily unavailable. Please try again.' });
  }
};

const getHistory = async (req, res) => {
  try {
    const conversation = await ChatConversation.findOne({ userId: req.user._id }).lean();
    res.status(200).json({ messages: conversation?.messages || [] });
  } catch (error) {
    console.error('AI history error:', error.message);
    res.status(500).json({ message: 'Could not load chat history' });
  }
};

module.exports = { chat, getHistory };