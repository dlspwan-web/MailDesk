import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Database,
  Mail,
  Palette,
  ShieldCheck,
  Search,
  Clock,
  FileCheck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

type DeletionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'rejected'

type DeletionRequest = {
  id: string
  email: string
  status: DeletionStatus
  requested_at: string
  completed_at: string | null
}

const settingGroups = [
  {
    title: 'Información del remitente',
    description: 'Nombre y dirección que aparecerán en tus correos.',
    icon: Mail,
    fields: ['Nombre del remitente', 'Correo de respuesta'],
  },
  {
    title: 'Proveedor de correo',
    description: 'La conexión estará disponible cuando decidas integrar un proveedor.',
    icon: ShieldCheck,
    fields: [],
  },
  {
    title: 'Preferencias de la aplicación',
    description: 'Opciones generales para tu espacio de trabajo.',
    icon: Palette,
    fields: [],
  },
]

const statusLabels: Record<DeletionStatus, string> = {
  pending: 'Pendiente',
  processing: 'En proceso',
  completed: 'Completada',
  rejected: 'No procede',
}

export default function Settings() {
  const [requests, setRequests] = useState<DeletionRequest[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const loadRequests = async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('deletion_requests')
      .select('id, email, status, requested_at, completed_at')
      .order('requested_at', { ascending: false })

    if (error) {
      console.error('Error al consultar solicitudes:', error)
      setError('No fue posible cargar las solicitudes. Verifica tu conexión.')
      setLoading(false)
      return
    }

    setRequests((data ?? []) as DeletionRequest[])
    setLoading(false)
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const pending = requests.filter(
    (request) => request.status === 'pending'
  ).length

  const processing = requests.filter(
    (request) => request.status === 'processing'
  ).length

  const completed = requests.filter(
    (request) => request.status === 'completed'
  ).length

  const filteredRequests = requests.filter((request) =>
    request.email.toLowerCase().includes(search.toLowerCase())
  )

  const updateStatus = async (
    id: string,
    status: DeletionStatus
  ) => {
    setUpdatingId(id)
    setError('')

    const completedAt =
      status === 'completed' ? new Date().toISOString() : null

    const { error } = await supabase
      .from('deletion_requests')
      .update({
        status,
        completed_at: completedAt,
      })
      .eq('id', id)

    if (error) {
      console.error('Error al actualizar solicitud:', error)
      setError('No fue posible actualizar el estado de la solicitud.')
      setUpdatingId(null)
      return
    }

    setRequests((previous) =>
      previous.map((request) =>
        request.id === id
          ? { ...request, status, completed_at: completedAt }
          : request
      )
    )

    setUpdatingId(null)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  }

  return (
    <div className="max-w-5xl space-y-6">

      <div>
        <p className="text-sm text-slate-400">
          Ajustes de la aplicación
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-white">
          Configuración
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Administra las preferencias y herramientas de MailDesk.
        </p>
      </div>

      {/* CONFIGURACIONES GENERALES */}

      {settingGroups.map(({ title, description, icon: Icon, fields }) => (
        <section key={title} className="panel-pad">
          <div className="flex gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-500/15 text-blue-300">
              <Icon size={19} />
            </span>

            <div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm text-slate-400">
                {description}
              </p>
            </div>
          </div>

          {fields.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {fields.map((field, index) => (
                <label key={field} className="field-label">
                  {field}
                  <input
                    className="field"
                    placeholder={
                      index === 0
                        ? 'Ej. Equipo MailDesk'
                        : 'ejemplo@empresa.com'
                    }
                  />
                </label>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-slate-700 bg-slate-900/50 p-4 text-sm text-slate-400">
              {title === 'Proveedor de correo'
                ? 'Aún no hay proveedor de correo conectado.'
                : 'Tema oscuro activo. Las preferencias persistentes estarán disponibles próximamente.'}
            </div>
          )}
        </section>
      ))}

      {/* PRIVACIDAD Y PROTECCIÓN DE DATOS */}

      <section className="panel overflow-hidden">

        <div className="border-b border-slate-700/70 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-purple-500/15 text-purple-300">
              <ShieldCheck size={20} />
            </span>

            <div>
              <h3 className="font-semibold text-white">
                Privacidad y protección de datos
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Administración de solicitudes de eliminación de datos personales.
              </p>
            </div>
          </div>
        </div>

        {/* INDICADORES */}

        <div className="grid gap-3 p-5 sm:grid-cols-3">

          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2 text-amber-300">
              <Clock size={17} />
              <span className="text-sm">Pendientes</span>
            </div>

            <p className="mt-3 text-2xl font-semibold text-white">
              {pending}
            </p>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2 text-blue-300">
              <AlertCircle size={17} />
              <span className="text-sm">En proceso</span>
            </div>

            <p className="mt-3 text-2xl font-semibold text-white">
              {processing}
            </p>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2 text-green-300">
              <FileCheck size={17} />
              <span className="text-sm">Completadas</span>
            </div>

            <p className="mt-3 text-2xl font-semibold text-white">
              {completed}
            </p>
          </div>

        </div>

        {/* ENCABEZADO DE SOLICITUDES */}

        <div className="flex flex-col justify-between gap-3 px-5 pb-5 sm:flex-row sm:items-center">
          <div>
            <h4 className="font-medium text-white">
              Solicitudes de eliminación
            </h4>

            <p className="mt-1 text-xs text-slate-400">
              Solicitudes recibidas y registradas en Supabase.
            </p>
          </div>

          <button
            onClick={loadRequests}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
            />
            Actualizar
          </button>
        </div>

        {/* MENSAJES DE ERROR */}

        {error && (
          <div className="mx-5 mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* BUSCADOR */}

        <div className="border-t border-slate-700/70 px-5 py-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              className="field pl-10"
              placeholder="Buscar por correo electrónico..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLA */}

        <div className="table-wrap">
          <table className="data-table min-w-[700px]">
            <thead>
              <tr>
                <th>Correo del solicitante</th>
                <th>Fecha de solicitud</th>
                <th>Estado</th>
                <th>Actualizar</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400">
                    Consultando solicitudes...
                  </td>
                </tr>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <p className="font-medium text-slate-100">
                        {request.email}
                      </p>
                    </td>

                    <td>{formatDate(request.requested_at)}</td>

                    <td>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          request.status === 'completed'
                            ? 'bg-green-500/15 text-green-300'
                            : request.status === 'processing'
                              ? 'bg-blue-500/15 text-blue-300'
                              : request.status === 'rejected'
                                ? 'bg-red-500/15 text-red-300'
                                : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {statusLabels[request.status] ?? request.status}
                      </span>
                    </td>

                    <td>
                      <select
                        className="field mt-0 min-w-32 text-xs"
                        value={request.status}
                        disabled={updatingId === request.id}
                        onChange={(e) =>
                          updateStatus(
                            request.id,
                            e.target.value as DeletionStatus
                          )
                        }
                      >
                        <option value="pending">Pendiente</option>
                        <option value="processing">En proceso</option>
                        <option value="completed">Completada</option>
                        <option value="rejected">No procede</option>
                      </select>

                      {updatingId === request.id && (
                        <p className="mt-1 text-xs text-slate-500">
                          Guardando...
                        </p>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center">
                    <ShieldCheck
                      size={28}
                      className="mx-auto mb-3 text-slate-600"
                    />

                    <p className="text-sm text-slate-400">
                      {search
                        ? 'No se encontraron solicitudes.'
                        : 'Todavía no hay solicitudes de eliminación registradas.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TOTAL */}

        <div className="border-t border-slate-700/70 px-5 py-3">
          <p className="text-xs text-slate-500">
            Total de solicitudes registradas: {requests.length}
          </p>
        </div>

      </section>

      {/* CONEXIÓN CON SUPABASE */}

      <section className="panel-pad">
        <div className="flex gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-green-500/15 text-green-300">
            <Database size={19} />
          </span>

          <div>
            <h3 className="font-semibold text-white">
              Base de datos
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              MailDesk está conectado a Supabase para gestionar sus registros.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3">
          <CheckCircle2 size={18} className="text-green-300" />

          <p className="text-sm text-green-100">
            Conexión configurada. Las solicitudes se consultan desde la base de datos.
          </p>
        </div>
      </section>

    </div>
  )
}