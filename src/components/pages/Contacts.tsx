import { useEffect, useState, type FormEvent } from 'react'
import { Plus, Search, Pencil, Trash2, Users, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Contact {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  async function loadContacts() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setContacts(data ?? [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadContacts()
  }, [])

  function openNewContact() {
    setEditingContact(null)
    setName('')
    setEmail('')
    setError('')
    setShowForm(true)
  }

  function openEditContact(contact: Contact) {
    setEditingContact(contact)
    setName(contact.name)
    setEmail(contact.email)
    setError('')
    setShowForm(true)
  }

  async function saveContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanName || !cleanEmail) {
      setError('Completa el nombre y el correo electrónico.')
      setSaving(false)
      return
    }

    const result = editingContact
      ? await supabase
          .from('contacts')
          .update({
            name: cleanName,
            email: cleanEmail,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingContact.id)
      : await supabase
          .from('contacts')
          .insert({
            name: cleanName,
            email: cleanEmail,
          })

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    setShowForm(false)
    setEditingContact(null)
    setSaving(false)

    await loadContacts()
  }

  async function deleteContact(contact: Contact) {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar a ${contact.name} de tu agenda?`
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contact.id)

    if (error) {
      setError(error.message)
      return
    }

    await loadContacts()
  }

  const filteredContacts = contacts.filter((contact) =>
    `${contact.name} ${contact.email}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-400">Agenda de MailDesk</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            Contactos
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Administra y organiza las personas de tus campañas.
          </p>
        </div>

        <button className="btn-primary" onClick={openNewContact}>
          <Plus size={18} />
          Agregar contacto
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="panel-pad flex items-center gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-500/15 text-blue-300">
            <Users size={21} />
          </span>
          <div>
            <p className="text-sm text-slate-400">Total de contactos</p>
            <p className="text-2xl font-semibold text-white">
              {contacts.length}
            </p>
          </div>
        </section>
      </div>

      <section className="panel overflow-hidden">
        <div className="border-b border-slate-700/70 p-4">
          <label className="relative block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="field mt-0 pl-10"
              placeholder="Buscar por nombre o correo electrónico"
            />
          </label>
        </div>

        {error && (
          <div className="m-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <p className="p-8 text-center text-sm text-slate-400">
            Cargando contactos...
          </p>
        ) : filteredContacts.length === 0 ? (
          <div className="p-10 text-center">
            <Users size={30} className="mx-auto text-slate-500" />
            <p className="mt-3 font-medium text-white">
              {query ? 'No encontramos resultados.' : 'Todavía no hay contactos.'}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {query
                ? 'Prueba con otro nombre o correo.'
                : 'Agrega tu primer contacto para comenzar.'}
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo electrónico</th>
                  <th>Fecha de incorporación</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="font-medium text-slate-100">
                      {contact.name}
                    </td>
                    <td>{contact.email}</td>
                    <td>
                      {new Date(contact.created_at).toLocaleDateString('es-CO')}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditContact(contact)}
                          className="rounded-lg p-2 text-blue-300 hover:bg-blue-500/10"
                          title="Editar contacto"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => deleteContact(contact)}
                          className="rounded-lg p-2 text-red-300 hover:bg-red-500/10"
                          title="Eliminar contacto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <section className="panel w-full max-w-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {editingContact ? 'Editar contacto' : 'Nuevo contacto'}
              </h3>

              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveContact} className="mt-5 space-y-4">
              <label className="field-label">
                Nombre completo
                <input
                  className="field"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ej. Juan Pérez"
                  required
                />
              </label>

              <label className="field-label">
                Correo electrónico
                <input
                  className="field"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </label>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? 'Guardando...'
                    : editingContact
                      ? 'Guardar cambios'
                      : 'Guardar contacto'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}