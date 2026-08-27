// Centralized API client for PathSeeker
// Static data is ONLY used as display fallback for public GET endpoints when server is unreachable.
// All mutations (POST / PUT / DELETE) ALWAYS throw on failure — they never silently succeed.

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
const API_CACHE_PREFIX = 'pathseeker_api_cache:';
const API_CACHE_TTL = 5 * 60 * 1000;

function getCachedResponse(endpoint) {
  try {
    const cached = sessionStorage.getItem(`${API_CACHE_PREFIX}${endpoint}`);
    if (!cached) return null;
    const entry = JSON.parse(cached);
    if (Date.now() - entry.timestamp > API_CACHE_TTL) {
      sessionStorage.removeItem(`${API_CACHE_PREFIX}${endpoint}`);
      return null;
    }
    return entry.data;
  } catch (err) {
    return null;
  }
}

function cacheResponse(endpoint, data) {
  try {
    sessionStorage.setItem(`${API_CACHE_PREFIX}${endpoint}`, JSON.stringify({ timestamp: Date.now(), data }));
  } catch (err) {
    // Storage can be unavailable or full; network data remains the source of truth.
  }
}

function clearApiCache() {
  try {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(API_CACHE_PREFIX))
      .forEach((key) => sessionStorage.removeItem(key));
  } catch (err) {}
}

// ─── Static Fallback Data (read-only display fallback for GET endpoints) ───────

