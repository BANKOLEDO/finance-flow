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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
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
              full_name: authUser.user_metadata?.full_name || 'User'
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

  // UPDATED: Add email confirmation redirect
  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/confirm-email`
      }
    })
    return { data, error }
  }

  // UPDATED: Add email confirmation check and remember me
  const signIn = async (email, password, rememberMe = false) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    // NEW: Remember me functionality
    if (!error && rememberMe) {
      localStorage.setItem('rememberedEmail', email)
    } else if (!error && !rememberMe) {
      localStorage.removeItem('rememberedEmail')
    }

    // NEW: Email confirmation check
    if (!error && data.user && !data.user.email_confirmed_at) {
      throw new Error('Please confirm your email address before signing in. Check your inbox for the confirmation link.')
    }

    return { data, error }
  }

  // NEW: Password reset functionality
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  }

  // NEW: Update password
  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { data, error }
  }

  // NEW: Resend confirmation email
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

  // UPDATED: Clear remembered email on sign out
  const signOut = async () => {
    localStorage.removeItem('rememberedEmail') // NEW
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setProfile(null)
    }
    return { error }
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
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}