// ============================================================
//  DATA USAHA — edit di sini saja untuk mengganti info toko
// ============================================================

export const business = {
    name: 'Pentol PK Bandara',
    // Tagline bertema penerbangan
    tagline: 'Pentol PK — JOSJIS Sewedep POL!',
    // Nomor WhatsApp penjual, format internasional TANPA tanda "+"
    whatsapp: '62895810274829',
    // Jam operasional (format 24 jam) untuk papan status penerbangan
    openHour: 15, // 15.00
    closeHour: 22, // 22.00
    openLabel: '14.00 – 23.59 WITA',
    area: 'Sekitar Jl. Bandara, Samarinda',
    emoji: '✈️',
    // Ongkir untuk pesanan diantar (flat). Ubah ke 0 jika gratis ongkir.
    deliveryFee: 5000,
    deliveryNote: 'Flat Rp5.000 untuk area sekitar gerobak',
    // Minimal belanja (subtotal) agar bisa checkout. Set 0 kalau tidak mau batas.
    minOrder: 10000,
    // Gambar QRIS statis merchant. Taruh file di public/qris.png (atau ganti path).
    qrisImage: '/qris.jpg',
    qrisName: 'Pentol PK Bandara', // nama merchant yang tampil di QRIS
    // Logo usaha (karakter penjual pentol). Taruh file di public/logo.png.
    // Jika file belum ada, header otomatis pakai emoji sebagai cadangan.
    logoImage: '/logo.jpg',
    // ── Lokasi gerobak untuk peta di aplikasi ──
    // Cara ambil koordinat: buka Google Maps, klik-KANAN di titik lokasimu →
    // angka pertama = lat, angka kedua = lng. Klik angkanya untuk menyalin.
    // (Bisa juga diatur dari tab Info sheet: key `lat`, `lng`, `mapZoom`.)
    lat: -0.365576, // lokasi gerobak (titik pas dari Google Maps)
    lng: 117.266725,
    mapZoom: 16,
    locationLabel: 'Gerobak kami mangkal di sini 🛺',
    // API key Google Maps Embed (biar peta muncul mulus, resmi Google).
    // Cara ambil: lihat README bagian "Peta Google Maps (API key)".
    // Kosongkan '' kalau belum punya → app tampilkan kartu lokasi biasa (tanpa peta gray).
    mapsApiKey: '',
}

// Level sambal yang bisa dipilih pelanggan
export const spiceLevels = ['Tidak Pedas', 'Sedang', 'Extra Pedas']

// URL Google Apps Script Web App untuk MENCATAT pesanan ke tab "Pesanan".
// Kosongkan '' = fitur mati (pesanan tetap jalan via WhatsApp, cuma tidak dicatat).
// Cara dapat URL: lihat sheet-template/catat-pesanan.gs + README.
export const orderLogUrl = 'https://script.google.com/macros/s/AKfycbyS5lwGH6i7XhBQoenyMt4cBBV5YVJiDUfepzBcDuNP01Iug5K7eIMDny0P1hYT2pOT9w/exec'

// Banner promo di atas menu. Kosongkan '' untuk menyembunyikan.
export const promoBanner = '🎉 Paket & Combo lebih hemat daripada beli satuan — cobain sekarang!'

// ID menu yang dapat badge "TERLARIS 🔥". Cocokkan dengan id di sheet/menu.js.
export const bestsellers = ['pentol-biasa', 'paket-komplit']

// Harga coret (harga normal sebelum hemat) untuk badge HEMAT + harga dicoret.
// Bisa juga diatur dari kolom `oldprice` di Google Sheet (menimpa nilai di sini).
export const oldPrices = {
    'paket-ngemil': 12000,
    'paket-komplit': 23000,
    'combo-ngemil': 12500,
    'combo-komplit': 23000,
}

// Metode pembayaran. QRIS = QRIS statis (scan lalu kirim bukti via WA), COD = bayar di tempat.
export const paymentMethods = [
    { key: 'cod', label: 'COD (Bayar di Tempat)', icon: '💵' },
    { key: 'qris', label: 'QRIS', icon: '📱' },
]

// ============================================================
//  GOOGLE SHEETS (opsional) — biar bisa edit menu & jam dari HP
// ------------------------------------------------------------
//  Cara pakai (lihat README bagian "Edit dari Google Sheets"):
//  1. Buat Google Sheet, isi 2 tab: "Menu" dan "Info".
//  2. Share -> "Siapa saja yang memiliki link" = Viewer.
//  3. Salin ID spreadsheet dari URL, tempel di `id` di bawah.
//  4. Ubah `enabled` jadi true.
//  Kalau enabled=false / gagal / offline, app otomatis pakai data lokal
//  (config di atas + src/data/menu.js) sebagai cadangan.
// ============================================================
export const sheet = {
    enabled: true,
    id: '1N-D3vXboYw3QV-DAQpUq8FCGvvw3dzF26CRe_XAJxv4',
    menuTab: 'Menu', // nama tab berisi daftar menu
    infoTab: 'Info', // nama tab berisi pengaturan (jam buka, ongkir, dll)
}

// Bangun URL ekspor CSV dari Google Sheets (endpoint gviz, tanpa perlu publish).
export function sheetCsvUrl(tabName) {
    return `https://docs.google.com/spreadsheets/d/${sheet.id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    tabName,
  )}`
}