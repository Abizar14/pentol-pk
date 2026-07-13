import { useState } from 'react'
import { business } from '../data/config'

// Menampilkan logo usaha (karakter penjual pentol) dari public/logo.png.
// Kalau file belum dipasang / gagal dimuat, otomatis fallback ke emoji.
export default function Logo({ className = 'h-10 w-10', emojiClass = 'text-2xl' }) {
  const [failed, setFailed] = useState(false)

  if (failed || !business.logoImage) {
    return (
      <div className={`flex items-center justify-center rounded-full bg-white/15 ${className} ${emojiClass}`}>
        {business.emoji}
      </div>
    )
  }

  return (
    <img
      src={business.logoImage}
      alt={`Logo ${business.name}`}
      onError={() => setFailed(true)}
      className={`rounded-full bg-white/90 object-cover ring-2 ring-white/40 ${className}`}
    />
  )
}
