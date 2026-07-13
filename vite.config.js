import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Konfigurasi Vite + PWA.
// Service worker (Workbox) otomatis meng-cache aset statis (JS/CSS/HTML/gambar)
// sehingga landing page + menu bisa dibuka offline. Kirim WhatsApp tetap butuh online.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Pentol PK Bandara',
        short_name: 'Pentol PK',
        description: 'Pesan pentol gerobakan langsung via WhatsApp',
        theme_color: '#B82F11',
        background_color: '#EFECDE',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,ico,woff2}'],
        navigateFallback: '/index.html',
        // Simpan data menu terakhir dari Google Sheets agar tetap tampil saat offline.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.hostname === 'docs.google.com',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'sheet-data',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
