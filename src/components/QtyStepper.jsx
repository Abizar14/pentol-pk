// Tombol tambah / kurang jumlah yang dipakai ulang di menu & keranjang.
export default function QtyStepper({ qty, onDec, onInc, size = 'md' }) {
  const btn =
    size === 'sm'
      ? 'h-8 w-8 text-lg'
      : 'h-10 w-10 text-xl'
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDec}
        aria-label="Kurangi"
        className={`${btn} flex items-center justify-center rounded-full bg-brand-cream font-bold text-brand-red ring-1 ring-brand-red/20 active:scale-90`}
      >
        −
      </button>
      <span className="w-6 text-center font-bold tabular-nums">{qty}</span>
      <button
        onClick={onInc}
        aria-label="Tambah"
        className={`${btn} flex items-center justify-center rounded-full bg-brand-red font-bold text-white active:scale-90`}
      >
        +
      </button>
    </div>
  )
}
