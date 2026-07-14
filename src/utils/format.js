// Format angka jadi Rupiah, mis. 13000 -> "Rp13.000"
export function rupiah(n) {
  return 'Rp' + Number(n || 0).toLocaleString('id-ID')
}

// Cek apakah toko sedang buka berdasarkan jam sekarang.
// Mendukung jam yang MELEWATI tengah malam, mis. buka 14 tutup 2 (dini hari).
export function isOpen(openHour, closeHour, now = new Date()) {
  const h = now.getHours() + now.getMinutes() / 60
  if (closeHour > openHour) {
    // Jam normal dalam satu hari, mis. 14–22
    return h >= openHour && h < closeHour
  }
  // Jam lewat tengah malam, mis. buka 14 tutup 02 → buka bila h>=14 ATAU h<02
  return h >= openHour || h < closeHour
}

// Validasi nomor HP Indonesia. Terima format 08xxx, 62xxx, atau +62xxx.
// Mengembalikan true jika valid (anti nomor ngasal untuk saring pesanan fiktif).
export function isValidPhone(raw) {
  const d = String(raw || '').replace(/[\s\-+()]/g, '')
  // 08xxxxxxxx (10-13 digit) atau 62 8xxxxxxxx
  return /^08\d{8,11}$/.test(d) || /^628\d{7,11}$/.test(d)
}
