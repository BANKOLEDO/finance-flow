import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { MailCheck, MailX, CheckCircle, XCircle, Loader } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AuthNavbar from '../../components/layout/AuthNavbar'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

export default function EmailConfirmation() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')
  const { user, signIn } = useAuth()

  useEffect(() => {
    handleEmailConfirmation()
  }, [])

  const handleEmailConfirmation = async () => {
    try {
      // Get the token from URL (Supabase includes it in the redirect)
      const token = searchParams.get('token')
      const type = searchParams.get('type')

      console.log('Confirmation params:', { token, type })

      if (token && type === 'signup') {
        // User came from email link - Supabase has already confirmed them
        // Now we can automatically sign them in or redirect to dashboard
        
        // Check if user is already confirmed and logged in
        if (user?.email_confirmed_at) {
          setStatus('success')
          setMessage('Your email has been confirmed! Redirecting to dashboard...')
          setTimeout(() => navigate('/dashboard'), 2000)
          return
        }

        // If not logged in but token is present, show success and prompt login
        setStatus('success')
        setMessage('Your email has been successfully confirmed! You can now sign in to your account.')
        
      } else if (user?.email_confirmed_at) {
        // User is already confirmed (direct visit to this page)
        setStatus('success')
        setMessage('Your email is already confirmed. You have full access to your account.')
      } else {
        // No token and not confirmed - show error
        setStatus('error')
        setMessage('Confirmation link is invalid or has expired. Please request a new confirmation email.')
      }

    } catch (error) {
      console.error('Email confirmation error:', error)
      setStatus('error')
      setMessage('Failed to confirm your email. The link may have expired or is invalid.')
    }
  }

  const handleAutoLogin = async () => {
    try {
      // In a real implementation, you might auto-login the user here
      // For security, we'll just redirect to login
      navigate('/login')
    } catch (error) {
      console.error('Auto-login error:', error)
      navigate('/login')
    }
  }

  const resendConfirmation = async () => {
    // This would call your resend confirmation API
    alert('Please use the "Resend Confirmation" feature on the login page.')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AuthNavbar />
        <div className="flex-1 flex flex-col justify-center py-4 px-3">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Card className="py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 text-center">
              <Loader className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirming your email...
              </h3>
              <p className="text-gray-600">
                Please wait while we verify your email address.
              </p>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AuthNavbar />
        <div className="flex-1 flex flex-col justify-center py-4 px-3">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Card className="py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 text-center">
              <div className="bg-red-50 border border-red-200 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MailX className="h-8 w-8 text-red-600" />
              </div>
              
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Confirmation Failed
              </h3>
              <p className="text-gray-600 mb-6">
                {message}
              </p>

              <div className="space-y-3">
                <Button
                  onClick={resendConfirmation}
                  variant="outline"
                  className="w-full"
                >
                  Resend Confirmation Email
                </Button>
                <Link to="/signup">
                  <Button variant="black" className="w-full">
                    Try Signing Up Again
                  </Button>
                </Link>
              </div>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500">
                  Back to login
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AuthNavbar />
      <div className="flex-1 flex flex-col justify-center py-4 px-3">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 text-center">
            <div className="bg-green-50 border border-green-200 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MailCheck className="h-8 w-8 text-green-600" />
            </div>
            
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Email Confirmed! 🎉
            </h3>
            <p className="text-gray-600 mb-6">
              {message}
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left mb-6">
              <h4 className="font-medium text-green-800 mb-2">What's next?</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Sign in to your account</li>
                <li>• Set up your financial profiles</li>
                <li>• Start tracking your expenses and budgets</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleAutoLogin}
                variant="black"
                className="w-full"
              >
                Sign In to Your Account
              </Button>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Go to Homepage
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              Welcome to Finance Flow!
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}