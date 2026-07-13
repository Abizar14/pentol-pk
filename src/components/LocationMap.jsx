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

  // Peta Google resmi (kalau ada API key) — tile pasti muncul + marker bawaan.
  const googleEmbed = `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${q}&zoom=${mapZoom}&language=id`

  // Peta default TANPA key: gambar peta statis (center+zoom di-render server) →
  // PASTI center di titik ini, mustahil nampilin dunia. Marker merah baked-in.
  const staticMap = `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&z=${mapZoom}&size=600,350&l=map&pt=${lng},${lat},pm2rdm`

  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`
  const openMaps = `https://www.google.com/maps/search/?api=1&query=${q}`

  return (
    <section className="mx-auto max-w-xl px-4 py-6">
      <RunwayDivider className="mb-5" />
      <h3 className="mb-1 text-xl font-extrabold text-brand-red">📍 Lokasi Gerobak</h3>
      <p className="mb-3 text-sm text-brand-brown/70">{locationLabel || area}</p>

      {hasKey ? (
        // Ada API key → peta Google interaktif (marker bawaan)
        <div className="overflow-hidden rounded-2xl shadow-md ring-1 ring-brand-brown/10">
          <iframe
            title="Lokasi Gerobak Pentol"
            src={googleEmbed}
            className="h-60 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      ) : (
        // Belum ada key → gambar peta statis (klik = buka Google Maps beneran)
        <a
          href={openMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-2xl shadow-md ring-1 ring-brand-brown/10 active:scale-[0.99]"
        >
          <img src={staticMap} alt="Peta lokasi gerobak" className="h-60 w-full object-cover" loading="lazy" />
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
