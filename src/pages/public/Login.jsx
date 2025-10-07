import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AuthNavbar from '../../components/layout/AuthNavbar'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

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

  // Load remembered email on component mount
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AuthNavbar />
      
      <div className="flex-1 flex flex-col justify-center py-4 px-3">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900">
            {forgotPasswordMode ? 'Reset Your Password' : 'Sign in to your account'}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="py-8 px-4 shadow-sm sm:rounded-lg sm:px-10">
            {resetSent ? (
              <div className="text-center space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                  Password reset email sent! Check your inbox for further instructions.
                </div>
                <Button
                  onClick={() => {
                    setForgotPasswordMode(false)
                    setResetSent(false)
                  }}
                  variant="black"
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {!forgotPasswordMode && (
                  <div>
                    <label htmlFor="password" className="block text-left mb-2 text-sm font-medium text-primary-600">
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 pr-10"
                        placeholder="Enter your password"
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
                  </div>
                )}

                {!forgotPasswordMode && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-900">
                        Remember me
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => setForgotPasswordMode(true)}
                      className="text-sm font-medium text-primary-600 hover:text-primary-500 text-xs sm:text-sm"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}

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
                        <LogIn className="h-5 w-5" />
                        <span>
                          {forgotPasswordMode ? 'Send Reset Link' : 'Sign in'}
                        </span>
                      </>
                    )}
                  </Button>
                </div>

                {forgotPasswordMode && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setForgotPasswordMode(false)}
                      className="text-sm text-primary-600 hover:text-primary-500"
                    >
                      Back to login
                    </button>
                  </div>
                )}
              </form>
            )}

            {!forgotPasswordMode && !resetSent && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">New to Finance Flow?</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link to="/signup">
                    <Button variant="outline" className="w-full">
                      Create your account
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}