import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, STATIC_CAREERS } from '../../services/api';
import { Link } from 'react-router-dom';
import PageLoader from '../../components/PageLoader';
import {
  Sparkles,
  Award,
  HelpCircle,
  Bookmark,
  ArrowRight,
  Flame,
  Star,
  GitCompare
} from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const [trendingCareers, setTrendingCareers] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await apiFetch('/careers', { useFallback: true });
      const all = res.careers || STATIC_CAREERS;

      setTrendingCareers(all.filter((c) => c.trending || c.featured).slice(0, 3));

      // Role-tailored filtering for 'Top Picks for You'
      const roleFilter = user?.role || 'student';
      setTopPicks(all.filter((c) => !c.targetAudience || c.targetAudience.includes(roleFilter)).slice(0, 3));

      // 'If You Liked This...' suggestion engine
      setRecommendations(all.slice(1, 4));

      // Quiz history
      if (user) {
        try {
          const historyRes = await apiFetch('/quiz/history');
          setQuizHistory(historyRes.history || []);
        } catch {
          setQuizHistory([]);
        }
      }
    } catch {
      setTrendingCareers(STATIC_CAREERS.slice(0, 3));
      setTopPicks(STATIC_CAREERS.slice(0, 3));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const loadTimer = setTimeout(() => fetchDashboardData(), 0);
    return () => clearTimeout(loadTimer);
  }, [fetchDashboardData]);

  const getRoleGreeting = () => {
    if (!user) return 'Welcome Seeker!';
    if (user.role === 'student') return `Welcome, Student ${user.name}!`;
    if (user.role === 'graduate') return `Welcome, Graduate ${user.name}!`;
    if (user.role === 'professional') return `Welcome, Professional ${user.name}!`;
    return `Welcome, ${user.name}!`;
  };

  if (loading) return <PageLoader label="Loading dashboard..." />;

  return (
    <div className="user-page">
        {/* Personalized Greeting Header */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem', background: 'var(--gradient-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
            <div className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
              <Sparkles size={13} style={{ marginRight: '0.3rem' }} /> Active Role Passport: {(user?.role || 'student').toUpperCase()}
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{getRoleGreeting()}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
              Here is your personalized career roadmap, recommended job roles, and activity progress.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/user/quiz" className="btn-primary">
              <HelpCircle size={16} /> Take AI Interest Quiz
            </Link>
            <Link to="/user/decision-helper" className="btn-secondary">
              <Sparkles size={16} /> Decision Helper
            </Link>
            <Link to="/user/bookmarks" className="btn-secondary">
              <Bookmark size={16} /> Saved Notes
            </Link>
          </div>
        </div>
      </div>

      {/* Decision Helper promo — the P0 moat feature, surfaced everywhere it matters */}
      <Link
        to="/user/decision-helper"
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          padding: '1.25rem 1.5rem',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-primary) 12%, var(--bg-surface)) 0%, color-mix(in srgb, var(--accent-secondary) 12%, var(--bg-surface)) 100%)',
          border: '1px solid color-mix(in srgb, var(--accent-primary) 30%, var(--border-color))',
          textDecoration: 'none',
          color: 'inherit',
          boxShadow: 'var(--shadow-glow)',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            display: 'grid', placeItems: 'center',
            background: 'var(--gradient-brand)', color: '#fff', flexShrink: 0
          }}>
            <GitCompare size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem' }}>Try the Decision Helper</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Pick any two careers. See them judged on 11 axes — salary, growth, study time, go-abroad potential, risk, and more.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
          Compare careers <ArrowRight size={16} />
        </div>
      </Link>

      {/* Quick Quiz Status Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', borderLeft: '4px solid var(--accent-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} color="var(--accent-primary)" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
              {quizHistory.length > 0 ? `Latest Top Stream Match: ${quizHistory[0].topDomain}` : 'Interest Quiz Pending'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {quizHistory.length > 0 ? `Evaluated on ${new Date(quizHistory[0].createdAt).toLocaleDateString()}` : 'Complete the multi-step quiz to get precision career matches'}
            </div>
          </div>
        </div>
        <Link to="/user/quiz" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          {quizHistory.length > 0 ? 'Retake Quiz' : 'Start Quiz Now'}
        </Link>
      </div>

      {/* DYNAMIC WIDGETS GRID */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* Widget 1: Trending Careers */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={22} color="var(--accent-rose)" /> Dynamic Widget: Trending Careers
            </h2>
            <Link to="/user/careers" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
              View All Careers →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {trendingCareers.map((c) => (
              <div key={c._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="badge badge-indigo">{c.domain}</span>
                    <span className="badge badge-rose">{c.jobDemand}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.4rem 0' }}>{c.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>{c.description}</p>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: 'var(--accent-emerald)', fontSize: '0.95rem' }}>PKR {(c.salaryRange?.min || 0).toLocaleString()} - {(c.salaryRange?.max || 0).toLocaleString()}</span>
                  <Link to="/user/careers" style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>Roadmap →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Top Picks For You (Role-Tailored) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={22} color="var(--accent-amber)" /> Dynamic Widget: Top Picks for You ({(user?.role || 'student').toUpperCase()})
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {topPicks.map((c) => (
              <div key={c._id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>Recommended for {user?.role || 'student'}</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.4rem 0' }}>{c.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{c.overview}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Required: {c.requiredSkills.slice(0, 3).join(', ')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 3: "If You Liked This..." Suggestion Engine */}
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={22} color="var(--accent-cyan)" /> "If You Liked This..." Recommendation Engine
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Explore related career paths from the Career Bank</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {recommendations.map((c) => (
              <div key={c._id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>Related Career Path</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0.4rem 0' }}>{c.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
