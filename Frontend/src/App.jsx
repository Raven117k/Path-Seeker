import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SitemapModal from './components/SitemapModal';
import AuthModal from './components/AuthModal';
import NotificationDrawer from './components/NotificationDrawer';
import AdminShell from './components/AdminShell';
import UserShell from './components/UserShell';
import Chatbot from './components/Chatbot';

// Guest Site Pages
import GuestHome from './pages/guest/GuestHome';
import GuestCareers from './pages/guest/GuestCareers';
import GuestStories from './pages/guest/GuestStories';
import GuestResources from './pages/guest/GuestResources';
import GuestAbout from './pages/guest/GuestAbout';

// User Panel Pages
import UserDashboard from './pages/user/UserDashboard';
import CareerBank from './pages/user/CareerBank';
import InterestQuiz from './pages/user/InterestQuiz';
import MultimediaCenter from './pages/user/MultimediaCenter';
import BookmarksAndNotes from './pages/user/BookmarksAndNotes';
import FeedbackAndSupport from './pages/user/FeedbackAndSupport';
import UserProfile from './pages/user/UserProfile';
import DecisionHelper from './pages/user/DecisionHelper';

// Admin Panel Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCareers from './pages/admin/ManageCareers';
import ManageQuiz from './pages/admin/ManageQuiz';
import ManageMultimedia from './pages/admin/ManageMultimedia';
import ManageStories from './pages/admin/ManageStories';
import ManageResources from './pages/admin/ManageResources';
import ManageFeedback from './pages/admin/ManageFeedback';

// Protected Route helper
function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/user/dashboard" replace />;
  return children;
}

const USER_PANEL_PATHS = [
  '/user/dashboard',
  '/user/decision-helper',
  '/user/careers',
  '/user/multimedia',
  '/user/stories',
  '/user/quiz',
  '/user/resources',
  '/user/bookmarks',
  '/user/feedback',
  '/user/profile'
];

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  const [panelLoading, setPanelLoading] = useState(false);
  const currentPath = location.pathname.replace(/\/+$/, '') || '/';
  const isAdminRoute = currentPath.startsWith('/admin');
  const isUserPanelRoute = Boolean(user && USER_PANEL_PATHS.includes(currentPath));

  useEffect(() => {
    const isPanelRoute = isAdminRoute || isUserPanelRoute;
    if (!isPanelRoute) {
      setPanelLoading(false);
      return undefined;
    }

    setPanelLoading(true);
    const timeoutId = window.setTimeout(() => setPanelLoading(false), 650);
    return () => window.clearTimeout(timeoutId);
  }, [isAdminRoute, isUserPanelRoute, currentPath]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminRoute && !isUserPanelRoute && <Navbar />}
      <NotificationDrawer />
      <SitemapModal />
      <AuthModal />
      <Chatbot />

      <main className={`app-main${isAdminRoute ? ' admin-main' : ''}`}>
        {panelLoading && (
          <div className="panel-loading-bar" role="progressbar" aria-label="Loading panel" aria-valuemin="0" aria-valuemax="100">
            <span />
          </div>
        )}
        {isAdminRoute ? (
          <AdminShell>
            <Routes>
              {/* Admin Panel Routes */}
              <Route path="/admin/" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
              <Route path="/admin/careers" element={<ProtectedRoute adminOnly><ManageCareers /></ProtectedRoute>} />
              <Route path="/admin/quiz" element={<ProtectedRoute adminOnly><ManageQuiz /></ProtectedRoute>} />
              <Route path="/admin/multimedia" element={<ProtectedRoute adminOnly><ManageMultimedia /></ProtectedRoute>} />
              <Route path="/admin/stories" element={<ProtectedRoute adminOnly><ManageStories /></ProtectedRoute>} />
              <Route path="/admin/resources" element={<ProtectedRoute adminOnly><ManageResources /></ProtectedRoute>} />
              <Route path="/admin/feedback" element={<ProtectedRoute adminOnly><ManageFeedback /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute adminOnly><UserProfile /></ProtectedRoute>} />
            </Routes>
          </AdminShell>
        ) : isUserPanelRoute ? (
          <UserShell>
            <Routes>
              {/* User Panel Routes */}
              <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              <Route path="/user/decision-helper" element={<ProtectedRoute><DecisionHelper /></ProtectedRoute>} />
              <Route path="/user/careers" element={<ProtectedRoute><CareerBank /></ProtectedRoute>} />
              <Route path="/user/multimedia" element={<ProtectedRoute><MultimediaCenter /></ProtectedRoute>} />
              <Route path="/user/stories" element={<ProtectedRoute><GuestStories /></ProtectedRoute>} />
              <Route path="/user/quiz" element={<ProtectedRoute><InterestQuiz /></ProtectedRoute>} />
              <Route path="/user/resources" element={<ProtectedRoute><GuestResources /></ProtectedRoute>} />
              <Route path="/user/bookmarks" element={<ProtectedRoute><BookmarksAndNotes /></ProtectedRoute>} />
              <Route path="/user/feedback" element={<ProtectedRoute><FeedbackAndSupport /></ProtectedRoute>} />
              <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            </Routes>
          </UserShell>
        ) : (
          <Routes>
            {/* Guest Site Routes */}
            <Route path="/" element={<GuestHome />} />
            <Route path="/careers" element={<GuestCareers />} />
            <Route path="/stories" element={<GuestStories />} />
            <Route path="/resources" element={<GuestResources />} />
            <Route path="/about" element={<GuestAbout />} />

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>

      {!isAdminRoute && !isUserPanelRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
