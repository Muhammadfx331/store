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
  sh.appendRow([new Date(), order, s_(d.name), "'" + String(d.phone || '').slice(0, 20), s_(d.city), s_(d.address), s_(d.pay), s_(d.items), Number(d.subtotal) || 0, Number(d.ship) || 0, Number(d.total) || 0, STATUSES[0]]);
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build();
  sh.getRange(sh.getLastRow(), HEAD.length).setDataValidation(rule);
  return ContentService.createTextOutput('ok');
}

const PROD_SHEET = 'المنتجات';
const PROD_HEAD = ['الاسم','الوصف','السعر','السعر قبل الخصم','التصنيف','إيموجي','روابط الصور','متوفر','الرقم'];
const s_ = v => { v = String(v == null ? '' : v).slice(0, 500); return /^[=+\-@]/.test(v) ? "'" + v : v; };

function doGet(e) {
  const q = (e && e.parameter) || {};
  if (q.products) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let ps = ss.getSheetByName(PROD_SHEET);
    if (!ps) {
      ps = ss.insertSheet(PROD_SHEET); ps.appendRow(PROD_HEAD); ps.setFrozenRows(1);
      ps.appendRow(['مثال: صابون غار', 'قطعة 200 غ', 3, '', 'مواد غذائية', '🧼', '', 'لا', '']); // مخفي لأن "متوفر" = لا
    }
    const v = ps.getDataRange().getValues(), out = [];
    for (let i = 1; i < v.length; i++) {
      const r = v[i];
      if (!r[0] || String(r[7]).trim() === 'لا') continue;
      out.push({ id: r[8] || i + 1, name: r[0], desc: r[1], price: r[2], old: r[3], cat: r[4], emoji: r[5], images: r[6] });
    }
    return ContentService.createTextOutput(JSON.stringify({ products: out })).setMimeType(ContentService.MimeType.JSON);
  }
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
