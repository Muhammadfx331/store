"use client";

import { useMemo, useState } from "react";

type P = { id: number; n: string; d: string; p: number; bg: string; ic: string };

const ITEMS: P[] = [
  { id: 1, n: "صابون غار حلبي", d: "قطعة 200 غ", p: 3, bg: "#dfeee0", ic: "M4 9h14.5v9.5H4z M8 9V6h6v3" },
  { id: 2, n: "زيت زيتون بكر", d: "عبوة 1 لتر", p: 9, bg: "#e8efcf", ic: "M9 8h6v3l1.5 3v6h-9v-6L9 11z" },
  { id: 3, n: "شاحن سريع 30 واط", d: "مع كبل Type-C", p: 7, bg: "#e3e0f2", ic: "M9 3h6v4H9z M7 7h10v4a5 5 0 0 1-10 0z M12 16v5" },
  { id: 4, n: "دهان بلاستيك أبيض", d: "عبوة 18 لتر", p: 35, bg: "#f0e6f2", ic: "M4 9h11v6H4z M15 11h3l2 3v3h-5z M6 15v4h3" },
];

function Heart({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.6C7.2 16.5 3.6 13.1 3.6 9.4 3.6 6.7 5.7 4.8 8.1 4.8c1.5 0 3 .8 3.9 2 .9-1.2 2.4-2 3.9-2 2.4 0 4.5 1.9 4.5 4.6 0 3.7-3.6 7.1-8.4 11.2Z" />
    </svg>
  );
}

function NavIcon({ k }: { k: string }) {
  const paths: Record<string, string> = {
    home: "M3.5 10.5 12 3.5l8.5 7 M5.5 9v11h13V9 M10 20v-5h4v5",
    heart: "M12 20.6C7.2 16.5 3.6 13.1 3.6 9.4 3.6 6.7 5.7 4.8 8.1 4.8c1.5 0 3 .8 3.9 2 .9-1.2 2.4-2 3.9-2 2.4 0 4.5 1.9 4.5 4.6 0 3.7-3.6 7.1-8.4 11.2Z",
    plus: "M12 3.4a8.6 8.6 0 1 0 0 17.2 8.6 8.6 0 0 0 0-17.2Z M12 8v8 M8 12h8",
    me: "M12 4.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Z M5 20a7 7 0 0 1 14 0",
  };
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[k]} />
    </svg>
  );
}

