import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'
import Button from '../ui/Button'

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200 ${
        checked ? 'border-money-500/50 bg-money-500' : 'border-line bg-canvas-deep'
      }`}
    >
      <span
        className={`absolute top-[3px] left-[3px] h-4 w-4 rounded-full transition-transform duration-200 ${
          checked ? 'translate-x-5 bg-canvas-deep' : 'bg-ink-faint'
        }`}
      />
    </button>
  )
}

export default function NotificationsSettings() {
  const [saveLoading, setSaveLoading] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReports: false,
    budgetAlerts: true,
  })

  const saveNotifications = async () => {
    setSaveLoading(true)
    try {
      localStorage.setItem('notificationPreferences', JSON.stringify(notifications))
      alert('Notification preferences saved!')
    } catch (error) {
      console.error('Error saving notifications:', error)
      alert('Error saving notification preferences')
    } finally {
      setSaveLoading(false)
    }
  }

  const rows = [
    { key: 'email', title: 'Email notifications', desc: 'Receive updates via email' },
    { key: 'push', title: 'Push notifications', desc: 'Get notified on this device' },
    { key: 'weeklyReports', title: 'Weekly reports', desc: 'Receive weekly financial summaries' },
    { key: 'budgetAlerts', title: 'Budget alerts', desc: 'Get notified when approaching budget limits' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-ink">Notification preferences</h2>
        <p className="mt-1 text-xs font-mono uppercase tracking-wider text-ink-faint">
          what you hear about
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between rounded-xl border border-line bg-canvas-soft px-4 py-4 transition-colors duration-200 hover:border-money-500/30"
            >
              <div>
                <h3 className="text-sm font-medium text-ink">{row.title}</h3>
                <p className="mt-0.5 text-xs text-ink-mute">{row.desc}</p>
              </div>
              <Toggle
                checked={notifications[row.key]}
                onChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, [row.key]: checked }))
                }
              />
            </div>
          ))}
        </div>

        <div className="border-t border-line pt-5">
          <Button onClick={saveNotifications} disabled={saveLoading} className="group/btn">
            <Save className="h-4 w-4" />
            {saveLoading ? 'Saving…' : 'Save preferences'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
