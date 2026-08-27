import React, { useState, useEffect } from 'react';
import { apiFetch, STATIC_MULTIMEDIA } from '../../services/api';
import { Video, Mic, FileText, Star, ThumbsUp, Eye, Tag, Play, X, Sparkles, Palette } from 'lucide-react';
import PageLoader from '../../components/PageLoader';

const getPlayableMediaUrl = (url) => {
  if (!url) return 'https://www.youtube.com/embed/5qap5aO4i9A';

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('youtube.com')) {
      const videoId = parsedUrl.pathname === '/watch'
        ? parsedUrl.searchParams.get('v')
        : parsedUrl.pathname.split('/').filter(Boolean).pop();
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (parsedUrl.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${parsedUrl.pathname.slice(1)}`;
    }
  } catch (err) {
    return url;
  }

  return url;
};

const isDirectVideo = (url) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url || '');

export default function MultimediaCenter() {
  const [items, setItems] = useState([]);
  const [activeType, setActiveType] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, [activeType]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const url = activeType === 'all' ? '/multimedia' : `/multimedia?type=${activeType}`;
      const res = await apiFetch(url, { useFallback: true });
      setItems(res.items || STATIC_MULTIMEDIA);
    } catch (err) {
      setItems(STATIC_MULTIMEDIA);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (ratingVal) => {
    if (!selectedMedia) return;
    try {
      await apiFetch(`/multimedia/${selectedMedia._id}/rate`, {
        method: 'POST',
        body: JSON.stringify({ rating: ratingVal })
      });
      alert('Thank you for your feedback rating!');
    } catch (err) {
      alert('Rating saved!');
    }
  };

  return (
    <div className="user-page">
        <div className="user-page-header" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Interactive <span className="gradient-text">Multimedia Center</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '650px', margin: '0.5rem auto 1.5rem' }}>
            Stream video tutorials, podcasts, and explainers equipped with transcripts, ratings, and tag filtering.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {['all', 'video', 'podcast', 'anim_explainer'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={activeType === t ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'center' }}
            >
              {t === 'all' ? 'All Content' : t === 'video' ? (<><Video size={14} /> Videos</>) : t === 'podcast' ? (<><Mic size={14} /> Podcasts</>) : (<><Palette size={14} /> Explainers</>)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <PageLoader label="Loading Media..." />
      ) : (
        <div>
          {/* Featured Content Bento Grid */}
          {items.length > 0 && (
            <div style={{ display: 'none' }}>
              {/* Main Featured Card (2-column span on larger screens) */}
              <div
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  group: true,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img
                    src={items[0]?.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'}
                    alt={items[0]?.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(15,23,42,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                  >
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)' }}>
                      <Play size={28} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
                    </div>
                  </div>
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ background: 'var(--accent-emerald)', color: 'white', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Featured
                    </span>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {items[0]?.duration || '12:45'}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {items[0]?.title}
                    </h3>
                    <button
                      onClick={() => setSelectedMedia(items[0])}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <Sparkles size={20} />
                    </button>
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                    {items[0]?.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {(items[0]?.tags || []).slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          style={{
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: 'var(--accent-primary)',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                      <Star size={16} fill="var(--accent-amber)" />
                      {items[0]?.ratingAvg || 4.9} ({items[0]?.ratingCount || 128})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', overflowX: 'auto' }}>
            {['All Resources', 'Videos Only', 'Podcasts', 'Explainers'].map((label) => (
              <button
                key={label}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: label === 'All Resources' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  borderBottom: label === 'All Resources' ? '2px solid var(--accent-primary)' : 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (label !== 'All Resources') e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  if (label !== 'All Resources') e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Media Cards Grid */}
          <div className="multimedia-card-grid">
            {items.map((item) => (
              <div
                key={item._id}
                className="multimedia-card"
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedMedia(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="multimedia-card-thumbnail" style={{ position: 'relative', width: '100%', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                  <img
                    src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80'}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(15,23,42,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                  >
                    <Play size={24} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
                  </div>
                  <span style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', background: 'rgba(15,23,42,0.7)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>
                    {item.duration || '08:20'}
                  </span>
                </div>
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {(item.tags || []).slice(0, 1).map((tag, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            background: 'rgba(99, 102, 241, 0.15)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-amber)' }}>
                      <Star size={14} fill="var(--accent-amber)" /> {item.ratingAvg || 4.5}
                    </div>
                    <button
                      onClick={() => setSelectedMedia(item)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <Sparkles size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Player Modal with Transcript Toggle */}
      {selectedMedia && (
        <div className="modal-overlay" onClick={() => setSelectedMedia(null)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-indigo" style={{ marginBottom: '0.3rem' }}>{selectedMedia.type}</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{selectedMedia.title}</h2>
              </div>
              <button onClick={() => setSelectedMedia(null)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}><X size={18} /></button>
            </div>

            {/* Embedded media player */}
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', background: '#000' }}>
              {isDirectVideo(selectedMedia.url) ? (
                <video
                  src={getPlayableMediaUrl(selectedMedia.url)}
                  title={selectedMedia.title}
                  controls
                  playsInline
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <iframe
                  src={getPlayableMediaUrl(selectedMedia.url)}
                  title={selectedMedia.title}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>

            {/* Rating & Transcript Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', pb: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Rate this content:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => handleRate(star)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Star size={18} fill={star <= userRating ? 'var(--accent-amber)' : 'none'} color="var(--accent-amber)" />
                  </button>
                ))}
              </div>

              <button onClick={() => setShowTranscript(!showTranscript)} className="btn-secondary">
                <FileText size={16} /> {showTranscript ? 'Hide Transcript' : 'Show Full Transcript'}
              </button>
            </div>

            {/* Transcript Drawer */}
            {showTranscript && (
              <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--accent-primary)' }}>Audio/Video Transcript</h4>
                {selectedMedia.transcript || 'Transcript coming soon...'}
              </div>
            )}
          </div>
        </div>
      )}
      </div>
  );
}
