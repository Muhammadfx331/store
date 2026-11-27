/* =============================================================
   smoke-store.mjs — اختبار دخان للنسخة المعدّلة من المتجر
   يشغّل public/mystore/index.html داخل jsdom مع محاكاة ردود
   Google Sheet، ويتأكد من التعديلات الثلاثة + سلامة الطلبات.
   ============================================================= */
import { readFileSync } from "node:fs";
import { JSDOM, VirtualConsole } from "jsdom";

const html = readFileSync("public/mystore/index.html", "utf8");
const errors = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => errors.push("jsdomError: " + e.message));
vc.on("error", (...a) => errors.push("console.error: " + a.join(" ")));

const PRODUCTS = {
  products: [
    { id: 77, name: "أنبوب PPR تجريبي", desc: "عود 4 متر", price: 2.5, cat: "صحية", emoji: "\u{1F6B0}", shop: "محل النور" },
    { id: 78, name: "دهان أبيض", price: 35, old: 42, cat: "دهان" },
  ],
};
const PROS = {
  pros: [
    { type: "sanelec", name: "أبو محمد", city: "الدرباسية", phone: "0936193191", desc: "صحية وكهرباء", works: [] },
  ],
};
const VEH = { vehicles: [{ type: "car", cond: "used", name: "هيونداي", year: "2010", price: 5000, km: 120000, city: "قامشلو", phone: "0936193191", images: "" }] };

let orderPosted = null;

const dom = new JSDOM(html, {
  url: "https://muhammadfx331.github.io/store/",
  runScripts: "dangerously",
  pretendToBeVisual: true,
  virtualConsole: vc,
  beforeParse(window) {
    window.fetch = (url, opts) => {
      url = String(url);
      const json = (o) => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify(o)), json: () => Promise.resolve(o) });
      if (opts && opts.method === "POST") {
        const body = JSON.parse(opts.body || "{}");
        if (body.action === "addveh") return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve("ok"), json: () => Promise.reject(new Error("not json")) });
        orderPosted = body;
        return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve("{}"), json: () => Promise.resolve({}) });
      }
      if (url.includes("products=1")) return json(PRODUCTS);
      if (url.includes("pros=1")) return json(PROS);
      if (url.includes("vehicles=1")) return json(VEH);
      if (url.includes("ratings=1")) return json({ ratings: { 77: { a: 4.5, n: 2 } } });
      if (url.includes("track")) return json({ found: true, status: "تم التأكيد" });
      return json({});
    };
    window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
    window.scrollTo = () => {};
    window.open = () => null;
    window.HTMLCanvasElement.prototype.getContext = () => null;
    window.Element.prototype.scrollIntoView = () => {};
    /* jsdom ما بيطبّق توابع <dialog> — نحاكيها حتى نقدر نختبر النوافذ */
    const DP = window.HTMLDialogElement.prototype;
    if (typeof DP.showModal !== "function") {
      DP.show = function () { this.open = true; };
      DP.showModal = function () { this.open = true; };
      DP.close = function () {
        const was = this.open;
        this.open = false;
        if (was) this.dispatchEvent(new window.Event("close"));
      };
    }
  },
});

const { window } = dom;
const { document } = window;
const $ = (s) => document.querySelector(s);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const results = [];
function check(name, cond, extra = "") {
  results.push({ name, ok: !!cond, extra });
}

await wait(900);

/* ---------- الأساسيات ---------- */
check("المنتجات انحملت من الجدول", document.querySelectorAll("#grid .card").length >= 2, `${document.querySelectorAll("#grid .card").length} بطاقة`);
check("نافذة المفضلة موجودة بالهيكل", !!$("#fdlg"));

/* ---------- 1) المفضلة ---------- */
const heart = document.querySelector('#grid .card [data-fav]');
heart.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await wait(60);
check("القلب بيضيف للمفضلة", window.localStorage.getItem("favs")?.includes("77"), window.localStorage.getItem("favs") || "");

$("#bnFav").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await wait(120);
check("زر المفضلة بيفتح النافذة", $("#fdlg").open);
check("النافذة فيها المنتج المفضل", $("#fdB").innerHTML.includes("أنبوب PPR تجريبي"));
check("النافذة فيها عدّاد", !!$("#fdT .fdn"));
check("النافذة فيها إجمالي القيمة", $("#fdSum").innerHTML.includes("قيمة المفضلة"));
check("الشبكة الرئيسية ما بقت مفلترة", !window.eval("favOnly"));

const addInDlg = $("#fdB [data-add]");
addInDlg.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await wait(80);
check("أضف للسلة شغّال داخل النافذة", JSON.parse(window.localStorage.getItem("cart") || "{}")["77"] === 1, window.localStorage.getItem("cart"));

/* إزالة من المفضلة داخل النافذة تعيد الرسم */
$("#fdB [data-fav]").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await wait(80);
check("الحذف من داخل النافذة بيعيد الرسم", !$("#fdB").innerHTML.includes("أنبوب PPR تجريبي"));
check("حالة فارغة + زر تسوّق الآن", $("#fdB").innerHTML.includes("fdGo"));
$("#fdlg").close();
await wait(60);
check("النافذة بتنسكر", !$("#fdlg").open);

