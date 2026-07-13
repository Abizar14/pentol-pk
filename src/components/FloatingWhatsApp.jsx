import { useStore } from '../store/StoreContext'

// Tombol WhatsApp mengambang — selalu terlihat, sekali tap langsung chat.
// Diposisikan di atas CartBar (bottom-24) supaya tidak ketutup.
export default function FloatingWhatsApp() {
  const { business } = useStore()
  const href = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
    `Halo ${business.name}, mau tanya-tanya dulu 🙏`,
  )}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-3xl shadow-lg shadow-green-600/40 ring-4 ring-white/60 transition active:scale-90"
    >
      💬
    </a>
  )
}
