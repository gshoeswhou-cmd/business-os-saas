import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [businesses, setBusinesses] = useState([])
  const [activeBusiness, setActiveBusiness] = useState(null)
  const [isPlatformOwner, setIsPlatformOwner] = useState(false)
  const [loading, setLoading] = useState(true)

  async function loadProfile(currentUser) {
    if (!currentUser) {
      setBusinesses([])
      setActiveBusiness(null)
      setIsPlatformOwner(false)
      return
    }

    const { data: memberships, error } = await supabase
      .from('business_members')
      .select('role, business:businesses(*), business_id')
      .eq('user_id', currentUser.id)
      .eq('is_active', true)

    if (error) {
      console.warn('Profile load error:', error.message)
      setBusinesses([])
      setActiveBusiness(null)
      setIsPlatformOwner(false)
      return
    }

    const rows = memberships || []
    setIsPlatformOwner(rows.some((row) => row.role === 'platform_owner'))
    const ownedBusinesses = rows.map((row) => ({ ...row.business, member_role: row.role })).filter(Boolean)
    setBusinesses(ownedBusinesses)
    setActiveBusiness(ownedBusinesses[0] || null)
  }

  useEffect(() => {
    let mounted = true

    async function init() {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(data.session)
      setUser(data.session?.user || null)
      await loadProfile(data.session?.user || null)
      setLoading(false)
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user || null)
      await loadProfile(nextSession?.user || null)
      setLoading(false)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
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
      reloadProfile: () => loadProfile(user),
      signOut,
    }),
    [session, user, businesses, activeBusiness, isPlatformOwner, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
