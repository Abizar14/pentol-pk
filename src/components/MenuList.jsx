import { rupiah } from '../utils/format'
import QtyStepper from './QtyStepper'

// Daftar menu (dari props — bisa data lokal atau Google Sheets).
// Setiap item menampilkan qty yang sudah ada di keranjang.
export default function MenuList({ menu, qtyOf, onInc, onDec }) {
  return (
    <section id="menu" className="mx-auto max-w-xl px-4 py-8">
      <h3 className="text-xl font-extrabold text-brand-red">🍽️ Menu Kami</h3>
      <p className="mb-4 text-sm text-brand-brown/60">Pilih pentol favoritmu, tap + untuk menambah 🍡</p>
      <ul className="space-y-3">
        {menu.map((item) => {
          const qty = qtyOf(item.id)
          return (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5"
            >
              {/* Gambar placeholder */}
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-brand-cream text-4xl">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full rounded-xl object-cover" />
                ) : (
                  <span>{item.emoji}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="truncate font-bold">{item.name}</h4>
                  <span className="whitespace-nowrap font-bold text-brand-red">{rupiah(item.price)}</span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-brand-brown/70">{item.desc}</p>

                <div className="mt-2 flex justify-end">
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
