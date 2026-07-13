/**
 * ============================================================
 *  APPS SCRIPT GABUNGAN — Pentol PK Bandara
 *  Berisi DUA fitur dalam satu file:
 *  (A) Rapikan tampilan tab Menu & Info  -> jalankan lewat menu "🍡 Pentol"
 *  (B) Catat pesanan ke tab "Pesanan"     -> aktif via Deploy > Web app
 * ------------------------------------------------------------
 *  CARA PAKAI:
 *  1. Buka spreadsheet -> Extensions -> Apps Script.
 *  2. Hapus semua kode lama, PASTE seluruh isi file ini, Save (💾).
 *  3. RAPIKAN: pilih fungsi "rapikanSheet" -> Run (▶) -> Allow.
 *     (atau nanti lewat menu "🍡 Pentol -> Rapikan Tampilan")
 *  4. CATAT PESANAN: Deploy -> New deployment -> ⚙ -> Web app
 *       Execute as: Me | Who has access: Anyone -> Deploy -> Authorize.
 *     Salin "Web app URL" (/exec) -> tempel ke src/data/config.js (orderLogUrl).
 * ============================================================
 */

// Palet warna dari logo usaha
var RED = '#B82F11'
var ORANGE = '#E38A3C'
var BROWN = '#603123'
var CREAM = '#EFECDE'
var CREAMDARK = '#E3D6C3'
var BORDER = '#CC7D57'
var WHITE = '#FFFFFF'

var MENU_HEADERS = ['id', 'name', 'price', 'desc', 'emoji', 'image', 'available']

// ============================================================
//  (A) RAPIKAN TAMPILAN
// ============================================================

// Menu tambahan di spreadsheet setelah script dijalankan.
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🍡 Pentol')
    .addItem('✨ Rapikan Tampilan', 'rapikanSheet')
    .addToUi()
}

function rapikanSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  formatMenu(ss.getSheetByName('Menu'))
  formatInfo(ss.getSheetByName('Info'))
  ss.toast('Tabel sudah dirapikan & diberi warna! 🎉', 'Pentol PK Bandara', 5)
}

// ---------- TAB MENU ----------
function formatMenu(sh) {
  if (!sh) return
  var lastRow = Math.max(sh.getLastRow(), 2)
  var nCol = MENU_HEADERS.length
  var nData = lastRow - 1

  sh.getRange(1, 1, 1, nCol).setValues([MENU_HEADERS])

  sh.getBandings().forEach(function (b) { b.remove() })
  var banding = sh.getRange(1, 1, lastRow, nCol).applyRowBanding()
  banding.setHeaderRowColor(RED).setFirstRowColor(CREAM).setSecondRowColor(CREAMDARK)

  var header = sh.getRange(1, 1, 1, nCol)
  header
    .setFontColor(WHITE)
    .setFontWeight('bold')
    .setFontSize(11)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
  sh.setRowHeight(1, 36)
  sh.setFrozenRows(1)

  var data = sh.getRange(2, 1, nData, nCol)
  data.setFontColor(BROWN).setVerticalAlignment('middle').setFontSize(10)

  var widths = [120, 150, 80, 300, 70, 130, 110]
  widths.forEach(function (w, i) { sh.setColumnWidth(i + 1, w) })

  sh.getRange(2, 3, nData, 1).setNumberFormat('#,##0').setHorizontalAlignment('center') // price
  sh.getRange(2, 5, nData, 1).setHorizontalAlignment('center') // emoji
  sh.getRange(2, 4, nData, 1).setWrap(true) // desc dibungkus

  var av = sh.getRange(2, 7, nData, 1)
  var cur = av.getValues()
  av.insertCheckboxes()
  var bool = cur.map(function (r) {
    return [String(r[0]).trim().toUpperCase() !== 'FALSE']
  })
  av.setValues(bool)
  av.setHorizontalAlignment('center')

  sh.getRange(1, 1, lastRow, nCol).setBorder(
    true, true, true, true, true, true, BORDER, SpreadsheetApp.BorderStyle.SOLID
  )

  sh.setTabColor(RED)
}

// ---------- TAB INFO ----------
function formatInfo(sh) {
  if (!sh) return

  var existing = {}
  var vals = sh.getDataRange().getValues()
  vals.forEach(function (r) {
    var k = String(r[0] || '').trim().toLowerCase()
    if (k && k !== 'key' && k.indexOf(' ') === -1) existing[k] = r[1]
  })
  function get(k, d) {
    return existing[k] !== undefined && existing[k] !== '' ? existing[k] : d
  }

  var rows = [
    ['key', 'value'],
    ['name', get('name', 'Pentol PK Bandara')],
    ['tagline', get('tagline', 'Pentol Express — siap meluncur ke lokasimu!')],
    ['area', get('area', 'Sekitar Jl. Bandara, Samarinda')],
    ['openHour', get('openhour', '15')],
    ['closeHour', get('closehour', '22')],
    ['openLabel', get('openlabel', '15.00 – 22.00 WITA')],
    ['deliveryFee', get('deliveryfee', '5000')],
    ['minOrder', get('minorder', '10000')],
    ['whatsapp', get('whatsapp', '62895810274829')],
  ]

  sh.clear()
  sh.getBandings().forEach(function (b) { b.remove() })
  sh.getRange(1, 1, rows.length, 2).setValues(rows)

  sh.getRange(1, 1, 1, 2)
    .setBackground(RED)
    .setFontColor(WHITE)
    .setFontWeight('bold')
    .setFontSize(11)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
  sh.setRowHeight(1, 34)
  sh.setFrozenRows(1)

  var nData = rows.length - 1
  sh.getRange(2, 1, nData, 1)
    .setBackground(CREAMDARK)
    .setFontColor(BROWN)
    .setFontWeight('bold')
    .setVerticalAlignment('middle')
  sh.getRange(2, 2, nData, 1)
    .setBackground(WHITE)
    .setFontColor(BROWN)
    .setVerticalAlignment('middle')

  sh.setColumnWidth(1, 160)
  sh.setColumnWidth(2, 340)

  sh.getRange(1, 1, rows.length, 2).setBorder(
    true, true, true, true, true, true, BORDER, SpreadsheetApp.BorderStyle.SOLID
  )

  sh.setTabColor(ORANGE)
}

// ============================================================
//  (B) CATAT PESANAN KE TAB "Pesanan"
// ============================================================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents)
    var ss = SpreadsheetApp.getActiveSpreadsheet()
    var sh = ss.getSheetByName('Pesanan')

    if (!sh) {
      sh = ss.insertSheet('Pesanan')
      sh.appendRow([
        'Waktu', 'Nama', 'No. HP', 'Metode', 'Pembayaran', 'Sambal',
        'Pesanan', 'Alamat', 'Catatan', 'Subtotal', 'Ongkir', 'Total',
      ])
      sh.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground(RED).setFontColor(WHITE)
      sh.setFrozenRows(1)
      sh.setTabColor(BROWN)
    }

    sh.appendRow([
      new Date(),
      data.nama || '',
      data.hp || '',
      data.metode || '',
      data.pembayaran || '',
      data.sambal || '',
      data.items || '',
      data.alamat || '',
      data.catatan || '',
      Number(data.subtotal) || 0,
      Number(data.ongkir) || 0,
      Number(data.total) || 0,
    ])

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON,
    )
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(
      ContentService.MimeType.JSON,
    )
  }
}

function doGet() {
  return ContentService.createTextOutput('Pentol PK Bandara - endpoint catat pesanan aktif ✅')
}
