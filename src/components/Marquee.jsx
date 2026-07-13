// Teks berjalan (running text) bertema penerbangan — kayak papan pengumuman bandara.
const ITEMS = [
  'GURIH & KENYAL',
  'SAMBAL BIKIN NAGIH',
  'PENTOL EXPRESS',
  'FRESH TIAP HARI',
  'SIAP MELUNCUR KE LOKASIMU',
  'PESAN SEKARANG',
]

function Strip() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((t, i) => (
        <span key={i} className="flex items-center whitespace-nowrap text-sm font-extrabold uppercase tracking-wide">
          <span className="px-4">{t}</span>
          <span className="text-brand-amber">✈</span>
        </span>
      ))}
    </div>
  )
}

export default function Marquee() {
  return (
    <div className="relative flex overflow-hidden border-y-2 border-brand-terracotta bg-brand-red py-2.5 text-brand-cream">
      {/* Dua salinan berjejer supaya loop-nya mulus tanpa jeda */}
      <div className="flex w-max animate-marquee">
        <Strip />
        <Strip />
      </div>
    </div>
  )
}
