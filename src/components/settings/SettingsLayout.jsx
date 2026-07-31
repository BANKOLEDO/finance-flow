import { motion } from 'framer-motion'
import { User, Shield, Download } from 'lucide-react'
import Card from '../ui/Card'

export default function SettingsLayout({ activeTab, onTabChange, children }) {
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'export', label: 'Export Data', icon: Download },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="mb-2 text-[10px] font-pixel uppercase tracking-wide text-money-400">
          /config
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Settings
        </h1>
        <p className="mt-2 text-sm text-ink-mute">
          Manage your account preferences and settings
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* sidebar nav */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="p-3">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                      isActive ? 'text-ink' : 'text-ink-faint hover:text-ink-mute'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="settings-tab"
                        className="absolute inset-0 rounded-lg border border-line bg-canvas-soft"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon className="relative h-4 w-4 shrink-0" />
                    <span className="relative">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </Card>
        </motion.div>

        {/* content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card className="p-6 sm:p-8">{children}</Card>
        </motion.div>
      </div>
    </div>
  )
}