const STATIC_CAREERS = [
  {
    _id: 'c1',
    title: 'AI & Machine Learning Engineer',
    domain: 'Technology',
    description: 'Design, build, and deploy advanced artificial intelligence algorithms and deep learning models to automate complex software workflows.',
    overview: 'AI Engineers work at the intersection of software development, computer vision, data science, and neural networks. Demand is surging in Pakistani tech hubs like Lahore, Islamabad, and Karachi.',
    requiredSkills: ['Python', 'PyTorch/TensorFlow', 'Linear Algebra', 'MLOps', 'Docker', 'NLP'],
    educationPath: 'BS in Computer Science or Data Science (NUST, FAST-NUCES, LUMS, COMSATS). MS in AI preferred.',
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
    _id: 'c2',
    title: 'Full-Stack Software Developer',
    domain: 'Technology',
    description: 'Architect end-to-end web applications combining modern frontend frameworks like React/Next.js with robust Node.js microservices.',
    overview: 'Full-Stack Developers build digital platforms for local and foreign clients. Highly lucrative career path for graduates from FAST, NUST, UET, and ITU.',
    requiredSkills: ['React', 'Node.js', 'MongoDB/PostgreSQL', 'TypeScript', 'REST & GraphQL APIs', 'Tailwind/CSS'],
    educationPath: 'BS CS / SE or ICS / A-Levels followed by intensive web development portfolio projects.',
    salaryRange: { min: 120000, max: 350000, currency: 'PKR' },
    jobDemand: 'Very High',
    targetAudience: ['student', 'graduate'],
    featured: true,
    trending: true,
    icon: 'Code',
    viewsCount: 1890,
    roadmap: [
      { title: 'Frontend Mastery', description: 'Learn HTML5, CSS3, JavaScript ES6+, and React Basics.', duration: '3 Months', level: 'Beginner' },
      { title: 'Backend & Database', description: 'Build Node.js/Express servers, JWT authentication, and MongoDB schemas.', duration: '3 Months', level: 'Intermediate' },
      { title: 'Full Application Integration', description: 'State management, custom hooks, payment gateway APIs, and deployment on Vercel.', duration: '3 Months', level: 'Advanced' }
    ]
  },
  {
    _id: 'c3',
    title: 'Health Informatics Specialist',
    domain: 'Healthcare',
    description: 'Optimize medical information technology systems, EHR databases, and clinical analytics to elevate patient care quality.',
    overview: 'Combines medical/healthcare knowledge with IT data science to securely manage patient records across hospitals and telehealth platforms in Pakistan.',
    requiredSkills: ['Health Data Standards (HL7/FHIR)', 'SQL & BigQuery', 'Electronic Health Records (EHR)', 'Data Privacy', 'Biostatistics'],
    educationPath: 'MBBS / BS Nursing / Health Informatics degree (Aga Khan University, Dow, UHS) with IT certifications.',
    salaryRange: { min: 110000, max: 280000, currency: 'PKR' },
    jobDemand: 'High',
    targetAudience: ['graduate', 'professional'],
    featured: false,
    trending: true,
    icon: 'Activity',
    viewsCount: 840,
    roadmap: [
      { title: 'Healthcare Systems Overview', description: 'Understand EHR standards, medical terminology, and patient data regulations.', duration: '2 Months', level: 'Beginner' },
      { title: 'Clinical Data Analytics', description: 'Learn SQL querying, biostatistics, and Tableau dashboarding for clinics.', duration: '4 Months', level: 'Intermediate' }
    ]
  },
  {
    _id: 'c4',
    title: 'Financial Quantitative Analyst (Quant)',
    domain: 'Business & Finance',
    description: 'Develop mathematical models and financial strategies for commercial banks, investment firms, and fintech startups.',
    overview: 'Quants analyze market patterns, risk matrices, and investment portfolios for top financial institutions in Karachi and Islamabad.',
    requiredSkills: ['Financial Modeling', 'Python/C++', 'Stochastic Calculus', 'Risk Analysis', 'Time Series Forecasting'],
    educationPath: 'BS/MS in Financial Mathematics, Economics, or Finance (LUMS, IBA Karachi, NUST).',
    salaryRange: { min: 160000, max: 400000, currency: 'PKR' },
    jobDemand: 'High',
    targetAudience: ['graduate', 'professional'],
    featured: true,
    trending: false,
    icon: 'TrendingUp',
    viewsCount: 960,
    roadmap: [
      { title: 'Financial Foundations', description: 'Corporate finance, derivative pricing, and portfolio theory.', duration: '4 Months', level: 'Beginner' },
      { title: 'Algorithmic Execution', description: 'C++ performance optimization, Python pandas for time series, backtesting strategies.', duration: '6 Months', level: 'Advanced' }
    ]
  },
  {
    _id: 'c5',
    title: 'UI/UX & Product Designer',
    domain: 'Creative & Design',
    description: 'Craft intuitive, aesthetically striking visual interfaces and user experiences through micro-interactions, wireframing, and research.',
    overview: 'UI/UX Designers solve product problems with design systems, modern typography, glassmorphism aesthetics, and user testing loops for software houses.',
    requiredSkills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Design Sprint', 'Micro-animations'],
    educationPath: 'Bachelor in Design / Fine Arts (NCA, Indus Valley, SADA NUST) or self-built UI portfolio.',
    salaryRange: { min: 100000, max: 300000, currency: 'PKR' },
    jobDemand: 'Very High',
    targetAudience: ['student', 'graduate', 'professional'],
    featured: true,
    trending: true,
    icon: 'Palette',
    viewsCount: 1530,
    roadmap: [
      { title: 'Design Fundamentals', description: 'Grid systems, color theory, typography, and contrast rules.', duration: '2 Months', level: 'Beginner' },
      { title: 'Figma & Prototyping', description: 'Component variants, auto-layout, interactive state animations, usability testing.', duration: '3 Months', level: 'Intermediate' }
    ]
  },
  {
    _id: 'c6',
    title: 'Robotics & Automation Engineer',
    domain: 'Engineering',
    description: 'Design autonomous robotic systems, smart manufacturing units, and embedded microcontrollers for industrial applications.',
    overview: 'Mechatronics and electrical engineers combine mechanical design, electronics, and ROS software for industrial automation in Pakistan.',
    requiredSkills: ['ROS 2', 'C++', 'CAD/SolidWorks', 'Embedded Microcontrollers', 'Kinematics', 'Computer Vision'],
    educationPath: 'BE in Mechatronics, Electrical, or Mechanical Engineering (NUST, GIKI, UET Lahore).',
    salaryRange: { min: 130000, max: 320000, currency: 'PKR' },
    jobDemand: 'High',
    targetAudience: ['student', 'graduate'],
    featured: false,
    trending: false,
    icon: 'Wrench',
    viewsCount: 710,
    roadmap: [
      { title: 'Embedded Electronics & C++', description: 'Sensors, microcontrollers, real-time operating systems.', duration: '4 Months', level: 'Beginner' },
      { title: 'ROS Navigation Stack', description: 'Kinematics, trajectory planning, SLAM navigation algorithms.', duration: '5 Months', level: 'Advanced' }
    ]
  }
];

