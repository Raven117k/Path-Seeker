import React, { useState, useEffect } from 'react';
import { apiFetch, uploadAdminAsset } from '../../services/api';
import { Video, Plus, Trash2, Edit, X, Save, CheckCircle2, AlertCircle, Clock, Star } from 'lucide-react';
import PageLoader from '../../components/PageLoader';

const TYPES = ['video', 'podcast', 'anim_explainer'];
const AUDIENCES = ['student', 'graduate', 'professional'];

const emptyForm = {
  title: '', type: 'video', url: '', thumbnailUrl: '',
  description: '', transcript: '', duration: '',
  tags: '', targetAudience: ['student', 'graduate', 'professional']
};

export default function ManageMultimedia() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => { fetchMedia(); }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/multimedia');
      setItems(res.items || []);
    } catch (err) {
      setItems([]);
      showToast('error', err.message || 'Could not load multimedia from database.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setMediaFile(null);
    setThumbnailFile(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      type: item.type || 'video',
      url: item.url || '',
      thumbnailUrl: item.thumbnailUrl || '',
      description: item.description || '',
      transcript: item.transcript || '',
      duration: item.duration || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      targetAudience: item.targetAudience || ['student', 'graduate', 'professional']
    });
    setMediaFile(null);
    setThumbnailFile(null);
    setModalOpen(true);
  };

  const buildPayload = () => ({
    title: form.title,
    type: form.type,
    url: form.url,
    thumbnailUrl: form.thumbnailUrl,
    description: form.description,
    transcript: form.transcript,
    duration: form.duration,
    tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    targetAudience: form.targetAudience
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildPayload();
      if (mediaFile) payload.url = (await uploadAdminAsset(mediaFile, 'multimedia')).url;
      if (thumbnailFile) payload.thumbnailUrl = (await uploadAdminAsset(thumbnailFile, 'multimedia/thumbnails')).url;
      if (editingItem) {
        await apiFetch(`/multimedia/${editingItem._id}`, { method: 'PUT', body: JSON.stringify(payload) });
        showToast('success', `"${form.title}" updated!`);
      } else {
        await apiFetch('/multimedia', { method: 'POST', body: JSON.stringify(payload) });
        showToast('success', `"${form.title}" added!`);
      }
      setModalOpen(false);
      fetchMedia();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await apiFetch(`/multimedia/${id}`, { method: 'DELETE' });
      showToast('success', `"${title}" deleted.`);
      fetchMedia();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const toggleAudience = (aud) => {
    setForm((f) => ({
      ...f,
      targetAudience: f.targetAudience.includes(aud)
        ? f.targetAudience.filter((a) => a !== aud)
        : [...f.targetAudience, aud]
    }));
  };

  const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' };

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999, background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)', border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'}`, color: toast.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', maxWidth: '420px' }}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />} {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Manage <span className="gradient-text">Multimedia Content</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Add, edit, or remove videos, podcasts, and transcripts.</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Media</button>
      </div>

      {loading ? (
          <PageLoader label="Loading media..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {items.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', gridColumn: '1/-1' }}>
              No multimedia items yet. Click "Add Media" to create one.
            </div>
          ) : items.map((i) => (
            <div key={i._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {i.thumbnailUrl && (
                <img src={i.thumbnailUrl} alt={i.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }} />
              )}
              <div>
                <span className="badge badge-indigo" style={{ marginBottom: '0.4rem' }}>{i.type}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.4rem 0' }}>{i.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{i.description}</p>
                {i.duration && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> {i.duration} · {i.viewsCount || 0} views · <Star size={12} /> {i.ratingAvg || 0}</span>}
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button onClick={() => openEdit(i)} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '0.3rem' }} title="Edit">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(i._id, i.title)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '0.3rem' }} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '95%', padding: '2rem', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{editingItem ? 'Edit Media Item' : 'Add Multimedia Item'}</h3>
              <button onClick={() => setModalOpen(false)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Type *</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Duration (e.g. 14:25)</label>
                  <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="14:25" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Embed URL *</label>
                <input type="text" required={!mediaFile} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://www.youtube.com/embed/..." style={inputStyle} />
                <input type="file" accept="video/*,audio/*" onChange={(e) => setMediaFile(e.target.files[0] || null)} style={{ marginTop: '0.6rem', color: 'var(--text-secondary)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Upload video or audio to Cloudinary, or use an embed URL.</span>
              </div>
              <div>
                <label style={labelStyle}>Thumbnail URL</label>
                <input type="text" value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} placeholder="https://images.unsplash.com/..." style={inputStyle} />
                <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0] || null)} style={{ marginTop: '0.6rem', color: 'var(--text-secondary)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Upload a thumbnail to Cloudinary, or use an image URL.</span>
              </div>
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Transcript Text</label>
                <textarea rows={3} value={form.transcript} onChange={(e) => setForm({ ...form, transcript: e.target.value })} placeholder="[00:00] Start of transcript..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tags (comma separated)</label>
                <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="AI, Python, Career Advice" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Target Audience</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {AUDIENCES.map((a) => (
                    <label key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.targetAudience.includes(a)} onChange={() => toggleAudience(a)} />
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary" style={{ justifyContent: 'center' }}>
                <Save size={16} /> {saving ? 'Saving...' : editingItem ? 'Update Media Item' : 'Save Media Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
