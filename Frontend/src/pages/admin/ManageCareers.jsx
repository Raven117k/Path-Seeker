import React, { useState, useEffect } from 'react';
import { apiFetch, STATIC_CAREERS } from '../../services/api';
import { Briefcase, Plus, Trash2, Edit, X, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import PageLoader from '../../components/PageLoader';

const DOMAINS = ['Technology', 'Healthcare', 'Business & Finance', 'Creative & Design', 'Engineering', 'Education', 'Legal & Policy'];
const DEMANDS = ['Explosive Growth', 'Very High', 'High', 'Moderate', 'Emerging'];
const AUDIENCES = ['student', 'graduate', 'professional'];

const emptyForm = {
  title: '', domain: 'Technology', description: '', overview: '',
  skills: '', eduPath: '', minSal: 80000, maxSal: 140000,
  jobDemand: 'Very High', featured: false, trending: false,
  targetAudience: ['student', 'graduate', 'professional']
};

export default function ManageCareers() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null); // null = create, object = edit
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  useEffect(() => { fetchCareers(); }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/careers');
      setCareers(res.careers || []);
    } catch (err) {
      setCareers([]);
      showToast('error', err.message || 'Could not load careers from database.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingCareer(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (career) => {
    setEditingCareer(career);
    setForm({
      title: career.title || '',
      domain: career.domain || 'Technology',
      description: career.description || '',
      overview: career.overview || '',
      skills: Array.isArray(career.requiredSkills) ? career.requiredSkills.join(', ') : '',
      eduPath: career.educationPath || '',
      minSal: career.salaryRange?.min || 80000,
      maxSal: career.salaryRange?.max || 140000,
      jobDemand: career.jobDemand || 'Very High',
      featured: career.featured || false,
      trending: career.trending || false,
      targetAudience: career.targetAudience || ['student', 'graduate', 'professional']
    });
    setModalOpen(true);
  };

  const buildPayload = () => ({
    title: form.title,
    domain: form.domain,
    description: form.description,
    overview: form.overview,
    requiredSkills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
    educationPath: form.eduPath,
    salaryRange: { min: Number(form.minSal), max: Number(form.maxSal), currency: 'PKR' },
    jobDemand: form.jobDemand,
    featured: form.featured,
    trending: form.trending,
    targetAudience: form.targetAudience
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCareer) {
        await apiFetch(`/careers/${editingCareer._id}`, {
          method: 'PUT',
          body: JSON.stringify(buildPayload())
        });
        showToast('success', `"${form.title}" updated successfully!`);
      } else {
        await apiFetch('/careers', {
          method: 'POST',
          body: JSON.stringify(buildPayload())
        });
        showToast('success', `"${form.title}" created and published!`);
      }
      setModalOpen(false);
      fetchCareers();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete career profile "${title}"? This cannot be undone.`)) return;
    try {
      await apiFetch(`/careers/${id}`, { method: 'DELETE' });
      showToast('success', `"${title}" deleted.`);
      fetchCareers();
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
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999, background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)', border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'}`, color: toast.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', maxWidth: '420px' }}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Manage <span className="gradient-text">Careers Bank</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Add, edit, or remove job roles, salary benchmarks, and roadmaps.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={18} /> Add New Career
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        {loading ? (
          <PageLoader label="Loading careers..." />
        ) : careers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No career profiles yet. Click "Add New Career" to create one.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem' }}>CAREER TITLE</th>
                <th style={{ padding: '0.75rem' }}>DOMAIN</th>
                <th style={{ padding: '0.75rem' }}>SALARY RANGE</th>
                <th style={{ padding: '0.75rem' }}>DEMAND</th>
                <th style={{ padding: '0.75rem' }}>FLAGS</th>
                <th style={{ padding: '0.75rem' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {careers.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '0.85rem', fontWeight: 700 }}>{c.title}</td>
                  <td style={{ padding: '0.85rem' }}><span className="badge badge-indigo">{c.domain}</span></td>
                  <td style={{ padding: '0.85rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    ${(c.salaryRange?.min || 0).toLocaleString()} – ${(c.salaryRange?.max || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.85rem' }}><span className="badge badge-emerald">{c.jobDemand}</span></td>
                  <td style={{ padding: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {c.featured && <span className="badge badge-amber" style={{ marginRight: '0.3rem' }}>Featured</span>}
                    {c.trending && <span className="badge badge-indigo">Trending</span>}
                  </td>
                  <td style={{ padding: '0.85rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEdit(c)} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '0.3rem' }} title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(c._id, c.title)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '0.3rem' }} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '660px', width: '95%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{editingCareer ? 'Edit Career Profile' : 'Add New Career Profile'}</h3>
              <button onClick={() => setModalOpen(false)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Title + Domain */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Career Title *</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Cloud Security Specialist" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Domain *</label>
                  <select value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} style={inputStyle}>
                    {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Short Description *</label>
                <textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Overview & Scope *</label>
                <textarea required rows={2} value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Required Skills (comma separated) *</label>
                <input type="text" required value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="AWS, Kubernetes, Cyber Security..." style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Education Path *</label>
                <input type="text" required value={form.eduPath} onChange={(e) => setForm({ ...form, eduPath: e.target.value })} placeholder="B.S. in Computer Science..." style={inputStyle} />
              </div>

              {/* Salary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Min Salary (PKR)</label>
                  <input type="number" value={form.minSal} onChange={(e) => setForm({ ...form, minSal: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Max Salary (PKR)</label>
                  <input type="number" value={form.maxSal} onChange={(e) => setForm({ ...form, maxSal: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Job Demand</label>
                  <select value={form.jobDemand} onChange={(e) => setForm({ ...form, jobDemand: e.target.value })} style={inputStyle}>
                    {DEMANDS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label style={labelStyle}>Target Audience</label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {AUDIENCES.map((a) => (
                    <label key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.targetAudience.includes(a)} onChange={() => toggleAudience(a)} />
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Flags */}
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  Featured Career
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} />
                  Trending
                </label>
              </div>

              <button type="submit" disabled={saving} className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                <Save size={16} /> {saving ? 'Saving...' : editingCareer ? 'Update Career Profile' : 'Publish Career Profile'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
