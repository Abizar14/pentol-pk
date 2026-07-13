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
          <p className="text-[11px] text-brand-cream/80">📍 {business.area}</p>
        </div>
      </div>
    </header>
  )
}
