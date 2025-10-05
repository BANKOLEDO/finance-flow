import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Palette, Download, Save, Moon, Sun } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

export default function Settings() {
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReports: false,
    budgetAlerts: true
  })

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: ''
  })

  // Security form state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Initialize form data when profile/user loads
  useEffect(() => {
    if (profile || user) {
      setProfileForm({
        full_name: profile?.full_name || '',
        email: user?.email || ''
      })
    }
  }, [profile, user])

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'export', label: 'Export Data', icon: Download },
  ]

  // Update profile function
  const updateProfile = async (e) => {
    e.preventDefault()
    setSaveLoading(true)
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileForm.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      // Update email through Supabase auth
      if (profileForm.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profileForm.email
        })
        
        if (emailError) throw emailError
        alert('Profile updated! Please check your email to confirm the new email address.')
      } else {
        alert('Profile updated successfully!')
      }
      
      // Refresh the page to get updated data
      window.location.reload()
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile: ' + error.message)
    } finally {
      setSaveLoading(false)
    }
  }

  // Change password function
  const changePassword = async (e) => {
    e.preventDefault()
    
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert('New passwords do not match!')
      return
    }

    if (securityForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!')
      return
    }

    setSaveLoading(true)
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: securityForm.newPassword
      })

      if (error) throw error

      alert('Password updated successfully!')
      setSecurityForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Error changing password: ' + error.message)
    } finally {
      setSaveLoading(false)
    }
  }

  // Export data to Excel/CSV
  const exportData = async (format = 'csv') => {
    setIsLoading(true)
    try {
      // Fetch user data
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)

      const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)

      const { data: budgets } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)

      if (format === 'csv') {
        exportToCSV(transactions, categories, budgets)
      } else {
        exportToPDF(transactions, categories, budgets)
      }
      
    } catch (error) {
      console.error('Export error:', error)
      alert('Error exporting data')
    } finally {
      setIsLoading(false)
    }
  }

  // Export to CSV function
  const exportToCSV = (transactions, categories, budgets) => {
    // Create transactions CSV
    const transactionsCSV = [
      ['Date', 'Description', 'Category', 'Type', 'Amount'],
      ...transactions.map(t => [
        new Date(t.transaction_date).toLocaleDateString(),
        t.description,
        categories.find(c => c.id === t.category_id)?.name || 'Uncategorized',
        t.type,
        t.amount
      ])
    ].map(row => row.join(',')).join('\n')

    // Create categories CSV
    const categoriesCSV = [
      ['Name', 'Color', 'Created Date'],
      ...categories.map(c => [
        c.name,
        c.color,
        new Date(c.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    // Create budgets CSV
    const budgetsCSV = [
      ['Category', 'Budget Amount', 'Period', 'Created Date'],
      ...budgets.map(b => [
        categories.find(c => c.id === b.category_id)?.name || 'Uncategorized',
        b.amount,
        b.period,
        new Date(b.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    // Combine all data into one CSV
    const fullCSV = `FINANCE FLOW EXPORT - ${new Date().toLocaleDateString()}\n\nTRANSACTIONS\n${transactionsCSV}\n\nCATEGORIES\n${categoriesCSV}\n\nBUDGETS\n${budgetsCSV}`

    const blob = new Blob([fullCSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finance-flow-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    alert('Data exported to CSV successfully!')
  }

  // Export to PDF function (simplified - in real app you might use a library like jsPDF)
  const exportToPDF = (transactions, categories, budgets) => {
    // For now, we'll just show a message about PDF export
    alert('PDF export feature coming soon! For now, please use CSV export.')
    // In a real implementation, you would use jsPDF or similar library
  }

  // Theme toggle function
  const toggleTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

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
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and settings</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-600 nav-active'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </Card>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>
                  <form onSubmit={updateProfile} className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-xl">
                          {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <Button type="button" variant="outline" size="sm" className="btn btn-outline">
                          Change Avatar
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter your email"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Changing email requires verification
                        </p>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="btn btn-primary flex items-center space-x-2"
                      disabled={saveLoading}
                    >
                      <Save className="h-4 w-4" />
                      <span>{saveLoading ? 'Saving...' : 'Save Changes'}</span>
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
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
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
                  <form onSubmit={changePassword} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={securityForm.newPassword}
                          onChange={(e) => setSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter new password"
                          required
                          minLength={6}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Password must be at least 6 characters long
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={securityForm.confirmPassword}
                          onChange={(e) => setSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Confirm new password"
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Changing your password will log you out of all other devices.
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="btn btn-primary flex items-center space-x-2"
                      disabled={saveLoading}
                    >
                      <Save className="h-4 w-4" />
                      <span>{saveLoading ? 'Updating...' : 'Update Password'}</span>
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Appearance</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Theme</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => toggleTheme('light')}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            theme === 'light' 
                              ? 'border-primary-500 bg-primary-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Sun className="h-6 w-6 mb-2 text-yellow-500" />
                          <h4 className="font-medium text-gray-900">Light Mode</h4>
                          <p className="text-sm text-gray-600">Clean and bright interface</p>
                        </button>

                        <button
                          onClick={() => toggleTheme('dark')}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            theme === 'dark' 
                              ? 'border-primary-500 bg-primary-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Moon className="h-6 w-6 mb-2 text-blue-500" />
                          <h4 className="font-medium text-gray-900">Dark Mode</h4>
                          <p className="text-sm text-gray-600">Easy on the eyes</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Export Data Tab */}
              {activeTab === 'export' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Export Data</h2>
                  <div className="space-y-6">
                    <p className="text-gray-600">
                      Export all your financial data including transactions, categories, and budgets.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card className="p-6 text-center border-2 border-dashed border-gray-200 hover:border-primary-300 transition-colors">
                        <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">CSV Export</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Export your data in CSV format for Excel, Google Sheets, or other applications
                        </p>
                        <Button
                          onClick={() => exportData('csv')}
                          disabled={isLoading}
                          className="btn btn-primary w-full"
                        >
                          {isLoading ? 'Exporting...' : 'Export as CSV'}
                        </Button>
                      </Card>

                      <Card className="p-6 text-center border-2 border-dashed border-gray-200 hover:border-primary-300 transition-colors">
                        <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">PDF Export</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Export your data as a formatted PDF report (Coming Soon)
                        </p>
                        <Button
                          onClick={() => exportData('pdf')}
                          disabled={true}
                          className="btn btn-outline w-full opacity-50"
                        >
                          Coming Soon
                        </Button>
                      </Card>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Important:</strong> Your exported data contains sensitive financial information. 
                        Keep this file secure and do not share it with unauthorized parties.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}