/* ---------- 2) الدليل بدون ملف شخصي ---------- */
$("#tabPros").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await wait(60);
document.querySelector('#tgrid [data-t="sanelec"]').dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await wait(80);
const plist = $("#plist").innerHTML;
check("الدليل بيعرض أصحاب المهن", plist.includes("أبو محمد"));
check("ما في زر «الملف الشخصي» بالدليل", !plist.includes('data-shop=') && !plist.includes("الملف الشخصي"));
check("الاسم ما عاد رابط لصفحة الملف", !plist.includes('href="#u='));
check("أزرار الاتصال والواتساب باقية", plist.includes("tel:") && plist.includes("wa.me"));

/* زر ملفي بدون تسجيل → نموذج الانضمام */
$("#bnMe").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await wait(80);
check("زر «ملفي» بيفتح التسجيل لما مافي ملف", $("#jdlg").open);
$("#jdlg").close();

/* ---------- 3) المركبات: رسالة السيرفر القديم ---------- */
window.localStorage.setItem("owner", JSON.stringify({ ph: "0936193191", code: "ABCD-EFGH", name: "أبو محمد" }));
window.eval("getOwner()");
window.__openAddVeh();
await wait(60);
$("#van").value = "هيونداي سوناتا";
$("#vap").value = "5000";
$("#vacy").value = "قامشلو";
/* صور وهمية: نستبدل shrinkImage (دالة عامة) لأنو canvas مو متوفر بـ jsdom */
const fake = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";
window.shrinkImage = async () => fake;
await $("#vaf").onchange({ target: { files: [{ type: "image/jpeg" }, { type: "image/jpeg" }], value: "" } });
await wait(80);
check("الصور انضغطت وظهرت بالمعاينة", $("#vaPrev").innerHTML.includes("<img"), $("#vaPrev").innerHTML.slice(0, 80));
$("#vasend").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await wait(400);
const vaerr = $("#vaerr").innerHTML;
check("رسالة واضحة عن سكربت السيرفر", vaerr.includes("Google Apps Script"), vaerr.slice(0, 120));
check("بديل واتساب ظاهر", vaerr.includes("vaWa"));
check("المسودة انحفظت محلياً", !!window.localStorage.getItem("vehDraft"));
window.opened = null;
window.open = (u) => { window.opened = u; return null; };
$("#vaWa").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await wait(60);
check("زر واتساب بيفتح المحادثة بالتفاصيل", String(window.opened || "").includes("wa.me/963936193191") && decodeURIComponent(String(window.opened)).includes("هيونداي سوناتا"));

/* ---------- 3b) زر «ملفي» مع ملف موجود ---------- */
$("#bnMe").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await wait(200);
check("ملفي بيفتح صفحة الملف لما يكون موافق عليه", !$("#ppage").hidden && $("#ppBody").innerHTML.includes("أبو محمد"));
check("ملفي بيضبط الهاش #u=", window.location.hash.startsWith("#u="));
check("زر ملفي بيصير مميز بالشريط", $("#bnMe").classList.contains("is-on"));
check("صفحة الملف فيها إضافة صور أعمال", $("#ppBody").innerHTML.includes("ppAddWork"));
window.eval("hideProfile()");
await wait(60);
check("صفحة الملف بتنسكر", $("#ppage").hidden);

/* ملف قيد المراجعة */
window.localStorage.setItem("owner", JSON.stringify({ ph: "0999000111", code: "XXXX-YYYY", name: "منتظر" }));
$("#bnMe").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await wait(200);
check("قيد المراجعة: ما بيفتح صفحة ملف", $("#ppage").hidden);
check("قيد المراجعة: بيحوّل لقسم الدليل", window.eval("view") === "pros");
window.localStorage.setItem("owner", JSON.stringify({ ph: "0936193191", code: "ABCD-EFGH", name: "أبو محمد" }));

/* ---------- 4) الطلبات ما تأثرت ---------- */
$("#vaf") && $("#vadlg").close();
window.eval("setView('shop')");
$("#grid [data-add]").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await wait(60);
$("#openCart").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await wait(60);
$("#fn").value = "زبون تجريبي";
$("#ph").value = "0936111222";
$("#addr").value = "شارع测试".replace("测试", "التشرين");
$("#gov").value = "الدرباسية";
$("#send").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await wait(400);
check("الطلب انحفظ محلياً", (JSON.parse(window.localStorage.getItem("orders") || "[]")).length === 1);
check("الطلب انرسل للجدول بنفس البنية", orderPosted && orderPosted.order && orderPosted.items && orderPosted.total > 0, JSON.stringify(orderPosted || {}).slice(0, 200));
check("مافي أخطاء runtime", errors.length === 0, errors.slice(0, 3).join(" | "));

/* ---------- التقرير ---------- */
let bad = 0;
for (const r of results) {
  if (!r.ok) bad++;
  console.log(`${r.ok ? "✓" : "✗"} ${r.name}${r.extra ? "  →  " + r.extra : ""}`);
}
console.log(`\n${results.length - bad}/${results.length} ناجح`);
try { dom.window.close(); } catch {}
process.exit(bad ? 1 : 0);
