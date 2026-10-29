import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { X } from 'lucide-react'

export function StatusBadge({ children }: { children: string }) {
  const styles: Record<string, string> = {
    Enviada: 'bg-green-500/15 text-green-400 ring-green-500/25',
    Entregada: 'bg-green-500/15 text-green-400 ring-green-500/25',
    Programada: 'bg-amber-500/15 text-amber-300 ring-amber-500/25',
    Borrador: 'bg-slate-500/15 text-slate-300 ring-slate-500/25',
    Suscrita: 'bg-green-500/15 text-green-400 ring-green-500/25',
    'Sin confirmar': 'bg-amber-500/15 text-amber-300 ring-amber-500/25',
    Pausada: 'bg-red-500/15 text-red-300 ring-red-500/25',
  }

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[children] ?? styles.Borrador}`}>{children}</span>
}

export function IconButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className="icon-btn" {...props}>{children}</button>
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/75 p-4 backdrop-blur-sm sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-panel shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-700/70 px-5 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-white">{title}</h2>
          <IconButton aria-label="Cerrar" onClick={onClose}><X size={19} /></IconButton>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function EmptyState({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-600 bg-slate-900/35 px-6 py-12 text-center"><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">{description}</p>{children && <div className="mt-5">{children}</div>}</div>
}
