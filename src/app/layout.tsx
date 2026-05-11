import type { Metadata } from "next";
// يستورد نوع Metadata من Next.js لتعريف عنوان ووصف الموقع بطريقة صحيحة.

import { Geist, Geist_Mono } from "next/font/google";
// يستورد خطوط Geist الرسمية من Next.js.

import { cookies } from "next/headers";
// يستورد cookies حتى نقرأ لغة الموقع من الكوكيز على السيرفر.

import "./globals.css";
// يستورد ملف التنسيق العام للمشروع.

import SiteHeader from "@/components/site/SiteHeader";
// يستورد الهيدر المشترك الذي أنشأناه ليظهر في كل صفحات الموقع.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
// يعرّف خط Geist Sans ويضعه داخل متغير CSS.

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
// يعرّف خط Geist Mono ويضعه داخل متغير CSS.

export const metadata: Metadata = {
  title: "ALZUHA",
  description: "ALZUHA Real Estate",
};
// يحدد بيانات الموقع العامة التي تظهر للمتصفح ومحركات البحث.

async function getLayoutLang(): Promise<"ar" | "en"> {
  const cookieStore = await cookies();
  // يقرأ كوكيز الطلب الحالي من السيرفر.

  const langCookie = cookieStore.get("lang")?.value;
  // يقرأ قيمة كوكي اللغة إن كانت موجودة.

  return langCookie === "en" ? "en" : "ar";
  // إذا كانت القيمة en نستخدم الإنجليزية، وإلا العربي هو الافتراضي.
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = await getLayoutLang();
  // يحدد اللغة الحالية للموقع.

  const dir = lang === "ar" ? "rtl" : "ltr";
  // يحدد اتجاه الصفحة: العربي من اليمين، الإنجليزي من اليسار.

  return (
    <html lang={lang} dir={dir}>
      <head>
        <link rel="stylesheet" href="/pages/home/css/page.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SiteHeader lang={lang} />
        {children}
      </body>
    </html>
  );
}