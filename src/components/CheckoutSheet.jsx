import { useMemo, useState } from 'react'
import { rupiah, isOpen, isValidPhone } from '../utils/format'
import { spiceLevels, paymentMethods } from '../data/config'
import { useStore } from '../store/StoreContext'
import { buildWhatsappUrl } from '../utils/whatsapp'
import QtyStepper from './QtyStepper'

// Sheet (modal geser dari bawah) berisi keranjang + checkout + tombol WhatsApp.
// Ringkasan pesanan ditampilkan bergaya BOARDING PASS (tema bandara).
export default function CheckoutSheet({ open, onClose, cart, onInc, onDec, onRemove }) {
  const { business } = useStore()
  const [spice, setSpice] = useState(spiceLevels[1]) // default: Sedang
  const [method, setMethod] = useState('ambil') // 'ambil' | 'antar'
  const [payment, setPayment] = useState('cod') // 'cod' | 'qris'
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [touched, setTouched] = useState(false)
  const [qrisFailed, setQrisFailed] = useState(false)
  const [coords, setCoords] = useState(null) // { lat, lng } dari GPS
  const [geoStatus, setGeoStatus] = useState('idle') // idle | loading | ok | error
  const [geoMsg, setGeoMsg] = useState('')

  // Ambil lokasi pelanggan via GPS browser (butuh HTTPS / localhost).
  function ambilLokasi() {
    if (!('geolocation' in navigator)) {
      setGeoStatus('error')
      setGeoMsg('HP/browser tidak mendukung GPS.')
      return
    }
    setGeoStatus('loading')
    setGeoMsg('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        })
        setGeoStatus('ok')
      },
      (err) => {
        setGeoStatus('error')
        setGeoMsg(
          err.code === err.PERMISSION_DENIED
            ? 'Izin lokasi ditolak. Aktifkan izin lokasi di browser, atau isi alamat manual.'
            : 'Gagal ambil lokasi. Coba lagi atau isi alamat manual.',
        )
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart])
  const deliveryFee = method === 'antar' ? business.deliveryFee : 0
  const total = subtotal + deliveryFee

  // ── Aturan anti pesanan fiktif ──
  const storeOpen = isOpen(business.openHour, business.closeHour) // kunci checkout saat tutup
  const nameOk = name.trim().length > 0
  const phoneOk = isValidPhone(phone) // No. HP wajib & valid
  const addressOk = method === 'ambil' || address.trim().length > 0
  const minOrderOk = subtotal >= (business.minOrder || 0) // minimal order

  const canSubmit = cart.length > 0 && nameOk && phoneOk && addressOk && minOrderOk && storeOpen

  function handleSubmit() {
    setTouched(true)
    if (!canSubmit) return
    const url = buildWhatsappUrl({
      cart,
      spice,
      method,
      payment,
      address: address.trim(),
      coords: method === 'antar' ? coords : null,
      name: name.trim(),
      phone: phone.trim(),
      note,
      subtotal,
      deliveryFee,
      total,
      businessName: business.name,
      whatsapp: business.whatsapp,
    })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (!open) return null

  const optionBtn = (active) =>
    `rounded-xl px-2 py-2.5 text-sm font-semibold ring-1 transition ${
      active ? 'bg-brand-red text-brand-cream ring-brand-red' : 'bg-white text-brand-brown ring-brand-brown/15'
    }`

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div className="relative flex max-h-[92vh] w-full max-w-xl animate-slide-up flex-col rounded-t-3xl bg-brand-cream shadow-2xl">
        {/* Header sheet */}
        <div className="flex items-center justify-between rounded-t-3xl border-b-4 border-brand-terracotta bg-brand-red px-4 py-3 text-brand-cream">
          <h3 className="text-lg font-extrabold">🎫 Check-in Pesanan</h3>
          <button onClick={onClose} aria-label="Tutup" className="text-2xl text-brand-cream/80">
            ✕
          </button>
        </div>

        {/* Isi (scrollable) */}
        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
          {cart.length === 0 ? (
            <p className="py-10 text-center text-brand-brown/60">
              Keranjang masih kosong. Yuk pilih pentol favoritmu! 🍡
            </p>
          ) : (
            <>
              {/* Daftar item keranjang */}
              <ul className="space-y-2">
                {cart.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-brand-brown/10">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{item.name}</p>
                      <p className="text-sm text-brand-red">{rupiah(item.price * item.qty)}</p>
                    </div>
                    <QtyStepper qty={item.qty} size="sm" onDec={() => onDec(item.id)} onInc={() => onInc(item.id)} />
                    <button
                      onClick={() => onRemove(item.id)}
                      aria-label="Hapus"
                      className="ml-1 text-lg text-brand-brown/40 hover:text-brand-red"
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>

              {/* Tambah jenis menu lain → tutup sheet, balik ke daftar menu (keranjang tetap tersimpan) */}
              <button
                type="button"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-terracotta py-2.5 text-sm font-semibold text-brand-terracotta active:scale-95"
              >
                ＋ Tambah menu lain
              </button>

              {/* Level sambal */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">🌶️ Level Sambal</label>
                <div className="grid grid-cols-3 gap-2">
                  {spiceLevels.map((lv) => (
                    <button key={lv} onClick={() => setSpice(lv)} className={optionBtn(spice === lv)}>
                      {lv}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metode pengambilan */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">🎫 Metode Pengambilan</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setMethod('ambil')} className={optionBtn(method === 'ambil')}>
                    🏃 Ambil Sendiri
                  </button>
                  {/* Diantar dinonaktifkan dulu — sistem masih ambil sendiri */}
                  <button
                    type="button"
                    disabled
                    className="relative cursor-not-allowed rounded-xl bg-brand-creamdark px-2 py-2.5 text-sm font-semibold text-brand-brown/40 ring-1 ring-brand-brown/10"
                  >
                    🛵 Diantar
                    <span className="mt-0.5 block text-[10px] font-bold text-brand-orange">Segera Hadir</span>
                  </button>
                </div>
                <p className="mt-1 text-xs text-brand-brown/60">
                  Untuk sekarang khusus <b>Ambil Sendiri</b> ya. Layanan antar segera hadir! 🛵
                </p>
              </div>

              {/* Metode pembayaran */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">💳 Pembayaran</label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((p) => (
                    <button key={p.key} onClick={() => setPayment(p.key)} className={optionBtn(payment === p.key)}>
                      {p.icon} {p.label}
                    </button>
                  ))}
                </div>

                {/* Panel QRIS statis */}
                {payment === 'qris' && (
                  <div className="mt-3 rounded-xl bg-white p-4 text-center ring-1 ring-brand-brown/10">
                    {qrisFailed ? (
                      <p className="text-sm text-brand-brown/70">
                        📱 QR belum dipasang. Scan QRIS langsung ke penjual, atau lanjut kirim pesanan lalu tanya
                        nomor QRIS via WhatsApp.
                      </p>
                    ) : (
                      <>
                        <img
                          src={business.qrisImage}
                          alt="QRIS pembayaran"
                          onError={() => setQrisFailed(true)}
                          className="mx-auto h-48 w-48 rounded-lg object-contain"
                        />
                        <p className="mt-2 text-xs text-brand-brown/70">
                          Scan & bayar, lalu <b>kirim bukti transfer</b> lewat WhatsApp setelah pesan. a.n.{' '}
                          {business.qrisName}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Nama */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Nama Penumpang <span className="text-brand-red">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama kamu"
                  className="w-full rounded-xl border-0 bg-white px-3 py-2.5 ring-1 ring-brand-brown/15 focus:ring-2 focus:ring-brand-red"
                />
                {touched && !nameOk && <p className="mt-1 text-xs text-brand-red">Nama wajib diisi.</p>}
              </div>

              {/* No. HP — wajib & divalidasi untuk saring pesanan fiktif */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  No. HP / WhatsApp <span className="text-brand-red">*</span>
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  inputMode="numeric"
                  placeholder="cth: 0812xxxxxxx"
                  className="w-full rounded-xl border-0 bg-white px-3 py-2.5 ring-1 ring-brand-brown/15 focus:ring-2 focus:ring-brand-red"
                />
                {touched && !phoneOk && (
                  <p className="mt-1 text-xs text-brand-red">Masukkan nomor HP aktif yang benar (08xx / 62xx).</p>
                )}
              </div>

              {/* Alamat (hanya kalau diantar) */}
              {method === 'antar' && (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    📍 Alamat Tujuan <span className="text-brand-red">*</span>
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    placeholder="Alamat lengkap untuk diantar"
                    className="w-full resize-none rounded-xl border-0 bg-white px-3 py-2.5 ring-1 ring-brand-brown/15 focus:ring-2 focus:ring-brand-red"
                  />
                  {touched && !addressOk && (
                    <p className="mt-1 text-xs text-brand-red">Alamat wajib diisi untuk diantar.</p>
                  )}

                  {/* Bagikan lokasi via GPS → jadi link Google Maps di pesan WA */}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={ambilLokasi}
                      disabled={geoStatus === 'loading'}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-brand-orange bg-brand-orange/10 py-2.5 text-sm font-semibold text-brand-brown active:scale-95 disabled:opacity-60"
                    >
                      {geoStatus === 'loading'
                        ? '⏳ Mengambil lokasi…'
                        : coords
                          ? '✅ Lokasi tersimpan — Perbarui'
                          : '📍 Bagikan Lokasi Saya (GPS)'}
                    </button>

                    {coords && (
                      <div className="mt-1.5 flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
                        <span>Titik lokasi siap dikirim 📌</span>
                        <a
                          href={`https://maps.google.com/?q=${coords.lat},${coords.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold underline"
                        >
                          Lihat peta
                        </a>
                      </div>
                    )}
                    {geoStatus === 'error' && <p className="mt-1 text-xs text-brand-red">{geoMsg}</p>}
                    <p className="mt-1 text-[11px] text-brand-brown/50">
                      Opsional, tapi bikin pengantaran lebih akurat. Penjual dapat link Maps yang tinggal di-tap.
                    </p>
                  </div>
                </div>
              )}

              {/* Catatan */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Catatan (opsional)</label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="mis. jangan terlalu asin"
                  className="w-full rounded-xl border-0 bg-white px-3 py-2.5 ring-1 ring-brand-brown/15 focus:ring-2 focus:ring-brand-red"
                />
              </div>

              {/* ===== KARTU BOARDING PASS ===== */}
              <BoardingPass
                cart={cart}
                method={method}
                payment={payment}
                spice={spice}
                name={name}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                ready={canSubmit}
              />
            </>
          )}
        </div>

        {/* Footer tombol kirim */}
        <div className="border-t border-brand-brown/10 bg-white p-4">
          {/* Banner toko tutup — kunci checkout di luar jam operasional */}
          {!storeOpen && (
            <div className="mb-3 rounded-xl bg-brand-brown px-3 py-2 text-center text-sm font-semibold text-brand-cream">
              🚫 Maaf, sedang TUTUP ({business.openLabel}). Pesanan dibuka lagi saat jam buka ya.
            </div>
          )}
          <button onClick={handleSubmit} disabled={!canSubmit} className="btn-primary w-full py-3.5 text-base">
            💬 Kirim Pesanan via WhatsApp
          </button>
          {/* Alasan spesifik kenapa belum bisa kirim */}
          {!canSubmit && cart.length > 0 && storeOpen && (
            <p className="mt-2 text-center text-xs text-brand-red">
              {!minOrderOk
                ? `Minimal pesanan ${rupiah(business.minOrder)}. Tambah ${rupiah(business.minOrder - subtotal)} lagi ya.`
                : !nameOk
                  ? 'Isi nama dulu ya.'
                  : !phoneOk
                    ? 'Isi No. HP aktif yang benar dulu ya.'
                    : !addressOk
                      ? 'Isi alamat pengantaran dulu ya.'
                      : 'Lengkapi data yang wajib diisi dulu ya.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Kartu konfirmasi bergaya boarding pass.
function BoardingPass({ cart, method, payment, spice, name, subtotal, deliveryFee, total, ready }) {
  const payLabel = payment === 'qris' ? 'QRIS' : 'COD'
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-brand-brown/10">
      {/* Strip header */}
      <div className="flex items-center justify-between bg-brand-red px-4 py-2 text-brand-cream">
        <span className="font-mono text-sm font-extrabold tracking-[0.2em]">BOARDING PASS</span>
        <span className="text-lg">✈️</span>
      </div>

      <div className="px-4 py-3 text-sm">
        {/* Rute */}
        <div className="flex items-center justify-between font-bold text-brand-brown">
          <div>
            <p className="text-[10px] font-normal text-brand-brown/50">DAPUR</p>
            <p>PENTOL</p>
          </div>
          <div className="flex-1 px-2 text-center text-brand-terracotta">· · · ✈ · · ·</div>
          <div className="text-right">
            <p className="text-[10px] font-normal text-brand-brown/50">TUJUAN</p>
            <p>{method === 'antar' ? 'ALAMAT' : 'GEROBAK'}</p>
          </div>
        </div>

        <DashedLine />

        {/* Detail item */}
        <ul className="space-y-1">
          {cart.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span className="text-brand-brown/80">
                {item.qty}× {item.name}
              </span>
              <span className="tabular-nums">{rupiah(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>

        <DashedLine />

        {/* Info tiket */}
        <div className="grid grid-cols-2 gap-y-1 text-xs text-brand-brown/80">
          <Field label="PENUMPANG" value={name.trim() || '—'} />
          <Field label="SAMBAL" value={spice} />
          <Field label="METODE" value={method === 'antar' ? 'Diantar' : 'Ambil Sendiri'} />
          <Field label="BAYAR" value={payLabel} />
        </div>

        <DashedLine />

        {/* Total */}
        <div className="space-y-0.5">
          <Row label="Subtotal" value={rupiah(subtotal)} />
          {method === 'antar' && deliveryFee > 0 && <Row label="Ongkir" value={rupiah(deliveryFee)} />}
          <div className="flex justify-between pt-1 text-base font-extrabold text-brand-red">
            <span>TOTAL</span>
            <span>{rupiah(total)}</span>
          </div>
        </div>

        {/* Status siap kirim */}
        <div
          className={`mt-3 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold ${
            ready ? 'bg-green-100 text-green-700' : 'bg-brand-creamdark text-brand-brown/60'
          }`}
        >
          {ready ? '✅ SIAP DIKIRIM' : '⏳ LENGKAPI DATA DULU'}
        </div>
      </div>
    </div>
  )
}

function DashedLine() {
  return <div className="my-2 border-t-2 border-dashed border-brand-brown/20" />
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] text-brand-brown/50">{label}</p>
      <p className="font-semibold text-brand-brown">{value}</p>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-brand-brown/80">
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}
