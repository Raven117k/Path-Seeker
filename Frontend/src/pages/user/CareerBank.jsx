import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, Bookmark, ArrowRight, X, CheckCircle2, Save, TrendingUp, Code, BarChart3, Palette, Cloud } from 'lucide-react';
import PageLoader from '../../components/PageLoader';

export default function CareerBank() {
  const { user } = useAuth();
  const [careers, setCareers] = useState([]);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('All');
  const [demand, setDemand] = useState('All');
  const [minSalary, setMinSalary] = useState(50000);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Saved filters state
  const [savedFilters, setSavedFilters] = useState(() => {
    const saved = localStorage.getItem('pathseeker_saved_filters');
    return saved ? JSON.parse(saved) : [];
  });

  // Sticky note modal state
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteItem, setNoteItem] = useState(null);
  const [stickyNoteText, setStickyNoteText] = useState('');

  useEffect(() => {
    fetchCareers();
  }, [domain, demand, minSalary]);

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (domain !== 'All') params.append('domain', domain);
      if (demand !== 'All') params.append('demand', demand);
      if (minSalary > 0) params.append('minSalary', minSalary);
      if (search) params.append('search', search);

      const res = await apiFetch(`/careers?${params.toString()}`, { useFallback: true });
      setCareers(res.careers || []);
    } catch (err) {}
    finally { setLoading(false); }
  };

  const handleSaveFilter = () => {
    const newFilter = { id: Date.now(), domain, demand, minSalary, search };
    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem('pathseeker_saved_filters', JSON.stringify(updated));
    alert('Filter preference saved!');
  };

  const applySavedFilter = (f) => {
    setDomain(f.domain);
    setDemand(f.demand);
    setMinSalary(f.minSalary);
    if (f.search) setSearch(f.search);
  };

  const handleBookmarkWithNote = async () => {
    try {
      await apiFetch('/bookmarks', {
        method: 'POST',
        body: JSON.stringify({
          itemType: 'career',
          itemId: noteItem._id,
          title: noteItem.title,
          subtitle: `${noteItem.domain} — PKR ${(noteItem.salaryRange?.min || 0).toLocaleString()} - ${(noteItem.salaryRange?.max || 0).toLocaleString()}`,
          stickyNote: stickyNoteText
        })
      });

      alert('Career profile bookmarked with sticky note!');
      setNoteModalOpen(false);
      setStickyNoteText('');
    } catch (err) {
      alert('Item is already bookmarked or saved.');
      setNoteModalOpen(false);
    }
  };

  return (
    <div className="user-page">
        <div className="user-page-header">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Advanced <span className="gradient-text">Career Bank</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Multi-level filtering by skill match, salary range, demand growth, and saved preferences.</p>
        </div>

      {/* Advanced Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Domain Category</label>
            <select value={domain} onChange={(e) => setDomain(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {['All', 'Technology', 'Healthcare', 'Business & Finance', 'Creative & Design', 'Engineering', 'Education', 'Legal & Policy'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Job Demand Level</label>
            <select value={demand} onChange={(e) => setDemand(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {['All', 'Explosive Growth', 'Very High', 'High', 'Moderate'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Min Salary: PKR {minSalary.toLocaleString()}</label>
            <input type="range" min="40000" max="150000" step="5000" value={minSalary} onChange={(e) => setMinSalary(Number(e.target.value))} style={{ width: '100%', marginTop: '0.6rem' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
            <button onClick={fetchCareers} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Search</button>
            <button onClick={handleSaveFilter} className="btn-secondary" title="Save filter preference"><Save size={18} /></button>
          </div>
        </div>

        {/* Saved Filters Tags */}
        {savedFilters.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Saved Preferences:</span>
            {savedFilters.map((sf) => (
              <button key={sf.id} onClick={() => applySavedFilter(sf)} className="badge badge-indigo" style={{ cursor: 'pointer', border: 'none' }}>
                {sf.domain} | PKR {sf.minSalary.toLocaleString()}+
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? <PageLoader label="Loading career profiles..." /> : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.75rem' }}>
        {careers.map((career, idx) => {
          const iconMap = { 'Software Engineer': Code, 'Data Scientist': BarChart3, 'UX/UI Designer': Palette, 'Cloud Architect': Cloud };
          const IconComponent = iconMap[career.title] || Search;
          const isDemandHigh = career.jobDemand === 'High' || career.jobDemand === 'Very High' || career.jobDemand === 'Explosive Growth';
          const demandColor = isDemandHigh ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)';
          const demandBgColor = isDemandHigh ? '#e6f4ea' : 'rgba(99, 102, 241, 0.1)';
          const demandTextColor = isDemandHigh ? '#31A24C' : 'var(--text-secondary)';

          return (
            <div
              key={career._id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                group: true,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Decorative Circle */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '96px',
                  height: '96px',
                  background: demandColor,
                  borderBottomLeftRadius: '100%',
                  marginRight: '-16px',
                  marginTop: '-16px',
                  opacity: 0.5,
                  transition: 'transform 0.3s ease',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <IconComponent size={24} color='var(--accent-primary)' />
                  </div>
                  <span
                    style={{
                      background: demandBgColor,
                      color: demandTextColor,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.4rem 0.75rem',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      border: isDemandHigh ? '1px solid #bce8c8' : '1px solid rgba(99, 102, 241, 0.2)',
                    }}
                  >
                    <TrendingUp size={12} /> {career.jobDemand} Demand
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--text-primary)' }}>
                  {career.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {career.description}
                </p>

                {/* Skills Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {(career.requiredSkills || career.skills || []).slice(0, 2).map((skill, i) => (
                    <span
                      key={i}
                      style={{
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.35rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Avg. Salary</span>
                  <div style={{ fontWeight: 800, color: 'var(--accent-emerald)', fontSize: '1rem' }}>
                    PKR {(career.salaryRange?.min || 0).toLocaleString()}+
                  </div>
                </div>
                <button
                  onClick={() => {
                    setNoteItem(career);
                    setNoteModalOpen(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent-primary)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                  title="Bookmark with Sticky Note"
                >
                  <Bookmark size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>}

      {/* Sticky Note Modal */}
      {noteModalOpen && noteItem && (
        <div className="modal-overlay" onClick={() => setNoteModalOpen(false)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Add Sticky Note for {noteItem.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Attach personal notes to your saved career passport bookmark.</p>

            <textarea
              rows={4}
              value={stickyNoteText}
              onChange={(e) => setStickyNoteText(e.target.value)}
              placeholder="e.g. Focus on PyTorch models in Q3, target salary $120k..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', marginBottom: '1.25rem' }}
            />

            <button onClick={handleBookmarkWithNote} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Save Bookmark & Sticky Note
            </button>
          </div>
        </div>
      )}
      </div>
  );
}
