import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import PageLoader from '../../components/PageLoader';

export default function FeedbackAndSupport() {
  const { user } = useAuth();
  const [category, setCategory] = useState('suggestion');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchUserFeedbacks();
  }, []);

  const fetchUserFeedbacks = async () => {
    try {
      const res = await apiFetch('/feedback/my');
      setFeedbacks(res.feedbacks || []);
    } catch (err) {}
    finally { setInitialLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/feedback', {
        method: 'POST',
        body: JSON.stringify({ category, subject, message })
      });

      setSuccessMsg('Feedback submitted! You will receive an in-app notification when an admin responds.');
      setSubject('');
      setMessage('');
      fetchUserFeedbacks();
    } catch (err) {
      alert('Error submitting feedback');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <PageLoader label="Loading feedback..." />;

  return (
    <div className="user-page">
      <div className="user-page-header">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Feedback & <span className="gradient-text">Support Center</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Submit bug reports, feature suggestions, or general queries to the PathSeeker administration team.</p>
      </div>

      <div className="user-page-grid user-page-grid--two-column">
        {/* Feedback Form */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} color="var(--accent-primary)" /> Submit Feedback Ticket
          </h2>

          {successMsg && (
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--accent-emerald)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Category Type</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                <option value="bug">Bug Report</option>
                <option value="suggestion">Feature Suggestion</option>
                <option value="query">General Query</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Subject Title</label>
              <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Question about AI quiz scoring" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', marginTop: '0.2rem' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Message Details</label>
              <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Provide detailed explanation..." style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', marginTop: '0.2rem' }} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center' }}>
              {loading ? 'Submitting...' : 'Send Feedback Ticket'} <Send size={16} />
            </button>
          </form>
        </div>

        {/* Ticket History */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>Ticket History & Responses</h2>

          {feedbacks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>No feedback tickets submitted yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
              {feedbacks.map((f) => (
                <div key={f._id} style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span className="badge badge-indigo">{f.category.toUpperCase()}</span>
                    <span className={`badge ${f.status === 'resolved' ? 'badge-emerald' : 'badge-amber'}`}>{f.status}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{f.subject}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.4rem 0' }}>{f.message}</p>

                  {f.adminResponse && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderLeft: '3px solid var(--accent-emerald)', padding: '0.75rem', marginTop: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                      <strong style={{ color: 'var(--accent-emerald)' }}>Admin Response:</strong> {f.adminResponse}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
