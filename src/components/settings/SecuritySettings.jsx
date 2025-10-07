import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'
import Button from '../ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

export default function SecuritySettings() {
  const { user } = useAuth()
  const [saveLoading, setSaveLoading] = useState(false)
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

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

  return (
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
              autocomplete="new-password" 
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
              autocomplete="new-password" 
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
  )
}