export function FavDemo() {
  const [favs, setFavs] = useState<number[]>([2]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [sheet, setSheet] = useState(false);
  const [toast, setToast] = useState("");
  const [pop, setPop] = useState<number | null>(null);

  const favItems = useMemo(() => ITEMS.filter((i) => favs.includes(i.id)), [favs]);
  const total = favItems.reduce((a, p) => a + p.p, 0);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 1800);
  };

  const toggle = (id: number) => {
    setPop(id);
    setTimeout(() => setPop(null), 520);
    setFavs((f) => {
      const has = f.includes(id);
      flash(has ? "انشالت من المفضلة" : "انضافت للمفضلة ✓");
      return has ? f.filter((x) => x !== id) : [...f, id];
    });
  };

  const card = (p: P, small = false) => (
    <article
      key={p.id}
      className="relative flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-white/85 shadow-[0_8px_22px_rgba(15,76,69,.12)]"
    >
      <button
        type="button"
        onClick={() => toggle(p.id)}
        aria-label="مفضلة"
        className={
          "absolute top-2 z-10 grid h-8 w-8 place-items-center rounded-full border backdrop-blur transition " +
          (favs.includes(p.id)
            ? "border-rose-200 bg-rose-50 text-rose-500"
            : "border-white/70 bg-white/70 text-[#5d7570] hover:text-rose-500") +
          (pop === p.id ? " pop-heart" : "")
        }
        style={{ insetInlineEnd: 8 }}
      >
        <Heart on={favs.includes(p.id)} />
      </button>
      <div className={"grid place-items-center " + (small ? "aspect-square" : "aspect-[4/3]")} style={{ background: p.bg }}>
        <svg viewBox="0 0 24 24" className={small ? "h-9 w-9" : "h-11 w-11"} style={{ color: "#0f4c45" }} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d={p.ic} />
        </svg>
      </div>
      <div className="flex flex-1 flex-col gap-0.5 p-2.5 text-[#16302c]">
        <h4 className="text-[13px] leading-tight font-bold">{p.n}</h4>
        <small className="text-[11px] text-[#5d7570]">{p.d}</small>
        <div className="mt-auto flex items-center justify-between gap-1 pt-2">
          <span className="text-[13px] font-extrabold text-[#0f4c45]">${p.p}</span>
          <button
            type="button"
            onClick={() => {
              setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + 1 }));
              flash("أضفناه للسلة ✓");
            }}
            className="rounded-lg bg-[#0f4c45] px-2.5 py-1.5 text-[11px] font-bold text-white active:scale-95"
          >
            أضف للسلة
          </button>
        </div>
      </div>
    </article>
  );

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
      <div className="phone shrink-0">
        <div className="phone-screen flex flex-col">
          {/* هيدر المتجر */}
          <div className="flex items-center gap-2 px-3 pt-3 pb-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#0f4c45] text-white">
              <NavIcon k="home" />
            </span>
            <b className="font-display text-sm text-[#0f4c45]">متجري</b>
            <span className="ms-auto rounded-full bg-[#f08a3c] px-2.5 py-1 text-[10px] font-extrabold text-[#2a1500]">
              السلة {cartCount}
            </span>
          </div>

          {/* الشبكة */}
          <div className="flex-1 overflow-hidden px-2.5">
            <div className="grid grid-cols-2 gap-2">{ITEMS.map((p) => card(p))}</div>
          </div>

          {/* الشريط السفلي */}
          <div className="mt-2 grid grid-cols-4 gap-1 border-t border-black/8 bg-white/85 px-2 py-1.5 backdrop-blur">
            {[
              { k: "home", t: "الرئيسية", act: () => setSheet(false) },
              { k: "heart", t: "المفضلة", act: () => setSheet(true) },
              { k: "plus", t: "النشر", act: () => flash("نافذة النشر (بالمتجر)") },
              { k: "me", t: "ملفي", act: () => flash("بيفتح ملفك — مو بالدليل") },
            ].map((b) => (
              <button
                key={b.k}
                type="button"
                onClick={b.act}
                className={
                  "relative flex flex-col items-center gap-0.5 rounded-xl py-1 text-[9.5px] font-bold transition " +
                  ((b.k === "heart" && sheet) || b.k === "home" ? "bg-[#0f4c45]/10 text-[#0f4c45]" : "text-[#5d7570]")
                }
              >
                <NavIcon k={b.k} />
                {b.t}
                {b.k === "heart" && favs.length ? (
                  <i className="absolute -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#f08a3c] px-1 text-[8.5px] font-extrabold text-[#2a1500] not-italic">
                    {favs.length}
                  </i>
                ) : null}
              </button>
            ))}
          </div>

          {/* نافذة المفضلة المنبثقة */}
          {sheet ? (
            <div className="absolute inset-0 z-20 flex items-end" role="dialog" aria-label="المفضلة">
              <button type="button" aria-label="إغلاق" className="absolute inset-0 bg-[#0a1f1c]/40 backdrop-blur-[3px]" onClick={() => setSheet(false)} />
              <div className="sheet-up relative max-h-[86%] w-full overflow-auto rounded-t-3xl border border-white/70 bg-white/95 shadow-[0_-16px_50px_rgba(6,32,28,.35)] backdrop-blur-xl">
                <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-black/8 bg-white/90 px-4 py-3 backdrop-blur">
                  <h4 className="font-display text-[15px] font-extrabold text-[#0f4c45]">المفضلة</h4>
                  {favItems.length ? (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#f08a3c] px-1.5 text-[10px] font-extrabold text-[#2a1500]">
                      {favItems.length}
                    </span>
                  ) : null}
                  <button type="button" onClick={() => setSheet(false)} className="ms-auto rounded-full border border-black/10 px-3 py-1 text-[11px] font-bold text-[#5d7570]">
                    إغلاق
                  </button>
                </div>
                <div className="p-3">
                  {favItems.length ? (
                    <>
                      <p className="mb-2.5 text-[11px] text-[#5d7570]">هاي المنتجات اللي حفظتها بهالجهاز — اضغط القلب لتشيل أي منتج.</p>
                      <div className="grid grid-cols-2 gap-2">{favItems.map((p) => card(p, true))}</div>
                    </>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-[12.5px] text-[#5d7570]">مافي شي بالمفضلة بعد.</p>
                      <p className="mt-1 text-[11px] text-[#8aa19b]">اضغط على القلب بأي منتج لتحفظو هون.</p>
                      <button type="button" onClick={() => setSheet(false)} className="mt-4 w-full rounded-xl bg-[#1b7a4b] py-2.5 text-[12px] font-bold text-white">
                        تسوّق الآن
                      </button>
                    </div>
                  )}
                </div>
                {favItems.length ? (
                  <div className="sticky bottom-0 flex flex-col gap-2 border-t border-black/8 bg-[#f2f6f4]/95 p-3 backdrop-blur">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#5d7570]">قيمة المفضلة</span>
                      <b className="font-display text-[15px] text-[#0f4c45]">${total.toFixed(2)}</b>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCart((c) => {
                            const n = { ...c };
                            favItems.forEach((p) => (n[p.id] = (n[p.id] || 0) + 1));
                            return n;
                          });
                          flash("ضفنا كل المفضلة للسلة ✓");
                        }}
                        className="flex-1 rounded-xl bg-[#1b7a4b] py-2.5 text-[12px] font-bold text-white active:scale-[.98]"
                      >
                        أضف الكل للسلة
                      </button>
                      <button type="button" onClick={() => { setSheet(false); flash("فتحت السلة"); }} className="flex-1 rounded-xl border border-black/12 bg-white py-2.5 text-[12px] font-bold text-[#0f4c45] active:scale-[.98]">
                        افتح السلة
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* توست */}
          {toast ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-20 z-30 flex justify-center px-4">
              <span className="rounded-full border border-white/25 bg-[#0a1f1c]/85 px-4 py-2 text-[11px] font-semibold text-white backdrop-blur">{toast}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-3">
        <h3 className="font-display text-lg font-extrabold text-white">جرّبها هون قبل ما ترفعها</h3>
        <p className="text-sm leading-7 text-brand-100/75">
          هاي محاكاة حيّة لنفس المنطق يلي انحط بالمتجر: القلب بيحفظ المنتج محلياً، وزر <b className="text-flame-400">المفضلة</b> بالشريط السفلي
          ما عاد بيفلتر الشبكة — بيفتح <b className="text-white">نافذة منبثقة</b> فيها المنتجات المحفوظة، عددها، قيمتها الإجمالية، وأزرار
          «أضف الكل للسلة» و«افتح السلة».
        </p>
        <ul className="space-y-2 text-[13px] text-brand-100/70">
          {[
            "الحذف من قلب النافذة بيعيد رسمها فوراً (نفس مستمع الشريط السفلي الأصلي، بدون ما نلمسو).",
            "بطاقة المنتج كاملة: الصورة المنزلقة، السعر، الخصم، التقييم، اسم المحل، وأضف للسلة.",
            "الضغط على المنتج بيفتح صفحة المنتج، وعلى اسم المحل بيفتح صفحة المحل — متل الشبكة تماماً.",
            "حالة فارغة مع زر «تسوّق الآن»، وترجمة كردية لكل النصوص الجديدة عبر addKU.",
          ].map((x) => (
            <li key={x} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-flame-400" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
