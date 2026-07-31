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
    email: '',
  })

  useEffect(() => {
    if (profile || user) {
      setProfileForm({
        full_name: profile?.full_name || '',
        email: user?.email || '',
      })
    }
  }, [profile, user])

  const updateProfile = async (e) => {
    e.preventDefault()
    setSaveLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileForm.full_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      if (profileForm.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profileForm.email,
        })

        if (emailError) throw emailError
        alert('Profile updated! Please check your email to confirm the new email address.')
      } else {
        alert('Profile updated successfully!')
      }

      window.location.reload()
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile: ' + error.message)
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-ink">Profile settings</h2>
        <p className="mt-1 text-xs font-mono uppercase tracking-wider text-ink-faint">
          your identity
        </p>
      </div>

      <form onSubmit={updateProfile} className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-money-500/30 bg-money-500/10">
            <span className="font-pixel text-xl text-money-400">
              {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-ink">
              {profile?.full_name || 'Unnamed'}
            </p>
            <p className="text-xs text-ink-faint">signed in as {user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Full name</label>
            <input
              type="text"
              value={profileForm.full_name}
              onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, full_name: e.target.value }))
              }
              className="input"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
              className="input"
              placeholder="Enter your email"
            />
            <p className="mt-1.5 text-xs text-ink-faint">Changing email requires verification</p>
          </div>
        </div>

        <div className="border-t border-line pt-5">
          <Button type="submit" disabled={saveLoading} className="group/btn">
            <Save className="h-4 w-4" />
            {saveLoading ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
