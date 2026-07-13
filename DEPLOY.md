# 🚀 Cara Deploy Pentol PK Bandara ke Vercel

Panduan langkah demi langkah supaya app-mu **online, gratis, dapat HTTPS**, dan
link-nya bisa dijadikan **QR code buat ditempel di gerobak**.

> Kamu cukup deploy **sekali**. Menu/harga/jam diedit lewat Google Sheet — otomatis
> update tanpa deploy ulang. Deploy ulang hanya perlu kalau ada perubahan KODE.

---

## ✅ Sebelum mulai
Pastikan build jalan (dari folder proyek, di terminal):
```bash
npm install
npm run build
```
Kalau muncul `✓ built`, berarti siap deploy.

---

## 🅰️ CARA TERCEPAT — Vercel CLI (tanpa GitHub)

### 1. Install Vercel CLI (sekali saja)
```bash
npm install -g vercel
```

### 2. Login
```bash
vercel login
```
Pilih **Continue with GitHub/Google/Email** → cek email → klik verifikasi.

### 3. Deploy pertama
Dari dalam folder proyek (`d:\pentol-pk`), ketik:
```bash
vercel
```
Jawab pertanyaannya (tekan Enter untuk default):
- *Set up and deploy?* → **Y**
- *Which scope?* → pilih akunmu
- *Link to existing project?* → **N**
- *Project name?* → `pentol-pk-bandara` (atau Enter)
- *In which directory is your code?* → **./** (Enter)
- *Framework?* → biasanya terdeteksi **Vite** otomatis (Enter)
- *Build settings?* → default sudah benar (build `npm run build`, output `dist`)

Tunggu beberapa detik → muncul link `https://...vercel.app`.

### 4. Jadikan versi produksi
```bash
vercel --prod
```
Kamu dapat link final, mis. `https://pentol-pk-bandara.vercel.app` — **ini link yang disebar.**

---

## 🅱️ CARA ALTERNATIF — GitHub + Vercel (auto-deploy tiap update kode)

Pakai ini kalau mau: tiap kamu ubah kode & `git push`, Vercel otomatis deploy ulang.

### 1. Buat repo & push ke GitHub
```bash
git init
git add .
git commit -m "Pentol PK Bandara - siap deploy"
```
Lalu buat repo kosong di **[github.com/new](https://github.com/new)** (jangan centang README),
salin URL-nya, dan:
```bash
git branch -M main
git remote add origin https://github.com/USERNAME/pentol-pk-bandara.git
git push -u origin main
```

### 2. Connect ke Vercel
1. Buka **[vercel.com](https://vercel.com)** → login pakai GitHub.
2. **Add New → Project** → pilih repo `pentol-pk-bandara` → **Import**.
3. Setting terdeteksi otomatis:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Klik **Deploy** → tunggu → dapat link HTTPS.

Ke depan, cukup `git push` → Vercel deploy ulang sendiri.

---

## 🎯 Setelah Live

### 1. Tes di HP
Buka link `.vercel.app` di HP. Cek: menu muncul, checkout ke WhatsApp jalan,
tombol "Install/Tambahkan ke Layar Utama" muncul.

### 2. (Kalau nanti pakai API key Maps) tambah domain
Di Google Cloud Console → API key → HTTP referrers → tambah:
```
https://pentol-pk-bandara.vercel.app/*
```
Supaya peta muncul di domain aslinya juga.

### 3. Buat QR Code buat gerobak
- Buka **[qr-code-generator.com](https://www.qr-code-generator.com)** atau
  **[qrcode.tec-it.com](https://qrcode.tec-it.com)**
- Tempel link `.vercel.app`-mu → download PNG → cetak → tempel di gerobak.

### 4. Sebar link
WhatsApp Status, bio, broadcast ke pelanggan.

---

## 🔄 Cara Update Nanti

| Yang diubah | Perlu deploy ulang? | Caranya |
|---|---|---|
| Menu / harga / stok / jam | ❌ Tidak | Edit Google Sheet, langsung update |
| Gambar / logo / kode / warna | ✅ Ya | Cara A: `vercel --prod` lagi. Cara B: `git push` |

---

## 🆘 Kalau Error
- **Build gagal di Vercel:** pastikan `npm run build` sukses di lokal dulu.
- **Halaman putih:** cek Output Directory = `dist`, Framework = Vite.
- **Menu kosong:** normal kalau Google Sheet belum ke-load; app pakai data lokal sbg cadangan.
- **Peta gray:** belum pasang `mapsApiKey` (lihat README bagian Peta). App tetap tampil kartu lokasi.
