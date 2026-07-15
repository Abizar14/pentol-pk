import { rupiah } from '../utils/format'
import { promoBanner, bestsellers, soldOutLabel } from '../data/config'
import QtyStepper from './QtyStepper'

// Tentukan badge & harga coret sebuah item.
function getBadge(item) {
  if (item.badge) return item.badge // dari kolom sheet
  if (bestsellers.includes(item.id)) return 'TERLARIS 🔥'
  if (/^(paket|combo)/.test(item.id)) return 'HEMAT'
  return null
}
function getOldPrice(item) {
  // Harga coret murni dari kolom `oldprice` di Google Sheet (buat pemasaran/anchor price).
  // Cuma tampil kalau lebih besar dari harga jual.
  return item.oldPrice && item.oldPrice > item.price ? item.oldPrice : null
}

// Daftar menu (dari props — bisa data lokal atau Google Sheets).
export default function MenuList({ menu, qtyOf, onInc, onDec }) {
  // Urutkan: yang tersedia di atas, yang stok kosong (SEGERA HADIR) di bawah.
  // Sort stabil → urutan asli dalam tiap grup tetap.
  const items = [...menu].sort(
    (a, b) => Number(a.available === false) - Number(b.available === false),
  )
  return (
    <section id="menu" className="mx-auto max-w-xl px-4 py-8">
      {/* Banner promo */}
      {promoBanner && (
        <div className="mb-4 animate-pop rounded-2xl bg-gradient-to-r from-brand-orange to-brand-amber px-4 py-3 text-center text-sm font-bold text-brand-brown shadow-md">
          {promoBanner}
        </div>
      )}

      <h3 className="text-xl font-extrabold text-brand-red">🍽️ Menu Kami</h3>
      <p className="mb-4 text-sm text-brand-brown/60">Pilih pentol favoritmu, tap + untuk menambah 🍡</p>

      <ul className="space-y-3">
        {items.map((item) => {
          const qty = qtyOf(item.id)
          const available = item.available !== false // default: tersedia
          const badge = available ? getBadge(item) : null
          const old = available ? getOldPrice(item) : null
          const isBest = badge && badge.startsWith('TERLARIS')
          return (
            <li
              key={item.id}
              className={`flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 ${
                available ? '' : 'opacity-80'
              }`}
            >
              {/* Gambar menu + badge di pojok */}
              <div className="relative h-16 w-16 flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-brand-cream text-4xl">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`h-full w-full object-cover ${available ? '' : 'grayscale'}`}
                    />
                  ) : (
                    <span className={available ? '' : 'grayscale'}>{item.emoji}</span>
                  )}
                </div>

                {/* Badge promo (kalau tersedia) */}
                {badge && (
                  <span
                    className={`absolute left-1 top-1 whitespace-nowrap rounded-md px-1 py-0.5 text-[8px] font-extrabold uppercase leading-none text-white shadow ${
                      isBest ? 'bg-brand-red' : 'bg-brand-orange'
                    }`}
                  >
                    {badge}
                  </span>
                )}

                {/* Overlay label saat stok kosong */}
                {!available && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-brand-brown/55">
                    <span className="rounded bg-brand-brown px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-brand-cream">
                      {soldOutLabel}
                    </span>
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="min-w-0 font-bold leading-tight">{item.name}</h4>
                  <div className="flex flex-shrink-0 flex-col items-end leading-none">
                    {old && <span className="text-[10px] text-brand-brown/40 line-through">{rupiah(old)}</span>}
                    <span
                      className={`whitespace-nowrap font-bold ${available ? 'text-brand-red' : 'text-brand-brown/40'}`}
                    >
                      {rupiah(item.price)}
                    </span>
                  </div>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-brand-brown/70">{item.desc}</p>

                <div className="mt-2 flex items-center justify-between">
                  {available && old ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                      Hemat {rupiah(old - item.price)}
                    </span>
                  ) : (
                    <span />
                  )}

                  {!available ? (
                    <span className="rounded-full bg-brand-brown/10 px-4 py-1.5 text-sm font-semibold text-brand-brown/50">
                      {soldOutLabel}
                    </span>
                  ) : qty > 0 ? (
                    <QtyStepper qty={qty} size="sm" onDec={() => onDec(item.id)} onInc={() => onInc(item.id)} />
                  ) : (
                    <button
                      onClick={() => onInc(item.id)}
                      className="rounded-full bg-brand-red px-4 py-1.5 text-sm font-semibold text-white active:scale-95"
                    >
                      + Tambah
                    </button>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
