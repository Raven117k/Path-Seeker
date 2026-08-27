const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (error) {}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDb = require('./config/connection');
const User = require('./models/User');
const Career = require('./models/Career');
const QuizQuestion = require('./models/QuizQuestion');
const QuizResult = require('./models/QuizResult');
const Multimedia = require('./models/Multimedia');
const SuccessStory = require('./models/SuccessStory');
const Resource = require('./models/Resource');
const Feedback = require('./models/Feedback');
const Bookmark = require('./models/Bookmark');
const Notification = require('./models/Notification');

const PASSWORD = 'password123';
const domains = ['Technology', 'Healthcare', 'Business & Finance', 'Creative & Design', 'Engineering', 'Education', 'Legal & Policy'];
const audienceRoles = ['student', 'graduate', 'professional'];
const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Riley', 'Casey', 'Avery', 'Sam', 'Jamie', 'Drew', 'Cameron', 'Quinn', 'Reese', 'Parker', 'Skyler', 'Rowan', 'Hayden', 'Emerson', 'Blake', 'Finley'];
const lastNames = ['Morgan', 'Patel', 'Chen', 'Williams', 'Johnson', 'Garcia', 'Wilson', 'Brown', 'Davis', 'Miller', 'Taylor', 'Anderson', 'Thomas', 'Moore', 'Martin', 'Clark', 'Lewis', 'Walker', 'Hall', 'Young'];
const imageUrls = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'
];
const avatarUrls = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
];
const videoUrls = [
  'https://www.youtube.com/watch?v=aircAruvnKk',
  'https://www.youtube.com/watch?v=PkZNo7MFNFg',
  'https://www.youtube.com/watch?v=8hly31xKli0',
  'https://www.youtube.com/watch?v=Oe421EPjeBE',
  'https://www.youtube.com/watch?v=Ke90Tje7VS0',
  'https://www.youtube.com/watch?v=rfscVS0vtbw'
];

const pick = (items, index) => items[index % items.length];
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const roleFor = (index) => index % 4 === 0 ? 'professional' : index % 3 === 0 ? 'graduate' : 'student';
const domainFor = (index) => pick(domains, index);

function makeCareer(index) {
  const domain = domainFor(index);
  const titleTemplates = {
    Technology: ['Product Engineer', 'Cloud Platform Specialist', 'Data Pipeline Developer', 'Cybersecurity Analyst', 'AI Solutions Architect'],
    Healthcare: ['Digital Health Coordinator', 'Clinical Data Analyst', 'Healthcare UX Researcher', 'Public Health Technologist'],
    'Business & Finance': ['Financial Planning Analyst', 'Product Operations Manager', 'Growth Strategy Consultant', 'Risk Intelligence Associate'],
    'Creative & Design': ['Service Designer', 'Brand Experience Strategist', 'Motion Design Producer', 'Content Systems Lead'],
    Engineering: ['Renewable Energy Engineer', 'Robotics Systems Engineer', 'Quality Automation Engineer', 'Urban Mobility Planner'],
    Education: ['Learning Experience Designer', 'Instructional Technology Coach', 'Education Data Specialist', 'Student Success Manager'],
    'Legal & Policy': ['Technology Policy Analyst', 'Privacy Compliance Advisor', 'Regulatory Research Associate', 'Civic Innovation Consultant']
  };
  const title = `${pick(titleTemplates[domain], index)} ${Math.floor(index / 7) + 1}`;
  const skillSets = {
    Technology: ['JavaScript', 'Python', 'SQL', 'Cloud Architecture', 'APIs', 'Git'],
    Healthcare: ['Clinical Research', 'Health Data', 'SQL', 'Patient Systems', 'Data Privacy', 'Reporting'],
    'Business & Finance': ['Financial Modeling', 'Excel', 'SQL', 'Market Research', 'Forecasting', 'Communication'],
    'Creative & Design': ['Figma', 'Research', 'Brand Strategy', 'Prototyping', 'Storytelling', 'Accessibility'],
    Engineering: ['CAD', 'Systems Thinking', 'Testing', 'Automation', 'Project Planning', 'Data Analysis'],
    Education: ['Curriculum Design', 'Facilitation', 'Learning Science', 'Assessment', 'EdTech', 'Coaching'],
    'Legal & Policy': ['Policy Research', 'Writing', 'Privacy', 'Stakeholder Management', 'Risk Analysis', 'Governance']
  };
  const minSalary = 50000 + (index % 10) * 6500;
  const roadmap = ['Foundations', 'Applied Practice', 'Portfolio Project', 'Career Launch'].map((step, stepIndex) => ({
    title: step,
    description: `Build practical ${domain.toLowerCase()} capability through guided projects and feedback.`,
    duration: `${2 + stepIndex} Months`,
    level: stepIndex < 1 ? 'Beginner' : stepIndex < 3 ? 'Intermediate' : 'Advanced'
  }));
  return {
    title,
    domain,
    description: `Use research, technology, and collaborative problem solving to create measurable outcomes in ${domain.toLowerCase()}.`,
    overview: `${title} professionals connect domain expertise with modern tools to solve meaningful problems for teams and communities.`,
    requiredSkills: skillSets[domain],
    educationPath: `Build a foundation through Matriculation, F.Sc/ICS, or a relevant BS degree at a Pakistani university, followed by project-based learning in ${domain.toLowerCase()}.`,
    salaryRange: { min: minSalary, max: minSalary + 65000, currency: 'PKR' },
    jobDemand: pick(['High', 'Very High', 'Moderate', 'Explosive Growth', 'Emerging'], index),
    targetAudience: [pick(audienceRoles, index), pick(audienceRoles, index + 1)],
    roadmap,
    featured: index < 12,
    trending: index % 4 === 0,
    icon: pick(['Briefcase', 'Code', 'Activity', 'BarChart3', 'Palette', 'GraduationCap'], index),
    viewsCount: 150 + index * 37
  };
}

