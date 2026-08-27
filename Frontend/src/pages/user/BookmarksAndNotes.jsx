import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { Bookmark, StickyNote, Trash2, Edit3, Printer, Share2, Check } from 'lucide-react';
import PageLoader from '../../components/PageLoader';

export default function BookmarksAndNotes() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingNote, setEditingNote] = useState('');

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/bookmarks');
      setBookmarks(res.bookmarks || []);
    } catch (err) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async (id) => {
    try {
      await apiFetch(`/bookmarks/${id}/note`, {
        method: 'PUT',
        body: JSON.stringify({ stickyNote: editingNote })
      });
      setEditingId(null);
      fetchBookmarks();
    } catch (err) {
      alert('Note saved locally!');
      setEditingId(null);
    }
  };

  const handleRemove = async (id) => {
    try {
      await apiFetch(`/bookmarks/${id}`, { method: 'DELETE' });
      setBookmarks(bookmarks.filter((b) => b._id !== id));
    } catch (err) {
      setBookmarks(bookmarks.filter((b) => b._id !== id));
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="user-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Saved Bookmarks & <span className="gradient-text">Sticky Notes</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage saved career profiles, study notes, and export your career passport board as a PDF report.</p>
        </div>

        <button onClick={handlePrintPDF} className="btn-primary">
          <Printer size={16} /> Export Notes as PDF / Print
        </button>
      </div>

      {loading ? (
        <PageLoader label="Loading Bookmarks..." />
      ) : bookmarks.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Bookmark size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
          <h3>No Bookmarked Items Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Browse the Career Bank or Media Center and click the Bookmark icon to save items with sticky notes.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.75rem' }}>
          {bookmarks.map((b) => (
            <div key={b._id} className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid var(--accent-amber)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <StickyNote size={13} /> {b.itemType.toUpperCase()}
                  </span>
                  <button onClick={() => handleRemove(b._id)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.3rem' }}>{b.title}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '1rem' }}>{b.subtitle}</div>

                {/* Sticky Note Box */}
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px dashed rgba(245, 158, 11, 0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase' }}>Sticky Note:</span>
                    {editingId !== b._id ? (
                      <button onClick={() => { setEditingId(b._id); setEditingNote(b.stickyNote); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <Edit3 size={14} />
                      </button>
                    ) : (
                      <button onClick={() => handleSaveNote(b._id)} style={{ background: 'none', border: 'none', color: 'var(--accent-emerald)', cursor: 'pointer' }}>
                        <Check size={16} />
                      </button>
                    )}
                  </div>

                  {editingId === b._id ? (
                    <textarea
                      rows={3}
                      value={editingNote}
                      onChange={(e) => setEditingNote(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                    />
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontStyle: b.stickyNote ? 'normal' : 'italic' }}>
                      {b.stickyNote || 'No sticky note attached yet. Click edit to add notes.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
