import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, Briefcase, TrendingUp, DollarSign, Bookmark, ArrowRight, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import PageLoader from '../../components/PageLoader';
import Reveal from '../../components/Reveal';

export default function GuestCareers() {
  const { user, openAuthModal } = useAuth();
  const [careers, setCareers] = useState([]);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('All');
  const [demand, setDemand] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(null);

  // Suggestions state
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchCareers();
  }, [domain, demand]);

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (domain !== 'All') queryParams.append('domain', domain);
      if (demand !== 'All') queryParams.append('demand', demand);
      if (search) queryParams.append('search', search);

      const res = await apiFetch(`/careers?${queryParams.toString()}`, { useFallback: true });
      setCareers(res.careers || []);
    } catch (err) {
      setCareers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCareers();
  };

  const handleLiveSearch = async (val) => {
    setSearch(val);
    if (val.length >= 2) {
      try {
        const res = await apiFetch(`/careers/suggestions?query=${encodeURIComponent(val)}`, { useFallback: true });
        setSuggestions(res.suggestions || []);
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const domains = ['All', 'Technology', 'Healthcare', 'Business & Finance', 'Creative & Design', 'Engineering', 'Education', 'Legal & Policy'];
  const demands = ['All', 'Explosive Growth', 'Very High', 'High', 'Moderate'];

  return (
    <div className="guest-page-shell">
      {/* Header */}
      <Reveal variant="slide-up" delay={50}>
      <div className="guest-page-hero">
        <span className="section-kicker">Career Passport · Pakistan Edition</span>
        <h1>Explore your <span className="gradient-text">next path.</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '650px', margin: '0.5rem auto 0' }}>
          Explore Pakistani career paths, PKR salary benchmarks, growth projections, and step-by-step education roadmaps.
        </p>
      </div>
      </Reveal>

      {/* Search & Filter Bar */}
      <Reveal variant="slide-up" delay={130}>
      <div className="glass-panel guest-page-toolbar" style={{ padding: '1.25rem', marginBottom: '2.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => handleLiveSearch(e.target.value)}
              placeholder="Search careers by title, skill (Python, Figma, SQL)..."
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.6rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem'
              }}
            />

            {/* Live Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="glass-panel" style={{ position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 30, padding: '0.5rem' }}>
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      setSearch(item.title);
                      setSuggestions([]);
                      fetchCareers();
                    }}
                    style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)' }}
                  >
                    <strong>{item.title}</strong> — <span style={{ color: 'var(--text-muted)' }}>{item.domain}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}
            >
              {domains.map((d) => (
                <option key={d} value={d}>Domain: {d}</option>
              ))}
            </select>

            <select
              value={demand}
              onChange={(e) => setDemand(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}
            >
              {demands.map((d) => (
                <option key={d} value={d}>Demand: {d}</option>
              ))}
            </select>

            <button type="submit" className="btn-primary">
              Filter Careers
            </button>
          </div>
        </form>
      </div>
      </Reveal>

      {/* Careers Grid */}
      {loading ? (
        <PageLoader label="Loading Career Profiles..." />
      ) : careers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h3>No matching careers found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Try broadening your search term or domain filter.</p>
        </div>
      ) : (
        <div className="guest-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.75rem' }}>
          {careers.map((career, index) => (
            <Reveal key={career._id} variant="slide-up" delay={index * 55}>
            <div className="glass-panel" style={{ height: '100%', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-indigo">{career.domain}</span>
                  <span className={`badge ${career.jobDemand === 'Explosive Growth' ? 'badge-rose' : 'badge-emerald'}`}>
                    {career.jobDemand} Demand
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {career.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                  {career.description}
                </p>

                {/* Skills tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  {career.requiredSkills.map((skill, idx) => (
                    <span key={idx} style={{ background: 'var(--bg-primary)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ESTIMATED SALARY</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      ${(career.salaryRange?.min || 0).toLocaleString()} - ${(career.salaryRange?.max || 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCareer(career)}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  View Career Roadmap <ArrowRight size={16} />
                </button>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* Career Detail & Roadmap Modal */}
      {selectedCareer && (
        <div className="modal-overlay" onClick={() => setSelectedCareer(null)}>
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>{selectedCareer.domain}</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{selectedCareer.title}</h2>
              </div>
              <button onClick={() => setSelectedCareer(null)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Overview & Scope</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedCareer.overview}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Educational Path</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{selectedCareer.educationPath}</p>
              </div>

              {/* Step-by-Step Roadmap */}
              {selectedCareer.roadmap && selectedCareer.roadmap.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--accent-primary)' }}>
                    Career Execution Roadmap
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedCareer.roadmap.map((step, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                          {idx + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{step.title} <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>({step.duration})</span></div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{step.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {!user ? (
                  <button onClick={() => { setSelectedCareer(null); openAuthModal('register'); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Sign In to Bookmark & Save Sticky Notes
                  </button>
                ) : (
                  <button onClick={() => alert('Saved to your bookmarks!')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Bookmark size={16} /> Bookmark Career Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