function makeResource(index) {
  const type = pick(['PDF', 'Checklist', 'Infographic', 'Template', 'Guide', 'Worksheet'], index);
  const domain = domainFor(index);
  return {
    title: `${domain} ${pick(['Career Starter Guide', 'Interview Field Notes', 'Skills Planning Workbook', 'Portfolio Checklist'], index)} ${index + 1}`,
    type,
    description: `A practical ${type.toLowerCase()} for exploring ${domain.toLowerCase()} roles, building evidence, and planning your next move.`,
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    previewContent: `## ${domain} career notes\n\n- Map your current strengths.\n- Choose one skill to practise this week.\n- Capture evidence in a portfolio or project log.`,
    tags: [domain, pick(['Beginner', 'Interview Prep', 'Skill-Building', 'Resume', 'Portfolio'], index + 1)],
    targetAudience: [pick(audienceRoles, index), pick(audienceRoles, index + 2)],
    downloadCount: 25 + index * 11
  };
}

function makeMultimedia(index) {
  const type = pick(['video', 'podcast', 'anim_explainer'], index);
  const domain = domainFor(index);
  return {
    title: `${domain}: ${pick(['A Day in the Role', 'Skills That Matter', 'Career Stories', 'Breaking Into the Field'], index)} ${index + 1}`,
    type,
    url: pick(videoUrls, index),
    thumbnailUrl: pick(imageUrls, index),
    description: `An approachable ${type === 'video' ? 'video' : type === 'podcast' ? 'conversation' : 'visual explainer'} about skills, decisions, and opportunities in ${domain.toLowerCase()}.`,
    transcript: `Welcome to this PathSeeker feature on ${domain}. In this session we explore the work, the skills behind it, and a practical first step for learners.`,
    duration: `${8 + (index % 12)}:${String((index * 7) % 60).padStart(2, '0')}`,
    tags: [domain, pick(['Career Advice', 'Skills', 'Interview', 'Industry Trends'], index)],
    targetAudience: [pick(audienceRoles, index), pick(audienceRoles, index + 1)],
    ratingSum: 40 + index * 5,
    ratingCount: 8 + (index % 12),
    ratingAvg: Number((4.1 + (index % 9) / 10).toFixed(1)),
    likesCount: 20 + index * 9,
    viewsCount: 100 + index * 43
  };
}

