import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'
import Button from '../ui/Button'

export default function NotificationsSettings() {
  const [saveLoading, setSaveLoading] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReports: false,
    budgetAlerts: true
  })

  // Save notification preferences
  const saveNotifications = async () => {
    setSaveLoading(true)
    try {
      // In a real app, you would save these to your database
      localStorage.setItem('notificationPreferences', JSON.stringify(notifications))
      alert('Notification preferences saved!')
    } catch (error) {
      console.error('Error saving notifications:', error)
      alert('Error saving notification preferences')
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Budget Alerts</h3>
              <p className="text-sm text-gray-600">Get notified when approaching budget limits</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.budgetAlerts}
                onChange={(e) => setNotifications(prev => ({ ...prev, budgetAlerts: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Weekly Reports</h3>
              <p className="text-sm text-gray-600">Receive weekly financial summaries</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.weeklyReports}
                onChange={(e) => setNotifications(prev => ({ ...prev, weeklyReports: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>

        <Button 
          onClick={saveNotifications}
          className="btn btn-primary flex items-center space-x-2"
          disabled={saveLoading}
        >
          <Save className="h-4 w-4" />
          <span>{saveLoading ? 'Saving...' : 'Save Preferences'}</span>
        </Button>
      </div>
    </motion.div>
  )
}