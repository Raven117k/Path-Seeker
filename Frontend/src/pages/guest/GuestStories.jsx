import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Award, Filter, X, ChevronRight, Send, CheckCircle2 } from 'lucide-react';
import PageLoader from '../../components/PageLoader';
import Reveal from '../../components/Reveal';

export default function GuestStories() {
  const { user, openAuthModal } = useAuth();
  const [stories, setStories] = useState([]);
  const [domain, setDomain] = useState('All');
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Submit story modal state
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [roleTitle, setRoleTitle] = useState('');
  const [storyDomain, setStoryDomain] = useState('Technology');
  const [summary, setSummary] = useState('');
  const [eduPath, setEduPath] = useState('');
  const [challenge, setChallenge] = useState('');
  const [breakthrough, setBreakthrough] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    fetchStories();
  }, [domain]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const url = domain === 'All' ? '/stories' : `/stories?domain=${encodeURIComponent(domain)}`;
      const res = await apiFetch(url, { useFallback: true });
      setStories(res.stories || []);
    } catch (err) {
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/stories', {
        method: 'POST',
        body: JSON.stringify({
          role: roleTitle,
          domain: storyDomain,
          summary,
          timeline: [
            { stage: 'Educational Path', title: 'Degree / Certifications', description: eduPath },
            { stage: 'Challenges Faced', title: 'Obstacles Overcome', description: challenge },
            { stage: 'Career Breakthrough', title: 'Landing the Role', description: breakthrough }
          ]
        })
      });

      setSubmitSuccess('Story submitted successfully! Our admins will review and publish it.');
      setTimeout(() => {
        setSubmitModalOpen(false);
        setSubmitSuccess('');
      }, 2500);
    } catch (err) {
      alert('Error submitting story.');
    }
  };

  const domains = ['All', 'Technology', 'Healthcare', 'Business & Finance', 'Creative & Design', 'Engineering'];

  const pageContent = (
    <div className="guest-page-shell">
      <Reveal variant="slide-up" delay={50}>
      <div className="guest-page-hero">
        <span className="section-kicker">Real routes · Real lessons</span>
        <h1>Success <span className="gradient-text">Stories Hub</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '650px', margin: '0.5rem auto 1.5rem' }}>
          Real career journeys from Pakistani students, graduates, and professionals who navigated their paths to meaningful work.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className={domain === d ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
            >
              {d}
            </button>
          ))}

          {user && (
            <button onClick={() => setSubmitModalOpen(true)} className="btn-secondary" style={{ color: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}>
              <Send size={16} /> Submit Your Story
            </button>
          )}
        </div>
      </div>
      </Reveal>

      {loading ? (
        <PageLoader label="Loading Stories..." />
      ) : (
        <div className="guest-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.75rem' }}>
          {stories.map((story, index) => (
            <Reveal key={story._id} variant="slide-up" delay={index * 55}>
            <div className="glass-panel" style={{ height: '100%', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <img
                    src={story.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={story.name}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{story.name}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{story.role}</div>
                  </div>
                </div>

                <span className="badge badge-indigo" style={{ marginBottom: '0.75rem' }}>{story.domain}</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  "{story.summary}"
                </p>
              </div>

              <button onClick={() => setSelectedStory(story)} className="btn-secondary" style={{ justifyContent: 'center' }}>
                View Interactive Timeline <ChevronRight size={16} />
              </button>
            </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* Story Timeline Modal */}
      {selectedStory && (
        <div className="modal-overlay" onClick={() => setSelectedStory(null)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={selectedStory.avatar} alt={selectedStory.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{selectedStory.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{selectedStory.role}</div>
                </div>
              </div>
              <button onClick={() => setSelectedStory(null)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}>
                <X size={18} />
              </button>
            </div>

            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '1.25rem' }}>
              Career Milestone Timeline
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {selectedStory.timeline && selectedStory.timeline.map((step, idx) => (
                <div key={idx} style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>{step.stage}</div>
                  <h5 style={{ fontSize: '1rem', fontWeight: 800, margin: '0.2rem 0 0.4rem' }}>{step.title}</h5>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Submission Modal */}
      {submitModalOpen && (
        <div className="modal-overlay" onClick={() => setSubmitModalOpen(false)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Submit Your Success Story</h3>
              <button onClick={() => setSubmitModalOpen(false)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}><X size={18} /></button>
            </div>

            {submitSuccess ? (
              <div style={{ color: 'var(--accent-emerald)', padding: '1rem', textAlign: 'center', fontWeight: 700 }}>
                <CheckCircle2 size={32} style={{ marginBottom: '0.5rem' }} /><br />
                {submitSuccess}
              </div>
            ) : (
              <form onSubmit={handleStorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Your Current Role Title</label>
                  <input type="text" required value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} placeholder="e.g. Lead Software Engineer at Acme Corp" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', marginTop: '0.2rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Domain</label>
                  <select value={storyDomain} onChange={(e) => setStoryDomain(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Business & Finance">Business & Finance</option>
                    <option value="Creative & Design">Creative & Design</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Story Executive Summary</label>
                  <textarea required rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief summary of your career growth..." style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', marginTop: '0.2rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Educational Path Description</label>
                  <input type="text" required value={eduPath} onChange={(e) => setEduPath(e.target.value)} placeholder="Degree, bootcamps, courses..." style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', marginTop: '0.2rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Main Challenge Overcome</label>
                  <input type="text" required value={challenge} onChange={(e) => setChallenge(e.target.value)} placeholder="Obstacles faced during interviews..." style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', marginTop: '0.2rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Key Breakthrough</label>
                  <input type="text" required value={breakthrough} onChange={(e) => setBreakthrough(e.target.value)} placeholder="Project or event that landed the job..." style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', marginTop: '0.2rem' }} />
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                  Submit Story for Approval
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return pageContent;
}
