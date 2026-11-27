import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "متجري — حزمة التحديث ٣ (المفضلة، الدليل، المركبات)",
  description:
    "ثلاثة تعديلات على متجر متجري: المفضلة صارت نافذة منبثقة، الدليل بدون زر ملف شخصي مع تفعيل زر «ملفي»، وإصلاح خطأ نشر المركبات بالصور. الطلبات والإشعارات ما تمسّت.",
  openGraph: {
    title: "متجري — حزمة التحديث ٣",
    description: "المفضلة كنافذة منبثقة + دليل بدون ملف شخصي + إصلاح نشر المركبات.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#06110f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen antialiased">
        {/* React 19 بيرفع هالوسوم لـ <head> لحالها */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <div className="mesh" aria-hidden="true" />
        <div
          className="orb"
          aria-hidden="true"
          style={{ width: "42vw", height: "42vw", top: "-12vw", insetInlineEnd: "-8vw", background: "radial-gradient(circle,#14655a,transparent 66%)" }}
        />
        <div
          className="orb"
          aria-hidden="true"
          style={{ width: "34vw", height: "34vw", bottom: "-10vw", insetInlineStart: "-6vw", background: "radial-gradient(circle,#b4571d,transparent 68%)", animationDelay: "-9s" }}
        />
        {children}
      </body>
    </html>
  );
}
