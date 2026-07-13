import { rupiah } from '../utils/format'
import { useStore } from '../store/StoreContext'
import StatusBadge from './StatusBadge'
import Logo from './Logo'

// Hero bertema penerbangan: tagline "Pentol Express", papan status, motif landasan.
export default function Hero({ minPrice, onOrderClick }) {
  const { business } = useStore()
  const waHref = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
    `Halo ${business.name}, saya mau tanya-tanya dulu 🙏`,
  )}`

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-red to-brand-dark text-brand-cream">
      <div className="mx-auto max-w-xl px-4 pb-8 pt-8">
        {/* Logo usaha besar di tengah (fallback ke emoji kalau belum dipasang) */}
        <div className="mb-5 flex justify-center">
          <Logo className="h-36 w-36 shadow-xl" emojiClass="text-7xl" />
        </div>

        <div className="mb-3 flex justify-center">
          <StatusBadge />
        </div>

        <h2 className="text-center text-2xl font-extrabold leading-snug">{business.tagline}</h2>

        {/* Motif landasan pemisah */}
        <div className="mx-auto my-4 h-1.5 w-40 rounded-full bg-runway opacity-70" />

        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span className="rounded-full bg-black/15 px-3 py-1">🕒 {business.openLabel}</span>
          <span className="rounded-full bg-black/15 px-3 py-1">📍 {business.area}</span>
          <span className="rounded-full bg-black/15 px-3 py-1">💰 Mulai {rupiah(minPrice)}</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={onOrderClick}
            className="btn bg-brand-amber py-3.5 text-base font-bold text-brand-brown shadow-lg hover:brightness-105"
          >
            🛒 Pesan Sekarang
          </button>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn border-2 border-brand-cream py-3.5 text-base text-brand-cream hover:bg-brand-cream hover:text-brand-red"
          >
            💬 Chat WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
