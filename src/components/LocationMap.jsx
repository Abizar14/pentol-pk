import { useStore } from '../store/StoreContext'
import RunwayDivider from './RunwayDivider'

// Peta lokasi gerobak.
// - Kalau ada mapsApiKey → pakai Google Maps Embed API resmi (tile pasti muncul + marker).
// - Kalau belum ada key → tampilkan kartu lokasi rapi (bukan peta abu-abu), tetap ada tombol Maps.
export default function LocationMap() {
  const { business } = useStore()
  const { lat, lng, mapZoom = 16, mapsApiKey, locationLabel, area } = business

  if (lat == null || lng == null) return null

  const q = `${lat},${lng}`
  const hasKey = mapsApiKey && mapsApiKey.length > 10
  const embed = `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${q}&zoom=${mapZoom}&language=id`
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`
  const openMaps = `https://www.google.com/maps/search/?api=1&query=${q}`

  return (
    <section className="mx-auto max-w-xl px-4 py-6">
      <RunwayDivider className="mb-5" />
      <h3 className="mb-1 text-xl font-extrabold text-brand-red">📍 Lokasi Gerobak</h3>
      <p className="mb-3 text-sm text-brand-brown/70">{locationLabel || area}</p>

      {hasKey ? (
        // Peta interaktif resmi Google (marker bawaan di titik lokasi)
        <div className="overflow-hidden rounded-2xl shadow-md ring-1 ring-brand-brown/10">
          <iframe
            title="Lokasi Gerobak Pentol"
            src={embed}
            className="h-60 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      ) : (
        // Fallback tanpa API key: kartu lokasi (bukan peta gray) + tombol
        <a
          href={openMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl bg-brand-creamdark p-4 shadow-md ring-1 ring-brand-brown/10 active:scale-[0.99]"
        >
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-brand-red text-3xl text-brand-cream">
            🗺️
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-brand-brown">Lihat di Google Maps</p>
            <p className="text-xs text-brand-brown/60">Tap untuk buka peta lokasi gerobak</p>
          </div>
          <span className="text-brand-red">➔</span>
        </a>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <a href={directions} target="_blank" rel="noopener noreferrer" className="btn-primary py-3 text-sm">
          🧭 Petunjuk Arah
        </a>
        <a href={openMaps} target="_blank" rel="noopener noreferrer" className="btn-outline py-3 text-sm">
          🗺️ Buka di Maps
        </a>
      </div>
    </section>
  )
}
