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

  // Peta default TANPA key: OpenStreetMap — dijamin render di mana saja (anti-gray),
  // sudah ada pin. Otomatis dipakai selama mapsApiKey masih kosong.
  const delta = 180 / Math.pow(2, mapZoom - 1)
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`
  const osmEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`

  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`
  const openMaps = `https://www.google.com/maps/search/?api=1&query=${q}`

  return (
    <section className="mx-auto max-w-xl px-4 py-6">
      <RunwayDivider className="mb-5" />
      <h3 className="mb-1 text-xl font-extrabold text-brand-red">📍 Lokasi Gerobak</h3>
      <p className="mb-3 text-sm text-brand-brown/70">{locationLabel || area}</p>

      <div className="overflow-hidden rounded-2xl shadow-md ring-1 ring-brand-brown/10">
        <iframe
          title="Lokasi Gerobak Pentol"
          // Pakai Google (kalau ada API key), kalau tidak → OpenStreetMap (anti-gray).
          src={hasKey ? googleEmbed : osmEmbed}
          className="h-60 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

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
