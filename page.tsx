import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "معاينة — متجري (النسخة المعدّلة)",
  description: "معاينة حيّة لملف المتجر بعد التعديلات الثلاثة.",
};

export default function PreviewPage() {
  return (
    <div className="flex h-[100dvh] flex-col">
      <header className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-[#06110f]/90 px-3 py-2.5 backdrop-blur-xl sm:px-5">
        <Link href="/" className="btn-g inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[12.5px] font-bold text-brand-100/85">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          رجوع للحزمة
        </Link>
        <div className="min-w-0">
          <b className="font-display block text-[13.5px] leading-tight font-extrabold text-white">متجري — النسخة المعدّلة</b>
          <span className="block text-[11px] text-brand-100/50">مفضلة منبثقة · دليل بدون ملف شخصي · زر «ملفي» شغّال</span>
        </div>
        <div className="ms-auto flex flex-wrap items-center gap-2">
          <span className="hidden rounded-full border border-brand-400/30 bg-brand-400/10 px-3 py-1.5 text-[11px] font-bold text-brand-200 sm:inline">
            الطلبات والإشعارات بدون تغيير
          </span>
          <a href="/mystore/index.html" target="_blank" rel="noopener noreferrer" className="btn-p rounded-xl px-3.5 py-2 text-[12.5px] font-bold">
            افتح بصفحة كاملة
          </a>
        </div>
      </header>

      <div className="min-h-0 flex-1 bg-[#0a1a17]">
        <iframe
          src="/mystore/index.html"
          title="متجر متجري — النسخة المعدّلة"
          className="h-full w-full border-0"
          allow="notifications; clipboard-write"
        />
      </div>

      <footer className="border-t border-white/10 bg-[#06110f]/90 px-4 py-2 text-center text-[11.5px] text-brand-100/45">
        هاي النسخة شغّالة من مجلد <span dir="ltr" className="font-mono">public/mystore/</span> — نفس الملف يلي بتنزّلو وترفعو على GitHub.
        الصور والأيقونات وmanifest وsw.js منصوبة جنبو حتى تكون المعاينة مطابقة.
      </footer>
    </div>
  );
}
