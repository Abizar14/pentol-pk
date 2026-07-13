# 🍡 Pentol PK Bandara — Aplikasi Pemesanan

Aplikasi web **PWA** untuk pemesanan pentol gerobakan. Pelanggan pilih menu →
checkout → langsung terbuka WhatsApp penjual dengan pesanan yang sudah rapi.
**Tanpa backend, tanpa database** — WhatsApp yang jadi sistem order-nya.

Dibangun dengan **React + Vite + Tailwind CSS + vite-plugin-pwa**.

## ✨ Fitur
- Landing page bertema **bandara/penerbangan** dengan palet warna dari logo usaha
- Papan status gaya **flight board** (STATUS: BUKA / TUTUP) otomatis ikut jam operasional
- Motif garis landasan (runway stripes) + pesawat kecil sebagai aksen
- Menu dari file data (`src/data/menu.js`) — gampang diedit
- Keranjang: tambah/kurang/hapus, total otomatis (state React murni, tanpa localStorage)
- Checkout: **Ambil Sendiri / Diantar** (ongkir otomatis), level sambal, nama, catatan
- Pembayaran **COD** & **QRIS statis** (scan → kirim bukti via WA)
- **Anti pesanan fiktif**: No. HP wajib + validasi, checkout terkunci saat toko tutup, minimal order
- Ringkasan pesanan bergaya **kartu boarding pass** dengan indikator "SIAP DIKIRIM"
- Tombol kirim → buka `wa.me` dengan pesan terformat
- **PWA**: bisa di-install ke home screen + menu tetap kebuka offline

## 🎨 Aset yang perlu kamu pasang (opsional tapi disarankan)
Aplikasi tetap jalan tanpa file ini (otomatis pakai fallback), tapi lebih bagus kalau dipasang:
- `public/logo.png` — logo usaha (karakter penjual pentol). Kalau kosong → pakai emoji ✈️
- `public/qris.png` — gambar QRIS statis merchant. Kalau kosong → muncul catatan tanya QRIS via WA

## 🛠️ Menjalankan Lokal
```bash
npm install
npm run icons     # buat ikon PWA (sekali saja / saat ganti ikon)
npm run dev       # buka http://localhost:5173
```

## 📦 Build Produksi
```bash
npm run build     # hasil ada di folder dist/
npm run preview   # cek hasil build secara lokal
```

## ✏️ Mengganti Data Usaha
- **Info toko** (nama, nomor WA, jam buka, ongkir): edit `src/data/config.js`
  - `whatsapp` pakai format internasional TANPA `+`, mis. `6281234567890`
  - `openHour` / `closeHour`: jam buka & tutup (format 24 jam). Ini yang mengunci checkout otomatis.
  - `minOrder`: minimal belanja agar bisa checkout (set `0` untuk menonaktifkan)
- **Daftar menu**: edit `src/data/menu.js`
- **Ikon aplikasi**: ganti gambar di `public/icons/` atau ubah `scripts/generate-icons.mjs` lalu `npm run icons`
- **Logo & QRIS**: taruh `public/logo.png` dan `public/qris.png`; path & nama merchant diatur di `src/data/config.js`
- **Warna**: palet logo ada di `tailwind.config.js` (token `brand.*`)

> ⚠️ **Catatan QRIS:** ini QRIS **statis** (tanpa backend). Pelanggan scan lalu kirim bukti
> transfer via WhatsApp — tidak ada auto-cek "sudah bayar". Untuk verifikasi pembayaran
> otomatis butuh payment gateway (Midtrans/Xendit) + server, di luar cakupan aplikasi ini.

## 📊 Edit Menu & Jam dari HP (Google Sheets — opsional)
Kalau mau ubah menu/harga/jam **dari HP tanpa buka kode & tanpa deploy ulang**,
sambungkan aplikasi ke Google Sheets. Kalau tidak diaktifkan, app tetap pakai data lokal.