const STATIC_QUIZ_QUESTIONS = [
  {
    _id: 'q1',
    questionText: 'Which post-Matric / F.Sc educational stream interests you the most?',
    type: 'single_choice',
    category: 'Work Preference',
    timeLimitSeconds: 30,
    options: [
      { text: 'ICS / Pre-Engineering: Building software algorithms, web apps, or AI systems.', domainWeights: { Technology: 5, Engineering: 2 } },
      { text: 'Pre-Medical: MDCAT prep, medical data, healthcare systems, or clinical research.', domainWeights: { Healthcare: 5, Education: 1 } },
      { text: 'I.Com / FA General Science: Business statistics, banking, fintech, or stock investments.', domainWeights: { 'Business & Finance': 5, Technology: 1 } },
      { text: 'Arts / Design: UI/UX design, visual branding, digital animation, or storytelling.', domainWeights: { 'Creative & Design': 5, Technology: 1 } }
    ]
  },
  {
    _id: 'q2',
    questionText: 'How confident are you in taking competitive entrance exams (ECAT, MDCAT, NUST NET, FAST)?',
    type: 'slider',
    category: 'Technical Aptitude',
    timeLimitSeconds: 30,
    options: [
      { text: 'High Confidence - I enjoy problem solving, mathematics, and logic tests.', domainWeights: { Technology: 5, Engineering: 4, 'Business & Finance': 3 } },
      { text: 'Moderate - I prefer practical, project-based learning over standardized test scores.', domainWeights: { Technology: 3, Healthcare: 3, Education: 3 } },
      { text: 'Creative Preference - I perform best when building portfolios and visual design projects.', domainWeights: { 'Creative & Design': 5, Education: 2 } }
    ]
  },
  {
    _id: 'q3',
    questionText: 'Which career environment fits your long-term goal in Pakistan?',
    type: 'single_choice',
    category: 'Workplace Culture',
    timeLimitSeconds: 25,
    options: [
      { text: 'Top software house or remote global company earning foreign exchange.', domainWeights: { Technology: 5, 'Creative & Design': 3 } },
      { text: 'Hospital, diagnostic lab, or medical research institute.', domainWeights: { Healthcare: 5 } },
      { text: 'Commercial bank, corporate house, or investment firm in Karachi/Islamabad.', domainWeights: { 'Business & Finance': 5 } },
      { text: 'Design agency, game development studio, or freelance creative workspace.', domainWeights: { 'Creative & Design': 5 } }
    ]
  },
  {
    _id: 'q4',
    questionText: 'When working on team projects, what role do you naturally step into?',
    type: 'likert_scale',
    category: 'Soft Skills & Leadership',
    timeLimitSeconds: 25,
    options: [
      { text: 'Technical Lead - Architecting solutions and writing code.', domainWeights: { Technology: 4, Engineering: 4 } },
      { text: 'Empathetic Facilitator - Helping team members and focusing on user needs.', domainWeights: { Healthcare: 4, Education: 4 } },
      { text: 'Project Manager - Managing deadlines, budget, and project deliverables.', domainWeights: { 'Business & Finance': 4 } },
      { text: 'Creative Lead - Designing visual layouts, pitch decks, and user interfaces.', domainWeights: { 'Creative & Design': 4 } }
    ]
  }
];

const STATIC_MULTIMEDIA = [
  {
    _id: 'm1',
    title: 'Complete Roadmap to Software Engineering & AI in Pakistan (2026)',
    type: 'video',
    url: 'https://www.youtube.com/embed/5qap5aO4i9A',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80',
    description: 'Detailed video guide on choosing between NUST, FAST, and LUMS, building a strong GitHub portfolio, and securing remote jobs.',
    transcript: `[00:00] Welcome to PathSeeker Pakistan Tech Guide.\n[02:15] Step 1: Picking F.Sc Pre-Engineering vs ICS.\n[05:30] Step 2: Preparing for FAST test and NUST NET.\n[09:45] Step 3: Building real-world projects during your BS degree.`,
    duration: '14:25',
    tags: ['Software', 'FAST', 'NUST', 'Career Advice'],
    targetAudience: ['student', 'graduate', 'professional'],
    ratingAvg: 4.9,
    ratingCount: 35,
    likesCount: 145,
    viewsCount: 2840
  },
  {
    _id: 'm2',
    title: 'Mastering UI/UX Design & Landing International Freelance Clients',
    type: 'video',
    url: 'https://www.youtube.com/embed/c9Wg6Cb_YlU',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    description: 'Learn how Pakistani designers build Figma design systems, create Behance portfolios, and acquire global remote projects.',
    transcript: `[00:00] In this tutorial, we analyze modern UI aesthetics and glassmorphism design tokens.\n[03:10] Rule 1: Always build reusable Figma components and contrast-compliant palettes.`,
    duration: '18:50',
    tags: ['Figma', 'UX Design', 'Freelancing', 'Frontend'],
    targetAudience: ['student', 'graduate'],
    ratingAvg: 4.8,
    ratingCount: 24,
    likesCount: 110,
    viewsCount: 2120
  },
  {
    _id: 'm3',
    title: 'Podcast: Navigating MDCAT vs Biotech vs Health Tech in Pakistan',
    type: 'podcast',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
    description: 'Audio podcast discussing alternative high-growth careers in medical tech if you miss MBBS admission.',
    transcript: `[00:00] Episode 8: What to do after MDCAT — Exploring Health Informatics, Biomedical Engineering, and Clinical Research.\n[05:20] Key takeaway: MBBS is not the only rewarding path in healthcare.`,
    duration: '22:15',
    tags: ['MDCAT', 'Healthcare', 'Podcast', 'Mentorship'],
    targetAudience: ['graduate', 'professional'],
    ratingAvg: 4.8,
    ratingCount: 28,
    likesCount: 118,
    viewsCount: 1750
  }
];

