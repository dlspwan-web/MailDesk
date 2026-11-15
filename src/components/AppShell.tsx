import { useState, type ReactNode } from 'react'
import {
  BarChart3,
  Bell,
  CheckCheck,
  ChevronRight,
  FilePlus2,
  LayoutDashboard,
  Mail,
  Menu,
  Settings,
  Users,
  X,
} from 'lucide-react'
import type { Section } from '../types'

const navItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'composer', label: 'Crear correo', icon: FilePlus2 },
  { id: 'contacts', label: 'Contactos', icon: Users },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
  { id: 'settings', label: 'Configuración', icon: Settings },
]

const titles: Record<Section, string> = {
  dashboard: 'Dashboard',
  campaigns: 'Campañas',
  composer: 'Crear correo',
  contacts: 'Contactos',
  reports: 'Reportes',
  settings: 'Configuración',
}

export default function AppShell({
  active,
  onNavigate,
  children,
}: {
  active: Section
  onNavigate: (section: Section) => void
  children: ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notificationUnread, setNotificationUnread] = useState(true)

  const navigate = (section: Section) => {
    onNavigate(section)
    setIsOpen(false)
    setNotificationsOpen(false)
  }

  const sidebar = (
    <aside className="flex h-full flex-col border-r border-slate-700/60 bg-[#0d1728] px-3 py-5">
      <div className="mb-8 flex items-center gap-3 px-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand shadow-lg shadow-blue-900/40">
          <Mail size={19} />
        </div>
        <div>
          <p className="font-semibold leading-none text-white">MailDesk</p>
          <p className="mt-1 text-xs text-slate-400">Espacio personal</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => navigate(id)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
              active === id
                ? 'bg-brand text-white shadow-lg shadow-blue-950/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto rounded-lg border border-slate-700 bg-slate-900/50 p-3">
        <p className="text-xs font-medium text-slate-200">Modo demostración</p>
        <p className="mt-1 text-xs leading-4 text-slate-500">
          No se envían correos ni se guardan datos externos.
        </p>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-ink">
      <div className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        {sidebar}
      </div>

      {isOpen && (
        <>
          <button
            className="fixed inset-0 z-30 bg-slate-950/75 lg:hidden"
            aria-label="Cerrar menú"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-40 w-72 lg:hidden">
            {sidebar}
          </div>
        </>
      )}

      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-700/60 bg-ink/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="icon-btn lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={21} />
            </button>

            <h1 className="text-lg font-semibold text-white sm:text-xl">
              {titles[active]}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <select
              aria-label="Período"
              className="rounded-lg border border-slate-700 bg-panel px-2 py-2 text-xs text-slate-200 sm:px-3 sm:text-sm"
            >
              <option>Últimos 30 días</option>
              <option>Últimos 7 días</option>
              <option>Este año</option>
            </select>

            {/* Centro de notificaciones */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative grid h-10 w-10 place-items-center rounded-lg border border-slate-700 bg-panel text-slate-300 transition hover:bg-slate-800 hover:text-white"
                aria-label="Notificaciones"
                aria-expanded={notificationsOpen}
              >
                <Bell size={19} />

                {notificationUnread && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-ink bg-red-500 px-1 text-[10px] font-bold text-white">
                    1
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-[340px] max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-slate-700 bg-[#111c2e] shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
                    <div>
                      <h3 className="font-semibold text-white">
                        Notificaciones
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        Solicitudes y avisos de MailDesk
                      </p>
                    </div>

                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                      aria-label="Cerrar notificaciones"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div className="p-3">
                    {notificationUnread ? (
                      <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
                        <div className="flex items-start gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-500/15 text-blue-300">
                            <Bell size={18} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-white">
                                Nueva solicitud de eliminación
                              </p>
                              <span className="h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                            </div>

                            <p className="mt-2 text-xs text-slate-300">
                              Juan Pérez
                            </p>

                            <p className="mt-1 break-all text-xs text-slate-400">
                              juan.prueba@example.com
                            </p>

                            <p className="mt-2 text-[11px] text-slate-500">
                              Solicitud de eliminación de datos · Pendiente
                            </p>

                            <button
                              onClick={() => navigate('settings')}
                              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
                            >
                              Ver solicitud
                              <ChevronRight size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <CheckCheck
                          size={27}
                          className="mx-auto text-green-400"
                        />
                        <p className="mt-3 text-sm font-medium text-white">
                          Todo al día
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          No tienes notificaciones nuevas.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-700 px-4 py-3">
                    <button
                      onClick={() => setNotificationUnread(false)}
                      disabled={!notificationUnread}
                      className="text-xs font-medium text-blue-300 transition hover:text-blue-200 disabled:cursor-not-allowed disabled:text-slate-500"
                    >
                      Marcar como leída
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Perfil del administrador */}
            <button className="flex items-center gap-2 rounded-lg p-1.5 text-left hover:bg-slate-800">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-500/20 text-sm font-semibold text-blue-300">
                DV
              </span>

              <span className="hidden sm:block">
                <span className="block text-sm font-medium text-slate-200">
                  David
                </span>
                <span className="block text-xs text-slate-500">
                  Administrador
                </span>
              </span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
