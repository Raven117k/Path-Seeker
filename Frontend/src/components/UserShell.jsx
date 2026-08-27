import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  BriefcaseBusiness,
  Video,
  Award,
  BookOpen,
  Bookmark,
  MessageSquare,
  User as UserIcon,
  LogOut,
  Moon,
  Sun,
  Bell,
  Settings2,
  ChevronRight,
  PanelLeft,
  HelpCircle,
  GitCompare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const USER_NAV_ITEMS = [
  { label: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
  { label: 'Career Bank', path: '/user/careers', icon: BriefcaseBusiness },
  { label: 'Decision Helper', path: '/user/decision-helper', icon: GitCompare },
  { label: 'Multimedia', path: '/user/multimedia', icon: Video },
  { label: 'Success Stories', path: '/user/stories', icon: Award },
  { label: 'Interest Quiz', path: '/user/quiz', icon: HelpCircle },
  { label: 'Resources', path: '/user/resources', icon: BookOpen },
  { label: 'Bookmarks & Notes', path: '/user/bookmarks', icon: Bookmark },
  { label: 'Feedback & Support', path: '/user/feedback', icon: MessageSquare },
  { label: 'Profile', path: '/user/profile', icon: UserIcon },
];

export default function UserShell({ children }) {
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

  const activeItem = USER_NAV_ITEMS.find((item) => item.path === currentPath) || USER_NAV_ITEMS[0];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="user-shell">
      <aside className="user-sidebar">
        <Link to="/user/dashboard" className="user-brand">
          <span className="user-brand-mark"><Compass size={20} /></span>
          <span>
            <strong>PathSeeker</strong>
            <small>USER PORTAL</small>
          </span>
        </Link>

        <div className="user-sidebar-label">Navigation</div>
        <nav className="user-nav" aria-label="User navigation">
          {USER_NAV_ITEMS.map(({ label, path, icon: Icon }) => {
            const isActive = currentPath === path;
            return (
              <Link key={path} to={path} className={`user-nav-item${isActive ? ' active' : ''}`} aria-current={isActive ? 'page' : undefined}>
                <Icon size={17} />
                <span>{label}</span>
                {isActive && <ChevronRight size={15} className="user-nav-arrow" />}
              </Link>
            );
          })}
        </nav>

        <div className="user-sidebar-bottom">
          <Link to="/" className="user-back-link"><PanelLeft size={16} /> View public site</Link>
          <button className="user-logout" onClick={handleLogout}><LogOut size={16} /> Sign out</button>
        </div>
      </aside>

      <section className="user-workspace">
        <header className="user-topbar">
          <div className="user-breadcrumb">
            <span>User</span><ChevronRight size={14} /><strong>{activeItem.label}</strong>
          </div>
          <div className="user-top-actions">
            <button className="icon-button" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="icon-button notification-button" onClick={() => setNotificationsOpen(!notificationsOpen)} title="Notifications" aria-label="Notifications">
              <Bell size={17} />
              {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
            </button>
            <button className="icon-button" onClick={() => navigate('/user/profile')} title="Open settings" aria-label="Open settings">
              <Settings2 size={17} />
            </button>
            <div className="user-profile">
              <span className="user-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              <span className="user-profile-copy">
                <strong>{user?.name || 'User'}</strong>
                <small>{user?.role || 'student'}</small>
              </span>
            </div>
          </div>
        </header>
        <div className="user-page-content">{children}</div>
      </section>
    </div>
  );
}
