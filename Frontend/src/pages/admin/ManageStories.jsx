import React, { useState, useEffect } from 'react';
import { apiFetch, STATIC_STORIES } from '../../services/api';
import { Award, Check, X, Trash2, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import PageLoader from '../../components/PageLoader';

export default function ManageStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchStories(); }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchStories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/admin/stories');
      setStories(res.stories || []);
    } catch (err) {
      setError(err.message || 'Could not load stories from database.');
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApprove = async (id, currentApproved) => {
    try {
      await apiFetch(`/admin/stories/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ approved: !currentApproved })
      });
      showToast('success', !currentApproved ? 'Story approved & published!' : 'Story moved to pending review.');
      fetchStories();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await apiFetch(`/admin/stories/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ featured: !currentFeatured })
      });
      showToast('success', !currentFeatured ? 'Story marked as featured!' : 'Story removed from featured.');
      fetchStories();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete story by "${name}"?`)) return;
    try {
      await apiFetch(`/admin/stories/${id}`, { method: 'DELETE' });
      showToast('success', `Story by "${name}" deleted.`);
      fetchStories();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const pending = stories.filter((s) => !s.approved);
  const approved = stories.filter((s) => s.approved);

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999, background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)', border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'}`, color: toast.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', maxWidth: '420px' }}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />} {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Manage <span className="gradient-text">Success Story Submissions</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review, approve, feature, or delete student and graduate career story submissions.</p>
      </div>

      {error && (
        <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--accent-rose)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {loading ? (
        <PageLoader label="Loading stories..." />
      ) : stories.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No story submissions yet. Users can submit their career stories from their dashboard.
        </div>
      ) : (
        <>
          {/* Pending Section */}
          {pending.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⏳ Pending Review ({pending.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {pending.map((s) => <StoryCard key={s._id} s={s} onApprove={handleToggleApprove} onFeatured={handleToggleFeatured} onDelete={handleDelete} />)}
              </div>
            </div>
          )}

          {/* Approved Section */}
          {approved.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} /> Approved & Live ({approved.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {approved.map((s) => <StoryCard key={s._id} s={s} onApprove={handleToggleApprove} onFeatured={handleToggleFeatured} onDelete={handleDelete} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StoryCard({ s, onApprove, onFeatured, onDelete }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
          <span className="badge badge-indigo">{s.domain}</span>
          <span className={`badge ${s.approved ? 'badge-emerald' : 'badge-amber'}`}>
            {s.approved ? 'Approved & Live' : 'Pending Review'}
          </span>
          {s.featured && <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Star size={14} /> Featured</span>}
          {s.submittedBy && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              by {s.submittedBy.name || s.submittedBy.email || 'User'}
            </span>
          )}
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{s.name} — {s.role}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>"{s.summary}"</p>
        {s.timeline?.length > 0 && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {s.timeline.length} timeline stages
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
        <button
          onClick={() => onApprove(s._id, s.approved)}
          className="btn-secondary"
          style={{ color: s.approved ? 'var(--accent-amber)' : 'var(--accent-emerald)', fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
        >
          {s.approved ? <><X size={14} /> Unapprove</> : <><Check size={14} /> Approve & Publish</>}
        </button>
        <button
          onClick={() => onFeatured(s._id, s.featured)}
          className="btn-secondary"
          style={{ color: s.featured ? 'var(--text-muted)' : 'var(--accent-amber)', fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
        >
          <Star size={14} /> {s.featured ? 'Unfeature' : 'Feature'}
        </button>
        <button
          onClick={() => onDelete(s._id, s.name)}
          style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '0.4rem' }}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