**Langkah:**
1. Buat Google Sheet baru, bikin **2 tab**:

   **Tab `Menu`** (baris pertama = judul kolom, huruf kecil):
   | id | name | price | desc | emoji | image | available |
   |----|------|-------|------|-------|-------|-----------|
   | pentol-isi | Pentol Isi | 5000 | Isi telur puyuh | 🥚 | | TRUE |
   | pentol-jumbo | Pentol Jumbo | 7000 | Ukuran raksasa | ⚽ | | FALSE |

   - `id` wajib unik. `available` = `FALSE`/`TIDAK`/`0` → item disembunyikan (stok habis).
   - `image` boleh dikosongkan (pakai emoji). `price` angka saja.

   **Tab `Info`** (kolom `key` & `value`):
   | key | value |
   |-----|-------|
   | openHour | 15 |
   | closeHour | 22 |
   | openLabel | 15.00 – 22.00 WITA |
   | deliveryFee | 5000 |
   | minOrder | 10000 |
   | area | Sekitar Jl. Bandara, Samarinda |
   | tagline | Pentol Express — siap meluncur ke lokasimu! |

2. Klik **Share → Ubah ke "Siapa saja yang punya link" = Viewer**.
3. Salin **ID spreadsheet** dari URL:
   `docs.google.com/spreadsheets/d/`**`ID_INI_YANG_DISALIN`**`/edit`
4. Buka `src/data/config.js`, di bagian `sheet`: isi `id`, lalu set `enabled: true`. Deploy ulang sekali.

Setelah itu: cukup edit spreadsheet dari HP → pelanggan lihat perubahan (menu/harga/jam/stok)
tanpa deploy lagi. Kalau offline / sheet error, app otomatis balik ke data lokal.

## 🗺️ Peta Google Maps (API key)
Peta di app pakai **Google Maps Embed API** (resmi, tile pasti muncul). Butuh API key
gratis. Tanpa key, app menampilkan kartu "Lihat di Google Maps" (tetap rapi, tak error).

**Cara ambil key (sekali saja):**
1. Buka **[console.cloud.google.com](https://console.cloud.google.com)** → login.
2. Buat **project baru** (menu dropdown atas → New Project → beri nama, mis. "pentol").
3. Aktifkan **Billing** (Menu → Billing → link a billing account). Butuh kartu debit/kredit.
   > Maps **Embed API GRATIS tanpa batas** — kartu cuma syarat verifikasi Google, tidak ditagih untuk Embed API. Set budget alert Rp0 kalau mau aman.
4. Menu → **APIs & Services → Library** → cari **"Maps Embed API"** → **Enable**.
5. Menu → **APIs & Services → Credentials → Create credentials → API key**. Salin key-nya.
6. Klik key itu → **Restrict**:
   - *Application restrictions* → **HTTP referrers** → tambah:
     `http://localhost:5173/*` dan (nanti) `https://NAMA-APPMU.vercel.app/*`
   - *API restrictions* → **Restrict key** → centang **Maps Embed API** saja.
7. Tempel key ke `src/data/config.js` → `mapsApiKey: 'KEY_KAMU'`. Build/deploy ulang.

> Key ini aman ditaruh di frontend **asalkan dibatasi ke domainmu** (langkah 6). Kalau
> tidak dibatasi, orang lain bisa memakainya — jadi jangan skip restriction.

## 🚀 Deploy Gratis (+ HTTPS otomatis)
PWA butuh HTTPS. Pilih salah satu:

### Vercel / Netlify / Cloudflare Pages
1. Push proyek ini ke GitHub.
2. Connect repo di dashboard mereka.
3. Setting build (biasanya terdeteksi otomatis):
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Deploy → dapat URL HTTPS gratis.

> Catatan: `npm run icons` sudah menghasilkan file PNG di `public/icons/`, jadi
> ikon ikut ter-commit dan tak perlu dijalankan di server. Kalau kamu meng-`gitignore`
> ikon, tambahkan `npm run icons && npm run build` sebagai build command.

### Server sendiri (Nginx)
Build lalu arahkan Nginx ke folder `dist/`, mis. subdomain `pentol.domainmu.id`.

## 📣 Setelah Live
1. Sebar link di WhatsApp Status / bio / broadcast.
2. Buat **QR code** dari URL-nya, tempel di gerobak biar pelanggan tinggal scan.
