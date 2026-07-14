/**
 * ============================================================
 *  CATAT PESANAN KE GOOGLE SHEET — Pentol PK Bandara
 *  Script ini menerima data pesanan dari aplikasi dan menambah
 *  1 baris ke tab "Pesanan" tiap ada yang checkout.
 * ------------------------------------------------------------
 *  CARA PAKAI (sekali saja):
 *  1. Buka spreadsheet-mu di browser.
 *  2. Extensions -> Apps Script.
 *  3. Buat file/hapus kode contoh, PASTE seluruh isi file ini.
 *  4. Klik Deploy -> New deployment.
 *  5. Klik ikon gerigi (⚙) -> pilih "Web app".
 *  6. Isi:
 *       - Description : catat pesanan
 *       - Execute as  : Me (email kamu)
 *       - Who has access : Anyone   <-- PENTING, harus "Anyone"
 *  7. Klik Deploy -> Authorize access -> pilih akun -> Advanced
 *     -> Go to (unsafe) -> Allow.
 *  8. Salin "Web app URL" (diakhiri /exec).
 *  9. Tempel URL itu ke src/data/config.js -> orderLogUrl: 'URL_KAMU'
 *     lalu deploy ulang app (vercel --prod).
 *
 *  Setelah itu: tiap pelanggan checkout, otomatis muncul di tab "Pesanan".
 * ============================================================
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents)
    var ss = SpreadsheetApp.getActiveSpreadsheet()
    var sh = ss.getSheetByName('Pesanan')

    // Buat tab "Pesanan" + header kalau belum ada
    if (!sh) {
      sh = ss.insertSheet('Pesanan')
      sh.appendRow([
        'Waktu', 'Nama', 'No. HP', 'Metode', 'Pembayaran', 'Sambal',
        'Pesanan', 'Alamat', 'Catatan', 'Subtotal', 'Ongkir', 'Total',
      ])
      sh.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#B82F11').setFontColor('#FFFFFF')
      sh.setFrozenRows(1)
    }

    sh.appendRow([
      Utilities.formatDate(new Date(), 'Asia/Makassar', 'dd/MM/yyyy HH:mm:ss'), // WITA
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

// Supaya URL bisa dibuka di browser untuk cek (opsional).
function doGet() {
  return ContentService.createTextOutput('Pentol PK Bandara - endpoint catat pesanan aktif ✅')
}
