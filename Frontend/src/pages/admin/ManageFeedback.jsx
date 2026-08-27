import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { MessageSquare, Send, X, CheckCircle2, AlertCircle, Clock, BarChart2 } from 'lucide-react';
import PageLoader from '../../components/PageLoader';

const SENTIMENT_COLORS = {
  Positive: 'var(--accent-emerald)',
  Neutral: 'var(--text-muted)',
  Constructive: 'var(--accent-primary)',
  Urgent: 'var(--accent-rose)'
};

export default function ManageFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [sentimentStats, setSentimentStats] = useState({ Positive: 0, Neutral: 0, Constructive: 0, Urgent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchFeedbacks(); }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/admin/feedback');
      setFeedbacks(res.feedbacks || []);
      if (res.sentimentStats) setSentimentStats(res.sentimentStats);
    } catch (err) {
      setError(err.message || 'Could not load feedback. Make sure the server is running.');
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendResponse = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await apiFetch(`/admin/feedback/${activeTicket._id}/respond`, {
        method: 'PUT',
        body: JSON.stringify({ adminResponse: responseText, status: 'resolved' })
      });
      showToast('success', 'Response sent! User notified in-app.');
      setResponseModalOpen(false);
      setResponseText('');
      fetchFeedbacks();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSending(false);
    }
  };

  const openResponse = (ticket) => {
    setActiveTicket(ticket);
    setResponseText(ticket.adminResponse || '');
    setResponseModalOpen(true);
  };

  const filteredFeedbacks = statusFilter === 'all'
    ? feedbacks
    : feedbacks.filter((f) => f.status === statusFilter);

  const totalFeedbacks = feedbacks.length;

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999, background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)', border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'}`, color: toast.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', maxWidth: '420px' }}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />} {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Manage <span className="gradient-text">Feedback Analytics</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review sentiment summary metrics and reply directly to user ticket submissions.</p>
      </div>

      {/* Sentiment Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {Object.entries(sentimentStats).map(([key, val]) => (
          <div key={key} className="glass-panel" style={{ padding: '1.25rem', borderLeft: `4px solid ${SENTIMENT_COLORS[key] || 'var(--border-color)'}` }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>{key.toUpperCase()} SENTIMENT</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: SENTIMENT_COLORS[key] || 'var(--text-primary)' }}>{val}</div>
            {totalFeedbacks > 0 && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{Math.round((val / totalFeedbacks) * 100)}% of total</div>}
          </div>
        ))}
      </div>

      {/* Filter + Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
          <option value="all">All Tickets ({feedbacks.length})</option>
          <option value="pending">Pending ({feedbacks.filter((f) => f.status !== 'resolved').length})</option>
          <option value="resolved">Resolved ({feedbacks.filter((f) => f.status === 'resolved').length})</option>
        </select>
        <button onClick={fetchFeedbacks} className="btn-secondary">Refresh</button>
      </div>

      {error && (
        <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--accent-rose)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Feedback Tickets List */}
      {loading ? (
          <PageLoader label="Loading feedback..." />
      ) : filteredFeedbacks.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No feedback tickets found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredFeedbacks.map((f) => (
            <div key={f._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-indigo">{f.category?.toUpperCase()}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: SENTIMENT_COLORS[f.sentiment] || 'var(--text-muted)' }}>
                    ● {f.sentiment}
                  </span>
                  <span className={`badge ${f.status === 'resolved' ? 'badge-emerald' : 'badge-rose'}`}>
                    {f.status === 'resolved' ? '✓ Resolved' : '⏳ Pending'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{f.subject}</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>
                  {f.userName} · {f.userEmail}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{f.message}</p>

                {f.adminResponse && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', borderLeft: '3px solid var(--accent-emerald)', padding: '0.75rem', marginTop: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--accent-emerald)' }}>Admin Response:</strong> {f.adminResponse}
                    {f.respondedAt && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{new Date(f.respondedAt).toLocaleDateString()}</div>}
                  </div>
                )}
              </div>

              <button
                onClick={() => openResponse(f)}
                className="btn-primary"
                style={{ fontSize: '0.82rem', flexShrink: 0 }}
              >
                <Send size={14} /> {f.adminResponse ? 'Update Response' : 'Respond & Notify'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {responseModalOpen && activeTicket && (
        <div className="modal-overlay" onClick={() => setResponseModalOpen(false)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px', width: '95%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Reply to {activeTicket.userName}</h3>
              <button onClick={() => setResponseModalOpen(false)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}><X size={18} /></button>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <strong style={{ color: 'var(--accent-primary)' }}>{activeTicket.subject}</strong>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{activeTicket.message}</p>
            </div>

            <form onSubmit={handleSendResponse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  Admin Response Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type response... this will be delivered directly to the user's notification drawer."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                />
              </div>
              <button type="submit" disabled={sending} className="btn-primary" style={{ justifyContent: 'center' }}>
                <Send size={16} /> {sending ? 'Sending...' : 'Send In-App Notification Response'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
