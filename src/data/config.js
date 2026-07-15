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
    openLabel: '14.00 – 02.00 WITA',
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

// Label untuk menu yang stoknya kosong (available tidak dicentang).
// Item TIDAK dihilangkan — tetap tampil tapi diberi tanda ini & tidak bisa dipesan.
// Ganti sesukamu, mis. 'SEGERA HADIR' atau 'SOON'.
export const soldOutLabel = 'SEGERA HADIR' // atau 'SOON'

// Banner promo di atas menu. Kosongkan '' untuk menyembunyikan.
export const promoBanner = '🔥 Kriwil & Daging gurih kenyal, sambal nampol — pesan sekarang! Paket & Combo segera hadir 🚀'

// ID menu yang dapat badge "TERLARIS 🔥". Cocokkan dengan id di sheet/menu.js.
export const bestsellers = ['pentol-biasa', 'paket-komplit']

// Harga coret (anchor price buat pemasaran) sekarang diatur dari kolom `oldprice`
// di Google Sheet — bebas isi angka apa pun. Kosong = tidak ada harga coret.

// Metode pembayaran. QRIS = QRIS statis (scan lalu kirim bukti via WA), COD = bayar di tempat.
export const paymentMethods = [
    { key: 'cod', label: 'COD (Bayar di Tempat)', icon: '💵' },
    { key: 'qris', label: 'QRIS', icon: '📱' },
]

// ============================================================
//  KATEGORI PRODUK — tiap kategori punya admin WA & aturan delivery sendiri
// ------------------------------------------------------------
//  Item di Google Sheet (tab Menu) diberi kolom `category`, mis. 'nasibakar'.
//  Kalau kolom kosong → otomatis masuk kategori default ('pentol').
//  Kalau keranjang berisi 2 kategori → checkout kirim ke 2 chat WA terpisah.
// ============================================================
export const defaultCategory = 'pentol'
export const categories = {
    pentol: {
        label: 'Pentol',
        whatsapp: business.whatsapp, // admin utama (pentol)
        delivery: false, // pentol: ambil sendiri saja
        deliveryFee: 0,
    },
    nasibakar: {
        label: 'Nasi Bakar',
        whatsapp: 'GANTI_NOMOR_ADMIN_NASI_BAKAR', // ← isi nomor WA admin nasi bakar (format 62...)
        delivery: true, // nasi bakar: bisa diantar
        deliveryFee: 5000, // ongkir nasi bakar
    },
}

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