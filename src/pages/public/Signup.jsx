import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, ExternalLink, MailCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AuthNavbar from '../../components/layout/AuthNavbar'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

// Terms and Conditions Modal Component
function TermsModal({ isOpen, onClose, onAccept }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms and Conditions</h2>
          
          <div className="space-y-4 text-sm text-gray-700">
            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
            
            <section>
              <h3 className="font-semibold text-lg mt-4 mb-2">1. Acceptance of Terms</h3>
              <p>By creating an account with Finance Flow, you agree to be bound by these Terms and Conditions. If you disagree with any part, you may not access our services.</p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mt-4 mb-2">2. Privacy and Data Security</h3>
              <p>We take your privacy seriously. Your financial data is encrypted and stored securely. We will never sell your personal information to third parties.</p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mt-4 mb-2">3. User Responsibilities</h3>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mt-4 mb-2">4. Financial Information</h3>
              <p>While we provide tools for financial management, we do not offer financial advice. You should consult with qualified professionals for financial decisions.</p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mt-4 mb-2">5. Service Modifications</h3>
              <p>We reserve the right to modify or discontinue our services at any time. We will notify users of significant changes to these terms.</p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mt-4 mb-2">6. Limitation of Liability</h3>
              <p>Finance Flow shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
            </section>
          </div>

          <div className="flex space-x-3 mt-6">
            <Button
              onClick={onAccept}
              variant="black"
              className="flex-1"
            >
              I Accept
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Email Confirmation Success Component
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
    <div className="text-center space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
        <MailCheck className="h-8 w-8 text-blue-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Check Your Email!
        </h3>
        <p className="text-gray-600">
          We've sent a confirmation link to <strong>{email}</strong>
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
        <h4 className="font-medium text-yellow-800 mb-1">Next Steps:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Check your inbox for an email from Finance Flow</li>
          <li>• Click the confirmation link in the email</li>
          <li>• You'll be redirected to confirm your account</li>
          <li>• Then you can sign in to your account</li>
        </ul>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleResend}
          variant="outline"
          className="w-full"
          disabled={resendLoading}
        >
          {resendLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mx-auto"></div>
          ) : (
            'Resend Confirmation Email'
          )}
        </Button>

        <Button
          onClick={onBackToLogin}
          variant="black"
          className="w-full"
        >
          Back to Login
        </Button>
      </div>

      {resendSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
          Confirmation email sent successfully!
        </div>
      )}

      <div className="text-sm text-gray-500">
        Didn't receive the email? Check your spam folder or try resending.
      </div>
    </div>
  )
}

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
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

      // If signup successful, show confirmation message
      if (data?.user) {
        setSignupSuccess(true)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptTerms = () => {
    setAcceptedTerms(true)
    setShowTermsModal(false)
  }

  const handleBackToLogin = () => {
    setSignupSuccess(false)
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  // Show email confirmation success screen
  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AuthNavbar />
        
        <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Card className="py-8 px-4 shadow-sm sm:rounded-lg sm:px-10">
              <EmailConfirmationSuccess
                email={formData.email}
                onResend={resendConfirmationEmail}
                onBackToLogin={handleBackToLogin}
              />
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Show regular signup form
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AuthNavbar />
      
      <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900">
            Create your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="py-8 px-4 shadow-sm sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="block text-left mb-2 text-sm font-medium text-primary-600">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-left mb-2 text-sm font-medium text-primary-600">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-left mb-2 text-sm font-medium text-primary-600">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 pr-10"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-left text-gray-500">
                  Must be at least 6 characters
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-left mb-2 text-sm font-medium text-primary-600">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 pr-10"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1 flex-shrink-0"
                />
                <label htmlFor="terms" className="block text-sm text-gray-900">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-primary-600 hover:text-primary-500 font-medium inline-flex items-center"
                  >
                    Terms and Conditions
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </button>
                </label>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="black"
                  className="w-full flex justify-center items-center space-x-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      <span>Create account</span>
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Sign in instead
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleAcceptTerms}
      />
    </div>
  )
}