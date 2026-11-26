/* يحوّل ملف المتجر الأصلي إلى النسخة المطوّرة مع الحفاظ الكامل على كود الطلبات والإشعارات */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import vm from "node:vm";

const SRC = readFileSync("build/original.html", "utf8");
const LAYER = readFileSync("build/layer.css", "utf8");
let s = SRC;
const report = [];
const fail = (m) => { throw new Error("TRANSFORM FAIL: " + m); };

/* ---------- أيقونات SVG (خط موحّد 24px، stroke=currentcolor) ---------- */
const A = 'class="icn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" ${A}>${inner}</svg>`;
const ICONS = {
  bell: svg('<path d="M18 8.5a6 6 0 0 0-12 0c0 6.5-2.5 7.5-2.5 7.5h17S18 15 18 8.5"/><path d="M10.3 20.5a2 2 0 0 0 3.4 0"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
  tag: svg('<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.6" cy="7.6" r="1" fill="currentColor" stroke="none"/>'),
  car: svg('<path d="M4 16.5H2.8V13l2.3-5A1.6 1.6 0 0 1 6.6 7h10.8a1.6 1.6 0 0 1 1.5 1l2.3 5v3.5H19"/><circle cx="7.3" cy="16.5" r="1.9"/><circle cx="16.7" cy="16.5" r="1.9"/><path d="M9.4 16.5h5.2M4.5 12.5h15"/>'),
  moto: svg('<circle cx="5.5" cy="16.5" r="2.6"/><circle cx="18.5" cy="16.5" r="2.6"/><path d="M5.5 16.5h6.2l3.1-6.3h3.7"/><path d="M13.6 6.8h2.9l2 9.7"/><path d="M9.2 6.8h2.6l1.4 3.4"/>'),
  tools: svg('<path d="M14.7 6.2a4.2 4.2 0 0 0-5.8 5.4L3 17.5 6.5 21l5.9-5.9a4.2 4.2 0 0 0 5.4-5.8l-3 3-2.4-.7-.7-2.4Z"/>'),
  install: svg('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M12 7v6.2m0 0-2.6-2.6M12 13.2l2.6-2.6"/><path d="M10 18h4"/>'),
  cart: svg('<circle cx="9.2" cy="20" r="1.4"/><circle cx="17.2" cy="20" r="1.4"/><path d="M2.8 4h2.2l2.6 11.4a1.5 1.5 0 0 0 1.5 1.2h7.7a1.5 1.5 0 0 0 1.5-1.2L20.4 8H6"/>'),
  camera: svg('<path d="M4 8h3.1L8.6 5.5h6.8L16.9 8H20a1.5 1.5 0 0 1 1.5 1.5V18A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V9.5A1.5 1.5 0 0 1 4 8Z"/><circle cx="12" cy="13.2" r="3.4"/>'),
  trash: svg('<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13.5h9l1-13.5"/><path d="M10 11v6M14 11v6"/>'),
  pencil: svg('<path d="M17 3.3a2.6 2.6 0 0 1 3.7 3.7L7.6 20.1 2 21.5l1.4-5.6Z"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  star: svg('<path d="m12 3 2.7 5.6 6.2.8-4.5 4.3 1.1 6.1L12 16.9l-5.5 2.9 1.1-6.1L3.1 9.4l6.2-.8Z"/>'),
  pin: svg('<path d="M12 21.5S5 15.8 5 10a7 7 0 0 1 14 0c0 5.8-7 11.5-7 11.5Z"/><circle cx="12" cy="10" r="2.6"/>'),
  receipt: svg('<path d="M6 2.5h12V21l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21Z"/><path d="M9 7.5h6M9 11h6M9 14.5h4"/>'),
  bag: svg('<path d="M5.5 8h13l-1.1 12.2a1.3 1.3 0 0 1-1.3 1.3H7.9a1.3 1.3 0 0 1-1.3-1.3Z"/><path d="M9 10.5V6.5a3 3 0 0 1 6 0v4"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/>'),
  moon: svg('<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z"/>'),
  contrast: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17Z" fill="currentColor" stroke="none"/>'),
  store: svg('<path d="M4 9 5.6 3.5h12.8L20 9"/><path d="M4 9a2.65 2.65 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.65 2.65 0 0 0 20 9"/><path d="M5.5 12v8h13v-8"/><path d="M10 20v-5.5h4V20"/>'),
  plug: svg('<path d="M9 2.5V7M15 2.5V7"/><path d="M6.5 7h11v3.5a5.5 5.5 0 0 1-11 0Z"/><path d="M12 16v5.5"/>'),
  wrench: svg('<path d="M14.7 6.3a4.2 4.2 0 0 0-5.9 5.3L3 17.4 6.6 21l5.8-5.8a4.2 4.2 0 0 0 5.3-5.9l-3 3-2.4-.6-.6-2.4Z"/>'),
  paint: svg('<path d="M12 21a9 9 0 1 1 9-9c0 2.4-1.4 3.6-3 3.6h-2.1a2 2 0 0 0-1.5 3.3c.7.8.3 2.1-2.4 2.1Z"/><circle cx="7.5" cy="11.5" r=".7" fill="currentColor" stroke="none"/><circle cx="10.3" cy="7.6" r=".7" fill="currentColor" stroke="none"/><circle cx="15" cy="7.9" r=".7" fill="currentColor" stroke="none"/>'),
  hammer: svg('<path d="m13.7 7.8 3.8 3.8L8 21.1l-3.8-3.8Z"/><path d="M12.2 6.3 14.5 4a2 2 0 0 1 2.8 0l2.7 2.7a2 2 0 0 1 0 2.8l-2.3 2.3"/>'),
  soap: svg('<rect x="3" y="9" width="14.5" height="9.5" rx="3.2"/><path d="M6.8 12.8c1.4-1.1 3.4-1.1 4.9 0"/><circle cx="19.3" cy="6.2" r="1.7"/><circle cx="15.6" cy="4.2" r="1"/>'),
  olive: svg('<ellipse cx="10.8" cy="14.2" rx="5.9" ry="6.3"/><path d="M13 8.2C13 5 15.4 3 19 3c-.3 3.6-2.4 5.7-5.6 5.9"/>'),
  herb: svg('<path d="M12 21.5V11"/><path d="M12 12.5C12 8.9 9.5 6.5 5.5 6.5c0 4 2.5 6 6.5 6Z"/><path d="M12 9c0-3.4 2.5-5.5 6.5-5.5 0 3.9-2.5 5.9-6.5 5.5Z"/>'),
  headphones: svg('<path d="M4 14.5V12a8 8 0 0 1 16 0v2.5"/><rect x="3" y="14" width="4.2" height="6.5" rx="2"/><rect x="16.8" y="14" width="4.2" height="6.5" rx="2"/>'),
  battery: svg('<rect x="2.5" y="8" width="17" height="9" rx="2.5"/><path d="M22 11.2v2.6"/><path d="M6.2 11v3M9.7 11v3M13.2 11v3"/>'),
  cup: svg('<path d="M6.5 3h11L16 21H8Z"/><path d="M7 8.5h10"/>'),
  bulb: svg('<path d="M9.5 18h5M10 21h4"/><path d="M12 3a6 6 0 0 1 3.5 10.9c-.8.6-1 1.3-1 2.1h-5c0-.8-.2-1.5-1-2.1A6 6 0 0 1 12 3Z"/>'),
  bolt: svg('<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12Z"/>'),
  shower: svg('<path d="M12 6.5V4H9.5"/><path d="M12 6.5a5.5 5.5 0 0 1 5.5 5.5v.5h-11V12A5.5 5.5 0 0 1 12 6.5Z"/><path d="M8.5 15.5v.01M12 15.5v.01M15.5 15.5v.01M10 18.7v.01M14 18.7v.01M12 21.5v.01"/>'),
  faucet: svg('<path d="M3.5 9.5h9.2a4.3 4.3 0 0 1 4.3 4.3v1.7"/><path d="M14.8 18.6h4.4M17 15.5v3.1"/><path d="M7.8 9.5V7M5.8 7h4"/><path d="M17 21.7s-1.3-1.4-1.3-2.3a1.3 1.3 0 0 1 2.6 0c0 .9-1.3 2.3-1.3 2.3Z"/>'),
  notebook: svg('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9.2 3v18"/><path d="M12.5 8h3.5M12.5 12h3.5"/>'),
  ruler: svg('<rect x="2.5" y="9.3" width="19" height="5.6" rx="1.5"/><path d="M6.8 9.3v2.4M10.6 9.3v3M14.4 9.3v2.4M18.2 9.3v3"/>'),
  brush: svg('<path d="M20.5 3.5c.6.6.6 1.5 0 2.1L12.4 13.7l-2.1-2.1 8.1-8.1c.6-.6 1.5-.6 2.1 0Z"/><path d="M10.3 13.7c-2.6 0-4.2 1.6-4.7 4.1-.3 1.5-1 2.1-2.6 2.6 1 1.5 3.1 2.1 4.7 1.5 2.6-.9 4.7-3.1 4.7-6.1Z"/>'),
  bricks: svg('<rect x="3" y="4.5" width="18" height="15" rx="1.5"/><path d="M3 9.5h18M3 14.5h18"/><path d="M9 4.5v5M15 4.5v5M6.5 9.5v5M12 9.5v5M17.5 9.5v5M9 14.5v5M15 14.5v5"/>'),
  bucket: svg('<path d="M5 9.5h14l-1.3 10.6a2 2 0 0 1-2 1.9H8.3a2 2 0 0 1-2-1.9Z"/><path d="M5.3 9.5a6.7 6.7 0 0 1 13.4 0"/><path d="M7 13h10"/>'),
  tiles: svg('<rect x="3.5" y="3.5" width="7.3" height="7.3" rx="1.6"/><rect x="13.2" y="3.5" width="7.3" height="7.3" rx="1.6"/><rect x="3.5" y="13.2" width="7.3" height="7.3" rx="1.6"/><rect x="13.2" y="13.2" width="7.3" height="7.3" rx="1.6"/>'),
  dress: svg('<path d="M9 3c0 2-.9 3.3-2.1 4.1L4.5 18c2.6 1.7 12.4 1.7 15 0L17.1 7.1C15.9 6.3 15 5 15 3"/><path d="M9 3c.9 1.1 5.1 1.1 6 0"/>'),
  box: svg('<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5Z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>'),
  phone: svg('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>'),
  moneybag: svg('<path d="M9.5 7.5 8 4.5h8l-1.5 3"/><path d="M9.5 7.5c-3 1.8-5 4.6-5 8A5.5 5.5 0 0 0 10 21h4a5.5 5.5 0 0 0 5.5-5.5c0-3.4-2-6.2-5-8Z"/><path d="M12 11v6M10 12.8h4"/>'),
  gift: svg('<rect x="3.5" y="8" width="17" height="4" rx="1.2"/><path d="M5 12v8.5h14V12M12 8v12.5"/><path d="M12 8s-4.5.3-4.5-2.7C7.5 3 12 3.5 12 8ZM12 8s4.5.3 4.5-2.7C16.5 3 12 3.5 12 8Z"/>'),
  lotion: svg('<path d="M9 8.5h6V20a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 20Z"/><path d="M10.5 8.5V6h3v2.5M10.5 3.5h3"/><path d="M11 13h2"/>'),
  house: svg('<path d="m3.5 11 8.5-7.5L20.5 11"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>'),
  check: svg('<circle cx="12" cy="12" r="8.7"/><path d="m8.3 12.3 2.6 2.6 4.8-5"/>'),
  fire: svg('<path d="M12 21.5c-3.9 0-6.5-2.4-6.5-6 0-2.7 1.7-4.6 3-6.3 1-1.3 2-2.6 2.2-4.7 2.6 1.3 3.6 3.6 3.3 5.9 1-.3 1.8-1 2.1-2.2 1.6 1.7 2.4 4.2 2.4 6.5 0 4.4-2.6 6.8-6.5 6.8Z"/>'),
  basket: svg('<path d="m5 9-2 3.5V19a1.5 1.5 0 0 0 1.5 1.5h15A1.5 1.5 0 0 0 21 19v-6.5L19 9Z"/><path d="M2.8 9h18.4"/><path d="m8 9 2.5-5.5M16 9l-2.5-5.5"/><path d="M9 12.5v4M12 12.5v4M15 12.5v4"/>'),
};

/* خريطة إيموجي → أيقونة */
const EMO = {
  "\u{1F514}": "bell", "\u{1F50D}": "search", "\u{1F3F7}": "tag", "\u{1F697}": "car",
  "\u{1F3CD}": "moto", "\u{1F6E0}": "tools", "\u{1F4F2}": "install", "\u{1F6D2}": "cart",
  "\u{1F4F7}": "camera", "\u{1F5D1}": "trash", "\u{270F}": "pencil", "\u{2795}": "plus",
  "\u{2B50}": "star", "\u{1F4CD}": "pin", "\u{1F9FE}": "receipt", "\u{1F6CD}": "bag",
  "\u{2600}": "sun", "\u{1F319}": "moon", "\u{1F313}": "contrast", "\u{1F3EA}": "store",
  "\u{1F50C}": "plug", "\u{1F527}": "wrench", "\u{1F3A8}": "paint", "\u{1F528}": "hammer",
  "\u{1F9FC}": "soap", "\u{1FAD2}": "olive", "\u{1F33F}": "herb", "\u{1F3A7}": "headphones",
  "\u{1F50B}": "battery", "\u{1F95B}": "cup", "\u{1F4A1}": "bulb", "\u{26A1}": "bolt",
  "\u{1F6BF}": "shower", "\u{1F6B0}": "faucet", "\u{1F4D3}": "notebook", "\u{1F4CF}": "ruler",
  "\u{1F58C}": "brush", "\u{1F9F1}": "bricks", "\u{1FAA3}": "bucket", "\u{1F533}": "tiles",
  "\u{1F457}": "dress", "\u{1F4E6}": "box", "\u{1F4F1}": "phone", "\u{1F4B0}": "moneybag",
  "\u{1F381}": "gift", "\u{1F9F4}": "lotion", "\u{1F3E0}": "house", "\u{2705}": "check",
  "\u{1F525}": "fire", "\u{1F9FA}": "basket",
};
const sq = (str) => str.replace(/"/g, "'");

/* ---------- 0) إصلاحات يجب أن تسبق الاستبدال العام (تحتوي إيموجي حرفي) ---------- */
const patch = (from, to, label) => {
  if (!s.includes(from)) fail("missing target: " + label);
  s = s.replace(from, to);
  report.push("patched: " + label);
};
// زر الوضع كان textContent (يعرض نصاً) → innerHTML مع أيقونات SVG
patch(
  "b.textContent={auto:'\u{1F313}',light:'\u{2600}\uFE0F',dark:'\u{1F319}'}[theme]",
  "b.innerHTML=THEME_IC[theme]",
  "theme button → SVG innerHTML"
);
// إيموجي منتجات Google Sheet: يمر عبر icn() بدل القصّ (سيُستبدل الإيموجي الاحتياطي بأيقونة لاحقاً)
patch(
  "e:String(r.emoji||'\u{1F6CD}\uFE0F').slice(0,4)",
  "e:icn(String(r.emoji||'\u{1F6CD}\uFE0F'))",
  "sheet emoji → icn()"
);

/* ---------- 1) استبدال الإيموجي عالمياً مع مراعاة نوع علامات الاقتباس المحيطة ---------- */
let replaced = 0;
s = s.replace(/\p{Extended_Pictographic}\uFE0F?/gu, (m, offset) => {
  const key = m.replace(/\uFE0F/g, "");
  const name = EMO[key];
  if (!name) return m; // © وأمثاله تبقى كما هي
  replaced++;
  const prev = s[offset - 1];
  return prev === '"' ? sq(ICONS[name]) : ICONS[name];
});
report.push(`emoji→svg replacements: ${replaced}`);

/* ---------- 2) إصلاحات دقيقة داخل الجافاسكربت ---------- */
// مواقع عرض إيموجي المنتج/المهنة → تمر عبر icn() لتشمل أيضاً ما يصل من الجدول
patch('<div class="row"><span class="e">${p.e}</span>', '<div class="row"><span class="e">${icn(p.e)}</span>', "cart row icon");
patch(':p.e}</span>', ':icn(p.e)}</span>', "shop dialog row icon");
patch('<b style="font-weight:400">${e}</b>', '<b style="font-weight:400">${icn(e)}</b>', "avatar icon");
patch('<span class="te" aria-hidden="true">${x.e}</span>', '<span class="te" aria-hidden="true">${icn(x.e)}</span>', "trade tile icon");
patch('<span class="emo" aria-hidden="true">${p.e}</span>', '<span class="emo" aria-hidden="true">${icn(p.e)}</span>', "thumb icon");
patch('<span class="pc-e" aria-hidden="true">${p.e}</span>', '<span class="pc-e" aria-hidden="true">${icn(p.e)}</span>', "profile card icon");
patch('<div class="pp-meta"><span>${T.e||\'\'} ', '<div class="pp-meta"><span>${icn(T.e||\'\')} ', "profile meta icon");

/* ---------- 3) رموز عارض الصور (lightbox) → SVG ---------- */
const G = {
  x: ICONS.plus.replace(/<path[^>]*d="M12 5v14M5 12h14"[^>]*\/>/, '<path d="m6 6 12 12M18 6 6 18"/>'),
};
const gx = svg('<path d="m6 6 12 12M18 6 6 18"/>');
const gPrev = svg('<path d="M14.5 5.5 8 12l6.5 6.5"/>');
const gNext = svg('<path d="M9.5 5.5 16 12l-6.5 6.5"/>');
const gMinus = svg('<path d="M6 12h12"/>');
const gPlus = svg('<path d="M12 6v12M6 12h12"/>');
const gReset = svg('<path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1"/><path d="M20.5 3.5V8H16"/>');
patch('aria-label="إغلاق">✕</button>', `aria-label="إغلاق">${gx}</button>`, "lbx close");
patch('aria-label="حذف">✕</button>', `aria-label="حذف">${gx}</button>`, "gx delete");
patch('aria-label="السابق">‹</button>', `aria-label="السابق">${gPrev}</button>`, "lbx prev");
patch('aria-label="التالي">›</button>', `aria-label="التالي">${gNext}</button>`, "lbx next");
patch('id="wPrev">‹</button>', `id="wPrev">${gPrev}</button>`, "wdlg prev");
patch('id="wNext">›</button>', `id="wNext">${gNext}</button>`, "wdlg next");
patch('aria-label="تصغير">−</button>', `aria-label="تصغير">${gMinus}</button>`, "lbx minus");
patch('aria-label="تكبير">+</button>', `aria-label="تكبير">${gPlus}</button>`, "lbx plus");
patch('aria-label="الحجم الأصلي">⟲</button>', `aria-label="الحجم الأصلي">${gReset}</button>`, "lbx reset");

/* ---------- 4) الهيدر: علامة المتجر + الهيدر المتحرك (سلايدر الصور) ---------- */
const brandmark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g class="bm-bag"><path d="M5.5 8.2h13l-1.1 12a1.4 1.4 0 0 1-1.4 1.3H8a1.4 1.4 0 0 1-1.4-1.3Z"/><path d="M9 10.6V6.6a3 3 0 0 1 6 0v4"/></g><path class="bm-spark" d="m17.6 3.2.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2Z" fill="currentColor" stroke="none"/></svg>`;
patch(
  '<div class="logo" id="storeName"></div>',
  `<div class="logo"><span class="brandmark" aria-hidden="true">${brandmark}</span><span id="storeName"></span></div>`,
  "header brandmark"
);

const slider = `
  <div class="hero-slides" aria-hidden="true">
    <img class="hslide is-on" src="Images/hero-1.jpg" alt="" draggable="false" fetchpriority="high">
    <img class="hslide" src="Images/hero-2.jpg" alt="" loading="lazy" draggable="false">
    <img class="hslide" src="Images/hero-3.jpg" alt="" loading="lazy" draggable="false">
    <div class="hero-scrim"></div>
  </div>
  <div class="hero-dots" aria-hidden="true"><i class="hdot is-on"></i><i class="hdot"></i><i class="hdot"></i></div>`;
patch('<section class="hero">', `<section class="hero">${slider}`, "hero slider markup");

/* شريط الأيقونات المتحركة القديم: يُزال من الواجهة (الكود يتحقق من وجود العناصر قبل الكتابة، فالحذف آمن) */
patch(
  '<div class="herobg" dir="ltr" aria-hidden="true"><div class="hr hr1" id="hr1"></div><div class="hr hr2" id="hr2"></div></div>',
  "",
  "removed old marquee icons (hr1/hr2)"
);

/* مندوب التوصيل على الدراجة — يعبر الهيدر بحركة مركّبة */
const courier = `
  <div class="cr-road" aria-hidden="true"></div>
  <div class="courier" aria-hidden="true">
    <svg viewBox="0 0 210 130" fill="none" aria-hidden="true">
      <defs><linearGradient id="crbeam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe9b0" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></linearGradient></defs>
      <ellipse cx="105" cy="112" rx="80" ry="6.5" fill="#04120f" opacity=".22"/>
      <g class="cr-speed" stroke="#9adfd2" stroke-width="3" stroke-linecap="round"><path d="M168 52h26"/><path d="M176 66h30"/><path d="M170 80h24"/></g>
      <path class="cr-beam" d="M54 58 4 45v34Z" fill="url(#crbeam)"/>
      <g class="cr-wheel"><circle cx="52" cy="98" r="15" fill="#22302c" stroke="#0d1714" stroke-width="5"/><path d="M52 85v26M39 98h26M43 89l18 18M61 89l-18 18" stroke="#58c2b0" stroke-width="2"/><circle cx="52" cy="98" r="3.2" fill="#58c2b0"/></g>
      <g class="cr-wheel"><circle cx="156" cy="98" r="15" fill="#22302c" stroke="#0d1714" stroke-width="5"/><path d="M156 85v26M143 98h26M147 89l18 18M165 89l-18 18" stroke="#58c2b0" stroke-width="2"/><circle cx="156" cy="98" r="3.2" fill="#58c2b0"/></g>
      <g class="cr-bob">
        <path d="M52 96Q60 64 84 52" stroke="#0e4a41" stroke-width="9" stroke-linecap="round"/>
        <path d="M76 48l18-6" stroke="#0e4a41" stroke-width="6" stroke-linecap="round"/>
        <circle cx="94" cy="42" r="3.4" fill="#2a2320"/>
        <path d="M38 92a15 15 0 0 1 28 0" stroke="#0e4a41" stroke-width="5"/>
        <path d="M64 56Q56 74 60 90h18Q70 72 76 56Z" fill="#14655a"/>
        <path d="M46 92h92q8 0 8 6v2H46Z" fill="#0e4a41"/>
        <path d="M100 84q26-16 56-4l2 12q-30 6-56 0Z" fill="#14655a"/>
        <path d="M108 80q20-10 42-2v6q-22-6-40 2Z" fill="#2a2320"/>
        <path d="M152 80l18 6-4 10-14-4Z" fill="#0e4a41"/>
        <rect x="163" y="84" width="5.5" height="8" rx="2" fill="#d35b4a"/>
        <circle cx="58" cy="57" r="6" fill="#ffe9b0" stroke="#caa54e" stroke-width="2"/>
        <g class="cr-rider">
          <path d="M141 46l-8 6m8 4-7 5" stroke="#b8632a" stroke-width="2.4" stroke-linecap="round"/>
          <rect x="141" y="39" width="26" height="25" rx="5.5" fill="#f4a261" stroke="#b8632a" stroke-width="2"/>
          <path d="M149 48h10.5l-1 10.5h-8.6Z" fill="#7a3c12"/>
          <path d="M151.8 48v-2.5a2.5 2.5 0 0 1 5 0V48" stroke="#7a3c12" stroke-width="1.8"/>
          <path d="M120 76q-4-20 7-29l11 5q-7 10-5 24Z" fill="#f08a3c"/>
          <path class="cr-scarf" d="M130 47q-8 2-15 0l-2 4.5q8 2 17 0Z" fill="#d95f4a"/>
          <path d="M129 53Q110 48 97 44" stroke="#f08a3c" stroke-width="7.5" stroke-linecap="round"/>
          <circle cx="96" cy="43.5" r="3.6" fill="#2a2320"/>
          <circle cx="137" cy="38" r="9.6" fill="#f7f3ea" stroke="#d8d2c4" stroke-width="2"/>
          <path d="M128 36q3-6 10-6.5V39q-6-1.5-10 1Z" fill="#2b3a42"/>
          <path d="M122 76q-1 10-9 14l4 5" stroke="#33424a" stroke-width="7.5" stroke-linecap="round"/>
          <path d="M112 93.5l10 2.5" stroke="#2a2320" stroke-width="5" stroke-linecap="round"/>
        </g>
      </g>
      <g fill="#cfe8e2"><circle class="cr-puff" cx="178" cy="100" r="5"/><circle class="cr-puff" cx="185" cy="93" r="3.6"/><circle class="cr-puff" cx="191" cy="102" r="4.4"/></g>
    </svg>
  </div>`;
patch(
  '<div class="hero-dots" aria-hidden="true"><i class="hdot is-on"></i><i class="hdot"></i><i class="hdot"></i></div>',
  '<div class="hero-dots" aria-hidden="true"><i class="hdot is-on"></i><i class="hdot"></i><i class="hdot"></i></div>' + courier,
  "delivery courier animation markup"
);

/* ---------- 5) الخط + الأيقونة (favicon) ---------- */
patch(
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&family=Cairo:wght@600;700;800&display=swap">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap">',
  "google fonts"
);
s = s.replace(/<link rel="icon" href="data:image\/svg\+xml[^"]*">/, '<link rel="icon" type="image/png" sizes="512x512" href="icon-512.png">');
if (!s.includes('href="icon-512.png"')) fail("favicon replacement");
report.push("patched: favicon");

/* ---------- 6) حقن محرك الأيقونات في بداية السكربت الرئيسي ---------- */
// مفاتيح ESVG: تُهرَّب كل المحارف غير ASCII حتى لا يبقى أي إيموجي حرفي في الملف الناتج
const escKey = (ch) => "\\u{" + ch.codePointAt(0).toString(16) + "}";
const ESVG = Object.entries(EMO).map(([cp, name]) => `"${cp.replace(/[\u{0080}-\u{10FFFF}]/gu, escKey)}":"${sq(ICONS[name])}"`).join(",");
const THEME_IC = `{auto:"${sq(ICONS.contrast)}",light:"${sq(ICONS.sun)}",dark:"${sq(ICONS.moon)}"}`;
const engine = `<script>
/* ===== محرك الأيقونات (تطوير الواجهة) — يحوّل أي إيموجي إلى أيقونة SVG، بما فيها القادمة من Google Sheet ===== */
var ESVG={${ESVG}};
var THEME_IC=${THEME_IC};
function icn(v){if(v==null)return"";var s=String(v);if(!s)return s;return s.replace(/\\p{Extended_Pictographic}\\uFE0F?/gu,function(m){var k=m.replace(/\\uFE0F/g,"");return ESVG[m]||ESVG[k]||m;});}
</script>\n<script>`;

const scriptIdx = s.indexOf("<script>", s.indexOf("</style>"));
if (scriptIdx === -1) fail("main script tag not found");
s = s.slice(0, scriptIdx) + engine + s.slice(scriptIdx + "<script>".length);
report.push("injected: icon engine (ESVG + icn + THEME_IC)");

/* ---------- 7) إلصاق طبقة التصميم الجديدة قبل </style> ---------- */
if (!s.includes("</style>")) fail("</style> not found");
s = s.replace("</style>", "\n/* ===================== طبقة التطوير الجديدة (زجاج + حركات + خطوط + سلايدر) ===================== */\n" + LAYER + "\n</style>");
report.push("injected: layer.css");

/* ---------- 8) سكربت الحركات الختامي (سلايدر + كشف عند التمرير + حالة الهيدر) ---------- */
const tail = `<script>
/* ===== حركات الواجهة المطوّرة (إضافة فقط — لا تمسّ الطلبات ولا الإشعارات) ===== */
(function(){
var RM=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var LITE=document.body.classList.contains("lite");
var hd=document.querySelector("header");
if(hd){var on=function(){hd.classList.toggle("scrolled",window.scrollY>14)};window.addEventListener("scroll",on,{passive:true});on();}
if(RM||LITE)return;
/* سلايدر الهيدر */
var slides=[].slice.call(document.querySelectorAll(".hslide")),dots=[].slice.call(document.querySelectorAll(".hdot")),si=0;
if(slides.length>1){setInterval(function(){slides[si].classList.remove("is-on");if(dots[si])dots[si].classList.remove("is-on");si=(si+1)%slides.length;slides[si].classList.add("is-on");if(dots[si])dots[si].classList.add("is-on");},5200);}
/* ظهور العناصر عند التمرير */
if("IntersectionObserver" in window){
var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target);}});},{threshold:.1,rootMargin:"0px 0px -6% 0px"});
var mark=function(n,i){n.classList.add("rv");n.style.setProperty("--rvd",((i%9)*55)+"ms");io.observe(n);};
var scan=function(root){var list=root.querySelectorAll("#plist .pro, #tgrid .tile, #vlist .vcard, #mine .pro, .vf");[].forEach.call(list,function(n,i){if(!n.classList.contains("rv"))mark(n,i);});};
scan(document);
["#plist","#tgrid","#vlist","#mine"].forEach(function(sel){var c=document.querySelector(sel);if(!c)return;new MutationObserver(function(){scan(c);}).observe(c,{childList:true});});
}
})();
</script>\n</body>`;
if (!s.includes("</body>")) fail("</body> not found");
s = s.replace("</body>", tail);
report.push("injected: tail motion script");

/* ---------- 9) تحقق نهائي ---------- */
// © علامة حقوق النشر في الفوتر — تُترك عمداً (رمز نصي وليس إيموجي واجهة)
const leftovers = [...s.matchAll(/\p{Extended_Pictographic}\uFE0F?/gu)].map((m) => m[0]).filter((c) => !c.includes("\u00A9"));
const uniqLeft = [...new Set(leftovers)];
report.push("remaining literal emoji (should be none): " + (uniqLeft.length ? uniqLeft.join(",") : "NONE"));
if (uniqLeft.length) fail("leftover emoji: " + uniqLeft.join(","));

for (const needle of ['SHEET_URL = "https://script.google.com', 'ONESIGNAL_APP_ID = "26b0ec9e', "OneSignalSDK.page.js", "OneSignalSDKWorker.js", 'manifest.webmanifest', "push/onesignal/"]) {
  if (!s.includes(needle)) fail("critical preserved code missing: " + needle);
}
report.push("verified: SHEET_URL / OneSignal / manifest / sw untouched");

// فحص صياغة كل السكربتات المضمّنة
const scripts = [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
scripts.forEach((code, i) => { try { new vm.Script(code); } catch (e) { fail("JS syntax error in script #" + i + ": " + e.message); } });
report.push(`verified: JS syntax OK in ${scripts.length} inline scripts`);

mkdirSync("public/store", { recursive: true });
writeFileSync("public/store/index.html", s);
report.push(`written: public/store/index.html (${(s.length / 1024).toFixed(1)} KB)`);
console.log(report.map((r) => " • " + r).join("\n"));
