import { useState, type ReactNode } from 'react'
import AppShell from './components/AppShell'
import Campaigns from './components/pages/Campaigns'
import Composer from './components/pages/Composer'
import Contacts from './components/pages/Contacts'
import Dashboard from './components/pages/Dashboard'
import Reports from './components/pages/Reports'
import Settings from './components/pages/Settings'
import type { Section } from './types'

export default function App() {
  const [section, setSection] = useState<Section>('dashboard')
  const content = {
    dashboard: <Dashboard />,
    campaigns: <Campaigns onCreate={() => setSection('composer')} />,
    composer: <Composer />,
    contacts: <Contacts />,
    reports: <Reports />,
    settings: <Settings />,
  } satisfies Record<Section, ReactNode>

  return <AppShell active={section} onNavigate={setSection}>{content[section]}</AppShell>
}
