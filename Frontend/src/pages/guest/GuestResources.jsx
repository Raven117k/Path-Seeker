import { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { Download, Eye, X, FileText, CheckSquare, Image } from 'lucide-react';
import PageLoader from '../../components/PageLoader';
import Reveal from '../../components/Reveal';

export default function GuestResources() {
  const [resources, setResources] = useState([]);
  const [type, setType] = useState('all');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, [type]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const url = type === 'all' ? '/resources' : `/resources?type=${type}`;
      const res = await apiFetch(url, { useFallback: true });
      setResources(res.resources || []);
    } catch (err) {
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      await apiFetch(`/resources/${doc._id}/download`, { method: 'POST' });
    } catch (err) {
      // Download tracking is non-critical, proceed with download
    }

    // Trigger download
    const link = document.createElement('a');
    link.href = doc.fileUrl || '#';
    link.target = '_blank';
    link.download = doc.title;
    link.click();
  };

  const getDocIcon = (docType) => {
    if (docType === 'PDF') return <FileText size={20} color="var(--accent-rose)" />;
    if (docType === 'Checklist') return <CheckSquare size={20} color="var(--accent-emerald)" />;
    return <Image size={20} color="var(--accent-cyan)" />;
  };

  const pageContent = (
    <div className="guest-page-shell">
      <Reveal variant="slide-up" delay={50}>
      <div className="guest-page-hero">
        <span className="section-kicker">Free tools for your next move</span>
        <h1>Document <span className="gradient-text">Resource Library</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '650px', margin: '0.5rem auto 1.5rem' }}>
          Downloadable checklists, PKR salary infographics, scholarship guides, and career preparation resources with instant previews.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {['all', 'PDF', 'Checklist', 'Infographic'].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={type === t ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
            >
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>
      </div>
      </Reveal>

      {loading ? (
        <PageLoader label="Loading Documents..." />
      ) : (
        <div className="guest-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.75rem' }}>
          {resources.map((doc, index) => (
            <Reveal key={doc._id} variant="slide-up" delay={index * 55}>
            <article className="resource-card glass-panel">
              <div>
                <div className="resource-card-meta">
                  <div className="resource-card-type">
                    {getDocIcon(doc.type)}
                    <span>{doc.type}</span>
                  </div>
                  <span className="resource-card-downloads">{doc.downloadCount || 0} downloads</span>
                </div>

                <h2 className="resource-card-title">{doc.title}</h2>
                <p className="resource-card-description">{doc.description}</p>

                {/* Tags */}
                <div className="resource-card-tags" aria-label="Resource tags">
                  {doc.tags && doc.tags.map((tag, idx) => (
                    <span key={idx} className="resource-card-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="resource-card-actions">
                <button onClick={() => setPreviewDoc(doc)} className="btn-secondary resource-card-preview">
                  <Eye size={16} /> Preview
                </button>
                <button onClick={() => handleDownload(doc)} className="btn-primary resource-card-download">
                  <Download size={16} /> Download
                </button>
              </div>
            </article>
            </Reveal>
          ))}
        </div>
      )}

      {/* Auto-preview Popup Modal */}
      {previewDoc && (
        <div className="modal-overlay" onClick={() => setPreviewDoc(null)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {getDocIcon(previewDoc.type)}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Document Preview: {previewDoc.title}</h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}><X size={18} /></button>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {previewDoc.previewContent || 'Document preview summary content loading...'}
            </div>

            <button onClick={() => handleDownload(previewDoc)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Download size={16} /> Download Full Document File ({previewDoc.type})
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return pageContent;
}
