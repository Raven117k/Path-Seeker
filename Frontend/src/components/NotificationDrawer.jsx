import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { X, Bell, CheckCheck, MessageSquare, AlertCircle } from 'lucide-react';

export default function NotificationDrawer() {
  const { notificationsOpen, setNotificationsOpen, notifications, setNotifications, unreadCount, setUnreadCount, user } = useAuth();

  useEffect(() => {
    if (user && notificationsOpen) {
      fetchNotifications();
    }
  }, [user, notificationsOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch('/notifications');
      if (res.notifications) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      // Server unreachable - show empty notifications
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const markAllRead = async () => {
    try {
      await apiFetch('/notifications/read', { method: 'PUT' });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      setUnreadCount(0);
    }
  };

  if (!notificationsOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '70px',
        right: '20px',
        width: '360px',
        maxHeight: '480px',
        zIndex: 90,
        overflowY: 'auto'
      }}
      className="glass-panel"
    >
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
          <Bell size={18} color="var(--accent-primary)" /> Notifications
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <CheckCheck size={14} /> Mark Read
            </button>
          )}
          <button onClick={() => setNotificationsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
      </div>

      <div style={{ padding: '0.75rem' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No new notifications
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item._id || Math.random()}
              style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: item.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.08)',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '0.5rem'
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MessageSquare size={14} color="var(--accent-primary)" /> {item.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {item.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
