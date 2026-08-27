import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Award,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  CircleHelp,
  Compass,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Moon,
  PanelLeft,
  Settings2,
  Sun,
  Users,
  Video
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Overview', path: '/admin', icon: LayoutDashboard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Careers', path: '/admin/careers', icon: BriefcaseBusiness },
  { label: 'Quiz library', path: '/admin/quiz', icon: CircleHelp },
  { label: 'Multimedia', path: '/admin/multimedia', icon: Video },
  { label: 'Stories', path: '/admin/stories', icon: Award },
  { label: 'Resources', path: '/admin/resources', icon: BookOpen },
  { label: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
  { label: 'Settings', path: '/admin/settings', icon: Settings2 }
];

export default function AdminShell({ children }) {
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/+$/, '') || '/';
  const navigate = useNavigate();
  const {
    user,
    logout,
    theme,
    toggleTheme,
    notificationsOpen,
    setNotificationsOpen,
    unreadCount
  } = useAuth();

  const activeItem = NAV_ITEMS.find((item) => item.path.replace(/\/+$/, '') === currentPath) || NAV_ITEMS[0];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin/" className="admin-brand">
          <span className="admin-brand-mark"><Compass size={20} /></span>
          <span>
            <strong>PathSeeker</strong>
            <small>ADMIN CONSOLE</small>
          </span>
        </Link>

        <div className="admin-sidebar-label">Workspace</div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
            const isActive = currentPath === path.replace(/\/+$/, '');
            return (
              <Link key={path} to={path} className={`admin-nav-item${isActive ? ' active' : ''}`} aria-current={isActive ? 'page' : undefined}>
                <Icon size={17} />
                <span>{label}</span>
                {isActive && <ChevronRight size={15} className="admin-nav-arrow" />}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <Link to="/" className="admin-back-link"><PanelLeft size={16} /> View public site</Link>
          <button className="admin-logout" onClick={() => { logout(); navigate('/'); }}><LogOut size={16} /> Sign out</button>
        </div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-breadcrumb">
            <span>Admin</span><ChevronRight size={14} /><strong>{activeItem.label}</strong>
          </div>
          <div className="admin-top-actions">
            <span className="admin-live"><Activity size={14} /> System online</span>
            <button className="icon-button" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="icon-button notification-button" onClick={() => setNotificationsOpen(!notificationsOpen)} title="Notifications" aria-label="Notifications">
              <Bell size={17} />
              {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
            </button>
            <div className="admin-profile">
              <span className="admin-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
              <span className="admin-profile-copy"><strong>{user?.name || 'Administrator'}</strong></span>
            </div>
          </div>
        </header>
        <div className="admin-page-content">{children}</div>
      </section>
    </div>
  );
}
