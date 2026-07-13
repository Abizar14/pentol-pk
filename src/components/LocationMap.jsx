import { useStore } from '../store/StoreContext'
import LeafletMap from './LeafletMap'

// Peta lokasi gerobak.
// - Default: peta Leaflet + tile OpenStreetMap (andal, interaktif, tanpa API key).
// - Kalau ada mapsApiKey → pakai Google Maps Embed API resmi.
export default function LocationMap() {
  const { business } = useStore()
  const { lat, lng, mapZoom = 16, mapsApiKey, locationLabel, area } = business

  if (lat == null || lng == null) return null

  const q = `${lat},${lng}`
  const hasKey = mapsApiKey && mapsApiKey.length > 10

  // Peta Google resmi (kalau ada API key) — tile pasti muncul + marker bawaan.
  const googleEmbed = `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${q}&zoom=${mapZoom}&language=id`

  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`
  const openMaps = `https://www.google.com/maps/search/?api=1&query=${q}`

  return (
    <section className="mx-auto max-w-xl px-4 py-8">
      <h3 className="mb-1 text-xl font-extrabold text-brand-red">📍 Lokasi Gerobak</h3>
      <p className="mb-3 text-sm text-brand-brown/70">{locationLabel || area}</p>

      <div className="overflow-hidden rounded-2xl shadow-md ring-1 ring-brand-brown/10">
        {hasKey ? (
          // Ada API key → peta Google interaktif
          <iframe
            title="Lokasi Gerobak Pentol"
            src={googleEmbed}
            className="h-60 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          // Default → peta Leaflet (OpenStreetMap), dijamin muncul & interaktif
          <LeafletMap lat={lat} lng={lng} zoom={mapZoom} label={locationLabel || area} />
        )}
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
