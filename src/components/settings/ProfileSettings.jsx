import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'
import Button from '../ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

export default function ProfileSettings() {
  const { user, profile } = useAuth()
  const [saveLoading, setSaveLoading] = useState(false)
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: ''
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

  return (
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
  )
}