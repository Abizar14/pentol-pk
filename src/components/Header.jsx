import { useStore } from '../store/StoreContext'
import Logo from './Logo'

// Header lengket di atas dengan LOGO usaha (karakter penjual) + nama.
// Border bawah pakai warna terakota sesuai logo.
export default function Header() {
  const { business } = useStore()
  return (
    <header className="sticky top-0 z-30 border-b-4 border-brand-terracotta bg-brand-red text-brand-cream shadow-md">
      <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-3">
        {/* Slot logo usaha — pasang file di public/logo.png */}
        <Logo className="h-11 w-11" emojiClass="text-2xl" />
        <div className="leading-tight">
          <h1 className="text-lg font-extrabold">{business.name}</h1>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${business.lat},${business.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-brand-amber underline decoration-brand-amber/50 underline-offset-2"
          >
            📍 Klik untuk lihat lokasi
          </a>
        </div>
      </div>
    </header>
  )
}
