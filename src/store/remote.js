import { csvToObjects, parseCsv } from '../utils/csv'
import { sheet, sheetCsvUrl } from '../data/config'

// Ambil angka bulat dari teks. Harga di sheet sering tampil "2.000" / "5,000"
// (pemisah ribuan). Semua non-digit dibuang agar "2.000" -> 2000, bukan 2.
function num(v) {
  const s = String(v ?? '').replace(/[^\d-]/g, '')
  if (s === '' || s === '-') return undefined
  const n = Number(s)
  return Number.isFinite(n) ? n : undefined
}

// Petakan tab "Menu" (kolom: id, name, price, desc, emoji, image, available)
function mapMenu(objs) {
  return objs
    .filter((o) => o.id && o.name)
    .map((o) => ({
      id: o.id,
      name: o.name,
      price: num(o.price) || 0,
      desc: o.desc || '',
      emoji: o.emoji || '🍡',
      image: o.image || null,
      oldPrice: num(o.oldprice) || null, // harga coret (opsional)
      badge: o.badge || null, // label khusus, mis. "TERLARIS" (opsional)
      category: (o.category || '').trim().toLowerCase() || 'pentol', // kategori produk
      // available FALSE/TIDAK/0 = stok kosong → tetap tampil tapi ditandai (bukan disembunyikan)
      available: !['false', 'tidak', '0', 'no'].includes((o.available || '').toLowerCase()),
    }))
}

// Petakan tab "Info": kolom-1 = key, value = sel TERISI pertama sesudahnya.
// Ambil sel terisi pertama (kolom B, lalu C, dst) supaya tetap kebaca walau
// nilainya tidak sengaja ke-geser satu kolom. Baris "key" (header) dilewati.
function mapInfo(rows) {
  const m = {}
  rows.forEach((r) => {
    const key = (r[0] || '').trim().toLowerCase()
    if (!key || key === 'key') return
    let val = ''
    for (let i = 1; i < r.length; i++) {
      if (String(r[i] || '').trim() !== '') {
        val = String(r[i]).trim()
        break
      }
    }
    m[key] = val
  })
  const out = {}
  if (m.name) out.name = m.name
  if (m.tagline) out.tagline = m.tagline
  if (m.area) out.area = m.area
  if (m.openlabel) out.openLabel = m.openlabel
  if (m.openhour !== undefined) out.openHour = num(m.openhour)
  if (m.closehour !== undefined) out.closeHour = num(m.closehour)
  if (m.deliveryfee !== undefined) out.deliveryFee = num(m.deliveryfee)
  if (m.minorder !== undefined) out.minOrder = num(m.minorder)
  if (m.whatsapp) out.whatsapp = String(m.whatsapp).replace(/[^\d]/g, '')
  // Koordinat peta = desimal, jadi TIDAK boleh pakai num() (yang buang titik).
  if (m.lat) out.lat = dec(m.lat)
  if (m.lng) out.lng = dec(m.lng)
  if (m.mapzoom !== undefined) out.mapZoom = num(m.mapzoom)
  if (m.locationlabel) out.locationLabel = m.locationlabel
  return out
}

// Parse angka desimal (untuk koordinat lat/lng). Titik dipertahankan sbg desimal.
function dec(v) {
  const n = Number(String(v ?? '').replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? n : undefined
}

// Ambil data dari Google Sheets. Melempar error kalau gagal (dipakai untuk fallback).
export async function fetchStoreData() {
  const [menuRes, infoRes] = await Promise.all([
    fetch(sheetCsvUrl(sheet.menuTab)),
    fetch(sheetCsvUrl(sheet.infoTab)),
  ])
  if (!menuRes.ok) throw new Error('Gagal ambil tab Menu')

  const menu = mapMenu(csvToObjects(await menuRes.text()))
  // Tab Info opsional & dibaca per posisi kolom — kalau gagal, cukup pakai default.
  const info = infoRes.ok ? mapInfo(parseCsv(await infoRes.text())) : {}

  if (!menu.length) throw new Error('Tab Menu kosong')
  return { menu, info }
}

export const sheetEnabled = () => sheet.enabled && !sheet.id.startsWith('GANTI')
