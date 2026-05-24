import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [businesses, setBusinesses] = useState([])
  const [activeBusiness, setActiveBusiness] = useState(null)
  const [isPlatformOwner, setIsPlatformOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  async function loadProfile(currentUser) {
    if (!currentUser) {
      setBusinesses([])
      setActiveBusiness(null)
      setIsPlatformOwner(false)
      return
    }

    try {
      const { data: memberships, error } = await supabase
        .from('business_members')
        .select('role, business:businesses(*), business_id')
        .eq('user_id', currentUser.id)
        .eq('is_active', true)

      if (error) throw error

      const rows = memberships || []
      setIsPlatformOwner(rows.some((row) => row.role === 'platform_owner'))
      const ownedBusinesses = rows.map((row) => ({ ...row.business, member_role: row.role })).filter(Boolean)
      setBusinesses(ownedBusinesses)
      setActiveBusiness(ownedBusinesses[0] || null)
    } catch (error) {
      console.warn('Profile load error:', error.message)
      setAuthError(error.message)
      setBusinesses([])
      setActiveBusiness(null)
      setIsPlatformOwner(false)
    }
  }

  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        if (!isSupabaseConfigured) {
          setAuthError('Missing Netlify environment variables: VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY.')
          setLoading(false)
          return
        }

        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        if (!mounted) return
        setSession(data.session)
        setUser(data.session?.user || null)
        await loadProfile(data.session?.user || null)
      } catch (error) {
        console.error('Auth init error:', error)
        setAuthError(error.message || 'Authentication failed to initialize.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      try {
        setSession(nextSession)
        setUser(nextSession?.user || null)
        await loadProfile(nextSession?.user || null)
      } catch (error) {
        setAuthError(error.message || 'Auth state update failed.')
      } finally {
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setBusinesses([])
    setActiveBusiness(null)
  }

  const value = useMemo(
    () => ({
      session,
      user,
      businesses,
      activeBusiness,
      setActiveBusiness,
      isPlatformOwner,
      loading,
      authError,
      isSupabaseConfigured,
      reloadProfile: () => loadProfile(user),
      signOut,
    }),
    [session, user, businesses, activeBusiness, isPlatformOwner, loading, authError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
