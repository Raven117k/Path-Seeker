import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { Users, Shield, Search, CheckCircle2, AlertCircle, XCircle, UserCheck, Edit, X, Save } from 'lucide-react';
import PageLoader from '../../components/PageLoader';

const ROLES = ['student', 'graduate', 'professional', 'admin'];

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    let list = [...users];
    if (roleFilter !== 'all') list = list.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [users, search, roleFilter]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/admin/users');
      setUsers(res.users || []);
    } catch (err) {
      setError(err.message || 'Could not load users. Make sure the server is running.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiFetch(`/admin/users/${userId}`, { method: 'PUT', body: JSON.stringify({ role: newRole }) });
      showToast('success', `Role updated to "${newRole}".`);
      fetchUsers();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'activate' : 'deactivate';
    if (!window.confirm(`Are you sure you want to ${action} this account?`)) return;
    try {
      await apiFetch(`/admin/users/${userId}`, { method: 'PUT', body: JSON.stringify({ isActive: newStatus }) });
      showToast('success', `Account ${newStatus ? 'activated' : 'deactivated'}.`);
      fetchUsers();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || '', email: user.email || '', password: '', contact: user.contact || '',
      role: user.role || 'student', avatar: user.avatar || '', educationLevel: user.educationLevel || 'High School',
      institution: user.institution || '', fieldOfStudy: user.fieldOfStudy || '',
      skills: (user.skills || []).join(', '), interests: (user.interests || []).join(', '),
      workExperience: user.workExperience || '', resumeUrl: user.resumeUrl || '', isActive: user.isActive !== false
    });
  };

  const updateEditField = (field, value) => setEditForm((current) => ({ ...current, [field]: value }));

  const handleEditSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...editForm,
        skills: editForm.skills.split(',').map((item) => item.trim()).filter(Boolean),
        interests: editForm.interests.split(',').map((item) => item.trim()).filter(Boolean)
      };
      if (!payload.password.trim()) delete payload.password;
      await apiFetch(`/admin/users/${editingUser._id}`, { method: 'PUT', body: JSON.stringify(payload) });
      showToast('success', `Profile for "${payload.name}" updated.`);
      setEditingUser(null);
      setEditForm(null);
      fetchUsers();
    } catch (err) {
      showToast('error', err.message || 'Could not update user.');
    } finally {
      setSaving(false);
    }
  };

  const roleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'badge-rose';
      case 'graduate': return 'badge-emerald';
      case 'professional': return 'badge-amber';
      default: return 'badge-indigo';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999, background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)', border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'}`, color: toast.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', maxWidth: '420px' }}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />} {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Manage <span className="gradient-text">Users & Passports</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>View accounts, adjust user roles, and activate or deactivate accounts.</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', minWidth: '150px' }}>
          <option value="all">All Roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
        <button onClick={fetchUsers} className="btn-secondary">Refresh</button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--accent-rose)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        {loading ? (
          <PageLoader label="Loading users..." />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            {users.length === 0 ? 'No users registered yet.' : 'No users match your search filters.'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <th style={{ padding: '0.75rem' }}>NAME</th>
                <th style={{ padding: '0.75rem' }}>EMAIL</th>
                <th style={{ padding: '0.75rem' }}>ROLE</th>
                <th style={{ padding: '0.75rem' }}>STATUS</th>
                <th style={{ padding: '0.75rem' }}>JOINED</th>
                <th style={{ padding: '0.75rem' }}>CHANGE ROLE</th>
                <th style={{ padding: '0.75rem' }}>ACCOUNT</th>
                <th style={{ padding: '0.75rem' }}>EDIT</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
                  <td style={{ padding: '0.85rem', fontWeight: 700 }}>{u.name}</td>
                  <td style={{ padding: '0.85rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '0.85rem' }}>
                    <span className={`badge ${roleBadgeColor(u.role)}`}>{u.role.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <span className={`badge ${u.isActive !== false ? 'badge-emerald' : 'badge-rose'}`}>
                      {u.isActive !== false ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      style={{ padding: '0.35rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.82rem' }}
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <button
                      onClick={() => handleToggleStatus(u._id, u.isActive !== false)}
                      style={{
                        background: 'none', border: '1px solid',
                        borderColor: u.isActive !== false ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                        color: u.isActive !== false ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                        padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem'
                      }}
                    >
                      {u.isActive !== false ? <><XCircle size={13} /> Deactivate</> : <><UserCheck size={13} /> Activate</>}
                    </button>
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <button onClick={() => openEdit(u)} className="btn-secondary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}>
                      <Edit size={13} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length > 0 && (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            Showing {filtered.length} of {users.length} users
          </div>
        )}
      </div>

      {editingUser && editForm && (
        <div className="modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditingUser(null); }}>
          <div className="admin-user-modal glass-panel">
            <div className="admin-modal-header">
              <div><span className="badge badge-indigo">User administration</span><h2>Edit user profile</h2><p>Update account access and passport details.</p></div>
              <button className="icon-button" onClick={() => setEditingUser(null)} title="Close editor" aria-label="Close editor"><X size={18} /></button>
            </div>
            <form onSubmit={handleEditSave} className="admin-user-form">
              <label>Full name<input required value={editForm.name} onChange={(e) => updateEditField('name', e.target.value)} /></label>
              <label>Email address<input required type="email" value={editForm.email} onChange={(e) => updateEditField('email', e.target.value)} /></label>
              <label>New password <span>(leave blank to keep current)</span><input type="password" minLength="6" value={editForm.password} onChange={(e) => updateEditField('password', e.target.value)} /></label>
              <label>Contact<input value={editForm.contact} onChange={(e) => updateEditField('contact', e.target.value)} /></label>
              <label>Role<select value={editForm.role} onChange={(e) => updateEditField('role', e.target.value)}>{ROLES.map((role) => <option key={role} value={role}>{role}</option>)}</select></label>
              <label>Education level<select value={editForm.educationLevel} onChange={(e) => updateEditField('educationLevel', e.target.value)}><option>High School</option><option>Undergraduate</option><option>Bachelor Degree</option><option>Master Degree</option><option>PhD / Doctorate</option></select></label>
              <label>Institution<input value={editForm.institution} onChange={(e) => updateEditField('institution', e.target.value)} /></label>
              <label>Field of study<input value={editForm.fieldOfStudy} onChange={(e) => updateEditField('fieldOfStudy', e.target.value)} /></label>
              <label>Skills <span>(comma separated)</span><input value={editForm.skills} onChange={(e) => updateEditField('skills', e.target.value)} /></label>
              <label>Interests <span>(comma separated)</span><input value={editForm.interests} onChange={(e) => updateEditField('interests', e.target.value)} /></label>
              <label className="admin-user-form-wide">Work experience<textarea rows="3" value={editForm.workExperience} onChange={(e) => updateEditField('workExperience', e.target.value)} /></label>
              <label className="admin-user-form-wide">Avatar URL<input value={editForm.avatar} onChange={(e) => updateEditField('avatar', e.target.value)} /></label>
              <label className="admin-user-form-wide">Resume URL<input value={editForm.resumeUrl} onChange={(e) => updateEditField('resumeUrl', e.target.value)} /></label>
              <label className="admin-user-active"><input type="checkbox" checked={editForm.isActive} onChange={(e) => updateEditField('isActive', e.target.checked)} /> Account active</label>
              <div className="admin-modal-actions"><button type="button" className="btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button><button type="submit" className="btn-primary" disabled={saving}><Save size={15} /> {saving ? 'Saving...' : 'Save user'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
