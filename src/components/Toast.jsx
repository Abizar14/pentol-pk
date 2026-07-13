// Notifikasi kecil "ditambahkan ke keranjang" yang muncul sebentar lalu hilang.
// Dikontrol dari App: tampil kalau `message` ada.
export default function Toast({ message }) {
  if (!message) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
      <div className="animate-pop rounded-full bg-brand-brown px-4 py-2 text-sm font-semibold text-brand-cream shadow-lg">
        ✅ {message}
      </div>
    </div>
  )
}
