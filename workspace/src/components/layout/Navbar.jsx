import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useChatNotifications } from '../../context/ChatNotificationContext.jsx'
import { useGamification } from '../../context/GamificationContext'
import { useSystemSettings } from '../../contexts/SystemSettingsContext'
import { Icons } from '../common/Icons'
import { UserProfileMenu } from './UserProfileMenu'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const { user, profile, isHost, loading } = useAuth()
  const { signupEnabled, toggleSignup } = useSystemSettings()
  const { stats } = useGamification()
  const { totalUnread } = useChatNotifications()
  const location = useLocation()

  // Hide main navbar on Landing Page if not logged in
  if (location.pathname === '/') return null;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hostMenuOpen, setHostMenuOpen] = useState(false)
  const [workflowMenuOpen, setWorkflowMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    // 1. Immediately show overlay to mask the page "flash"
    setIsSigningOut(true)
    setMobileMenuOpen(false)
    setHostMenuOpen(false)

    // Small delay to ensure render happens before heavy sync operations
    await new Promise(resolve => setTimeout(resolve, 50))

    // 2. Manually clear Supabase cookies (Nuclear Option)
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    // 3. Clear Local/Session Storage
    localStorage.clear()
    sessionStorage.clear()

    try {
      // 4. Attempt formal sign out
      await supabase.auth.signOut()
    } catch (e) {
      console.error("SignOut error:", e)
    } finally {
      // 5. Force hard redirect and REPLACE history to prevent "Back" button
      // Redirect to / (protected) to trigger Login screen
      window.location.replace('/')
    }
  }

  const workflowItems = [
    { path: '/workflows', label: 'All Workflows', icon: <Icons.Workflows className="w-5 h-5" /> },
    { path: '/mytasks', label: 'My Tasks', icon: <Icons.Check className="w-5 h-5" /> }
  ]

  const navItems = [
    { path: '/documents', label: 'Web Source', icon: <Icons.Documents className="w-5 h-5" /> },

    { path: '/chat', label: 'Chat', icon: <Icons.Chat className="w-5 h-5" /> },
  ]

  const hostConfigItems = [
    { path: '/team', label: 'Team Members', icon: <Icons.Users className="w-5 h-5" /> },
    { path: '/competencies', label: 'Competencies', icon: <Icons.AcademicCap className="w-5 h-5" /> },
    { path: '/categories', label: 'Categories', icon: <Icons.Folder className="w-5 h-5" /> },
    { path: '/developer-requests', label: 'Developer Requests', icon: <Icons.Code className="w-5 h-5" /> },
    { path: '/system-settings', label: 'System Settings', icon: <Icons.Settings className="w-5 h-5" /> }
  ]

  // Add updated logic for XP calculation
  const progress = stats?.nextLevelXp ? Math.min((stats.xp / stats.nextLevelXp) * 100, 100) : 0;
  const isElite = [
    'president',
    'secretary',
    'treasurer',
    'counselor',
    'host',
    'host elite',
    'founder',
    'dev',
    'hr',
    'management',
    'agent',
    'admin',
    'owner'
  ].includes((stats?.roleLevel || '').toLowerCase());

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
    setHostMenuOpen(false)
    setWorkflowMenuOpen(false)
  }, [location.pathname])

  // Prefetching Logic for Super Rapid Navigation
  const prefetchers = {
    '/workflows': () => import('../../components/workflows/WorkflowList'),
    '/mytasks': () => import('../../pages/MyTasks'),
    '/documents': () => import('../../pages/Documents'),

    '/chat': () => import('../../pages/Chat'),
    '/team': () => import('../../components/team/TeamMembers'),
    '/competencies': () => import('../../components/competencies/CompetencyManager'),
    '/categories': () => import('../../components/workflows/CategoryManagement'),
    '/developer-requests': () => import('../../pages/DeveloperRequests'),
    '/system-settings': () => import('../../pages/SystemSettings'),
  };

  const handlePrefetch = (path) => {
    const prefetcher = prefetchers[path];
    if (prefetcher) {
      prefetcher().catch(err => console.error(`Error prefetching ${path}:`, err));
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] h-[80px] glass-white border-b border-gray-200/50 shadow-sm">
      <div className="w-full px-6 md:px-[48px] h-full relative">
        <div className="flex justify-between h-full items-center">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-[12px] group">
            <img
              src="/assets/logonobg.png"
              alt="ARQtype"
              className="h-[36px] w-auto object-contain filter brightness-0 invert group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Workflows Dropdown */}
            <div className="relative">
              <button
                onClick={() => setWorkflowMenuOpen(!workflowMenuOpen)}
                onMouseEnter={() => handlePrefetch('/workflows')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-brand flex items-center gap-1 ${location.pathname === '/workflows' || location.pathname === '/mytasks'
                  ? 'bg-deep-blue-50 text-deep-blue-700 border border-deep-blue-100'
                  : 'text-gray-600 hover:text-deep-blue-brand hover:bg-deep-blue-50'
                  }`}
              >
                <span className="hidden lg:inline">Workflows</span>
                <span className="lg:hidden"><Icons.Workflows className="w-5 h-5" /></span>
                <svg className={`w-3 h-3 transition-transform ${workflowMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {workflowMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 overflow-hidden">
                  {workflowItems.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setWorkflowMenuOpen(false)}
                      onMouseEnter={() => handlePrefetch(item.path)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-brand ${location.pathname === item.path
                        ? 'bg-deep-blue-50 text-deep-blue-700 font-medium border border-deep-blue-100'
                        : 'text-gray-600 hover:bg-deep-blue-50 hover:text-deep-blue-brand'
                        }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onMouseEnter={() => handlePrefetch(item.path)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-brand relative ${location.pathname === item.path
                  ? 'bg-deep-blue-50 text-deep-blue-700 border border-deep-blue-100'
                  : 'text-gray-600 hover:text-deep-blue-brand hover:bg-deep-blue-50'
                  }`}
              >
                <span className="hidden lg:inline">{item.label}</span>
                <span className="lg:hidden text-lg">{item.icon}</span>
                {item.path === '/chat' && totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-brand text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center shadow-sm animate-glow-orange">
                    {totalUnread > 99 ? '99+' : totalUnread}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Host Config Dropdown */}
            {isHost && (
              <div className="relative">
                <button
                  onClick={() => setHostMenuOpen(!hostMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:text-warm-orange-brand hover:bg-warm-orange-brand/10 rounded-lg transition-all duration-300 border border-gray-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs font-semibold hidden xl:inline">Host Settings</span>
                  <svg className={`w-3 h-3 transition-transform ${hostMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {hostMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 overflow-hidden">
                    <div className="px-3 py-2 border-b border-gray-100 bg-warm-orange-brand/10">
                      <span className="text-[10px] bg-warm-orange-brand/20 text-warm-orange-brand px-2 py-0.5 rounded border border-warm-orange-brand/30 font-semibold tracking-wide">HOST ONLY</span>
                    </div>
                    {hostConfigItems.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setHostMenuOpen(false)}
                        onMouseEnter={() => handlePrefetch(item.path)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-warm-orange-brand/10 hover:text-warm-orange-brand transition-all duration-300"
                      >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    {/* Quick Toggles Section - Moved to /system-settings */}
                    {/* <div className="border-t border-white/5 mt-1 pt-1">...</div> */}
                  </div>
                )}
              </div>
            )}

            {/* User Profile Menu or Sign In Button */}
            {!loading && (
              user ? (
                <UserProfileMenu onSignOut={handleSignOut} />
              ) : (
                <Link
                  to="/dashboard" // Redirect to protected route to trigger Login
                  className="px-5 py-2.5 rounded-xl bg-gradient-brand text-black font-bold text-sm hover:bg-gradient-brand-subtle transition-brand shadow-md hover:shadow-lg hover-lift"
                >
                  Sign In
                </Link>
              )
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-deep-blue-brand hover:bg-deep-blue-50 transition-brand"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <Icons.Close className="w-6 h-6" /> : <Icons.Menu className="w-6 h-6" />}
          </button>
        </div>


        <motion.div
          initial="closed"
          animate={mobileMenuOpen ? "open" : "closed"}
          variants={{
            open: {
              opacity: 1,
              height: "auto",
              transition: {
                duration: 0.2,
                ease: "easeOut"
              }
            },
            closed: {
              opacity: 0,
              height: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn"
              }
            }
          }}
          className="md:hidden absolute top-full left-0 w-full border-b border-gray-200 glass-white shadow-lg overflow-hidden z-40"
        >
          <div className="py-4 pb-32 space-y-2 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain">
            {/* User Stats Card - Mobile */}
            <motion.div
              variants={{
                open: { opacity: 1, y: 0 },
                closed: { opacity: 0, y: -20 }
              }}
              className={`mx-4 mb-4 p-4 rounded-xl border ${isElite
                ? 'bg-gradient-brand-subtle border-warm-orange-200'
                : 'bg-gray-50 border-gray-200'
                }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${isElite
                  ? 'bg-gradient-brand text-white'
                  : 'bg-gradient-blue-only text-white'
                  }`}>
                  {isElite ? <Icons.Crown className="w-6 h-6" /> : stats.level}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 truncate">
                    {profile?.display_name || user?.email?.split('@')[0] || 'Guest'}
                  </h3>
                  <p className={`text-xs font-semibold ${isElite
                    ? 'text-transparent bg-clip-text bg-gradient-brand'
                    : 'text-deep-blue-brand'
                    }`}>
                    {stats.roleLevel}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-white rounded-lg p-2 text-center border border-gray-100 shadow-sm">
                  <div className="text-xs text-gray-500 font-medium">Level</div>
                  <div className="text-lg font-bold text-gray-900">{stats.level}</div>
                </div>
                <div className="bg-white rounded-lg p-2 text-center border border-gray-100 shadow-sm">
                  <div className="text-xs text-gray-500 font-medium">IP</div>
                  <div className="text-lg font-bold text-warm-orange-brand">{stats.impactPoints}</div>
                </div>
                <div className="bg-white rounded-lg p-2 text-center border border-gray-100 shadow-sm">
                  <div className="text-xs text-gray-500 font-medium">XP</div>
                  <div className="text-lg font-bold text-deep-blue-brand">{stats.xp}</div>
                </div>
              </div>

              <div className="w-full h-2 rounded-full overflow-hidden bg-gray-200">
                <motion.div
                  className={`h-full ${isElite
                    ? 'bg-gradient-brand'
                    : 'bg-gradient-blue-only'
                    }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <div className="text-[10px] text-gray-500 text-center mt-1">
                {stats.xp} / {stats.nextLevelXp} XP to Level {stats.level + 1}
              </div>
            </motion.div>

            {/* Navigation Items */}
            {/* Workflows */}
            <motion.div
              variants={{
                open: { opacity: 1, y: 0 },
                closed: { opacity: 0, y: -20 }
              }}
            >
              <Link
                to="/workflows"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-4 rounded-xl text-lg font-medium transition-all active:scale-[0.98] ${location.pathname === '/workflows'
                  ? 'bg-deep-blue-50 text-deep-blue-700 border border-deep-blue-100 shadow-sm'
                  : 'text-gray-600 hover:text-deep-blue-brand hover:bg-deep-blue-50'
                  }`}
              >
                <span className="flex items-center gap-4">
                  <Icons.Workflows className="w-6 h-6" />
                  Workflows
                </span>
              </Link>
            </motion.div>

            {/* My Tasks */}
            <motion.div
              variants={{
                open: { opacity: 1, y: 0 },
                closed: { opacity: 0, y: -20 }
              }}
            >
              <Link
                to="/mytasks"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-4 rounded-xl text-lg font-medium transition-all active:scale-[0.98] ${location.pathname === '/mytasks'
                  ? 'bg-deep-blue-50 text-deep-blue-700 border border-deep-blue-100 shadow-sm'
                  : 'text-gray-600 hover:text-deep-blue-brand hover:bg-deep-blue-50'
                  }`}
              >
                <span className="flex items-center gap-4">
                  <Icons.Check className="w-6 h-6" />
                  My Tasks
                </span>
              </Link>
            </motion.div>

            {navItems.map(item => (
              <motion.div
                key={item.path}
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: -20 }
                }}
              >
                <Link
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-4 rounded-xl text-lg font-medium transition-all active:scale-[0.98] ${location.pathname === item.path
                    ? 'bg-gradient-brand-subtle text-white border border-white/10 shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <span className="flex items-center gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    {item.label}
                  </span>
                  {item.path === '/chat' && totalUnread > 0 && (
                    <span className="bg-gradient-brand text-white text-sm font-bold px-2.5 py-1 rounded-full shadow-lg shadow-warm-orange-brand/20 animate-glow-orange">
                      {totalUnread > 99 ? '99+' : totalUnread}
                    </span>
                  )}
                </Link>
              </motion.div>
            ))}

            {/* Host Config Items (Mobile) */}
            {isHost && (
              <>
                <motion.div
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: -20 }
                  }}
                  className="px-4 py-3 flex items-center gap-2 mt-6"
                >
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Admin Tools</span>
                  <span className="text-[10px] bg-warm-orange-100 text-warm-orange-700 px-2 py-0.5 rounded border border-warm-orange-200 font-semibold">HOST ONLY</span>
                </motion.div>
                {hostConfigItems.map(item => (
                  <motion.div
                    key={item.path}
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: -20 }
                    }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium transition-all active:scale-[0.98] ${location.pathname === item.path
                        ? 'bg-deep-blue-50 text-deep-blue-700 border border-deep-blue-100'
                        : 'text-gray-600 hover:text-deep-blue-brand hover:bg-deep-blue-50'
                        }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </>
            )}

            {/* Mobile Actions */}
            <div className="border-t border-white/5 mt-6 pt-6 px-2 space-y-3">
              {[
                { to: "/profile", label: "View Profile", icon: <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
                { to: "/home", label: "Guide", icon: <Icons.Home className="w-6 h-6 text-gray-400" /> },
                { to: "/settings", label: "Settings", icon: <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
                { to: "/career", label: "Career", icon: <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> }
              ].map((action, idx) => (
                <motion.div
                  key={action.to}
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: -20 }
                  }}
                >
                  <Link
                    to={action.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 bg-gray-50 rounded-xl text-gray-800 font-bold text-lg hover:bg-deep-blue-50 hover:text-deep-blue-brand transition-brand border border-gray-100 active:scale-[0.98]"
                  >
                    {action.icon}
                    {action.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Sign Out Button - Isolated */}
            <motion.div
              variants={{
                open: { opacity: 1, y: 0 },
                closed: { opacity: 0, y: -20 }
              }}
              className="px-4 pb-12 mt-8"
            >
              <div className="h-px bg-gray-200 mb-8" /> {/* Separator Line */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-red-50 text-red-600 rounded-2xl font-black text-xl hover:bg-red-100 transition-brand border border-red-100 shadow-sm active:scale-[0.98] hover-lift"
              >
                <Icons.LogOut className="w-6 h-6 border" />
                Sign Out
              </button>
              <p className="text-center text-xs text-gray-600 mt-6 font-medium">
                v1.0.0 • ARQTYPE App
              </p>
            </motion.div>
          </div>
        </motion.div>

      </div >

      {/* Sign Out Loading Overlay - Masks the page during hard reload */}
      {
        isSigningOut && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-bold text-white">Disconnecting...</h2>
            <p className="text-sm text-gray-400">Clearing secure session</p>
          </div>
        )
      }
    </nav >
  )
}
