import { rupiah } from '../utils/format'

// Bar keranjang mengambang di bawah, muncul kalau ada item.
export default function CartBar({ count, subtotal, onOpen }) {
  if (count === 0) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <button
        onClick={onOpen}
        className="pointer-events-auto mx-auto flex w-full max-w-xl animate-pop items-center justify-between rounded-2xl bg-brand-red px-5 py-3.5 text-white shadow-xl shadow-brand-red/40 active:scale-[0.98]"
      >
        <span className="flex items-center gap-2 font-semibold">
          <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-sm font-bold text-brand-red">
            {count}
          </span>
          Lihat Keranjang
        </span>
        <span className="font-extrabold">{rupiah(subtotal)}</span>
      </button>
    </div>
  )
}
