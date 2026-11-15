import { useState } from 'react'
import { Mail, Lock, LogIn } from 'lucide-react'
import { supabase } from './lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Correo o contraseña incorrectos.')
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1220] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#111C2E] p-8 shadow-2xl">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-blue-600">
            <Mail size={28} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white">
            MailDesk
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Ingresa a tu espacio de administración
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Correo electrónico
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@correo.com"
              className="w-full rounded-lg border border-slate-700 bg-[#0B1220] px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Contraseña
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="w-full rounded-lg border border-slate-700 bg-[#0B1220] px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            <LogIn size={18} />
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          MailDesk · Panel de administración
        </p>

      </div>
    </div>
  )
}