/*
  كود Google Apps Script لتسجيل الطلبات + تتبّع الطلب
  - بيسجّل الطلبات بتبويب جديد اسمو "الطلبات" بنفس الجدول (التبويب القديم ما بينلمس).
  - عمود "الحالة" فيه قائمة منسدلة: غيّر الحالة منها والزبون بيشوفها بتبويب "طلباتي".
  - لازم يكون السكربت مفتوح من جدول Google نفسو: Extensions ثم Apps Script.
*/
const SHEET_NAME = 'الطلبات';
const HEAD = ['الوقت','رقم الطلب','الاسم','الهاتف','المدينة','العنوان','الدفع','المنتجات','المجموع','التوصيل','الإجمالي','الحالة'];
const STATUSES = ['قيد المراجعة','تم التأكيد','قيد التجهيز','خرج للتوصيل','تم التسليم','ملغي'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { sh = ss.insertSheet(SHEET_NAME); sh.appendRow(HEAD); sh.setFrozenRows(1); }
  return sh;
}

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const sh = sheet_();
  const order = String(d.order || '').trim().toUpperCase();
  // منع التكرار: إذا نفس رقم الطلب موجود ما بنضيفو مرة تانية
  if (order) {
    const col = sh.getRange(2, 2, Math.max(sh.getLastRow() - 1, 1), 1).getValues().flat();
    if (col.map(x => String(x).trim().toUpperCase()).indexOf(order) !== -1) return ContentService.createTextOutput('dup');
  }
  sh.appendRow([new Date(), order, d.name, "'" + d.phone, d.city, d.address, d.pay, d.items, d.subtotal, d.ship, d.total, STATUSES[0]]);
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build();
  sh.getRange(sh.getLastRow(), HEAD.length).setDataValidation(rule);
  return ContentService.createTextOutput('ok');
}

function doGet(e) {
  const id = String((e && e.parameter && e.parameter.track) || '').trim().toUpperCase();
  let out = { found: false };
  if (id) {
    const v = sheet_().getDataRange().getValues();
    for (let i = 1; i < v.length; i++) {
      if (String(v[i][1]).trim().toUpperCase() === id) { out = { found: true, status: String(v[i][HEAD.length - 1]) }; break; }
    }
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
