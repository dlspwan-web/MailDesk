import { useState, type ReactNode } from 'react'
import { BarChart3, FilePlus2, LayoutDashboard, Mail, Menu, Settings, Users, X } from 'lucide-react'
import type { Section } from '../types'

const navItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'campaigns', label: 'Campañas', icon: Mail },
  { id: 'composer', label: 'Crear correo', icon: FilePlus2 },
  { id: 'contacts', label: 'Contactos', icon: Users },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
  { id: 'settings', label: 'Configuración', icon: Settings },
]

const titles: Record<Section, string> = {
  dashboard: 'Dashboard', campaigns: 'Campañas', composer: 'Crear correo', contacts: 'Contactos', reports: 'Reportes', settings: 'Configuración',
}

export default function AppShell({ active, onNavigate, children }: { active: Section; onNavigate: (section: Section) => void; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = (section: Section) => { onNavigate(section); setIsOpen(false) }
  const sidebar = (
    <aside className="flex h-full flex-col border-r border-slate-700/60 bg-[#0d1728] px-3 py-5">
      <div className="mb-8 flex items-center gap-3 px-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand shadow-lg shadow-blue-900/40"><Mail size={19} /></div>
        <div><p className="font-semibold leading-none text-white">MailDesk</p><p className="mt-1 text-xs text-slate-400">Espacio personal</p></div>
      </div>
      <nav className="space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => navigate(id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${active === id ? 'bg-brand text-white shadow-lg shadow-blue-950/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}><Icon size={18} />{label}</button>)}
      </nav>
      <div className="mt-auto rounded-lg border border-slate-700 bg-slate-900/50 p-3"><p className="text-xs font-medium text-slate-200">Modo demostración</p><p className="mt-1 text-xs leading-4 text-slate-500">No se envían correos ni se guardan datos externos.</p></div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-ink">
      <div className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</div>
      {isOpen && <><button className="fixed inset-0 z-30 bg-slate-950/75 lg:hidden" aria-label="Cerrar menú" onClick={() => setIsOpen(false)} /><div className="fixed inset-y-0 left-0 z-40 w-72 lg:hidden">{sidebar}</div></>}
      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-700/60 bg-ink/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3"><button onClick={() => setIsOpen(true)} className="icon-btn lg:hidden" aria-label="Abrir menú"><Menu size={21} /></button><h1 className="text-lg font-semibold text-white sm:text-xl">{titles[active]}</h1></div>
          <div className="flex items-center gap-2 sm:gap-4"><select aria-label="Período" className="rounded-lg border border-slate-700 bg-panel px-2 py-2 text-xs text-slate-200 sm:px-3 sm:text-sm"><option>Últimos 30 días</option><option>Últimos 7 días</option><option>Este año</option></select><button className="flex items-center gap-2 rounded-lg p-1.5 text-left hover:bg-slate-800"><span className="grid h-8 w-8 place-items-center rounded-full bg-blue-500/20 text-sm font-semibold text-blue-300">DV</span><span className="hidden sm:block"><span className="block text-sm font-medium text-slate-200">David</span><span className="block text-xs text-slate-500">Administrador</span></span></button></div>
        </header>
        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
