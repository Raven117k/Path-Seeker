import React, { useState, useEffect } from 'react';
import { apiFetch, STATIC_QUIZ_QUESTIONS } from '../../services/api';
import { HelpCircle, Plus, Trash2, Edit, X, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import PageLoader from '../../components/PageLoader';

const CATEGORIES = ['Work Preference', 'Technical Aptitude', 'Workplace Culture', 'Soft Skills & Leadership', 'Career Interest'];
const TYPES = ['single_choice', 'slider', 'likert_scale', 'multi_select'];
const ALL_DOMAINS = ['Technology', 'Healthcare', 'Business & Finance', 'Creative & Design', 'Engineering', 'Education', 'Legal & Policy'];

const emptyOption = { text: '', domainWeights: {} };

const emptyForm = {
  questionText: '',
  category: 'Work Preference',
  type: 'single_choice',
  timeLimitSeconds: 30,
  options: [
    { text: '', domainWeights: { Technology: 0 } },
    { text: '', domainWeights: { Healthcare: 0 } },
    { text: '', domainWeights: { 'Business & Finance': 0 } },
    { text: '', domainWeights: { 'Creative & Design': 0 } }
  ]
};

export default function ManageQuiz() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQ, setEditingQ] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchQuestions(); }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/quiz/questions');
      setQuestions(res.questions || []);
    } catch (err) {
      setQuestions([]);
      showToast('error', err.message || 'Could not load quiz questions from database.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingQ(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (q) => {
    setEditingQ(q);
    setForm({
      questionText: q.questionText || '',
      category: q.category || 'Work Preference',
      type: q.type || 'single_choice',
      timeLimitSeconds: q.timeLimitSeconds || 30,
      options: q.options?.length > 0 ? q.options.map((o) => ({
        text: o.text || '',
        domainWeights: o.domainWeights || {}
      })) : emptyForm.options
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      questionText: form.questionText,
      category: form.category,
      type: form.type,
      timeLimitSeconds: Number(form.timeLimitSeconds),
      options: form.options.filter((o) => o.text.trim()).map((o) => ({
        text: o.text,
        domainWeights: o.domainWeights
      }))
    };
    try {
      if (editingQ) {
        await apiFetch(`/quiz/questions/${editingQ._id}`, { method: 'PUT', body: JSON.stringify(payload) });
        showToast('success', 'Question updated successfully!');
      } else {
        await apiFetch('/quiz/questions', { method: 'POST', body: JSON.stringify(payload) });
        showToast('success', 'Question added to quiz bank!');
      }
      setModalOpen(false);
      fetchQuestions();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quiz question?')) return;
    try {
      await apiFetch(`/quiz/questions/${id}`, { method: 'DELETE' });
      showToast('success', 'Question deleted.');
      fetchQuestions();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const updateOption = (idx, field, value) => {
    setForm((f) => {
      const opts = [...f.options];
      opts[idx] = { ...opts[idx], [field]: value };
      return { ...f, options: opts };
    });
  };

  const updateOptionWeight = (optIdx, domain, value) => {
    setForm((f) => {
      const opts = [...f.options];
      opts[optIdx] = {
        ...opts[optIdx],
        domainWeights: { ...opts[optIdx].domainWeights, [domain]: Number(value) }
      };
      return { ...f, options: opts };
    });
  };

  const addOption = () => {
    setForm((f) => ({ ...f, options: [...f.options, { text: '', domainWeights: {} }] }));
  };

  const removeOption = (idx) => {
    setForm((f) => ({ ...f, options: f.options.filter((_, i) => i !== idx) }));
  };

  const inputStyle = { width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box', fontSize: '0.9rem' };
  const labelStyle = { fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' };

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
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Manage <span className="gradient-text">Quiz Questions</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Configure interest quiz question bank, time limits, options, and domain scoring weights.</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Question</button>
      </div>

      {loading ? (
          <PageLoader label="Loading questions..." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {questions.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No quiz questions yet. Click "Add Question" to create one.
            </div>
          ) : questions.map((q, idx) => (
            <div key={q._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                  <span className="badge badge-indigo">Q{idx + 1}</span>
                  <span className="badge badge-amber">{q.category}</span>
                  <span className="badge badge-emerald">{q.type}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>⏱ {q.timeLimitSeconds}s</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.3rem 0 0.6rem' }}>{q.questionText}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {q.options?.map((opt, oi) => (
                    <div key={oi} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 700, flexShrink: 0 }}>{String.fromCharCode(65 + oi)}.</span>
                      <span>{opt.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                <button onClick={() => openEdit(q)} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '0.3rem' }} title="Edit">
                  <Edit size={17} />
                </button>
                <button onClick={() => handleDelete(q._id)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '0.3rem' }} title="Delete">
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', width: '95%', padding: '2rem', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{editingQ ? 'Edit Quiz Question' : 'Add Quiz Question'}</h3>
              <button onClick={() => setModalOpen(false)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={labelStyle}>Question Text *</label>
                <textarea required rows={2} value={form.questionText} onChange={(e) => setForm({ ...form, questionText: e.target.value })} placeholder="e.g. Which project topic excites you most?" style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Question Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Time Limit (seconds)</label>
                  <input type="number" min={10} max={120} value={form.timeLimitSeconds} onChange={(e) => setForm({ ...form, timeLimitSeconds: e.target.value })} style={inputStyle} />
                </div>
              </div>

              {/* Options Editor */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={labelStyle}>Answer Options & Domain Weights</label>
                  <button type="button" onClick={addOption} style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.6rem', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>+ Add Option</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {form.options.map((opt, oi) => (
                    <div key={oi} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--accent-primary)', width: '1.2rem', flexShrink: 0, paddingTop: '0.65rem' }}>{String.fromCharCode(65 + oi)}.</span>
                        <input type="text" required value={opt.text} onChange={(e) => updateOption(oi, 'text', e.target.value)} placeholder={`Option ${String.fromCharCode(65 + oi)} text...`} style={{ ...inputStyle, flex: 1 }} />
                        {form.options.length > 2 && (
                          <button type="button" onClick={() => removeOption(oi)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '0.4rem', flexShrink: 0 }}>
                            <X size={15} />
                          </button>
                        )}
                      </div>
                      {/* Domain weight inputs */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.4rem' }}>
                        {ALL_DOMAINS.map((domain) => (
                          <div key={domain} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{domain.split(' ')[0]}</span>
                            <input
                              type="number" min={0} max={10} step={1}
                              value={opt.domainWeights[domain] || 0}
                              onChange={(e) => updateOptionWeight(oi, domain, e.target.value)}
                              style={{ width: '48px', padding: '0.3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.8rem', textAlign: 'center' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary" style={{ justifyContent: 'center' }}>
                <Save size={16} /> {saving ? 'Saving...' : editingQ ? 'Update Question' : 'Save Question'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
