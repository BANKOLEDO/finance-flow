import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AuthShell from '../../components/layout/AuthShell'
import Button from '../../components/ui/Button'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { updatePassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { error } = await updatePassword(password)
      if (error) throw error
      setSuccess(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      {success ? (
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold text-ink">Password updated.</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-mute">
            Your password has been reset. Sign in with the new one.
          </p>
          <Link to="/login" className="mt-8 block">
            <Button variant="light" className="w-full" size="lg">
              Sign in now
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-3 text-[10px] font-pixel uppercase tracking-wide text-money-400">
            set a new password
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Pick a new one.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-mute">
            Make it something only you would choose — and not your pet\u2019s name.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3.5 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="label">
                New password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-ink-faint hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-ink-faint">At least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-ink-faint hover:text-ink"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="group/btn w-full" disabled={loading}>
              {loading ? 'Resetting…' : 'Reset password'}
              {!loading && (
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="font-mono text-xs uppercase tracking-wider text-money-400 hover:text-money-300">
              Back to sign in
            </Link>
          </div>
        </>
      )}
    </AuthShell>
  )
}
