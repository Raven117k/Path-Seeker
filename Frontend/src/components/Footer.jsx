import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Map, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { setSitemapOpen } = useAuth();

  return (
    <footer className="glass-panel" style={{ borderRadius: 0, borderBottom: 0, borderLeft: 0, borderRight: 0, marginTop: '4rem', padding: '3rem 1.5rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Compass size={20} color="#fff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>PathSeeker</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Discover what fits you best. An interactive, role-tailored Career Passport platform designed for Students, Graduates, and Professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Career Passport Tools</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><Link to="/careers" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Global Career Bank</Link></li>
              <li><Link to="/user/quiz" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>AI-Powered Interest Quiz</Link></li>
              <li><Link to="/user/multimedia" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Interactive Media Center</Link></li>
              <li><Link to="/stories" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Success Stories Hub</Link></li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Resources & Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><Link to="/resources" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Document Resource Library</Link></li>
              <li><Link to="/user/feedback" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Feedback & Enquiries</Link></li>
              <li>
                <button
                  onClick={() => setSitemapOpen(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Map size={15} /> Application Sitemap
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Standards & Trust</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '0.75rem' }}>
              Built in compliance with Aptech TechWiz SRS specifications. Mobile-ready architecture & role-based privacy protocols.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-indigo"><ShieldCheck size={12} /> Secure JWT</span>
              <span className="badge badge-emerald"><Sparkles size={12} /> Mobile Ready</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <div>© 2026 PathSeeker Career Passport. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Engineered with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> for Students, Graduates & Professionals.
          </div>
        </div>
      </div>
    </footer>
  );
}
