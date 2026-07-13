import { useEffect, useState } from 'react'
import { isOpen } from '../utils/format'
import { useStore } from '../store/StoreContext'

// Papan status gaya flight board: "STATUS: BUKA" / "STATUS: TUTUP".
// Update tiap menit.
export default function StatusBadge() {
  const { business } = useStore()
  const [open, setOpen] = useState(() => isOpen(business.openHour, business.closeHour))

  useEffect(() => {
    const check = () => setOpen(isOpen(business.openHour, business.closeHour))
    check() // langsung sinkron kalau jam berubah dari Google Sheets
    const t = setInterval(check, 60_000)
    return () => clearInterval(t)
  }, [business.openHour, business.closeHour])

  return (
    <span className="inline-flex items-center gap-2 rounded-md bg-brand-brown px-3 py-1.5 font-mono text-xs font-bold tracking-widest text-brand-amber shadow-inner">
      <span className={`h-2 w-2 rounded-full ${open ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
      STATUS:{' '}
      <span className={open ? 'text-green-300' : 'text-red-300'}>{open ? 'BUKA' : 'TUTUP'}</span>
      <span className="text-brand-amber/60">·</span>
      <span className="text-brand-cream/90">{business.openLabel}</span>
    </span>
  )
}
