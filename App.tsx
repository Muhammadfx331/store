import { useEffect, useRef, useState } from "react";

/* ================= أيقونات SVG ================= */
type IcProps = { className?: string };
const S = (p: IcProps & { d: string; filled?: boolean }) => (
  <svg
    className={p.className ?? "w-5 h-5"}
    viewBox="0 0 24 24"
    fill={p.filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={p.d} />
  </svg>
);
const IcBag = (p: IcProps) => (
  <svg className={p.className ?? "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5.5 8h13l-1.1 12.2a1.3 1.3 0 0 1-1.3 1.3H7.9a1.3 1.3 0 0 1-1.3-1.3Z" />
    <path d="M9 10.5V6.5a3 3 0 0 1 6 0v4" />
  </svg>
);
const IcSpark = (p: IcProps) => <S {...p} d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9ZM18.5 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9Z" />;
const IcShield = (p: IcProps) => <S {...p} d="M12 2.8 4.5 5.5v6c0 5 3.2 8.3 7.5 9.7 4.3-1.4 7.5-4.7 7.5-9.7v-6Zm-3 9 2.2 2.2 3.8-4.2" />;
const IcBell = (p: IcProps) => <S {...p} d="M18 8.5a6 6 0 0 0-12 0c0 6.5-2.5 7.5-2.5 7.5h17S18 15 18 8.5M10.3 20.5a2 2 0 0 0 3.4 0" />;
const IcSheet = (p: IcProps) => <S {...p} d="M6 2.5h12V21l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21ZM9 7.5h6M9 11h6M9 14.5h4" />;
const IcDown = (p: IcProps) => <S {...p} d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M4.5 19.5h15" />;
const IcCheck = (p: IcProps) => <S {...p} d="m4.5 12.5 5 5 10-11" />;
const IcEye = (p: IcProps) => <S {...p} d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 2.7a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4Z" />;
const IcGitHub = (p: IcProps) => (
  <svg className={p.className ?? "w-5 h-5"} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 1.8A10.2 10.2 0 0 0 8.8 21.7c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5A3.9 3.9 0 0 1 6.7 8.8a3.6 3.6 0 0 1 .1-2.7s.9-.3 2.8 1a9.5 9.5 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .3.7.4 1.6.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.2 10.2 0 0 0 12 1.8Z" />
  </svg>
);
const IcImage = (p: IcProps) => <S {...p} d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm4 6a1.8 1.8 0 1 0 0-3.6A1.8 1.8 0 0 0 8 11Zm12 5.5-5-5L5 19" />;
const IcCode = (p: IcProps) => <S {...p} d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-12-2 14" />;
const IcType = (p: IcProps) => <S {...p} d="M5 7V4.5h14V7M12 4.5v15m-3 0h6" />;
const IcMonitor = (p: IcProps) => <S {...p} d="M3.5 5h17v11h-17Zm5 14.5h7m-3.5-3.5v3.5" />;
const IcPhone = (p: IcProps) => <S {...p} d="M7.5 2.5h9a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V4a1.5 1.5 0 0 1 1.5-1.5Zm3 16.5h3" />;
const IcWarn = (p: IcProps) => <S {...p} d="M12 3.5 22 20H2Zm0 6.5v4.5m0 3v.01" />;
const IcLayers = (p: IcProps) => <S {...p} d="m12 3 9 5-9 5-9-5Zm-9 9.5 9 5 9-5M3 17l9 5 9-5" />;
const IcArrowUp = (p: IcProps) => <S {...p} d="M12 19V5m0 0-5 5m5-5 5 5" />;
const IcExt = (p: IcProps) => <S {...p} d="M14 4h6v6m0-6L10.5 13.5M20 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5.5" />;
const IcCopy = (p: IcProps) => <S {...p} d="M8 8V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-3M4 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1Z" />;
const IcZip = (p: IcProps) => <S {...p} d="M5 3.5h14a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Zm4 0v2m0 2v2m0 2v2m-1.5 3.5h3l-.4 3h-2.2Z" />;
const IcBike = (p: IcProps) => (
  <svg className={p.className ?? "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="5.5" cy="16.5" r="2.8" />
    <circle cx="18.5" cy="16.5" r="2.8" />
    <path d="M5.5 16.5 9.5 9h3.2l2 4.5h3.8M12.7 9l-1.9 7.5M9 6.2h3.4l1.2 2.8" />
  </svg>
);
const IcPin = (p: IcProps) => <S {...p} d="M12 21.5S5 15.8 5 10a7 7 0 0 1 14 0c0 5.8-7 11.5-7 11.5Zm0-8.9a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z" />;
const IcCar = (p: IcProps) => (
  <svg className={p.className ?? "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 16.5H2.8V13l2.3-5A1.6 1.6 0 0 1 6.6 7h10.8a1.6 1.6 0 0 1 1.5 1l2.3 5v3.5H19" />
    <circle cx="7.3" cy="16.5" r="1.9" />
    <circle cx="16.7" cy="16.5" r="1.9" />
    <path d="M9.4 16.5h5.2M4.5 12.5h15" />
  </svg>
);

/* ================= كشف عند التمرير ================= */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("on"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            (en.target as HTMLElement).classList.add("on");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ================= نسخ للحافظة ================= */
function CopyChip({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {});
        setOk(true);
        setTimeout(() => setOk(false), 1600);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-seafoam/90 hover:border-mint/50 hover:bg-mint/10 transition-colors"
      title="نسخ المسار"
    >
      {ok ? <IcCheck className="w-3.5 h-3.5 text-mint" /> : <IcCopy className="w-3.5 h-3.5" />}
      <span dir="ltr" className="font-mono">{text}</span>
    </button>
  );
}

/* ================= بيانات الملفات ================= */
const FILES = [
  {
    icon: IcCode,
    name: "index.html",
    kind: "ملف المتجر الكامل — الجديد",
    path: "جذر المستودع (يستبدل القديم)",
    href: "/store/index.html",
    dl: "index.html",
    desc: "كل المتجر بملف واحد: الواجهة الزجاجية، الأيقونات، الهيدر المتحرك — وكود الطلبات والإشعارات كما هو حرفياً.",
    hot: true,
  },
  {
    icon: IcImage,
    name: "Images/hero-2.jpg",
    kind: "صورة الهيدر ١ — المنتجات",
    path: "مجلد Images",
    href: "/store/Images/hero-2.jpg",
    dl: "hero-2.jpg",
    desc: "زيت زيتون وصابون غار ومؤونة بلدية — توحي بمنتجات المتجر السورية.",
  },
  {
    icon: IcImage,
    name: "Images/hero-3.jpg",
    kind: "صورة الهيدر ٢ — العدة والبناء",
    path: "مجلد Images",
    href: "/store/Images/hero-3.jpg",
    dl: "hero-3.jpg",
    desc: "دهانات وعدد وأدوات بناء — القسم الثاني من بضاعة المتجر.",
  },
  {
    icon: IcBag,
    name: "apple-touch-icon.png",
    kind: "أيقونة المتجر — آيفون",
    path: "جذر المستودع (استبدال)",
    href: "/store/apple-touch-icon.png",
    dl: "apple-touch-icon.png",
    desc: "شعار المتجر الجديد: كيس تسوق برتقالي على زجاج أخضر زمردي.",
  },
  {
    icon: IcBag,
    name: "icon-192.png",
    kind: "أيقونة المتجر — 192px",
    path: "جذر المستودع (استبدال)",
    href: "/store/icon-192.png",
    dl: "icon-192.png",
    desc: "يستخدمها manifest.webmanifest (الملف نفسه بدون تغيير).",
  },
  {
    icon: IcBag,
    name: "icon-512.png",
    kind: "أيقونة المتجر — 512px",
    path: "جذر المستودع (استبدال)",
    href: "/store/icon-512.png",
    dl: "icon-512.png",
    desc: "الأيقونة الكبيرة + تظهر في معاينة المشاركة og:image.",
  },
];

const STEPS = [
  {
    t: "حمّل الحزمة",
    d: "نزّل ملف ZIP كاملاً من الأعلى وفك الضغط عنه، أو حمّل الملفات واحدة واحدة من قسم «الملفات».",
  },
  {
    t: "احتفظ بنسخة احتياطية",
    d: "من مستودعك على GitHub، اضغط على index.html القديم ثم Raw واحفظه عندك. إذا حبيت ترجع عن التحديث لأي سبب، ارفع الملف القديم من جديد وانتهى.",
  },
  {
    t: "استبدل index.html",
    d: "ادخل إلى مستودع Muhammadfx331/store ← Add file ← Upload files ← اسحب index.html الجديد ← اختر «Replace» عند التعارض ← Commit changes.",
  },
  {
    t: "ارفع صور الهيدر",
    d: "ادخل إلى مجلد Images داخل المستودع ← Add file ← Upload files ← ارفع hero-2.jpg و hero-3.jpg (إذا رافع الصور القديمة، اترك hero-1.jpg بدون ما تستخدم — ما عاد لها داعي) ← Commit.",
  },
  {
    t: "استبدل الأيقونات",
    d: "في جذر المستودع ارفع apple-touch-icon.png و icon-192.png و icon-512.png واختر استبدال الملفات القديمة.",
  },
  {
    t: "انتظر دقيقة وجرّب",
    d: "GitHub Pages بيحدّث خلال 1–2 دقيقة. افتح المتجر: اطلب منتجاً وتأكد أن الطلب وصل إلى Google Sheet، وفعّل الإشعارات وتأكد أن OneSignal يعمل كالمعتاد.",
  },
];

const KEPT = [
  { icon: IcSheet, t: "إرسال الطلبات إلى Google Sheets", d: "نفس SHEET_URL ونفس بنية البيانات (order, name, phone, city, address, pay, items…) — لم يتغير حرف واحد." },
  { icon: IcBell, t: "إشعارات OneSignal للزبون", d: "نفس ONESIGNAL_APP_ID ومسار service worker (push/onesignal) وتحميل SDK — بدون أي تعديل." },
  { icon: IcCode, t: "كل معرفات العناصر (IDs)", d: "أكثر من 150 معرفاً يستخدمها الكود بقيت كما هي — السلة، الطلبات، التتبع، ملفات المهن، كلها تعمل." },
  { icon: IcLayers, t: "sw.js و manifest.webmanifest", d: "تثبيت التطبيق على الجوال يعمل كما كان — فقط صور الأيقونات تجددت بأسماء الملفات نفسها." },
];

const CHANGED = [
  { icon: IcSpark, t: "87 إيموجي → أيقونات SVG", d: "كل الإيموجي بالمتجر صارت أيقونات مرسومة بخط موحّد — وحتى الإيموجي اللي بتضيفو بعمود emoji في Google Sheet بيتحول تلقائياً." },
  { icon: IcMonitor, t: "هيدر متحرك بصور المتجر", d: "سلايدر صورتين (منتجات المؤونة وعدة البناء) بحركة Ken Burns بطيئة مع نقاط تنقّل — وأزيلت صورة رجل التوصيل والأيقونات القديمة ومؤشر الكتابة من الأعلى." },
  { icon: IcBike, t: "قافلة توصيل: دراجة ووراها شاحنة", d: "مندوب على دراجة يعبر الهيدر بعجلات تدور ومساعدات تقفز وخطوط سرعة وغبار — وبعده بـ 5 ثواني تطلع شاحنة توصيل شايلة لوقو المتجر على صندوقها بنفس الحركة، بدورة متكررة ما تخلص." },
  { icon: IcPin, t: "خريطة الحسكة المتحركة", d: "تحت الهيدر مباشرة: خريطة المحافظة ترسم نفسها ومدنها تنبض واحدة ورا التانية بأسهم توصيل متدفقة — والدراجة والشاحنة تتنقلان بين المدن واحدة واحدة (توقف عند كل مدينة)، وأسماء المدن تنقلب تلقائياً كل 3.6 ثانية بين العربية والكورمانجية (Qamişlo، Dêrik، Dirbêsiyê…). وعلى الموبايل الخريطة بتظهر كاملة بلا تمرير." },
  { icon: IcCode, t: "خانات أكمل لنشر المنتجات", d: "صاحب المحل صار ينشر منتجاته مع تصنيفها (اختيار من أقسام المتجر أو كتابة قسم جديد) وحتى 6 صور بدل 3 — بنفس نافذة المراجعة ورمز التعديل، والترجمة Kurdî شاملة." },
  { icon: IcBag, t: "لوقو المتجر بحركات تركيبية", d: "الشعار يطفو ويتوهج بنبض برتقالي، الكيس يتمايل يميناً ويساراً، والشرارة تومض وتدور — وعند المرور فوقه يسرع رقصه." },
  { icon: IcCar, t: "نشر السيارات والدراجات النارية", d: "زر «أضف مركبة للبيع» بقسم المركبات: أصحاب المحلات ينشرون سيارة أو دراجة بكامل التفاصيل (موديل، سنة، حالة، سعر، كيلومتراج، مدينة، وصف) وحتى 10 صور — بنفس آلية المنتجات: مراجعة + تحقق برمز التعديل + ترجمة Kurdî كاملة." },
  { icon: IcPhone, t: "إصلاح الشريط العلوي للجوال", d: "على الشاشات الضيقة (320–430px) اسم «متجري» صار ياخد سطر كامل فوق والأزرار تحتو — لا قصّ ولا تداخل بأي مقاس." },
  { icon: IcType, t: "خطوط عربية وكورمانجية", d: "Noto Kufi Arabic للعناوين، IBM Plex Sans Arabic للنصوص، و Space Grotesk للعناوين اللاتينية عند التبديل إلى Kurdî." },
  { icon: IcLayers, t: "زجاج أعمق وأزرار أغنى", d: "طبقات زجاجية بتوهج داخلي، أزرار بتدرج ولمعان دوري، خانات بتوهج عند التركيز، وبطاقات ترتفع عند المرور." },
  { icon: IcEye, t: "حركات كشف وتتابع", d: "العناصر تظهر بتتابع ناعم عند التمرير، شارة الإشعارات تنبض، والنوافذ تفتح بحركة نابضية — وتتوقف تلقائياً لمن يفضّل تقليل الحركة." },
  { icon: IcBag, t: "شعار وأيقونة متجر جديدة", d: "كيس تسوق برتقالي مع شرارة على زجاج زمردي — في الهيدر وفي أيقونة التطبيق ومعاينة المشاركة." },
];

/* ================= التطبيق ================= */
export default function App() {
  useReveal();
  const [device, setDevice] = useState<"desk" | "mob">("desk");
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen">
      <div className="ambient" />
      <div className="grain" />

      {/* ---------- الشريط العلوي ---------- */}
      <header className="sticky top-0 z-50 border-b border-white/8 bg-deep/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <span className="app-mark grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber to-flame text-deep shadow-lg shadow-amber/25">
            <svg className="w-5.5 h-5.5 overflow-visible" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <g className="bm-bag">
                <path d="M5.5 8.2h13l-1.1 12a1.4 1.4 0 0 1-1.4 1.3H8a1.4 1.4 0 0 1-1.4-1.3Z" />
                <path d="M9 10.6V6.6a3 3 0 0 1 6 0v4" />
              </g>
              <path className="bm-spark" d="m17.6 3.2.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2Z" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <div className="flex-1 leading-tight">
            <p className="font-display font-800 text-[15px]">متجري <span className="text-mint">·</span> حزمة الواجهة الجديدة</p>
            <p className="text-[11px] text-sand" dir="ltr">Pakêta nû ya rûkarê — Firoşgeha min</p>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-[13px] text-seafoam/85">
            <a href="#preview" className="hover:text-gold transition-colors">المعاينة</a>
            <a href="#files" className="hover:text-gold transition-colors">الملفات</a>
            <a href="#steps" className="hover:text-gold transition-colors">الخطوات</a>
          </nav>
          <a
            href="/store/index.html"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-xl border border-mint/35 bg-mint/10 px-3.5 py-2 text-[13px] font-semibold text-mint hover:bg-mint/20 hover:border-mint/60 transition-colors"
          >
            افتح المتجر الجديد <IcExt className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* ---------- الافتتاحية + المعاينة ---------- */}
      <section id="preview" className="relative mx-auto max-w-6xl px-4 pt-14 pb-20 md:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <p className="rv mb-5 inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/8 px-4 py-1.5 text-[12.5px] text-seafoam">
              <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-mint" />
              تسليم جاهز للرفع على GitHub — بدون أي تغيير على الطلبات والإشعارات
            </p>
            <h1 className="font-display text-[clamp(2.1rem,5.4vw,3.5rem)] font-900 leading-[1.28] text-paper">
              <span className="line-mask" style={{ "--d": "0.05s" } as React.CSSProperties}>
                <span>متجرك نفسه…</span>
              </span>
              <span className="line-mask" style={{ "--d": "0.18s" } as React.CSSProperties}>
                <span>
                  بواجهة <em className="not-italic text-amber">زجاجية</em> تتنفّس
                </span>
              </span>
            </h1>
            <p className="rv mt-5 max-w-xl text-[15.5px] leading-8 text-seafoam/90" style={{ "--d": "0.3s" } as React.CSSProperties}>
              طوّرنا الشكل فقط: أيقونات SVG بدل كل الإيموجي، هيدر متحرك بصور توحي لشغل المتجر، خطوط عربية وكورمانجية (Kurdî)،
              وأزرار وخانات بزجاج مصقول — بينما كود <b className="text-gold">Google Sheets</b> و<b className="text-gold">OneSignal</b> بقي كما هو حرفياً.
            </p>

            <div className="rv mt-7 flex flex-wrap items-center gap-3" style={{ "--d": "0.4s" } as React.CSSProperties}>
              <a
                href="/store-package.zip"
                download="store-package.zip"
                className="sheen inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-b from-[#f7a055] via-amber to-flame px-6 py-3.5 font-display font-800 text-[15px] text-deep shadow-xl shadow-amber/30 hover:shadow-amber/45 hover:-translate-y-0.5 transition-all"
              >
                <IcZip className="w-5 h-5" />
                حمّل الحزمة كاملة (ZIP)
              </a>
              <a
                href="/store/index.html"
                download="index.html"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 text-[14px] font-semibold text-paper hover:border-mint/50 hover:bg-mint/10 hover:-translate-y-0.5 transition-all"
              >
                <IcDown className="w-4.5 h-4.5" />
                index.html فقط
              </a>
            </div>

            {/* لوحة الحالة */}
            <div className="rv mt-9 divide-y divide-white/8 rounded-2xl border border-white/10 bg-white/4 backdrop-blur-md" style={{ "--d": "0.5s" } as React.CSSProperties}>
              {[
                { icon: IcSheet, label: "الطلبات", target: "Google Sheets", state: "بدون تغيير", cls: "text-mint border-mint/40 bg-mint/10" },
                { icon: IcBell, label: "الإشعارات", target: "OneSignal", state: "بدون تغيير", cls: "text-mint border-mint/40 bg-mint/10" },
                { icon: IcSpark, label: "الواجهة", target: "HTML + CSS + Icons", state: "تجديد كامل", cls: "text-amber border-amber/40 bg-amber/10" },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-3.5 px-4.5 py-3.5">
                  <span className={`grid h-9 w-9 place-items-center rounded-lg border ${r.cls}`}>
                    <r.icon className="w-4.5 h-4.5" />
                  </span>
                  <div className="flex-1 leading-tight">
                    <p className="text-[14px] font-semibold text-paper">{r.label}</p>
                    <p className="text-[11.5px] text-sand" dir="ltr">{r.target}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-[11.5px] font-bold ${r.cls}`}>{r.state}</span>
                </div>
              ))}
            </div>
          </div>

          {/* إطار المعاينة */}
          <div ref={previewRef} className="rv relative" style={{ "--d": "0.25s" } as React.CSSProperties}>
            <div className="preview-glow" />
            <div className={`device-frame relative mx-auto w-full ${device === "mob" ? "max-w-[390px]" : "max-w-full"}`}>
              <div className="overflow-hidden rounded-[22px] border border-white/12 bg-pine shadow-2xl shadow-black/50">
                <div className="flex items-center gap-2 border-b border-white/8 bg-deep/70 px-4 py-2.5" dir="ltr">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="mx-auto flex items-center gap-1.5 rounded-md bg-white/6 px-3 py-1 text-[10.5px] text-sand">
                    muhammadfx331.github.io/store
                  </span>
                  <span className="flex gap-1">
                    <button
                      onClick={() => setDevice("desk")}
                      aria-label="معاينة سطح المكتب"
                      className={`grid h-6.5 w-6.5 place-items-center rounded-md transition-colors ${device === "desk" ? "bg-mint/20 text-mint" : "text-sand hover:text-paper"}`}
                    >
                      <IcMonitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDevice("mob")}
                      aria-label="معاينة الجوال"
                      className={`grid h-6.5 w-6.5 place-items-center rounded-md transition-colors ${device === "mob" ? "bg-mint/20 text-mint" : "text-sand hover:text-paper"}`}
                    >
                      <IcPhone className="w-4 h-4" />
                    </button>
                  </span>
                </div>
                <iframe
                  src="/store/index.html"
                  title="معاينة المتجر الجديد"
                  className="block w-full border-0 bg-[#eef4f1]"
                  style={{ height: device === "mob" ? 680 : 600 }}
                />
              </div>

              {/* ملصقات عائمة */}
              <span className="floaty absolute -right-3 -top-4 hidden rounded-xl border border-amber/40 bg-deep/90 px-3 py-1.5 text-[11.5px] font-bold text-gold shadow-lg backdrop-blur md:block">
                سلايدر + قافلة توصيل + خريطة
              </span>
              <span className="floaty-slow absolute -left-3 top-24 hidden rounded-xl border border-mint/40 bg-deep/90 px-3 py-1.5 text-[11.5px] font-bold text-mint shadow-lg backdrop-blur md:block">
                شعار متحرك · 87 أيقونة SVG
              </span>
              <span className="floaty absolute -bottom-4 right-10 hidden rounded-xl border border-white/15 bg-deep/90 px-3 py-1.5 text-[11.5px] font-bold text-seafoam shadow-lg backdrop-blur md:block" dir="ltr">
                Kurdî · عربي
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- ما تجدد / ما بقي ---------- */}
      <section className="border-y border-white/8 bg-pine/40 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rv mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[13px] font-bold text-amber">Çi guherî · ماذا تغيّر</p>
              <h2 className="font-display text-3xl font-900 text-paper md:text-4xl">الواجهة تجددت… والمنطق untouched</h2>
            </div>
            <p className="hidden max-w-xs text-[13px] leading-6 text-sand md:block">
              تحقق آلي في بيئة اختبار: إضافة للسلة، طلب، تبديل Kurdî، وعرض منتجات الجدول — كلها تعمل بدون أخطاء.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* تجدد */}
            <div className="rv rounded-3xl border border-amber/25 bg-gradient-to-b from-amber/8 to-transparent p-6 md:p-7">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-3.5 py-1 text-[12px] font-bold text-gold">
                <IcSpark className="w-3.5 h-3.5" /> تجديد كامل
              </p>
              <ul className="space-y-4.5">
                {CHANGED.map((c) => (
                  <li key={c.t} className="flex gap-3.5">
                    <span className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl border border-amber/35 bg-amber/10 text-amber">
                      <c.icon className="w-4.5 h-4.5" />
                    </span>
                    <div>
                      <p className="text-[15px] font-bold text-paper">{c.t}</p>
                      <p className="mt-0.5 text-[13px] leading-6.5 text-seafoam/85">{c.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* بقي */}
            <div className="rv rounded-3xl border border-mint/25 bg-gradient-to-b from-mint/8 to-transparent p-6 md:p-7" style={{ "--d": "0.12s" } as React.CSSProperties}>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint/10 px-3.5 py-1 text-[12px] font-bold text-mint">
                <IcShield className="w-3.5 h-3.5" /> لم يُمَسّ — مضمون
              </p>
              <ul className="space-y-4.5">
                {KEPT.map((k) => (
                  <li key={k.t} className="flex gap-3.5">
                    <span className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl border border-mint/35 bg-mint/10 text-mint">
                      <k.icon className="w-4.5 h-4.5" />
                    </span>
                    <div>
                      <p className="text-[15px] font-bold text-paper">{k.t}</p>
                      <p className="mt-0.5 text-[13px] leading-6.5 text-seafoam/85">{k.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="codebox-ui mt-5 rounded-2xl border border-white/10 bg-deep/80 p-4 text-seafoam/90">
                <p className="mb-1 text-[10px] uppercase tracking-wider text-sand">نفس الأسطر كما في ملفك القديم</p>
                <p><span className="text-[#7fd1c0]">const</span> SHEET_URL = <span className="text-gold">"https://script.google.com/macros/s/AKfyc…/exec"</span>;</p>
                <p><span className="text-[#7fd1c0]">const</span> ONESIGNAL_APP_ID = <span className="text-gold">"26b0ec9e-2732-44f3-96f7-2b1fdde5652e"</span>;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- الملفات ---------- */}
      <section id="files" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="rv mb-10">
          <p className="mb-2 text-[13px] font-bold text-amber">Pelên pakêtê · ملفات الحزمة</p>
          <h2 className="font-display text-3xl font-900 text-paper md:text-4xl">6 ملفات فقط — حمّلها وارفعها</h2>
          <p className="mt-3 max-w-2xl text-[14px] leading-7 text-seafoam/85">
            لا ملفات إضافية ولا إعدادات جديدة: <span className="text-gold">sw.js</span> و<span className="text-gold">manifest.webmanifest</span> ومجلد{" "}
            <span className="text-gold">push/onesignal</span> و<span className="text-gold">.well-known</span> تبقى كما هي في مستودعك.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FILES.map((f, i) => (
            <div
              key={f.name}
              className={`file-card rv relative flex flex-col rounded-2xl border p-5 ${
                f.hot ? "border-amber/45 bg-gradient-to-b from-amber/12 to-transparent" : "border-white/10 bg-white/4"
              }`}
              style={{ "--d": `${(i % 3) * 0.08}s` } as React.CSSProperties}
            >
              {f.hot && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-gradient-to-l from-amber to-flame px-3 py-0.5 text-[10.5px] font-black text-deep shadow-md">
                  الأهم
                </span>
              )}
              <div className="mb-3 flex items-center gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-xl border ${f.hot ? "border-amber/40 bg-amber/15 text-amber" : "border-mint/30 bg-mint/10 text-mint"}`}>
                  <f.icon className="w-5 h-5" />
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="truncate font-mono text-[13px] font-bold text-paper" dir="ltr">{f.name}</p>
                  <p className="text-[11.5px] text-sand">{f.kind}</p>
                </div>
              </div>
              <p className="mb-4 flex-1 text-[12.5px] leading-6 text-seafoam/85">{f.desc}</p>
              <div className="flex items-center justify-between gap-2">
                <CopyChip text={f.name} />
                <a
                  href={f.href}
                  download={f.dl}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12.5px] font-bold transition-all hover:-translate-y-0.5 ${
                    f.hot
                      ? "bg-gradient-to-b from-[#f7a055] to-flame text-deep shadow-lg shadow-amber/30"
                      : "border border-white/15 bg-white/6 text-paper hover:border-mint/50 hover:bg-mint/10"
                  }`}
                >
                  <IcDown className="w-4 h-4" /> تحميل
                </a>
              </div>
            </div>
          ))}

          {/* بطاقة ZIP */}
          <div className="file-card rv relative flex flex-col justify-between overflow-hidden rounded-2xl border border-mint/40 bg-gradient-to-br from-moss/70 to-pine p-5 sm:col-span-2 lg:col-span-3" style={{ "--d": "0.15s" } as React.CSSProperties}>
            <div className="flex flex-wrap items-center gap-5">
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-mint/40 bg-mint/15 text-mint">
                <IcZip className="w-7 h-7" />
              </span>
              <div className="min-w-52 flex-1">
                <p className="font-display text-lg font-800 text-paper">store-package.zip — كل شيء دفعة واحدة</p>
                <p className="mt-1 text-[13px] leading-6 text-seafoam/85">
                  يحوي index.html + صورتي الهيدر + الأيقونات الثلاث بهيكل المجلدات الصحيح. فكه وارفع محتوياته كما هي.
                </p>
              </div>
              <a
                href="/store-package.zip"
                download="store-package.zip"
                className="sheen inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-mint to-[#2e8b7b] px-6 py-3.5 font-display font-800 text-[14.5px] text-deep shadow-xl shadow-mint/25 hover:-translate-y-0.5 transition-all"
              >
                <IcDown className="w-5 h-5" /> تحميل ZIP (1.0 MB)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- الخطوات ---------- */}
      <section id="steps" className="border-y border-white/8 bg-pine/40 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rv mb-12 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[13px] font-bold text-amber">Gav bi gav · خطوة بخطوة</p>
              <h2 className="font-display text-3xl font-900 text-paper md:text-4xl">طبّقها على GitHub خلال دقائق</h2>
            </div>
            <a
              href="https://github.com/Muhammadfx331/store"
              target="_blank"
              rel="noopener"
              className="hidden items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-[13px] font-semibold text-paper hover:border-mint/50 hover:bg-mint/10 transition-colors md:inline-flex"
            >
              <IcGitHub className="w-4.5 h-4.5" /> Muhammadfx331/store
            </a>
          </div>

          <ol className="relative space-y-6 before:absolute before:inset-y-2 before:right-[22px] before:w-px before:bg-gradient-to-b before:from-mint/50 before:via-amber/40 before:to-transparent">
            {STEPS.map((st, i) => (
              <li key={st.t} className="rv relative flex gap-5 pr-0" style={{ "--d": `${i * 0.06}s` } as React.CSSProperties}>
                <span className="relative z-10 grid h-11 w-11 flex-none place-items-center rounded-2xl border border-mint/40 bg-deep font-display text-[15px] font-900 text-mint shadow-lg shadow-black/30">
                  {i + 1}
                </span>
                <div className="flex-1 rounded-2xl border border-white/10 bg-white/4 p-5 transition-colors hover:border-mint/35">
                  <p className="font-display text-[16px] font-800 text-paper">{st.t}</p>
                  <p className="mt-1.5 text-[13.5px] leading-7 text-seafoam/85">{st.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="rv mt-10 flex gap-4 rounded-2xl border border-amber/35 bg-amber/8 p-5" style={{ "--d": "0.2s" } as React.CSSProperties}>
            <span className="grid h-10 w-10 flex-none place-items-center rounded-xl border border-amber/40 bg-amber/15 text-amber">
              <IcWarn className="w-5 h-5" />
            </span>
            <p className="text-[13.5px] leading-7 text-gold/95">
              <b>نصيحة:</b> خذ نسخة من index.html القديم قبل الاستبدال. وإذا لاحظت أي شيء، ارفع القديم مكانه مباشرة ويرجع كل شيء كما كان —
              ملفات sw.js و manifest و OneSignal لم تُعدَّل أصلاً.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- ملاحظات تقنية ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="rv mb-10">
          <p className="mb-2 text-[13px] font-bold text-amber">Têbînî · ملاحظات</p>
          <h2 className="font-display text-3xl font-900 text-paper md:text-4xl">تفاصيل تسوى تعرفها</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              icon: IcSheet,
              t: "الإيموجي في Google Sheet",
              d: "عمود emoji في جدولك يستمر بالعمل: أكثر من 50 إيموجي شائعة (صنبور، مطرقة، دهان، عربة تسوق، محل…) تتحول تلقائياً إلى أيقونة SVG بنفس اللون والحجم، وأي إيموجي غير معروف يبقى كما هو — لن ينكسر شيء.",
            },
            {
              icon: IcType,
              t: "الخطوط واللغتان",
              d: "عند التبديل إلى Kurdî تظهر العناوين اللاتينية بخط Space Grotesk (يدعم ê î û ç ş)، والنصوص بخط IBM Plex Sans Arabic — والعربية كلها بخط Noto Kufi Arabic المميز.",
            },
            {
              icon: IcEye,
              t: "الحركة تحترم الزبون",
              d: "وضع «lite» الأصلي محفوظ: من يفعّل تقليل الحركة في جهازه يحصل على واجهة هادئة بدون سلايدر أو كشف متتابع — نفس منطق ملفك القديم.",
            },
            {
              icon: IcCode,
              t: "أماكن الإعدادات لم تتغير",
              d: "SHEET_URL و ONESIGNAL_APP_ID و SHEET_PRODUCTS في أعلى السكربت الرئيسي بنفس المواضع — إذا بدّلت رابط الجدول أو معرف OneSignal يوماً، تعدّله بنفس الطريقة القديمة.",
            },
          ].map((n, i) => (
            <div key={n.t} className="rv file-card rounded-2xl border border-white/10 bg-white/4 p-5.5" style={{ "--d": `${(i % 2) * 0.08}s` } as React.CSSProperties}>
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-mint/30 bg-mint/10 text-mint">
                  <n.icon className="w-5 h-5" />
                </span>
                <p className="font-display text-[15.5px] font-800 text-paper">{n.t}</p>
              </div>
              <p className="text-[13px] leading-7 text-seafoam/85">{n.d}</p>
            </div>
          ))}

          {/* ملاحظة جانب الجدول */}
          <div className="rv mt-4 rounded-2xl border border-gold/35 bg-gradient-to-b from-gold/10 to-transparent p-5.5 md:p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-gold/40 bg-gold/15 text-gold">
                <IcSheet className="w-5 h-5" />
              </span>
              <p className="font-display text-[15.5px] font-800 text-paper">خطوة واحدة صغيرة على Google Sheet (لنشر المركبات)</p>
            </div>
            <p className="text-[13px] leading-7 text-seafoam/85">
              الواجهة ترسل طلبات نشر المركبات إلى <b className="text-gold">نفس رابط SHEET_URL</b> القديم بأكشن جديد اسمه{" "}
              <span dir="ltr" className="font-mono text-gold">addveh</span> — تماماً مثل <span dir="ltr" className="font-mono">addprod</span> الخاص بالمنتجات.
              أضف في سكربت Apps Script معالجة للأكشن الجديد (نسخ طريقة addprod نفسها: حفظ الطلب للمراجعة، وبعد الموافقة إضافة سطر لتبويب «المركبات»).
            </p>
            <div className="codebox-ui mt-4 rounded-2xl border border-white/10 bg-deep/80 p-4 text-seafoam/90">
              <p className="mb-1 text-[10px] uppercase tracking-wider text-sand">شكل الطلب اللي بيوصل لسكربتك</p>
              <p>{"{"} action: <span className="text-gold">"addveh"</span>, phone, code, type: <span className="text-gold">"car"|"bike"</span>, name, year, price,</p>
              <p>&nbsp;&nbsp;cond: <span className="text-gold">"new"|"used"</span>, km, city, desc, photos: [ …حتى 10 صور… ] {"}"}</p>
              <p className="mt-2 mb-1 text-[10px] uppercase tracking-wider text-sand">أعمدة تبويب «المركبات» (كما يقرأها المتجر)</p>
              <p>name · type · cond · year · price · km · city · phone · wa · desc · dealer · images</p>
            </div>
            <p className="mt-3 text-[12.5px] leading-6 text-sand">
              ملاحظة: الطلبات والإشعارات ما بتتأثر إطلاقاً — addveh إضافة جديدة بالكامل، وإذا سكربتك بعد ما يعرف الأكشن بيرجع خطأ، الزبون بيشوف رسالة خطأ واضحة وما بيضيع شيء.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- الفوتر ---------- */}
      <footer className="border-t border-white/8 bg-deep/80 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 text-center">
          <span className="app-mark grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber to-flame text-deep shadow-lg shadow-amber/25">
            <svg className="w-6 h-6 overflow-visible" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <g className="bm-bag">
                <path d="M5.5 8.2h13l-1.1 12a1.4 1.4 0 0 1-1.4 1.3H8a1.4 1.4 0 0 1-1.4-1.3Z" />
                <path d="M9 10.6V6.6a3 3 0 0 1 6 0v4" />
              </g>
              <path className="bm-spark" d="m17.6 3.2.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2Z" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <p className="font-display text-lg font-800 text-paper">
            متجري — الدرباسية · قامشلو · عامودا · ديرك
          </p>
          <p className="max-w-xl text-[13px] leading-7 text-sand">
            حزمة تطوير الواجهة: ملف HTML واحد يستبدل القديم + 3 صور هيدر + 3 أيقونات.
            الطلبات إلى Google Sheet والإشعارات عبر OneSignal — كما كانت دائماً.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[12.5px]">
            <a href="/store/index.html" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-seafoam hover:border-mint/50 hover:text-mint transition-colors">
              <IcExt className="w-4 h-4" /> معاينة المتجر الجديد
            </a>
            <a href="https://muhammadfx331.github.io/store/" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-seafoam hover:border-mint/50 hover:text-mint transition-colors">
              <IcArrowUp className="w-4 h-4" /> المتجر الحالي على GitHub Pages
            </a>
          </div>
          <p className="text-[11.5px] text-sand/70" dir="ltr">Firoşgeha min — rûkarê nû, heman sîstem</p>
        </div>
      </footer>
    </div>
  );
}
