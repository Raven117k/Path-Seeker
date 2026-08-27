const dns = require('dns');
// Force Google DNS / Cloudflare DNS for SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

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

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB Atlas Cloud Cluster...');
    await connectDb();

    console.log('Clearing existing database collections on Atlas...');
    await User.deleteMany({});
    await Career.deleteMany({});
    await QuizQuestion.deleteMany({});
    await QuizResult.deleteMany({});
    await Multimedia.deleteMany({});
    await SuccessStory.deleteMany({});
    await Resource.deleteMany({});
    await Feedback.deleteMany({});
    await Bookmark.deleteMany({});
    await Notification.deleteMany({});

    console.log('Seeding demo users to MongoDB Atlas...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await User.create({
      name: 'PathSeeker Administrator',
      email: 'admin@pathseeker.com',
      password: hashedPassword,
      contact: '+92 300 0000001',
      role: 'admin',
      educationLevel: 'Master Degree',
      institution: 'Aptech Tech Academy',
      fieldOfStudy: 'System Architecture'
    });

    const student = await User.create({
      name: 'Alex Johnson',
      email: 'alex@student.com',
      password: hashedPassword,
      contact: '+92 300 0000002',
      role: 'student',
      educationLevel: 'Undergraduate',
      institution: 'State Tech University',
      fieldOfStudy: 'Computer Science',
      skills: ['JavaScript', 'Python', 'HTML/CSS'],
      interests: ['Artificial Intelligence', 'Web Design', 'Data Visualization']
    });

    const graduate = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@graduate.com',
      password: hashedPassword,
      contact: '+92 300 0000003',
      role: 'graduate',
      educationLevel: 'Bachelor Degree',
      institution: 'City Business College',
      fieldOfStudy: 'Digital Marketing & Analytics',
      skills: ['SEO', 'React.js', 'Content Strategy', 'Google Analytics'],
      interests: ['Product Management', 'UX Design', 'Startups']
    });

    const professional = await User.create({
      name: 'David Miller',
      email: 'david@pro.com',
      password: hashedPassword,
      contact: '+92 300 0000004',
      role: 'professional',
      educationLevel: 'Master Degree',
      institution: 'Metropolitan University',
      fieldOfStudy: 'Biomedical Engineering',
      workExperience: '5 years as Healthcare Systems Analyst',
      skills: ['Python', 'SQL', 'Clinical Data Systems', 'Team Leadership'],
      interests: ['AI in Healthcare', 'HealthTech Innovations', 'Executive Management']
    });

    console.log('Seeding Careers Bank to Atlas...');
    const careers = await Career.create([
      {
        title: 'AI & Machine Learning Engineer',
        domain: 'Technology',
        description: 'Design, build, and deploy advanced artificial intelligence algorithms and deep learning models to automate complex workflows.',
        overview: 'AI Engineers work at the intersection of software development, computer vision, data science, and neural networks.',
        requiredSkills: ['Python', 'PyTorch/TensorFlow', 'Linear Algebra', 'MLOps', 'Docker', 'NLP'],
        educationPath: 'Bachelor’s degree in Computer Science, Data Science, or Applied Mathematics.',
        salaryRange: { min: 150000, max: 450000, currency: 'PKR' },
        jobDemand: 'Explosive Growth',
        targetAudience: ['student', 'graduate', 'professional'],
        featured: true,
        trending: true,
        icon: 'Cpu',
        viewsCount: 1420,
        roadmap: [
          { title: 'Foundations', description: 'Master Python, Object-Oriented Programming, and Data Structures.', duration: '3 Months', level: 'Beginner' },
          { title: 'Data Science & Math', description: 'Study Linear Algebra, Calculus, Statistics, NumPy, and Pandas.', duration: '4 Months', level: 'Intermediate' },
          { title: 'Deep Learning & Frameworks', description: 'Train Neural Networks with PyTorch, Scikit-Learn, and Transformers.', duration: '5 Months', level: 'Intermediate' },
          { title: 'MLOps & Deployment', description: 'Deploy models using Docker, FastAPI, and Cloud Infrastructure.', duration: '3 Months', level: 'Advanced' }
        ]
      },
      {
        title: 'Full-Stack Software Developer',
        domain: 'Technology',
        description: 'Architect end-to-end web applications combining modern frontend frameworks like React/Next.js with robust Node.js microservices.',
        overview: 'Full-Stack Developers are versatile problem solvers capable of handling database schemas, API development, and responsive glassmorphism UI design.',
        requiredSkills: ['React', 'Node.js', 'MongoDB/PostgreSQL', 'TypeScript', 'REST & GraphQL APIs', 'Tailwind/CSS'],
        educationPath: 'Bachelor’s degree in CS/IT or intensive full-stack coding bootcamp with hands-on portfolio projects.',
        salaryRange: { min: 120000, max: 350000, currency: 'PKR' },
        jobDemand: 'Very High',
        targetAudience: ['student', 'graduate'],
        featured: true,
        trending: true,
        icon: 'Code',
        viewsCount: 1890,
        roadmap: [
          { title: 'Frontend Mastery', description: 'Learn HTML5, CSS3, JavaScript ES6+, and React Basics.', duration: '3 Months', level: 'Beginner' },
          { title: 'Backend & Database', description: 'Build Node.js/Express servers, JWT authentication, and MongoDB schemas.', duration: '3 Months', level: 'Intermediate' }
        ]
      },
      {
        title: 'Health Informatics Specialist',
        domain: 'Healthcare',
        description: 'Optimize medical information technology systems, EHR databases, and clinical analytics to elevate patient care quality.',
        overview: 'Combines clinical knowledge with IT data science to securely manage patient records, HIPAA compliance, and predictive health monitoring.',
        requiredSkills: ['Health Data Standards (HL7/FHIR)', 'SQL & BigQuery', 'Electronic Health Records (EHR)', 'Data Privacy', 'Biostatistics'],
        educationPath: 'Degree in Health Informatics, Nursing Science, IT, or Health Administration with technical certification.',
        salaryRange: { min: 110000, max: 280000, currency: 'PKR' },
        jobDemand: 'High',
        targetAudience: ['graduate', 'professional'],
        featured: false,
        trending: true,
        icon: 'Activity',
        viewsCount: 840,
        roadmap: [
          { title: 'Healthcare Systems Overview', description: 'Understand EHR standards, medical terminology, and HIPAA regulation.', duration: '2 Months', level: 'Beginner' }
        ]
      }
    ]);

    console.log('Seeding AI Interest Quiz questions to Atlas...');
    await QuizQuestion.create([
      {
        questionText: 'What kind of daily challenges motivate you the most?',
        type: 'single_choice',
        category: 'Work Preference',
        timeLimitSeconds: 30,
        options: [
          { text: 'Building software algorithms, automation tools, or dynamic websites.', domainWeights: { Technology: 5, Engineering: 2 } },
          { text: 'Analyzing biological data, health trends, or helping patients directly.', domainWeights: { Healthcare: 5, Education: 1 } },
          { text: 'Analyzing market statistics, managing budgets, or evaluating investment risks.', domainWeights: { 'Business & Finance': 5, Technology: 1 } },
          { text: 'Creating visual brand aesthetics, UI layouts, or multimedia storytelling.', domainWeights: { 'Creative & Design': 5, Technology: 1 } }
        ]
      }
    ]);

    console.log('MongoDB Atlas Cloud seeding completed successfully!');
    console.log('----------------------------------------------------');
    console.log('DEMO ACCOUNTS READY ON ATLAS (Password: password123)');
    console.log('Admin Account: admin@pathseeker.com');
    console.log('Student Account: alex@student.com');
    console.log('Graduate Account: sarah@graduate.com');
    console.log('Professional Account: david@pro.com');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seeder Failed:', error.message);
    process.exit(1);
  }
};

seedData();
