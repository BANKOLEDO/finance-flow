import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
        setInitializing(false)
      }
    })

    // Listen for auth changes - including email confirmation
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event)
      
      setUser(session?.user ?? null)
      
      if (event === 'SIGNED_IN') {
        if (session?.user) {
          await fetchProfile(session.user.id)
          
          // Check if user just confirmed their email
          if (session.user.email_confirmed_at) {
            console.log('User email confirmed!')
            // This could trigger a welcome event or redirect here
          }
        }
      } else if (event === 'USER_UPDATED') {
        // Handle email confirmation updates
        if (session?.user?.email_confirmed_at) {
          console.log('Email confirmation detected!')
        }
      } else if (event === 'SIGNED_OUT') {
        setProfile(null)
        setLoading(false)
      } else if (event === 'EMAIL_VERIFIED') {
        console.log('Email verified event triggered!')
        // This event fires when user verifies their email via the confirmation link
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, try to create it
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: authUser.email,
              full_name: authUser.user_metadata?.full_name || 'User',
              email_verified: authUser.email_confirmed_at !== null
            })
            .select()
            .single()
          
          setProfile(newProfile)
        }
      } else if (!error) {
        setProfile(data)
      }
    } catch (err) {
      console.error('Profile error:', err)
    } finally {
      setLoading(false)
      setInitializing(false)
    }
  }

  const signUp = async (email, password, fullName) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: fullName 
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) throw error

      return { data, error }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password, rememberMe = false) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (!error && rememberMe) {
      localStorage.setItem('rememberedEmail', email)
    } else if (!error && !rememberMe) {
      localStorage.removeItem('rememberedEmail')
    }

    // Check if user needs email confirmation
    if (!error && data.user && !data.user.email_confirmed_at) {
      throw new Error('Please confirm your email address before signing in. Check your inbox for the confirmation link.')
    }

    return { data, error }
  }

  const resendConfirmationEmail = async (email) => {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm-email`
      }
    })
    return { data, error }
  }

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  }

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { data, error }
  }

  const signOut = async () => {
    localStorage.removeItem('rememberedEmail')
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setProfile(null)
    }
    return { error }
  }

  const checkEmailVerification = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user?.email_confirmed_at !== null
  }

  const value = {
    user,
    profile,
    loading: initializing,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmationEmail,
    checkEmailVerification
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}