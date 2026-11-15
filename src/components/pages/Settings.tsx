import { useState } from 'react'
import {
  CheckCircle2,
  Database,
  Mail,
  Palette,
  ShieldCheck,
  Trash2,
  Plus,
  Search,
  X,
  Clock,
  FileCheck,
  AlertCircle
} from 'lucide-react'

type RequestStatus = 'Pendiente' | 'En proceso' | 'Completada' | 'No procede'

type DeletionRequest = {
  id: number
  name: string
  email: string
  reason: string
  observations: string
  date: string
  status: RequestStatus
}

const settingGroups = [
  {
    title: 'Información del remitente',
    description: 'Nombre y dirección que aparecerán en tus correos.',
    icon: Mail,
    fields: ['Nombre del remitente', 'Correo de respuesta']
  },
  {
    title: 'Proveedor de correo',
    description: 'La conexión estará disponible cuando decidas integrar un proveedor.',
    icon: ShieldCheck,
    fields: []
  },
  {
    title: 'Preferencias de la aplicación',
    description: 'Opciones generales para tu espacio de trabajo.',
    icon: Palette,
    fields: []
  }
]

export default function Settings() {
  const [requests, setRequests] = useState<DeletionRequest[]>([])
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    reason: 'Solicitud del titular',
    observations: ''
  })

  const pending = requests.filter(r => r.status === 'Pendiente').length
  const processing = requests.filter(r => r.status === 'En proceso').length
  const completed = requests.filter(r => r.status === 'Completada').length

  const filteredRequests = requests.filter(request =>
    request.email.toLowerCase().includes(search.toLowerCase()) ||
    request.name.toLowerCase().includes(search.toLowerCase())
  )

  function addRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newRequest: DeletionRequest = {
      id: Date.now(),
      ...form,
      date: new Date().toLocaleDateString('es-CO'),
      status: 'Pendiente'
    }

    setRequests(previous => [newRequest, ...previous])

    setForm({
      name: '',
      email: '',
      reason: 'Solicitud del titular',
      observations: ''
    })

    setShowForm(false)
  }

  function updateStatus(id: number, status: RequestStatus) {
    setRequests(previous =>
      previous.map(request =>
        request.id === id ? { ...request, status } : request
      )
    )
  }

  return (
    <div className="max-w-5xl space-y-6">

      <div>
        <p className="text-sm text-slate-400">Ajustes de la aplicación</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Configuración</h2>
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
              <p className="mt-1 text-sm text-slate-400">{description}</p>
            </div>
          </div>

          {fields.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {fields.map((field, index) => (
                <label key={field} className="field-label">
                  {field}
                  <input
                    className="field"
                    placeholder={index === 0 ? 'Ej. Equipo MailDesk' : 'ejemplo@empresa.com'}
                  />
                </label>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-slate-700 bg-slate-900/50 p-4 text-sm text-slate-400">
              {title === 'Proveedor de correo'
                ? 'Aún no hay proveedor conectado. La interfaz está lista para una futura integración segura.'
                : 'Tema oscuro activo. Las preferencias persistentes estarán disponibles con la conexión de datos.'}
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
            <p className="mt-3 text-2xl font-semibold text-white">{pending}</p>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2 text-blue-300">
              <AlertCircle size={17} />
              <span className="text-sm">En proceso</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-white">{processing}</p>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2 text-green-300">
              <FileCheck size={17} />
              <span className="text-sm">Completadas</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-white">{completed}</p>
          </div>

        </div>

        {/* BOTÓN NUEVA SOLICITUD */}

        <div className="flex flex-col justify-between gap-3 px-5 pb-5 sm:flex-row sm:items-center">
          <div>
            <h4 className="font-medium text-white">Solicitudes de eliminación</h4>
            <p className="mt-1 text-xs text-slate-400">
              Registra y realiza seguimiento a las solicitudes recibidas.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
          >
            {showForm ? <X size={17} /> : <Plus size={17} />}
            {showForm ? 'Cancelar' : 'Nueva solicitud'}
          </button>
        </div>

        {/* FORMULARIO */}

        {showForm && (
          <form onSubmit={addRequest} className="space-y-4 border-t border-slate-700/70 bg-slate-900/40 p-5">

            <div>
              <h4 className="font-semibold text-white">Registrar solicitud</h4>
              <p className="mt-1 text-sm text-slate-400">
                Ingresa los datos de la persona que solicita la eliminación.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <label className="field-label">
                Nombre del solicitante
                <input
                  className="field"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Nombre completo"
                />
              </label>

              <label className="field-label">
                Correo electrónico *
                <input
                  type="email"
                  required
                  className="field"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="contacto@ejemplo.com"
                />
              </label>

              <label className="field-label">
                Motivo de la solicitud
                <select
                  className="field"
                  value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })}
                >
                  <option>Solicitud del titular</option>
                  <option>Retiro de autorización</option>
                  <option>Actualización de información</option>
                  <option>Otro motivo</option>
                </select>
              </label>

              <label className="field-label sm:col-span-2">
                Observaciones
                <textarea
                  className="field min-h-24"
                  value={form.observations}
                  onChange={e => setForm({ ...form, observations: e.target.value })}
                  placeholder="Detalles adicionales de la solicitud..."
                />
              </label>

            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
              >
                Registrar solicitud
              </button>
            </div>

          </form>
        )}

        {/* BUSCADOR */}

        <div className="border-t border-slate-700/70 px-5 py-4">
          <div className="relative">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="field pl-10"
              placeholder="Buscar por nombre o correo electrónico..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLA */}

        <div className="table-wrap">
          <table className="data-table min-w-[700px]">
            <thead>
              <tr>
                <th>Solicitante</th>
                <th>Fecha</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Actualizar</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map(request => (
                  <tr key={request.id}>
                    <td>
                      <p className="font-medium text-slate-100">
                        {request.name || 'Sin nombre'}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {request.email}
                      </p>
                    </td>

                    <td>{request.date}</td>

                    <td>{request.reason}</td>

                    <td>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        request.status === 'Completada'
                          ? 'bg-green-500/15 text-green-300'
                          : request.status === 'En proceso'
                          ? 'bg-blue-500/15 text-blue-300'
                          : request.status === 'No procede'
                          ? 'bg-red-500/15 text-red-300'
                          : 'bg-amber-500/15 text-amber-300'
                      }`}>
                        {request.status}
                      </span>
                    </td>

                    <td>
                      <select
                        className="field mt-0 min-w-32 text-xs"
                        value={request.status}
                        onChange={e => updateStatus(request.id, e.target.value as RequestStatus)}
                      >
                        <option>Pendiente</option>
                        <option>En proceso</option>
                        <option>Completada</option>
                        <option>No procede</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    <ShieldCheck size={28} className="mx-auto mb-3 text-slate-600" />
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

        <div className="border-t border-slate-700/70 px-5 py-3">
          <p className="text-xs text-slate-500">
            Total de solicitudes registradas: {requests.length}
          </p>
        </div>

      </section>

      {/* SUPABASE */}

      <section className="panel-pad">
        <div className="flex gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-green-500/15 text-green-300">
            <Database size={19} />
          </span>

          <div>
            <h3 className="font-semibold text-white">Futura conexión con Supabase</h3>
            <p className="mt-1 text-sm text-slate-400">
              Estructura prevista para campañas, contactos, borradores y almacenamiento de archivos.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3">
          <CheckCircle2 size={18} className="text-amber-300" />
          <p className="text-sm text-amber-100">
            Sin conexión configurada. No se han solicitado ni almacenado credenciales.
          </p>
        </div>
      </section>

    </div>
  )
}
