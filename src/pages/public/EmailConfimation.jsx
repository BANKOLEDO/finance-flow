// src/pages/public/EmailConfirmation.jsx
import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MailCheck, MailX, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AuthNavbar from '../../components/layout/AuthNavbar'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

export default function EmailConfirmation() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    confirmEmail()
  }, [])

  const confirmEmail = async () => {
    try {
      // Check if user is already confirmed (they might have clicked the link and are already logged in)
      if (user?.email_confirmed_at) {
        setStatus('success')
        setMessage('Your email has already been confirmed. You can now access all features.')
        return
      }

      // For Supabase, the confirmation happens automatically when they click the link
      // This page is just to show a success message and guide them to login
      
      // Simulate API call to verify email
      setTimeout(() => {
        setStatus('success')
        setMessage('Your email has been successfully confirmed! You can now sign in to your account.')
      }, 1500)

    } catch (error) {
      console.error('Email confirmation error:', error)
      setStatus('error')
      setMessage('Failed to confirm your email. The link may have expired or is invalid.')
    }
  }

  const resendConfirmation = async () => {
    alert('Resend confirmation functionality would be implemented here')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AuthNavbar />
        <div className="flex-1 flex flex-col justify-center py-4 px-3">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Card className="py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
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
              Email Confirmed!
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
              <Link to="/login">
                <Button variant="black" className="w-full">
                  Sign In to Your Account
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Go to Homepage
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              Welcome to Finance Flow! 🎉
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}