/* اختبار دخان: يحمّل صفحة المتجر المطوّرة في jsdom ويراقب أخطاء وقت التشغيل */
import { readFileSync } from "node:fs";
import { JSDOM, VirtualConsole } from "jsdom";

const html = readFileSync("public/store/index.html", "utf8");
const errors = [];
const logs = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => errors.push("jsdomError: " + e.message));
vc.on("error", (...a) => errors.push("console.error: " + a.join(" ")));
vc.on("log", (...a) => logs.push(a.join(" ")));

const dom = new JSDOM(html, {
  url: "https://muhammadfx331.github.io/store/",
  runScripts: "dangerously",
  pretendToBeVisual: true,
  virtualConsole: vc,
  beforeParse(window) {
    // محاكاة استجابة Google Sheet (مع إيموجي حقيقي في عمود emoji لاختبار icn)
    window.fetch = (url) => {
      url = String(url);
      const json = (o) => Promise.resolve({ ok: true, json: () => Promise.resolve(o) });
      if (url.includes("products=1")) return json({ products: [
        { id: 77, name: "أنبوب PPR تجريبي", desc: "عود 4 متر", price: 2.5, cat: "صحية", emoji: "\u{1F6B0}" },
        { id: 78, name: "منتج بدون إيموجي", price: 5, cat: "أخرى" },
        { id: 79, name: "منتج بإيموجي غير معروف", price: 3, cat: "أخرى", emoji: "\u{1F984}" },
      ]});
      if (url.includes("pros=1")) return json({ pros: [] });
      if (url.includes("vehicles=1")) return json({ vehicles: [] });
      return new Promise(() => {});
    };
    window.matchMedia = window.matchMedia || ((q) => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } }));
    window.addEventListener("error", (e) => errors.push("window.onerror: " + e.message + " @" + (e.filename || "") + ":" + e.lineno));
  },
});

setTimeout(() => {
  const d = dom.window.document;
  const check = (label, ok) => console.log((ok ? "PASS" : "FAIL") + " — " + label);
  check("storeName set", (d.querySelector("#storeName")?.textContent || "").length > 0);
  check("hero slider injected", d.querySelectorAll(".hslide").length === 3);
  check("brandmark injected", !!d.querySelector(".brandmark svg"));
  check("old marquee icons removed", !d.querySelector(".herobg") && !d.querySelector("#hr1"));
  check("delivery courier injected", !!d.querySelector(".courier .cr-wheel") && !!d.querySelector(".cr-road"));
  check("logo has compound-motion parts", !!d.querySelector(".bm-bag") && !!d.querySelector(".bm-spark"));
  check("bell icon is SVG", !!d.querySelector("#bell svg.icn"));
  check("tabVeh icon is SVG", !!d.querySelector("#tabVeh svg.icn"));
  check("theme button is SVG", !!d.querySelector("#theme svg.icn"));
  check("search icon SVG", !!d.querySelector(".srch svg.icn"));
  const gridCards = d.querySelectorAll("#grid .card").length;
  check("product grid rendered (" + gridCards + " cards)", gridCards > 0);
  const firstThumb = d.querySelector("#grid .thumb");
  check("thumb icon SVG (no emoji)", firstThumb ? !!firstThumb.querySelector("svg.icn") : false);
  const tiles = d.querySelectorAll("#tgrid .tile").length;
  check("trade tiles rendered (" + tiles + ")", tiles === 10);
  check("tile icon SVG", !!d.querySelector("#tgrid .tile svg.icn"));
  // الإيموجي المعروف يتحول لأيقونة، وغير المعروف يبقى (سلوك آمن)
  const gridHtml = d.querySelector("#grid")?.innerHTML || "";
  check("known emojis converted in grid", !/[\u{1F6B0}\u{1F6CD}]/u.test(gridHtml));
  check("layer CSS present", (d.querySelector("style")?.textContent || "").includes("hero-slides"));
  check("SHEET_URL preserved", html.includes("script.google.com/macros/s/AKfycbza87CVglv96ldM2OZq9M5Mz"));
  check("OneSignal preserved", html.includes("26b0ec9e-2732-44f3-96f7-2b1fdde5652e"));
  check("icn() converts sheet emoji", dom.window.icn && dom.window.icn("\u{1F6D2}\uFE0F").includes("<svg"));
  // تبديل اللغة للكورمانجية
  d.querySelector("#lang")?.click();
  check("Kurdî lang switch works", (d.querySelector("#lang")?.textContent || "").includes("عربي"));
  const kuH1 = d.querySelector(".hero h1")?.textContent || "";
  check("Kurdî hero text", kuH1.includes("Hilberên sûrî"));
  d.querySelector("#lang")?.click();
  // فتح السلة وإضافة منتج من منتجات الجدول المحاكية
  d.querySelector('[data-add="77"]')?.click();
  check("add-to-cart works (cnt=1)", d.querySelector("#cnt")?.textContent === "1");
  const thumbSvg = d.querySelector('#grid .thumb svg.icn');
  check("sheet emoji → SVG icon in card", !!thumbSvg);
  d.querySelector("#openCart")?.click();
  check("cart opens with SVG row icon", d.querySelector("#cart")?.classList.contains("open") && !!d.querySelector("#items svg.icn"));
  console.log(errors.length ? "\nRUNTIME ERRORS:\n" + errors.join("\n") : "\nNO RUNTIME ERRORS 🎉");
  process.exit(errors.length ? 1 : 0);
}, 1500);
