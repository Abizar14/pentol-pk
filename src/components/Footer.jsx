import { useStore } from '../store/StoreContext'
import Logo from './Logo'

// Footer berbentuk kartu — logo, nama usaha, jam, area, + tombol WhatsApp.
export default function Footer() {
  const { business } = useStore()
  const waHref = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
    `Halo ${business.name}, mau tanya-tanya dulu 🙏`,
  )}`

  return (
    <footer className="mx-auto max-w-xl px-4 pb-8 pt-2">
      <div className="rounded-3xl bg-gradient-to-b from-brand-red to-brand-dark px-6 py-7 text-center text-brand-cream shadow-xl">
        <div className="mb-3 flex justify-center">
          <Logo className="h-16 w-16 shadow-lg" emojiClass="text-3xl" />
        </div>
        <h4 className="text-lg font-extrabold">{business.name}</h4>

        <div className="mx-auto my-4 h-1 w-24 rounded-full bg-runway opacity-70" />

        <div className="space-y-1.5 text-sm text-brand-cream/90">
          <p>🕒 {business.openLabel}</p>
          <p>📍 {business.area}</p>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn mt-5 w-full bg-brand-amber py-3 font-bold text-brand-brown hover:brightness-105"
        >
          💬 Chat WhatsApp
        </a>

        <p className="mt-5 text-[11px] text-brand-cream/60">EST 2026 · Pesan gampang lewat WhatsApp ✈️</p>
      </div>
    </footer>
  )
}
