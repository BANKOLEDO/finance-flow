import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CreditCard, 
  Target, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../ui/Button'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
    { name: 'Budgets', href: '/dashboard/budgets', icon: Target },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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

  return (
    <div className="min-h-screen bg-gray-50 flex dashboard-container">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on desktop, slide-in on mobile */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 
        bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out 
        flex flex-col
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center space-x-2" onClick={() => setSidebarOpen(false)}>
            <img 
              src="/logo/logo-dark-transparent.png" 
              alt="Finance Flow" 
              className="h-6 lg:h-8 w-auto"
            />
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 lg:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 font-semibold text-xs lg:text-sm">
                {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs lg:text-sm text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-3 lg:p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium 
                  transition-all duration-200 group
                  ${active
                    ? 'bg-primary-50 text-primary-600 shadow-sm nav-active'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className={active ? 'font-semibold' : 'font-medium'}>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sign out - Sticky at bottom */}
        <div className="p-3 lg:p-4 border-t border-gray-200 flex-shrink-0">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 text-sm btn btn-outline"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 lg:min-w-[calc(100vw-16rem)]">
        {/* Top bar - Sticky */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 flex-shrink-0 shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors btn btn-outline"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Page title */}
            <div className="flex-1 lg:flex-none ml-2 lg:ml-0">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h1>
            </div>

            {/* Date display - Hidden on small screens */}
            <div className="hidden sm:flex items-center">
              <div className="card px-3 py-2">
                <span className="text-sm text-gray-600 font-medium">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content - Scrollable */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}