import { rupiah } from './format'

// Susun teks pesanan yang rapi lalu buka WhatsApp penjual di tab baru.
// cart: array { id, name, price, qty }. businessName & whatsapp datang dari store.
export function buildWhatsappUrl({ cart, spice, method, payment, address, coords, name, phone, note, subtotal, deliveryFee, total, businessName, whatsapp }) {
  const payLabel = payment === 'qris' ? 'QRIS (kirim bukti transfer)' : 'COD (Bayar di Tempat)'
  const lines = []
  lines.push(`✈️ ${businessName} — BOARDING PASS`)
  lines.push('')
  lines.push('Halo, mau pesan:')
  lines.push('')

  cart.forEach((item) => {
    lines.push(`${item.qty}x ${item.name} — ${rupiah(item.price * item.qty)}`)
  })

  lines.push('')
  lines.push(`Sambal: ${spice}`)
  lines.push(`Metode: ${method === 'antar' ? 'Diantar' : 'Ambil Sendiri'}`)
  if (method === 'antar') {
    lines.push(`Alamat: ${address}`)
    // Link Google Maps dari lokasi GPS pelanggan (tinggal di-tap penjual).
    if (coords) {
      lines.push(`Lokasi (Maps): https://maps.google.com/?q=${coords.lat},${coords.lng}`)
    }
  }
  lines.push(`Pembayaran: ${payLabel}`)
  if (note && note.trim()) {
    lines.push(`Catatan: ${note.trim()}`)
  }

  lines.push('')
  lines.push(`Subtotal: ${rupiah(subtotal)}`)
  if (method === 'antar' && deliveryFee > 0) {
    lines.push(`Ongkir: ${rupiah(deliveryFee)}`)
  }
  lines.push(`Total: ${rupiah(total)}`)
  lines.push('')
  lines.push(`a.n. ${name}`)
  if (phone && phone.trim()) {
    lines.push(`No. HP: ${phone.trim()}`)
  }

  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${whatsapp}?text=${text}`
}
