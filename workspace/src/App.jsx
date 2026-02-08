import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { useAuth } from './hooks/useAuth.jsx';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Login } from './components/auth/Login';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
// Navbar is now lazy loaded
import { Loading } from './components/common/Loading';
import { LevelUpModal } from './components/gamification/LevelUpModal';
import { PresenceProvider } from './context/PresenceContext';
import { DynamicBackground } from './components/layout/DynamicBackground';
import { ToastProvider } from './contexts/ToastContext';
import React, { Suspense, lazy } from 'react'; // Import lazy and Suspense
import './style.css';

import PublicLayout from './components/website/PublicLayout';
const PublicHomePage = lazy(() => import('./components/website/pages/HomePage'));
const PublicStatutePage = lazy(() => import('./components/website/pages/StatutePage'));
const PublicPrivacyPolicyPage = lazy(() => import('./components/website/pages/PrivacyPolicyPage'));
const PublicCookiePolicyPage = lazy(() => import('./components/website/pages/CookiePolicyPage'));

// Lazy Load Pages
const Navbar = lazy(() => import('./components/layout/Navbar').then(module => ({ default: module.Navbar })));
const WorkflowList = lazy(() => import('./components/workflows/WorkflowList').then(module => ({ default: module.WorkflowList })));
const CategoryManagement = lazy(() => import('./components/workflows/CategoryManagement').then(module => ({ default: module.CategoryManagement })));
const TeamMembers = lazy(() => import('./components/team/TeamMembers').then(module => ({ default: module.TeamMembers })));
const CompetencyManager = lazy(() => import('./components/competencies/CompetencyManager'));

const WorkflowDetail = lazy(() => import('./pages/WorkflowDetail'));
const MyTasks = lazy(() => import('./pages/MyTasks'));
const Chat = lazy(() => import('./pages/Chat'));
const Profile = lazy(() => import('./pages/Profile'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
// LandingPage is now directly imported
const Guide = lazy(() => import('./pages/Guide'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Documents = lazy(() => import('./pages/Documents'));
const Career = lazy(() => import('./pages/Career'));

const Store = lazy(() => import('./pages/Store'));
const Settings = lazy(() => import('./pages/Settings'));
const DeveloperRequests = lazy(() => import('./pages/DeveloperRequests'));
const SystemSettings = lazy(() => import('./pages/SystemSettings'));

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  const isGuidePage = location.pathname === '/' || location.pathname === '/home';
  const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';

  // Determine Background Variant
  const getBackgroundVariant = () => {
    const path = location.pathname;
    if (path.startsWith('/workflows') || path.startsWith('/workflow/') || path === '/mytasks') return 'workflows';
    if (path.startsWith('/documents')) return 'documents';
    if (path.startsWith('/career')) return 'career';
    return 'default';
  };
  const isWorkflowPage = location.pathname.startsWith('/workflows') || location.pathname.startsWith('/workflow/');

  const isSystemSettings = location.pathname === '/system-settings';

  const isStorePage = location.pathname === '/store';

  const isPublicPage = location.pathname.startsWith('/statuto') || location.pathname === '/' || location.pathname === '/home' || location.pathname === '/privacy-policy' || location.pathname === '/cookie-policy';

  return (
    <div className={`${isChatPage ? 'h-screen overflow-hidden flex flex-col' : 'min-h-screen flex flex-col'} text-gray-100 selection:bg-violet-500 selection:text-white relative font-sans`}>

      {/* Dynamic Global Background */}
      <DynamicBackground variant={getBackgroundVariant()} />

      <PresenceProvider>
        <div className="relative z-10 flex-1 flex flex-col md:overflow-hidden">
          {user && (
            <Suspense fallback={<div className="h-20 w-full fixed top-0 left-0 bg-transparent z-50"></div>}>
              <Navbar />
            </Suspense>
          )}
          {/* Main Content Area */}
          <main className={isChatPage || isGuidePage || isLoginPage || isWorkflowPage || isSystemSettings || isStorePage || isPublicPage ? ("w-full overflow-hidden flex-1 flex flex-col" + (isWorkflowPage ? " pt-36 md:pt-32" : "")) : "w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-36 md:pt-32 md:overflow-hidden"}>
            {/* Suspense Wrapper for Lazy Loading */}
            <Suspense fallback={<Loading fullScreen={false} message="Loading module..." />}>
              <Routes location={location} key={location.pathname}>
                {/* Public Website Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={user ? <Navigate to="/home" replace /> : <PublicHomePage />} />
                  <Route path="/statuto" element={<PublicStatutePage />} />
                  <Route path="/privacy-policy" element={<PublicPrivacyPolicyPage />} />
                  <Route path="/cookie-policy" element={<PublicCookiePolicyPage />} />
                </Route>

                {/* Login Page */}
                <Route path="/login" element={
                  user ? <Navigate to="/home" replace /> : <Login />
                } />
                <Route path="/signup" element={
                  user ? <Navigate to="/home" replace /> : <Login isSignup={true} />
                } />

                {/* Protected Routes */}
                <Route path="/guide" element={<ProtectedRoute><Guide /></ProtectedRoute>} />
                <Route path="/home" element={<ProtectedRoute><Guide /></ProtectedRoute>} />

                {/* Legacy Redirects */}
                <Route path="/workspace/*" element={<Navigate to="/home" replace />} />
                <Route path="/workspace" element={<Navigate to="/home" replace />} />

                <Route path="/career" element={<ProtectedRoute><Career /></ProtectedRoute>} />

                <Route path="/workflows" element={<ProtectedRoute><WorkflowList /></ProtectedRoute>} />
                <Route path="/workflow/:workflowId" element={<ProtectedRoute><WorkflowDetail /></ProtectedRoute>} />
                <Route path="/categories" element={<ProtectedRoute><CategoryManagement /></ProtectedRoute>} />
                <Route path="/mytasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
                <Route path="/team" element={<ProtectedRoute><TeamMembers /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/system-settings" element={<ProtectedRoute><SystemSettings /></ProtectedRoute>} />
                <Route path="/developer-requests" element={<ProtectedRoute><DeveloperRequests /></ProtectedRoute>} />
                <Route path="/users/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                {/* Dashboard commented out as requested */}
                {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
                <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />

                <Route path="/store" element={<ProtectedRoute><Store /></ProtectedRoute>} />
                <Route path="/competencies" element={<ProtectedRoute><CompetencyManager /></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div >
      </PresenceProvider >
      <LevelUpModal />
    </div >
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
