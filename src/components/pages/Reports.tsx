import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { performanceData, timelineData } from '../../lib/mockData'

const cards = [
  { label: 'Entregas', value: '0%', desc: 'Sin envíos registrados' },
  { label: 'Aperturas únicas', value: '0', desc: 'Sin aperturas registradas' },
  { label: 'Clics únicos', value: '0', desc: 'Sin clics registrados' },
  { label: 'Aperturas totales', value: '0', desc: 'Sin actividad registrada' }
]

const links: {
  label: string
  clicks: number
  rate: string
}[] = []

export default function Reports() {
  return (
    <div className="space-y-6">

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-400">Actividad registrada</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Reportes</h2>
          <p className="mt-2 text-sm text-slate-400">
            Analiza el desempeño de tus comunicaciones.
          </p>
        </div>

        <div className="flex gap-2">
          <select className="field mt-0">
            <option>Todas las campañas</option>
          </select>

          <select className="field mt-0">
            <option>Últimos 30 días</option>
            <option>Últimos 7 días</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <section className="panel-pad" key={card.label}>
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{card.value}</p>
            <p className="mt-2 text-xs text-slate-500">{card.desc}</p>
          </section>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">

        <section className="panel-pad">
          <h3 className="font-semibold text-white">Entregas y rebotes</h3>
          <p className="mt-1 text-sm text-slate-400">
            Evolución durante el período
          </p>

          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ left: -20 }}>
                <CartesianGrid vertical={false} stroke="#334155" strokeDasharray="4 4" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="envios" name="Entregas" stroke="#16A34A" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="clics" name="Rebotes" stroke="#DC2626" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {timelineData.length === 0 && (
            <p className="text-center text-sm text-slate-500">
              Aún no hay actividad para mostrar.
            </p>
          )}
        </section>

        <section className="panel-pad">
          <h3 className="font-semibold text-white">Rendimiento por campaña</h3>
          <p className="mt-1 text-sm text-slate-400">
            Aperturas y clics en porcentaje
          </p>

          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ left: -20 }}>
                <CartesianGrid vertical={false} stroke="#334155" strokeDasharray="4 4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="apertura" name="Aperturas" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clics" name="Clics" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {performanceData.length === 0 && (
            <p className="text-center text-sm text-slate-500">
              Aún no hay campañas para mostrar.
            </p>
          )}
        </section>

      </div>

      <section className="panel overflow-hidden">
        <div className="border-b border-slate-700/70 px-5 py-4">
          <h3 className="font-semibold text-white">Enlaces con más clics</h3>
          <p className="mt-1 text-sm text-slate-400">
            Resultados de los enlaces de tus campañas.
          </p>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Enlace</th>
                <th>Clics únicos</th>
                <th>Porcentaje</th>
              </tr>
            </thead>

            <tbody>
              {links.length > 0 ? (
                links.map((link) => (
                  <tr key={link.label}>
                    <td className="font-medium text-slate-100">{link.label}</td>
                    <td>{link.clicks}</td>
                    <td>{link.rate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-500">
                    Todavía no hay enlaces registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}
