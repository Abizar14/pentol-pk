import { useEffect, useState } from 'react'

// Menangkap event `beforeinstallprompt` dan menampilkan tombol
// "Tambahkan ke Layar Utama" (Add to Home Screen).
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault()
      setDeferred(e)
      setVisible(true)
    }
    const onInstalled = () => setVisible(false)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  async function install() {
    if (!deferred) return
    deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="mx-auto mt-4 flex max-w-xl items-center gap-3 rounded-2xl bg-brand-amber/20 px-4 py-3 ring-1 ring-brand-amber/40">
      <span className="text-2xl">📲</span>
      <p className="flex-1 text-sm font-medium text-brand-brown">
        Pasang aplikasi ini biar gampang pesan lagi nanti.
      </p>
      <div className="flex gap-1.5">
        <button onClick={install} className="rounded-full bg-brand-red px-3 py-1.5 text-sm font-semibold text-white">
          Pasang
        </button>
        <button onClick={() => setVisible(false)} aria-label="Tutup" className="px-1 text-brand-brown/50">
          ✕
        </button>
      </div>
    </div>
  )
}
