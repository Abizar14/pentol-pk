import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Peta interaktif pakai Leaflet + tile OpenStreetMap.
// Andal (tile dari CDN OSM), tanpa API key, bisa zoom/geser, ada pin di lokasi.
export default function LeafletMap({ lat, lng, zoom = 16, label }) {
  const elRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!elRef.current || mapRef.current) return

    const map = L.map(elRef.current, { scrollWheelZoom: false }).setView([lat, lng], zoom)
    mapRef.current = map

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)

    // Pin merah (pakai divIcon biar tidak kena masalah path ikon default Leaflet).
    const icon = L.divIcon({
      className: 'pentol-pin',
      html: '<div style="font-size:30px;line-height:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.4))">📍</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    })
    L.marker([lat, lng], { icon }).addTo(map).bindPopup(label || 'Lokasi Gerobak')

    // Perbaiki "tile abu-abu": paksa Leaflet hitung ulang ukuran container
    // beberapa kali (kadang container belum final saat init) + saat resize.
    const fix = () => map.invalidateSize()
    const timers = [50, 200, 500, 1000].map((t) => setTimeout(fix, t))
    const ro = new ResizeObserver(fix)
    ro.observe(elRef.current)

    return () => {
      timers.forEach(clearTimeout)
      ro.disconnect()
      map.remove()
      mapRef.current = null
    }
  }, [lat, lng, zoom, label])

  return <div ref={elRef} className="h-60 w-full" />
}
