import { orderLogUrl } from '../data/config'

// Kirim data pesanan ke Google Apps Script Web App (fire-and-forget).
// Pakai mode 'no-cors' + text/plain supaya tidak kena preflight CORS —
// kita tidak butuh membaca responsnya, cukup mengirim.
export function logOrder(payload) {
  if (!orderLogUrl || orderLogUrl.length < 10) return // fitur mati kalau URL kosong
  try {
    fetch(orderLogUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    }).catch(() => {})
  } catch {
    // Diamkan — pencatatan gagal tidak boleh mengganggu alur pesan ke WhatsApp.
  }
}
