// Parser CSV kecil yang aman untuk output Google Sheets (gviz out:csv).
// Menangani nilai dalam tanda kutip, koma di dalam teks, dan escape "".
export function parseCsv(text) {
  const rows = []
  let cur = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      cur.push(field)
      field = ''
    } else if (c === '\n') {
      cur.push(field)
      rows.push(cur)
      cur = []
      field = ''
    } else if (c !== '\r') {
      field += c
    }
  }
  if (field.length || cur.length) {
    cur.push(field)
    rows.push(cur)
  }
  return rows
}

// Ubah CSV jadi array objek pakai baris pertama sebagai header (huruf kecil).
export function csvToObjects(text) {
  const rows = parseCsv(text).filter((r) => r.some((c) => c.trim() !== ''))
  if (!rows.length) return []
  const headers = rows[0].map((h) => h.trim().toLowerCase())
  return rows.slice(1).map((r) => {
    const obj = {}
    headers.forEach((h, i) => {
      obj[h] = (r[i] ?? '').trim()
    })
    return obj
  })
}
