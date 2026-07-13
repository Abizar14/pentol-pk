import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Peta interaktif Leaflet. Pakai basemap CARTO (Voyager) — CDN cepat & boleh
// dipakai produksi (beda dg tile.openstreetmap.org yang untuk hobi saja).
export default function LeafletMap({ lat, lng, zoom = 16, label }) {
  const elRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!elRef.current || mapRef.current) return

    const map = L.map(elRef.current, { scrollWheelZoom: false }).setView([lat, lng], zoom)
    mapRef.current = map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
      subdomains: 'abcd',
      maxZoom: 20,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map)

    const icon = L.divIcon({
      className: 'pentol-pin',
      html: '<div style="font-size:30px;line-height:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.4))">📍</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    })
    L.marker([lat, lng], { icon }).addTo(map).bindPopup(label || 'Lokasi Gerobak')

    // Anti "tile abu-abu": paksa hitung ulang ukuran berkali-kali + saat resize.
    const fix = () => map.invalidateSize()
    const timers = [0, 100, 300, 700, 1500].map((t) => setTimeout(fix, t))
    const ro = new ResizeObserver(fix)
    ro.observe(elRef.current)
    window.addEventListener('load', fix)

    return () => {
      timers.forEach(clearTimeout)
      ro.disconnect()
      window.removeEventListener('load', fix)
      map.remove()
      mapRef.current = null
    }
  }, [lat, lng, zoom, label])

  // Tinggi eksplisit (px) supaya Leaflet selalu tahu ukuran container sejak awal.
  return <div ref={elRef} style={{ height: 240, width: '100%' }} />
}
