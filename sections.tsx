"use client";

import { useState } from "react";
import { CopyButton, DownloadButton } from "@/components/ui";

/* ---------------- قائمة خطوات الرفع (محفوظة بالسيرفر) ---------------- */

export type Step = { key: string; title: string; body: string };

export function Checklist({ steps, initialDone }: { steps: Step[]; initialDone: string[] }) {
  const [done, setDone] = useState<Record<string, boolean>>(
    Object.fromEntries(steps.map((s) => [s.key, initialDone.includes(s.key)])),
  );
  const [busy, setBusy] = useState<string | null>(null);

  const count = Object.values(done).filter(Boolean).length;
  const pct = Math.round((count / steps.length) * 100);

  const toggle = async (key: string) => {
    const next = !done[key];
    setDone((d) => ({ ...d, [key]: next }));
    setBusy(key);
    try {
      await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, done: next }),
      });
    } catch {
      /* الحالة المحلية بتكفي */
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="glass rounded-3xl p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h3 className="font-display text-xl font-extrabold text-white">خطوات الرفع</h3>
        <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-bold text-brand-100/80 tabular-nums">
          {count}/{steps.length} منفّذة
        </span>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 sm:w-40">
          <div className="h-full rounded-full bg-gradient-to-l from-flame-500 to-brand-400 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <ol className="space-y-2.5">
        {steps.map((s, i) => {
          const on = !!done[s.key];
          return (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => toggle(s.key)}
                disabled={busy === s.key}
                className={
                  "flex w-full items-start gap-3 rounded-2xl border p-3.5 text-start transition disabled:opacity-60 " +
                  (on ? "border-brand-400/40 bg-brand-400/10" : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]")
                }
              >
                <span
                  className={
                    "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-extrabold " +
                    (on ? "border-brand-300 bg-brand-400 text-brand-950" : "border-white/25 text-brand-100/70")
                  }
                >
                  {on ? (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m4.5 12.5 5 5 10-11" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="min-w-0">
                  <b className={"block text-sm font-bold " + (on ? "text-brand-200 line-through decoration-brand-400/60" : "text-white")}>{s.title}</b>
                  <span className="mt-1 block text-[13px] leading-6 text-brand-100/65">{s.body}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-[12px] text-brand-100/45">
        الحالة بتنحفظ بقاعدة بيانات هالموقع (جدول <span dir="ltr" className="font-mono">checklist</span>) — إذا رجعت للصفحة بتلاقيها متل ما هي.
      </p>
    </div>
  );
}

/* ---------------- عارض كود Apps Script ---------------- */

export function CodeBlock({ code, filename }: { code: string; filename: string }) {
  const lines = code.split("\n").length;
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <b dir="ltr" className="font-mono text-xs text-brand-100/80">
          {filename}
        </b>
        <span className="rounded-full bg-white/6 px-2 py-0.5 text-[11px] text-brand-100/55 tabular-nums">{lines} سطر</span>
        <div className="ms-auto flex gap-2">
          <CopyButton text={code} label="نسخ السكربت كامل" />
          <DownloadButton href={`/mystore/${filename}`} file={filename} initialCount={0}>
            تنزيل
          </DownloadButton>
        </div>
      </div>
      <pre className="code-scroll bg-[#04100e]/70 p-4 font-mono text-[12.5px] leading-6 text-brand-100/85">
        <code>{code}</code>
      </pre>
    </div>
  );
}
