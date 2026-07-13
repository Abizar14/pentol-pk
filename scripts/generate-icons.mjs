// Generator ikon PWA sederhana TANPA dependency (pakai zlib bawaan Node).
// Menggambar background merah membulat + "pentol" cokelat di tengah.
// Hasil: public/icons/icon-192.png & icon-512.png
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'icons')
mkdirSync(outDir, { recursive: true })

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1
  }
  return ~c >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

// px(x,y) -> [r,g,b]
function makePng(size, px) {
  const bytesPerRow = size * 3
  const raw = Buffer.alloc((bytesPerRow + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (bytesPerRow + 1)] = 0 // filter none
    for (let x = 0; x < size; x++) {
      const [r, g, b] = px(x, y)
      const o = y * (bytesPerRow + 1) + 1 + x * 3
      raw[o] = r
      raw[o + 1] = g
      raw[o + 2] = b
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // color type RGB
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// Warna diambil dari palet logo usaha
const RED = [184, 47, 17] // #B82F11
const BALL = [204, 125, 87] // #CC7D57 terakota
const HILITE = [227, 138, 60] // #E38A3C oranye aksen
const STICK = [96, 49, 35] // #603123 cokelat tua

function draw(size) {
  const c = size / 2
  const ballR = size * 0.28
  const hiR = size * 0.08
  return makePng(size, (x, y) => {
    // tusuk sate vertikal
    if (Math.abs(x - c) < size * 0.03 && y > c) return STICK
    const dx = x - c
    const dy = y - c * 0.82
    const d = Math.sqrt(dx * dx + dy * dy)
    if (d < ballR) {
      const hx = x - c * 0.82
      const hy = y - c * 0.62
      if (Math.sqrt(hx * hx + hy * hy) < hiR) return HILITE
      return BALL
    }
    return RED
  })
}

for (const size of [192, 512]) {
  writeFileSync(join(outDir, `icon-${size}.png`), draw(size))
  console.log(`✓ icon-${size}.png`)
}
