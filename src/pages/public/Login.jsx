import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AuthShell from '../../components/layout/AuthShell'
import Button from '../../components/ui/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const { signIn, resetPassword } = useAuth()

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await signIn(email, password, rememberMe)
      if (error) throw error
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (!email) {
      setError('Please enter your email address')
      setLoading(false)
      return
    }
    try {
      const { error } = await resetPassword(email)
      if (error) throw error
      setResetSent(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = forgotPasswordMode ? handleForgotPassword : handleLogin

  return (
    <AuthShell>
      <p className="mb-3 text-[10px] font-pixel uppercase tracking-wide text-money-400">
        {forgotPasswordMode ? 'recover access' : 'sign in'}
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {forgotPasswordMode ? 'Reset your password' : 'Welcome back.'}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-mute">
        {forgotPasswordMode
          ? 'Tell us the email you signed up with and we\u2019ll send a reset link.'
          : 'Sign in to pick up where your ledger left off.'}
      </p>

      {resetSent ? (
        <div className="mt-8 space-y-6">
          <div className="rounded-lg border border-money-500/40 bg-money-500/10 p-4 text-sm text-money-400">
            Reset link sent. Check your inbox for the next step.
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setForgotPasswordMode(false)
              setResetSent(false)
            }}
          >
            Back to sign in
          </Button>
        </div>
      ) : (
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3.5 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
            />
          </div>

          {!forgotPasswordMode && (
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-ink-faint transition-colors hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {!forgotPasswordMode && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2.5 text-ink-soft">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-line-strong bg-canvas-soft accent-money-500"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setForgotPasswordMode(true)}
                className="font-mono text-xs uppercase tracking-wider text-money-400 hover:text-money-300"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button type="submit" className="group/btn w-full" size="lg" disabled={loading}>
            {loading
              ? forgotPasswordMode
                ? 'Sending…'
                : 'Signing in…'
              : forgotPasswordMode
                ? 'Send reset link'
                : 'Sign in'}
            {!loading && (
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            )}
          </Button>
        </form>
      )}

      {!forgotPasswordMode && !resetSent && (
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-canvas px-3 text-[10px] font-mono uppercase tracking-[0.2em] text-ink-faint">
                new to flow?
              </span>
            </div>
          </div>
          <Link to="/signup" className="mt-6 block">
            <Button variant="outline" className="w-full" size="lg">
              Create an account
            </Button>
          </Link>
        </div>
      )}
    </AuthShell>
  )
}
