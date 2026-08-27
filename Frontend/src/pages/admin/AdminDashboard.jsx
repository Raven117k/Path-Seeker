import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  HelpCircle,
  Video,
  Award,
  BookOpen,
  MessageSquare,
  Shield,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import PageLoader from '../../components/PageLoader';

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastError, setBroadcastError] = useState('');

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/admin/dashboard-stats');
      setStatsData(res);
    } catch (err) {
      console.error('[AdminDashboard] Fetch error:', err.message);
      setError(err.message || 'Could not load dashboard stats. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setBroadcastLoading(true);
    setBroadcastMsg('');
    setBroadcastError('');
    try {
      const res = await apiFetch('/admin/broadcast', {
        method: 'POST',
        body: JSON.stringify({ title: 'Platform Announcement', message: announcementText })
      });
      setBroadcastMsg(res.message || 'Announcement broadcast successfully!');
      setAnnouncementText('');
    } catch (err) {
      setBroadcastError(err.message || 'Failed to broadcast. Make sure the server is running.');
    } finally {
      setBroadcastLoading(false);
    }
  };

  // Build chart data from real API response
  const domainChartData = statsData?.topDomainCounts
    ? Object.entries(statsData.topDomainCounts).map(([name, count]) => ({ name, count }))
    : [];

  const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e'];
  const rolePieData = statsData?.usersByRole
    ? [
        { name: 'Students', value: statsData.usersByRole.student || 0, color: '#6366f1' },
        { name: 'Graduates', value: statsData.usersByRole.graduate || 0, color: '#10b981' },
        { name: 'Professionals', value: statsData.usersByRole.professional || 0, color: '#f59e0b' }
      ].filter((d) => d.value > 0)
    : [];

  const stats = statsData?.stats || {};

  return (
    <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="badge badge-amber" style={{ marginBottom: '0.4rem' }}>
            <Shield size={13} style={{ marginRight: '0.3rem' }} /> Administrator Control Panel
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>System <span className="gradient-text">Analytics & Management</span></h1>
        </div>

        {/* Quick Admin Action Links */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link to="/admin/users" className="btn-secondary" style={{ fontSize: '0.85rem' }}><Users size={15} /> Users</Link>
          <Link to="/admin/careers" className="btn-secondary" style={{ fontSize: '0.85rem' }}><Briefcase size={15} /> Careers</Link>
          <Link to="/admin/quiz" className="btn-secondary" style={{ fontSize: '0.85rem' }}><HelpCircle size={15} /> Quiz</Link>
          <Link to="/admin/multimedia" className="btn-secondary" style={{ fontSize: '0.85rem' }}><Video size={15} /> Media</Link>
          <Link to="/admin/stories" className="btn-secondary" style={{ fontSize: '0.85rem' }}><Award size={15} /> Stories</Link>
          <Link to="/admin/resources" className="btn-secondary" style={{ fontSize: '0.85rem' }}><BookOpen size={15} /> Resources</Link>
          <Link to="/admin/feedback" className="btn-secondary" style={{ fontSize: '0.85rem' }}><MessageSquare size={15} /> Feedback</Link>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {error}
          <button onClick={fetchAdminStats} style={{ marginLeft: 'auto', background: 'none', border: '1px solid currentColor', color: 'inherit', padding: '0.3rem 0.7rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.8rem' }}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <PageLoader label="Loading dashboard statistics..." />
      ) : (
        <>
          {/* STAT CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL USERS</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)', margin: '0.2rem 0' }}>
                {stats.totalUsers ?? '—'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Active Platform Passport Holders</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>CAREERS PROFILES</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)', margin: '0.2rem 0' }}>
                {stats.totalCareers ?? '—'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Across Industry Domains</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>QUIZ EVALUATIONS</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)', margin: '0.2rem 0' }}>
                {stats.totalQuizAttempts ?? '—'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Total Submissions</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>MULTIMEDIA ITEMS</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)', margin: '0.2rem 0' }}>
                {stats.totalMedia ?? '—'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Videos & Podcasts</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>PENDING STORY REVIEWS</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-rose)', margin: '0.2rem 0' }}>
                {stats.pendingStories ?? '—'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Awaiting Approval</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL FEEDBACKS</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)', margin: '0.2rem 0' }}>
                {stats.totalFeedbacks ?? '—'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>User Submissions</div>
            </div>
          </div>

          {/* ANALYTICS CHARTS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
            {/* Bar Chart: Quiz Popularity by Domain */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart2 size={20} color="var(--accent-primary)" /> Interest Quiz Domain Match Volume
              </h3>
              {domainChartData.length > 0 ? (
                <div style={{ width: '100%', height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={domainChartData}>
                      <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} />
                      <Tooltip contentStyle={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="var(--accent-primary)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No quiz data yet. Data will appear as users complete the Interest Quiz.
                </div>
              )}
            </div>

            {/* Pie Chart: User Demographics */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PieIcon size={20} color="var(--accent-emerald)" /> User Roles Ratio
              </h3>
              {rolePieData.length > 0 ? (
                <>
                  <div style={{ width: '100%', height: '220px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={rolePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                          {rolePieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                    {rolePieData.map((d) => (
                      <span key={d.name} style={{ color: d.color, fontWeight: 700 }}>● {d.name} ({d.value})</span>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                  No user data yet. Data will appear as users register.
                </div>
              )}
            </div>
          </div>

          {/* Broadcast System Announcement Tool */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={20} color="var(--accent-amber)" /> Broadcast System Announcement
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Send an instant in-app notification announcement to all registered platform users.
            </p>

            {broadcastMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--accent-emerald)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} /> {broadcastMsg}
              </div>
            )}

            {broadcastError && (
              <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <AlertCircle size={16} /> {broadcastError}
              </div>
            )}

            <form onSubmit={handleBroadcast} style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                required
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Type announcement message (e.g. New 2026 AI Salary Guide uploaded!)..."
                style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
              />
              <button type="submit" className="btn-primary" disabled={broadcastLoading}>
                {broadcastLoading ? 'Broadcasting...' : 'Broadcast Notification'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
