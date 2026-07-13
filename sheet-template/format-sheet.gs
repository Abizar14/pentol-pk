/**
 * ============================================================
 *  RAPIKAN GOOGLE SHEET — Pentol PK Bandara
 *  Script ini mempercantik tab "Menu" & "Info" secara otomatis:
 *  warna sesuai logo, header rapi, checkbox stok, border, dll.
 *  Tab "Info" yang berantakan juga otomatis dibetulkan.
 * ------------------------------------------------------------
 *  CARA PAKAI (sekali saja):
 *  1. Buka spreadsheet-mu di browser (laptop lebih enak).
 *  2. Menu atas: Extensions -> Apps Script (Ekstensi -> Apps Script).
 *  3. Hapus semua kode contoh, PASTE seluruh isi file ini.
 *  4. Klik ikon Save (💾).
 *  5. Di daftar fungsi pilih "rapikanSheet", lalu klik Run (▶).
 *  6. Muncul minta izin -> Review permissions -> pilih akunmu ->
 *     Advanced -> Go to (unsafe) -> Allow. (Wajar, ini script buatanmu.)
 *  7. Kembali ke spreadsheet — sudah rapi & berwarna. 🎉
 *
 *  Setelah dijalankan, akan muncul menu "🍡 Pentol" di atas untuk
 *  merapikan ulang kapan saja (mis. sehabis menambah menu baru).
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

// Menu utama tambahan yang muncul di spreadsheet setelah script dijalankan.
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

  // Pastikan judul kolom benar
  sh.getRange(1, 1, 1, nCol).setValues([MENU_HEADERS])

  // Bersihkan banding lama biar tidak error
  sh.getBandings().forEach(function (b) { b.remove() })

  // Warna belang-belang (header merah, isi krem / krem gelap)
  var banding = sh.getRange(1, 1, lastRow, nCol).applyRowBanding()
  banding.setHeaderRowColor(RED).setFirstRowColor(CREAM).setSecondRowColor(CREAMDARK)

  // Header
  var header = sh.getRange(1, 1, 1, nCol)
  header
    .setFontColor(WHITE)
    .setFontWeight('bold')
    .setFontSize(11)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
  sh.setRowHeight(1, 36)
  sh.setFrozenRows(1)

  // Isi data
  var data = sh.getRange(2, 1, nData, nCol)
  data.setFontColor(BROWN).setVerticalAlignment('middle').setFontSize(10)

  // Lebar kolom
  var widths = [120, 150, 80, 300, 70, 130, 110]
  widths.forEach(function (w, i) { sh.setColumnWidth(i + 1, w) })

  // Perataan & format tiap kolom
  sh.getRange(2, 3, nData, 1).setNumberFormat('#,##0').setHorizontalAlignment('center') // price
  sh.getRange(2, 5, nData, 1).setHorizontalAlignment('center') // emoji
  sh.getRange(2, 4, nData, 1).setWrap(true) // desc dibungkus

  // Kolom "available" -> checkbox stok (dicentang = tersedia)
  var av = sh.getRange(2, 7, nData, 1)
  var cur = av.getValues()
  av.insertCheckboxes()
  var bool = cur.map(function (r) {
    return [String(r[0]).trim().toUpperCase() !== 'FALSE']
  })
  av.setValues(bool)
  av.setHorizontalAlignment('center')

  // Border
  sh.getRange(1, 1, lastRow, nCol).setBorder(
    true, true, true, true, true, true, BORDER, SpreadsheetApp.BorderStyle.SOLID
  )

  sh.setTabColor(RED)
}

// ---------- TAB INFO ----------
function formatInfo(sh) {
  if (!sh) return

  // Baca nilai lama yang MASIH terbaca (key tanpa spasi), agar edit angka
  // yang sudah kamu ubah tetap dipertahankan. Baris berantakan diabaikan.
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

  // Header
  sh.getRange(1, 1, 1, 2)
    .setBackground(RED)
    .setFontColor(WHITE)
    .setFontWeight('bold')
    .setFontSize(11)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
  sh.setRowHeight(1, 34)
  sh.setFrozenRows(1)

  // Kolom "key" (kiri) diberi warna, kolom "value" (kanan) putih
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
