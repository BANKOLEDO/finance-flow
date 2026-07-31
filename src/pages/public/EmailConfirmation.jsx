import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { MailCheck, MailX, Loader, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AuthShell from '../../components/layout/AuthShell'
import Button from '../../components/ui/Button'

export default function EmailConfirmation() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    handleEmailConfirmation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEmailConfirmation = async () => {
    try {
      const token = searchParams.get('token')
      const type = searchParams.get('type')

      if (token && type === 'signup') {
        if (user?.email_confirmed_at) {
          setStatus('success')
          setMessage('Your email has been confirmed. Redirecting to your dashboard…')
          setTimeout(() => navigate('/dashboard'), 2000)
          return
        }
        setStatus('success')
        setMessage('Your email has been confirmed. You can now sign in.')
      } else if (user?.email_confirmed_at) {
        setStatus('success')
        setMessage('Your email is already confirmed. Full access unlocked.')
      } else {
        setStatus('error')
        setMessage('Confirmation link is invalid or has expired. Request a new one.')
      }
    } catch (error) {
      console.error('Email confirmation error:', error)
      setStatus('error')
      setMessage('Failed to confirm your email. The link may have expired.')
    }
  }

  const resendConfirmation = () => {
    alert('Please use the "Forgot password" option on the sign-in page.')
  }

  return (
    <AuthShell>
      {status === 'loading' && (
        <div className="py-10 text-center">
          <Loader className="mx-auto mb-6 h-8 w-8 animate-spin text-money-400" />
          <h1 className="font-display text-3xl font-semibold text-ink">Confirming…</h1>
          <p className="mt-3 text-sm text-ink-mute">Verifying your email address.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center">
          <span className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-money-500/40 bg-money-500/10">
            <MailCheck className="h-7 w-7 text-money-400" />
          </span>
          <h1 className="font-display text-3xl font-semibold text-ink">Confirmed.</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-mute">{message}</p>

          <div className="mt-6 space-y-3">
            <Button variant="light" className="group/btn w-full" onClick={() => navigate('/login')}>
              Sign in to your account
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Button>
            <Link to="/" className="block">
              <Button variant="outline" className="w-full">
                Back to homepage
              </Button>
            </Link>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center">
          <span className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10">
            <MailX className="h-7 w-7 text-red-400" />
          </span>
          <h1 className="font-display text-3xl font-semibold text-ink">Link didn\u2019t work.</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-mute">{message}</p>

          <div className="mt-6 space-y-3">
            <Button variant="outline" className="w-full" onClick={resendConfirmation}>
              Resend confirmation
            </Button>
            <Link to="/signup" className="block">
              <Button variant="light" className="w-full">
                Try signing up again
              </Button>
            </Link>
          </div>
        </div>
      )}
    </AuthShell>
  )
}
