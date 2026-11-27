"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/** بيضيف صفة الظهور لعناصر .rv عند التمرير — نفس فكرة المتجر */
export function Reveal() {
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
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
  return null;
}

/** زر نسخ للحافظة */
export function CopyButton({ text, label = "نسخ" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand("copy");
          } catch {
            /* تجاهل */
          }
          ta.remove();
        }
        setOk(true);
        setTimeout(() => setOk(false), 1800);
      }}
      className="btn-g inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-brand-100"
    >
      {ok ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand-300" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m4.5 12.5 5 5 10-11" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 8V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-3M4 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1Z" />
        </svg>
      )}
      {ok ? "اننسخ ✓" : label}
    </button>
  );
}

/** زر تنزيل: بيسجّل العملية بقاعدة البيانات ثم بيبلّش التنزيل */
export function DownloadButton({
  href,
  file,
  children,
  primary = false,
  initialCount,
  onCount,
}: {
  href: string;
  file: string;
  children: ReactNode;
  primary?: boolean;
  initialCount?: number;
  onCount?: (n: number) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [n, setN] = useState(initialCount ?? 0);
  const started = useRef(false);

  const go = () => {
    if (!started.current) {
      started.current = true;
      const a = document.createElement("a");
      a.href = href;
      a.download = file;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        go();
        if (onCount || initialCount !== undefined) {
          setBusy(true);
          try {
            const r = await fetch("/api/download", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ file }),
            });
            const d = (await r.json()) as { ok?: boolean; count?: number };
            if (d.ok && typeof d.count === "number") {
              setN(d.count);
              onCount?.(d.count);
            }
          } catch {
            setN((v) => v + 1);
          } finally {
            setBusy(false);
          }
        }
      }}
      className={
        (primary ? "btn-p " : "btn-g ") +
        "inline-flex items-center justify-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-bold disabled:opacity-70"
      }
    >
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M4.5 19.5h15" />
      </svg>
      {children}
      {n > 0 ? <span className="rounded-full bg-black/20 px-2 py-0.5 text-[11px] tabular-nums">{n}</span> : null}
    </button>
  );
}
