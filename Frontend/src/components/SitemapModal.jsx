import { useAuth } from '../context/AuthContext';
import { X, Map, UserCheck, Shield, ChevronRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SitemapModal() {
  const { sitemapOpen, setSitemapOpen } = useAuth();

  if (!sitemapOpen) return null;

  const sitemapData = [
    {
      title: '1. Guest Site (Public Access)',
      icon: Compass,
      color: 'var(--accent-cyan)',
      routes: [
        { name: 'Home Landing Page', path: '/', desc: 'Hero section, Career Passport preview, dynamic statistics & sitemap trigger' },
        { name: 'Career Bank Preview', path: '/careers', desc: 'Browse global job roles, search by domain, filter by salary & demand' },
        { name: 'Success Stories Hub', path: '/stories', desc: 'Read inspiring graduate & professional career path timelines' },
        { name: 'Document Library Preview', path: '/resources', desc: 'Explore downloadable checklists, PDFs, and infographics' },
        { name: 'Auth Portal & OTP Simulation', path: '#auth', desc: 'Role-based registration (Student/Graduate/Pro) & password recovery' }
      ]
    },
    {
      title: '2. User Panel (Role-Tailored)',
      icon: UserCheck,
      color: 'var(--accent-primary)',
      routes: [
        { name: 'Personalized Dashboard', path: '/user/dashboard', desc: 'Role greetings, trending career widgets, quiz results, & activity tracking' },
        { name: 'AI Interest Quiz & Recommendation Engine', path: '/user/quiz', desc: 'Timed questions, sliders, Likert scales, domain scoring & stream auto-suggestions' },
        { name: 'Decision Helper', path: '/user/decision-helper', desc: 'Compare two careers across salary, growth, study time, Pakistan readiness, and scheme access' },
        { name: 'Interactive Multimedia Center', path: '/user/multimedia', desc: 'Video player & audio podcasts with transcript toggle & 5-star rating system' },
        { name: 'Bookmarks & Sticky Notes Board', path: '/user/bookmarks', desc: 'Save careers, resources, and add personal sticky notes with PDF export' },
        { name: 'Feedback & Enquiries Form', path: '/user/feedback', desc: 'Submit bug reports, suggestions, query tickets with live response status' },
        { name: 'User Profile & Resume Uploader', path: '/user/profile', desc: 'Manage skills, education history, interests, and upload PDF resume' }
      ]
    },
    {
      title: '3. Admin Control Panel (Restricted)',
      icon: Shield,
      color: 'var(--accent-amber)',
      routes: [
        { name: 'Admin Overview & Analytics Dashboard', path: '/admin', desc: 'Usage stats, quiz attempt charts, feedback sentiment breakdown' },
        { name: 'User Management', path: '/admin/users', desc: 'View registered users, change roles, toggle active status' },
        { name: 'Career Profiles Manager', path: '/admin/careers', desc: 'Full CRUD manager for career cards, salary ranges & roadmaps' },
        { name: 'Quiz Question Bank Editor', path: '/admin/quiz', desc: 'Manage quiz questions, time limits & domain weight scoring' },
        { name: 'Story Submissions Approvals', path: '/admin/stories', desc: 'Review, approve, or feature user-submitted career success stories' },
        { name: 'Feedback Inbox & System Announcer', path: '/admin/feedback', desc: 'Respond to user tickets & broadcast in-app notifications' }
      ]
    }
  ];

  return (
    <div className="modal-overlay" onClick={() => setSitemapOpen(false)}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '850px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', pb: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Map size={22} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>PathSeeker Interactive Sitemap</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SRS Section 1.9 Architectural Flow Map</p>
            </div>
          </div>
          <button onClick={() => setSitemapOpen(false)} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {sitemapData.map((section, idx) => {
            const IconComp = section.icon;
            return (
              <div key={idx} style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <IconComp size={20} color={section.color} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: section.color }}>{section.title}</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                  {section.routes.map((route, rIdx) => (
                    <Link
                      key={rIdx}
                      to={route.path.startsWith('#') ? '/' : route.path}
                      onClick={() => setSitemapOpen(false)}
                      style={{
                        display: 'block',
                        padding: '0.85rem',
                        background: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {route.name}
                        <ChevronRight size={14} color="var(--text-muted)" />
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                        {route.desc}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
