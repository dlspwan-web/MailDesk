import { useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import AppShell from './components/AppShell'
import Login from './components/Login'
import Campaigns from './components/pages/Campaigns'
import Composer from './components/pages/Composer'
import Contacts from './components/pages/Contacts'
import Dashboard from './components/pages/Dashboard'
import Reports from './components/pages/Reports'
import Settings from './components/pages/Settings'
import { supabase } from './lib/supabase'
import type { Section } from './types'

export default function App() {
  const [section, setSection] = useState<Section>('dashboard')
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    let active = true

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (active) {
        setSession(data.session)
      }
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (active) {
          setSession(newSession)
          setAccessDenied(false)
        }
      }
    )

    return () => {
      active = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let active = true

    const verifyAdmin = async () => {
      if (!session) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      setLoading(true)

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (!active) return

      if (error || data?.role !== 'admin') {
        setIsAdmin(false)
        setAccessDenied(true)
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      setIsAdmin(true)
      setAccessDenied(false)
      setLoading(false)
    }

    verifyAdmin()

    return () => {
      active = false
    }
  }, [session])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B1220]">
        <p className="text-sm text-slate-400">Verificando acceso...</p>
      </div>
    )
  }

  if (!session || !isAdmin) {
    return (
      <div>
        {accessDenied && (
          <div className="fixed left-1/2 top-4 z-50 w-[90%] max-w-md -translate-x-1/2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-300">
            Tu usuario no tiene permisos de administrador.
          </div>
        )}
        <Login />
      </div>
    )
  }

  const content = {
    dashboard: <Dashboard />,
    campaigns: <Campaigns onCreate={() => setSection('composer')} />,
    composer: <Composer />,
    contacts: <Contacts />,
    reports: <Reports />,
    settings: <Settings />,
  } satisfies Record<Section, ReactNode>

  return (
    <AppShell
  active={section}
  onNavigate={setSection}
  userEmail={session.user.email ?? ''}
  onSignOut={() => supabase.auth.signOut()}
>
  {content[section]}
</AppShell>
  )
}