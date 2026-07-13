import { rupiah } from '../utils/format'
import { promoBanner, bestsellers, oldPrices } from '../data/config'
import QtyStepper from './QtyStepper'

// Tentukan badge & harga coret sebuah item.
function getBadge(item) {
  if (item.badge) return item.badge // dari kolom sheet
  if (bestsellers.includes(item.id)) return 'TERLARIS 🔥'
  if (/^(paket|combo)/.test(item.id)) return 'HEMAT'
  return null
}
function getOldPrice(item) {
  const old = item.oldPrice || oldPrices[item.id]
  return old && old > item.price ? old : null
}

// Daftar menu (dari props — bisa data lokal atau Google Sheets).
export default function MenuList({ menu, qtyOf, onInc, onDec }) {
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
        {menu.map((item) => {
          const qty = qtyOf(item.id)
          const badge = getBadge(item)
          const old = getOldPrice(item)
          const isBest = badge && badge.startsWith('TERLARIS')
          return (
            <li key={item.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
              {/* Gambar + badge di pojok */}
              <div className="relative h-16 w-16 flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-brand-cream text-4xl">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <span>{item.emoji}</span>
                  )}
                </div>
                {badge && (
                  <span
                    className={`absolute -left-1 -top-1 rounded-full px-1.5 py-0.5 text-[9px] font-extrabold text-white shadow ${
                      isBest ? 'bg-brand-red' : 'bg-brand-orange'
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold leading-tight">{item.name}</h4>
                  <div className="flex flex-col items-end leading-none">
                    {old && <span className="text-[10px] text-brand-brown/40 line-through">{rupiah(old)}</span>}
                    <span className="whitespace-nowrap font-bold text-brand-red">{rupiah(item.price)}</span>
                  </div>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-brand-brown/70">{item.desc}</p>

                <div className="mt-2 flex items-center justify-between">
                  {old ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                      Hemat {rupiah(old - item.price)}
                    </span>
                  ) : (
                    <span />
                  )}
                  {qty > 0 ? (
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
