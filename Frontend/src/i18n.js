// i18n — minimal i18n stub. English only for the hackathon.
//
// Usage:
//   import { t } from '../i18n';
//   <h1>{t('home.title')}</h1>

const en = {
  app: {
    name: 'PathSeeker',
    tagline: 'From Curiosity to Career',
    systemName: 'Career Passport'
  },
  nav: {
    careers: 'Careers',
    stories: 'Stories',
    resources: 'Resources',
    dashboard: 'Dashboard',
    profile: 'Profile',
    logout: 'Sign out'
  },
  home: {
    kicker: 'Career Passport · TechWiz 6',
    titleLead: 'Decode your future',
    titleSpan: 'in 5 minutes',
    lede: 'Stop guessing. Start mapping. PathSeeker turns the chaos of "what to do after Matric or F.Sc" into one clear next step — with a 90-day action plan you can start today.',
    primaryCta: 'Start free quiz',
    secondaryCta: 'Explore careers',
    trustLine: 'No credit card · Mobile-ready · Built for Pakistan',
    statStudents: 'Active students',
    statCareers: 'Career profiles',
    statStories: 'Success stories',
    statResources: 'Free resources',
    audienceTitle: 'Pick the door that fits you',
    audienceLede: 'Three stages, three passports. Each one tailored to the decision you actually have to make.',
    toolsTitle: 'Three tools, one decision',
    toolsLede: 'Everything you need to go from "I have no idea" to "I know my next step."',
    ctaTitle: 'Ready to decode your future?',
    ctaLede: 'Free forever. No spam. No paid counsellors.'
  },
  quiz: {
    title: 'AI Interest Quiz',
    lede: '10 questions. About 5 minutes. 1 honest recommendation.',
    submit: 'See my recommendation',
    retake: 'Retake quiz',
    backToDashboard: 'Back to dashboard'
  },
  decisionHelper: {
    title: 'Decision Helper',
    lede: 'Compare two careers side-by-side. No more "I wish I had known."',
    pickFirst: 'Pick the first career',
    pickSecond: 'Pick the second career',
    compare: 'Compare',
    salary: 'Salary band',
    growth: '5-year growth',
    studyTime: 'Total study time',
    goAbroad: 'Go-abroad potential',
    pkReady: 'Pakistan-ready',
    workLife: 'Work-life balance',
    risk: 'Risk level',
    flexibility: 'Location flexibility',
    govtSchemes: 'Govt. schemes available',
    skillsOverlap: 'Skill overlap with my profile',
    finalVerdict: 'Verdict'
  },
  empty: {
    noBookmarks: 'No bookmarks yet',
    noBookmarksHint: 'Tap the bookmark icon on any career, multimedia, or resource and it will appear here.',
    noFeedback: 'No feedback yet',
    noFeedbackHint: 'You can submit your first feedback from this page.',
    noNotifications: 'No new notifications',
    noNotificationsHint: 'We will let you know when admins respond to your feedback or new careers are added.'
  }
};

const dict = { en };

export function t(key, locale = 'en') {
  const segs = key.split('.');
  let node = dict[locale] || dict.en;
  for (const seg of segs) {
    if (node && typeof node === 'object' && seg in node) node = node[seg];
    else return key; // graceful fallback
  }
  return typeof node === 'string' ? node : key;
}

export const supportedLocales = Object.keys(dict);

