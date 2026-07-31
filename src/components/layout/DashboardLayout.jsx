import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CreditCard,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
    { name: 'Budgets', href: '/dashboard/budgets', icon: Target },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  useEffect(() => setSidebarOpen(false), [location.pathname])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (path) => location.pathname === path

  const handleSignOut = async () => {
    try {
      const { error } = await signOut()
      if (error) throw error
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Error signing out. Please try again.')
    }
  }

  const userInitial = profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'
  const pageTitle = navigation.find((item) => isActive(item.href))?.name || 'Dashboard'

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-5 py-5">
        <Link to="/dashboard" onClick={() => setSidebarOpen(false)}>
          <img
            src="/logo/logo-light-transparent.png"
            alt="Finance Flow"
            className="h-7 w-auto lg:h-8"
          />
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="rounded-lg p-1.5 text-ink-mute hover:bg-canvas-soft lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-[9px] font-pixel uppercase tracking-wide text-ink-faint">
          menu
        </p>
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-money-500/10 text-money-400'
                  : 'text-ink-mute hover:bg-canvas-soft hover:text-ink'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-money-500" />
              )}
              <Icon className={`h-5 w-5 ${active ? 'text-money-400' : 'text-ink-faint group-hover:text-ink-mute'}`} />
              <span className={active ? 'font-semibold' : ''}>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-line p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-money-500/40 bg-money-500/10 text-xs font-semibold text-money-400">
            {userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{profile?.full_name || 'User'}</p>
            <p className="truncate text-[11px] text-ink-faint">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-lg p-2 text-ink-faint transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-line bg-canvas-soft lg:block">
        {sidebar}
      </aside>

      {/* mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-canvas-deep/80 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-line bg-canvas-soft lg:hidden"
            >
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-3.5 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg border border-line p-2 text-ink hover:bg-canvas-soft lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex flex-col">
                <h1 className="font-display text-xl font-semibold text-ink">{pageTitle}</h1>
                <p className="hidden text-[10px] font-mono uppercase tracking-[0.18em] text-ink-faint sm:block">
                  personal ledger · live
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-lg border border-line bg-canvas-soft px-3 py-2 md:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-money-500 animate-blink" />
                <span className="text-xs font-mono tabular text-ink-mute">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg border border-line bg-canvas-soft px-2 py-1.5 transition-colors hover:border-line-strong"
                  aria-label="Profile menu"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-money-500 text-xs font-semibold text-canvas">
                    {userInitial}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-ink-faint transition-transform duration-200 ${
                      profileDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-canvas-card py-1 shadow-pop"
                    >
                      <div className="border-b border-line px-4 py-3">
                        <p className="truncate text-sm font-semibold text-ink">
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="truncate text-xs text-ink-faint">{user?.email}</p>
                      </div>
                      <Link
                        to="/dashboard/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-soft transition-colors hover:bg-canvas-soft hover:text-ink"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl min-h-full p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
