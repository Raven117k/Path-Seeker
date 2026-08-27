import React, { useState, useEffect } from 'react';
import { apiFetch, uploadAdminAsset } from '../../services/api';
import { BookOpen, Plus, Trash2, Edit, X, Save, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import PageLoader from '../../components/PageLoader';

const DOC_TYPES = ['PDF', 'Checklist', 'Infographic', 'Guide', 'Template', 'Worksheet'];
const AUDIENCES = ['student', 'graduate', 'professional'];

const emptyForm = {
  title: '', type: 'PDF', description: '',
  fileUrl: '', previewContent: '', tags: '',
  targetAudience: ['student', 'graduate', 'professional']
};

export default function ManageResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => { fetchResources(); }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/resources');
      setResources(res.resources || []);
    } catch (err) {
      setResources([]);
      showToast('error', err.message || 'Could not load resources from database.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingResource(null);
    setForm(emptyForm);
    setSelectedFile(null);
    setModalOpen(true);
  };

  const openEdit = (resource) => {
    setEditingResource(resource);
    setForm({
      title: resource.title || '',
      type: resource.type || 'PDF',
      description: resource.description || '',
      fileUrl: resource.fileUrl || '',
      previewContent: resource.previewContent || '',
      tags: Array.isArray(resource.tags) ? resource.tags.join(', ') : '',
      targetAudience: resource.targetAudience || ['student', 'graduate', 'professional']
    });
    setSelectedFile(null);
    setModalOpen(true);
  };

  const buildPayload = () => ({
    title: form.title,
    type: form.type,
    description: form.description,
    fileUrl: form.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    previewContent: form.previewContent,
    tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    targetAudience: form.targetAudience
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let fileUrl = form.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      if (selectedFile) fileUrl = (await uploadAdminAsset(selectedFile, 'resources')).url;
      if (editingResource) {
        await apiFetch(`/resources/${editingResource._id}`, { method: 'PUT', body: JSON.stringify({ ...buildPayload(), fileUrl }) });
        showToast('success', `"${form.title}" updated!`);
      } else {
        await apiFetch('/resources', { method: 'POST', body: JSON.stringify({ ...buildPayload(), fileUrl }) });
        showToast('success', `"${form.title}" published!`);
      }
      setModalOpen(false);
      fetchResources();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete resource "${title}"?`)) return;
    try {
      await apiFetch(`/resources/${id}`, { method: 'DELETE' });
      showToast('success', `"${title}" deleted.`);
      fetchResources();
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
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Manage <span className="gradient-text">Resource Documents</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Upload PDFs, checklists, infographics, and manage download metrics.</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Document</button>
      </div>

      {loading ? (
          <PageLoader label="Loading resources..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {resources.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', gridColumn: '1/-1' }}>
              No resources yet. Click "Add Document" to create one.
            </div>
          ) : resources.map((r) => (
            <div key={r._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>{r.type}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.4rem 0' }}>{r.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{r.description}</p>
                {r.tags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
                    {r.tags.map((tag) => (
                      <span key={tag} style={{ fontSize: '0.72rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', padding: '0.15rem 0.5rem', borderRadius: '999px', border: '1px solid rgba(99,102,241,0.2)' }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Download size={13} /> {r.downloadCount || 0} downloads
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => openEdit(r)} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '0.3rem' }} title="Edit">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(r._id, r.title)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '0.3rem' }} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
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
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{editingResource ? 'Edit Resource Document' : 'Add Resource Document'}</h3>
              <button onClick={() => setModalOpen(false)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Document Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                  {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>File URL (direct download/view link)</label>
                <input type="text" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="https://example.com/document.pdf" style={inputStyle} />
                <input type="file" accept=".pdf,image/*" onChange={(e) => setSelectedFile(e.target.files[0] || null)} style={{ marginTop: '0.6rem', color: 'var(--text-secondary)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Choose a PDF or image to upload to Cloudinary, or use a URL.</span>
              </div>
              <div>
                <label style={labelStyle}>Preview Summary Text (Markdown supported)</label>
                <textarea rows={3} value={form.previewContent} onChange={(e) => setForm({ ...form, previewContent: e.target.value })} placeholder="### Key Highlights:&#10;- Point 1&#10;- Point 2" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tags (comma separated)</label>
                <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Resume, Skill-Building, Interview Prep" style={inputStyle} />
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
                <Save size={16} /> {saving ? 'Saving...' : editingResource ? 'Update Document' : 'Publish Document'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
