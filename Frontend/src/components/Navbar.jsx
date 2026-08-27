import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bell, Compass, LayoutDashboard, LogOut, Menu, Moon, Sun, User as UserIcon, X
} from 'lucide-react';

const navItems = [
  { label: 'Careers', path: '/careers' },
  { label: 'Stories', path: '/stories' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' }
];

export default function Navbar() {
  const {
    user, logout, theme, toggleTheme, openAuthModal,
    notificationsOpen, setNotificationsOpen, unreadCount
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/+$/, '') || '/';
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="guest-navbar">
      <div className="guest-navbar-inner">
        <Link to="/" className="guest-brand" onClick={closeMenu} aria-label="PathSeeker home">
          <span className="guest-brand-mark"><Compass size={22} /></span>
          <span className="guest-brand-copy"><strong>Path<span>Seeker</span></strong><small>CAREER PASSPORT</small></span>
        </Link>

        <nav className={menuOpen ? 'guest-nav guest-nav--open' : 'guest-nav'} aria-label="Main navigation">
          <div className="guest-nav-links">
            {navItems.map((item) => <Link key={item.path} to={item.path} className={currentPath === item.path ? 'guest-nav-link guest-nav-link--active' : 'guest-nav-link'} onClick={closeMenu}>{item.label}</Link>)}
          </div>
          <div className="guest-nav-mobile-tools">
            <button onClick={() => { toggleTheme(); closeMenu(); }} className="guest-nav-action"><span>{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
          </div>
        </nav>

        <div className="guest-navbar-tools">
          <button onClick={toggleTheme} className="guest-icon-button" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
          {user ? <div className="guest-auth-tools"><button onClick={() => setNotificationsOpen(!notificationsOpen)} className="guest-icon-button guest-notification-button" title="Notifications" aria-label="Notifications"><Bell size={17} />{unreadCount > 0 && <span>{unreadCount}</span>}</button><Link to={user.role === 'admin' ? '/admin/' : '/user/dashboard'} className="btn-primary guest-dashboard-link"><LayoutDashboard size={16} />{user.role === 'admin' ? 'Admin panel' : 'Dashboard'}</Link><button onClick={() => navigate('/user/profile')} className="guest-icon-button" title="Edit profile" aria-label="Edit profile"><UserIcon size={17} /></button><button onClick={logout} className="guest-icon-button guest-logout" title="Log out" aria-label="Log out"><LogOut size={17} /></button></div> : <div className="guest-auth-tools"><button onClick={() => openAuthModal('login')} className="guest-sign-in">Sign in</button><button onClick={() => openAuthModal('register')} className="btn-primary guest-join-button">Get started <span>↗</span></button></div>}
        </div>
        <button className="guest-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </header>
  );
}