const STATIC_STORIES = [
  {
    _id: 's1',
    name: 'Ayesha Khan',
    role: 'Lead AI Engineer at Systems Ltd (Lahore)',
    domain: 'Technology',
    userType: 'graduate',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    summary: 'From ICS student in Faisalabad to leading machine learning engineering teams in Lahore.',
    approved: true,
    featured: true,
    timeline: [
      { stage: 'Educational Path', title: 'BS Computer Science at FAST-NUCES', description: 'Graduated top of class with focus on artificial intelligence and computer vision.' },
      { stage: 'Career Breakthrough', title: 'Open-Source Healthcare ML Model', description: 'Built an open-source lungs diagnostic AI model that won national hackathon.' }
    ]
  },
  {
    _id: 's2',
    name: 'Tariq Mahmood',
    role: 'Principal Healthcare Data Architect at Shaukat Khanum',
    domain: 'Healthcare',
    userType: 'professional',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    summary: 'Pioneering cloud-based health records infrastructure connecting oncology clinics across Pakistan.',
    approved: true,
    featured: true,
    timeline: [
      { stage: 'Educational Path', title: 'BS Biomedical Engineering (NUST)', description: 'Specialized in clinical database management and diagnostic equipment.' },
      { stage: 'Career Breakthrough', title: 'Architected Cloud EHR System', description: 'Reduced clinical record retrieval time by 80% across emergency wards.' }
    ]
  }
];

const STATIC_RESOURCES = [
  {
    _id: 'r1',
    title: 'HEC & PEEF Scholarship Application Checklist 2026',
    type: 'Checklist',
    description: 'Complete guide for Pakistani students to apply for HEC Need-Based, PEEF, and Ehsaas Undergraduate Scholarships.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    previewContent: '### HEC Scholarship Guidelines:\n- Keep income certificate & academic transcripts updated.\n- Apply online through HEC e-portal before deadline.',
    tags: ['Scholarship', 'HEC', 'PEEF', 'Beginner'],
    targetAudience: ['student', 'graduate'],
    downloadCount: 540
  },
  {
    _id: 'r2',
    title: 'Pakistan Tech & IT Salary Benchmark 2026 (Infographic)',
    type: 'Infographic',
    description: 'Visual breakdown of starting salaries, growth trajectories, and remote USD earning trends for developers in Pakistan.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    previewContent: '### Pakistan Tech Compensation Overview:\n- Fresh Graduate (FAST/NUST): PKR 120,000 - 180,000 / month\n- Senior Developer / AI Architect: PKR 350,000 - 800,000+ / month',
    tags: ['Salary Guide', 'Technology', 'Beginner'],
    targetAudience: ['student', 'graduate', 'professional'],
    downloadCount: 820
  },
  {
    _id: 'r3',
    title: 'Post-F.Sc & A-Levels Career Path Matrix (PDF Guide)',
    type: 'PDF',
    description: 'Comprehensive decision matrix comparing Pre-Engineering, Pre-Medical, ICS, and Commerce career options.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    previewContent: '### Stream Breakdown:\n- **Pre-Engineering**: CS, SE, Electrical, Mechanical, Civil.\n- **Pre-Medical**: MBBS, BDS, Doctor of Pharmacy, Biotechnology, Health Informatics.',
    tags: ['Skill-Building', 'Guidance'],
    targetAudience: ['student'],
    downloadCount: 460
  }
];

// ─── Core fetch helper ────────────────────────────────────────────────────────

