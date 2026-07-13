// Teks berjalan (running text) bertema penerbangan — kayak papan pengumuman bandara.
const DEFAULT_ITEMS = [
  'GURIH & KENYAL',
  'SAMBAL BIKIN NAGIH',
  'PENTOL PK BANDARA',
  'FRESH TIAP HARI',
  'SEGERA KEMARI',
  'PESAN SEKARANG',
]

function Strip({ items }) {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center whitespace-nowrap text-sm font-extrabold uppercase tracking-wide">
          <span className="px-4">{t}</span>
          <span className="text-brand-amber">✈</span>
        </span>
      ))}
    </div>
  )
}

export default function Marquee({ items = DEFAULT_ITEMS }) {
  return (
    <div className="relative flex overflow-hidden border-y-2 border-brand-terracotta bg-brand-red py-2.5 text-brand-cream">
      {/* Dua salinan berjejer supaya loop-nya mulus tanpa jeda */}
      <div className="marquee-track flex w-max">
        <Strip items={items} />
        <Strip items={items} />
      </div>
    </div>
  )
}
