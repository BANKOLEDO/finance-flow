import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, MailCheck, ExternalLink, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AuthShell from '../../components/layout/AuthShell'
import Button from '../../components/ui/Button'

function TermsModal({ isOpen, onClose, onAccept }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas-deep/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-canvas-card shadow-pop">
        <div className="border-b border-line p-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Terms and Conditions</h2>
        </div>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6 text-sm leading-relaxed text-ink-soft">
          <p className="text-xs font-mono uppercase tracking-wider text-ink-faint">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <section>
            <h3 className="mb-1.5 font-display text-base font-semibold text-ink">1. Acceptance of Terms</h3>
            <p>By creating an account with Finance Flow, you agree to be bound by these Terms and Conditions. If you disagree with any part, you may not access our services.</p>
          </section>
          <section>
            <h3 className="mb-1.5 font-display text-base font-semibold text-ink">2. Privacy and Data Security</h3>
            <p>We take your privacy seriously. Your financial data is encrypted and stored securely. We will never sell your personal information to third parties.</p>
          </section>
          <section>
            <h3 className="mb-1.5 font-display text-base font-semibold text-ink">3. User Responsibilities</h3>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          </section>
          <section>
            <h3 className="mb-1.5 font-display text-base font-semibold text-ink">4. Financial Information</h3>
            <p>While we provide tools for financial management, we do not offer financial advice. You should consult with qualified professionals for financial decisions.</p>
          </section>
          <section>
            <h3 className="mb-1.5 font-display text-base font-semibold text-ink">5. Service Modifications</h3>
            <p>We reserve the right to modify or discontinue our services at any time. We will notify users of significant changes to these terms.</p>
          </section>
          <section>
            <h3 className="mb-1.5 font-display text-base font-semibold text-ink">6. Limitation of Liability</h3>
            <p>Finance Flow shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
          </section>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-line p-6 sm:flex-row">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={onAccept} className="flex-1">
            I accept
          </Button>
        </div>
      </div>
    </div>
  )
}

function EmailConfirmationSuccess({ email, onResend, onBackToLogin }) {
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const handleResend = async () => {
    setResendLoading(true)
    const { error } = await onResend(email)
    setResendLoading(false)
    if (!error) {
      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 5000)
    }
  }

  return (
    <div className="text-center">
      <span className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-money-500/40 bg-money-500/10">
        <MailCheck className="h-7 w-7 text-money-400" />
      </span>
      <h1 className="font-display text-3xl font-semibold text-ink">Check your inbox</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-mute">
        We sent a confirmation link to <span className="text-ink">{email}</span>
      </p>

      <div className="mt-6 rounded-lg border border-line bg-canvas-soft p-4 text-left">
        <p className="mb-2 text-[10px] font-pixel uppercase tracking-wide text-money-400">
          next steps
        </p>
        <ul className="space-y-1.5 text-sm text-ink-soft">
          <li>1 · Open the email from Finance Flow</li>
          <li>2 · Click the confirmation link inside</li>
          <li>3 · Sign in and start your ledger</li>
        </ul>
      </div>

      <div className="mt-6 space-y-3">
        <Button
          onClick={handleResend}
          variant="outline"
          className="w-full"
          disabled={resendLoading}
        >
          {resendLoading ? 'Sending…' : 'Resend confirmation email'}
        </Button>
        <Button onClick={onBackToLogin} variant="light" className="w-full">
          Back to sign in
        </Button>
      </div>

      {resendSuccess && (
        <p className="mt-4 rounded-lg border border-money-500/40 bg-money-500/10 p-3 text-sm text-money-400">
          Confirmation email sent — check spam if it\u2019s not in your inbox.
        </p>
      )}
    </div>
  )
}

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signupSuccess, setSignupSuccess] = useState(false)

  const { signUp, resendConfirmationEmail } = useAuth()

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!acceptedTerms) {
      setError('You must accept the Terms and Conditions')
      setLoading(false)
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await signUp(formData.email, formData.password, formData.fullName)
      if (error) throw error
      if (data?.user) setSignupSuccess(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setSignupSuccess(false)
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' })
  }

  return (
    <AuthShell>
      {signupSuccess ? (
        <EmailConfirmationSuccess
          email={formData.email}
          onResend={resendConfirmationEmail}
          onBackToLogin={handleBackToLogin}
        />
      ) : (
        <>
          <p className="mb-3 text-[10px] font-pixel uppercase tracking-wide text-money-400">
            new account
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Start your ledger.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-mute">
            One email and you\u2019re in. No card, no quiz, no fine print.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3.5 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="label">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="input"
                placeholder="Ada Lovelace"
              />
            </div>

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
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
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
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
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

            <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-line-strong bg-canvas-soft accent-money-500"
              />
              <span>
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="inline-flex items-center gap-1 font-medium text-money-400 hover:text-money-300"
                >
                  terms &amp; conditions
                  <ExternalLink className="h-3 w-3" />
                </button>
              </span>
            </label>

            <Button type="submit" size="lg" className="group/btn w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
              {!loading && (
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              )}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-canvas px-3 text-[10px] font-mono uppercase tracking-[0.2em] text-ink-faint">
                  already tracking?
                </span>
              </div>
            </div>
            <Link to="/login" className="mt-6 block">
              <Button variant="outline" className="w-full" size="lg">
                Sign in instead
              </Button>
            </Link>
          </div>
        </>
      )}

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setAcceptedTerms(true)
          setShowTermsModal(false)
        }}
      />
    </AuthShell>
  )
}