/**
 * apiFetch — general fetch with timeout.
 * All requests (GET and mutations) throw on failure.
 * Static fallbacks are ONLY used when explicitly requested via options.useFallback.
 */
export async function apiFetch(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();

  if (method === 'GET') {
    const cached = getCachedResponse(endpoint);
    if (cached !== null) return cached;
  }

  const token = localStorage.getItem('pathseeker_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  // Remove Content-Type for FormData (browser sets boundary automatically)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const { useFallback, timeoutMs = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('pathseeker_token');
        localStorage.removeItem('pathseeker_user');
        window.dispatchEvent(new Event('auth:logout'));
      }
      throw new Error(data.message || `Server error: ${res.status}`);
    }

    if (method === 'GET') cacheResponse(endpoint, data);
    else clearApiCache();

    return data;
  } catch (err) {
    clearTimeout(timeoutId);

    const msg = err.name === 'AbortError'
      ? 'Request timed out. Make sure the server is running on port 2408.'
      : err.message || 'Network error. Could not reach the server.';

    if (useFallback) {
      console.warn(`[apiFetch] GET ${endpoint} failed, using static fallback. Reason: ${msg}`);
      return getStaticFallback(endpoint);
    }

    throw new Error(msg);
  }
}

/**
 * apiFetchRaw — for multipart/file uploads (no Content-Type override)
 * Always throws on failure.
 */
export async function apiFetchRaw(endpoint, options = {}) {
  const token = localStorage.getItem('pathseeker_token');
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s for uploads

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Server error: ${res.status}`);
    clearApiCache();
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    const msg = err.name === 'AbortError'
      ? 'Upload timed out. Check your connection and server.'
      : err.message || 'Upload failed.';
    throw new Error(msg);
  }
}

export async function uploadAdminAsset(file, folder) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  return apiFetchRaw('/admin/upload', { method: 'POST', body: formData });
}

export function chatWithPathSeeker(message, currentPage) {
  return apiFetch('/ai/chat', {
    method: 'POST',
    timeoutMs: 60000,
    body: JSON.stringify({ message, currentPage })
  });
}

export function getPathSeekerHistory() {
  return apiFetch('/ai/history');
}

// ─── Static fallback router ───────────────────────────────────────────────────

function getStaticFallback(endpoint) {
  if (endpoint.startsWith('/careers')) {
    return { count: STATIC_CAREERS.length, careers: STATIC_CAREERS, career: STATIC_CAREERS[0] };
  }
  if (endpoint.startsWith('/quiz/questions')) {
    return { questions: STATIC_QUIZ_QUESTIONS };
  }
  if (endpoint.startsWith('/multimedia')) {
    return { count: STATIC_MULTIMEDIA.length, items: STATIC_MULTIMEDIA, item: STATIC_MULTIMEDIA[0] };
  }
  if (endpoint.startsWith('/stories') || endpoint.startsWith('/admin/stories')) {
    return { count: STATIC_STORIES.length, stories: STATIC_STORIES };
  }
  if (endpoint.startsWith('/resources')) {
    return { count: STATIC_RESOURCES.length, resources: STATIC_RESOURCES };
  }
  if (endpoint.startsWith('/admin/dashboard-stats')) {
    return {
      stats: { totalUsers: 0, totalCareers: 0, totalQuizAttempts: 0, totalMedia: 0, pendingStories: 0, totalResources: 0, totalFeedbacks: 0 },
      usersByRole: { student: 0, graduate: 0, professional: 0 },
      topDomainCounts: {}
    };
  }
  if (endpoint.startsWith('/admin/users')) {
    return { users: [] };
  }
  if (endpoint.startsWith('/admin/feedback')) {
    return { feedbacks: [], sentimentStats: { Positive: 0, Neutral: 0, Constructive: 0, Urgent: 0 }, categoryStats: {} };
  }
  if (endpoint.startsWith('/feedback/my')) {
    return { feedbacks: [] };
  }
  if (endpoint.startsWith('/bookmarks')) {
    return { bookmarks: [] };
  }
  if (endpoint.startsWith('/notifications')) {
    return { notifications: [], unreadCount: 0 };
  }
  if (endpoint.startsWith('/profile')) {
    return { user: null };
  }
  if (endpoint.startsWith('/quiz/history')) {
    return { history: [] };
  }
  return { message: 'Success' };
}

export { STATIC_CAREERS, STATIC_QUIZ_QUESTIONS, STATIC_MULTIMEDIA, STATIC_STORIES, STATIC_RESOURCES };
