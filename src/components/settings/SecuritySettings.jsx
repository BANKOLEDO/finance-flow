import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Info } from 'lucide-react'
import Button from '../ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

export default function SecuritySettings() {
  const { user } = useAuth()
  const [saveLoading, setSaveLoading] = useState(false)
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

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
        password: securityForm.newPassword,
      })

      if (error) throw error

      alert('Password updated successfully!')
      setSecurityForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Error changing password: ' + error.message)
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-ink">Security settings</h2>
        <p className="mt-1 text-xs font-mono uppercase tracking-wider text-ink-faint">
          password & access
        </p>
      </div>

      <form onSubmit={changePassword} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="label">New password</label>
            <input
              type="password"
              value={securityForm.newPassword}
              onChange={(e) =>
                setSecurityForm((prev) => ({ ...prev, newPassword: e.target.value }))
              }
              className="input"
              placeholder="Enter new password"
              required
              autoComplete="new-password"
              minLength={6}
            />
            <p className="mt-1.5 text-xs text-ink-faint">
              Password must be at least 6 characters long
            </p>
          </div>

          <div>
            <label className="label">Confirm new password</label>
            <input
              type="password"
              value={securityForm.confirmPassword}
              onChange={(e) =>
                setSecurityForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
              className="input"
              placeholder="Confirm new password"
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <p className="text-sm text-amber-200/80">
            <strong>Note:</strong> Changing your password will log you out of all other devices.
          </p>
        </div>

        <div className="border-t border-line pt-5">
          <Button type="submit" disabled={saveLoading} className="group/btn">
            <Save className="h-4 w-4" />
            {saveLoading ? 'Updating…' : 'Update password'}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