function makeStory(index) {
  const domain = domainFor(index);
  const userType = pick(audienceRoles, index);
  const name = `${pick(firstNames, index + 3)} ${pick(lastNames, index + 8)}`;
  return {
    name,
    role: `${pick(['Senior', 'Lead', 'Associate', 'Product', 'Principal'], index)} ${pick(['Specialist', 'Engineer', 'Strategist', 'Designer', 'Analyst'], index)} at Horizon ${index + 1}`,
    domain,
    userType,
    avatar: pick(avatarUrls, index),
    summary: `After an uncertain start, ${name.split(' ')[0]} built a focused plan, found the right mentors, and moved into meaningful ${domain.toLowerCase()} work.`,
    timeline: [
      { stage: 'Educational Path', title: 'Built a strong foundation', description: `Combined formal learning with small projects focused on ${domain.toLowerCase()}.` },
      { stage: 'Challenges Faced', title: 'Made the transition visible', description: 'Used feedback, community, and consistent practice to turn uncertainty into momentum.' },
      { stage: 'Career Breakthrough', title: 'Found the right opportunity', description: 'Presented a focused portfolio and earned a role aligned with long-term goals.' }
    ],
    featured: index < 10,
    approved: true,
    approvedAt: new Date()
  };
}

async function seedDemoData() {
  try {
    await connectDb();
    console.log('Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}), Career.deleteMany({}), QuizQuestion.deleteMany({}), QuizResult.deleteMany({}),
      Multimedia.deleteMany({}), SuccessStory.deleteMany({}), Resource.deleteMany({}), Feedback.deleteMany({}),
      Bookmark.deleteMany({}), Notification.deleteMany({})
    ]);

    const password = await bcrypt.hash(PASSWORD, 10);
    const demoUsers = [
      { name: 'PathSeeker Demo Administrator', email: 'admin@pathseeker.com', role: 'admin', educationLevel: 'BS Computer Science', institution: 'NUST Islamabad', fieldOfStudy: 'Technology' },
      { name: 'Alex Khan', email: 'alex@student.com', role: 'student', educationLevel: 'ICS', institution: 'Punjab Group of Colleges', fieldOfStudy: 'Technology' },
      { name: 'Sarah Ahmed', email: 'sarah@graduate.com', role: 'graduate', educationLevel: 'BS Computer Science', institution: 'FAST-NUCES Lahore', fieldOfStudy: 'Technology' },
      { name: 'David Malik', email: 'david@pro.com', role: 'professional', educationLevel: 'BS Software Engineering', institution: 'COMSATS Islamabad', fieldOfStudy: 'Technology' }
    ];
    const users = Array.from({ length: 50 }, (_, index) => {
      const demoUser = demoUsers[index];
      const isAdmin = demoUser?.role === 'admin';
      const name = demoUser?.name || `${pick(firstNames, index)} ${pick(lastNames, index + 4)}`;
      const email = demoUser?.email || `demo.user${String(index).padStart(2, '0')}@pathseeker.com`;
      const role = demoUser?.role || roleFor(index);
      return {
        name, email, password, role,
        contact: `+92 300 ${String(1000000 + index).padStart(7, '0')}`,
        avatar: isAdmin ? '' : pick(avatarUrls, index),
        educationLevel: demoUser?.educationLevel || pick(['Matriculation (SSC)', 'F.Sc Pre-Engineering', 'ICS', 'BS Degree', 'MS Degree'], index),
        institution: demoUser?.institution || pick(['NUST Islamabad', 'FAST-NUCES Lahore', 'COMSATS Islamabad', 'UET Lahore', 'IBA Karachi'], index),
        fieldOfStudy: demoUser?.fieldOfStudy || domainFor(index),
        skills: [pick(['Python', 'JavaScript', 'Figma', 'SQL', 'Research'], index), pick(['Communication', 'Leadership', 'Data Analysis', 'Writing'], index + 1)],
        interests: [domainFor(index), pick(['Mentorship', 'Innovation', 'Sustainability', 'Entrepreneurship'], index + 2)],
        workExperience: role === 'professional' ? `${2 + (index % 8)} years across ${domainFor(index)} projects` : ''
      };
    });
    const insertedUsers = await User.insertMany(users);
    const admin = insertedUsers[0];
    const regularUsers = insertedUsers.slice(1);

    const careers = await Career.insertMany(Array.from({ length: 100 }, (_, index) => makeCareer(index)));
    const resources = await Resource.insertMany(Array.from({ length: 70 }, (_, index) => ({ ...makeResource(index), createdBy: admin._id })));
    const multimedia = await Multimedia.insertMany(Array.from({ length: 60 }, (_, index) => ({ ...makeMultimedia(index), createdBy: admin._id })));
    const stories = await SuccessStory.insertMany(Array.from({ length: 48 }, (_, index) => ({ ...makeStory(index), submittedBy: regularUsers[index % regularUsers.length]._id })));

    const quizQuestions = await QuizQuestion.insertMany(Array.from({ length: 12 }, (_, index) => ({
      questionText: pick([
        'Which kind of challenge would you enjoy solving every week?',
        'What type of output gives you the most energy?',
        'How do you prefer to learn a new skill?',
        'Which environment helps your best work happen?'
      ], index),
      type: index % 4 === 0 ? 'likert_scale' : 'single_choice',
      category: pick(['Work Preference', 'Strengths', 'Learning Style', 'Environment'], index),
      timeLimitSeconds: 30 + (index % 3) * 15,
      options: domains.slice(0, 4).map((domain, optionIndex) => ({
        text: `Explore ${domain.toLowerCase()} problems and projects.`,
        domainWeights: { [domain]: 3 + ((index + optionIndex) % 3) }
      }))
    })));

    await QuizResult.insertMany(Array.from({ length: 35 }, (_, index) => {
      const user = regularUsers[index % regularUsers.length];
      const topDomain = domainFor(index);
      return {
        userId: user._id,
        topDomain,
        domainScores: Object.fromEntries(domains.map((domain, domainIndex) => [domain, domain === topDomain ? 80 + (index % 20) : 20 + ((index + domainIndex) % 35)])),
        recommendedCareers: [careers[index % careers.length]._id, careers[(index + 7) % careers.length]._id],
        answers: quizQuestions.slice(0, 4).map((question, questionIndex) => ({ questionId: question._id, selectedOptionIndex: (index + questionIndex) % 4 }))
      };
    }));

    await Feedback.insertMany(Array.from({ length: 45 }, (_, index) => {
      const user = regularUsers[index % regularUsers.length];
      const status = pick(['pending', 'in_review', 'resolved'], index);
      return {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        category: pick(['bug', 'suggestion', 'query', 'general'], index),
        subject: pick(['Helpful career filters', 'Question about my quiz result', 'Resource download issue', 'Suggestion for the dashboard'], index),
        message: `Demo feedback from ${user.name} about improving the PathSeeker experience.`,
        sentiment: pick(['Positive', 'Neutral', 'Constructive', 'Urgent'], index),
        status,
        adminResponse: status === 'resolved' ? 'Thanks for the thoughtful note. This has been reviewed by the PathSeeker team.' : ''
      };
    }));

    await Bookmark.insertMany(Array.from({ length: 80 }, (_, index) => {
      const user = regularUsers[index % regularUsers.length];
      const itemType = pick(['career', 'multimedia', 'resource', 'story'], index);
      const source = itemType === 'career' ? careers[index % careers.length] : itemType === 'multimedia' ? multimedia[index % multimedia.length] : itemType === 'resource' ? resources[index % resources.length] : stories[index % stories.length];
      return {
        userId: user._id,
        itemType,
        itemId: source._id,
        title: source.title || source.role,
        subtitle: source.domain || source.type || 'Career inspiration',
        stickyNote: pick(['Review this on Sunday', 'Ask a mentor about this path', 'Add this skill to my plan', 'Great reference for my portfolio'], index),
        category: pick(['Priority', 'Career Ideas', 'Learning', 'Inspiration'], index)
      };
    }));

    await Notification.insertMany(Array.from({ length: 75 }, (_, index) => ({
      userId: regularUsers[index % regularUsers.length]._id,
      title: pick(['New career match', 'Resource spotlight', 'Feedback update', 'PathSeeker announcement'], index),
      message: pick(['Your profile has a new recommended career match.', 'A new guide was added to the resource room.', 'An admin responded to your feedback ticket.', 'Your weekly career exploration summary is ready.'], index),
      type: pick(['feedback_reply', 'announcement', 'quiz_recommendation', 'system'], index),
      isRead: index % 3 === 0
    })));

    console.log('Demo database populated successfully.');
    console.log(JSON.stringify({ users: insertedUsers.length, careers: careers.length, resources: resources.length, multimedia: multimedia.length, successStories: stories.length, quizQuestions: quizQuestions.length, quizResults: 35, feedback: 45, bookmarks: 80, notifications: 75 }, null, 2));
    console.log(`Demo password for every account: ${PASSWORD}`);
    console.log('Admin login: admin@pathseeker.com');
  } catch (error) {
    console.error('Demo seeder failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedDemoData();
