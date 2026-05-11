"use client"; // تحويل الهيدر إلى Client Component لأننا نحتاج usePathname لمعرفة الصفحة الحالية داخل المتصفح.

import Link from "next/link"; // استيراد Link للتنقل الداخلي بين صفحات Next.js بدون إعادة تحميل كاملة للصفحة.

import { usePathname } from "next/navigation"; // استيراد usePathname لمعرفة المسار الحالي مثل / أو /services.

import LanguageSwitch from "@/components/site/LanguageSwitch"; // استيراد مبدّل اللغة المستخدم في الهيدر.

import HomeMobileMenu from "@/components/site/HomeMobileMenu"; // استيراد قائمة الموبايل والآيباد.

type SiteHeaderProps = { // تعريف نوع خصائص الهيدر.
  lang: "ar" | "en"; // اللغة الحالية: عربي أو إنجليزي.
}; // نهاية تعريف النوع.

type HeaderLink = { // تعريف نوع الرابط داخل الهيدر.
  href: string; // مسار الرابط.
  label: string; // النص المعروض للرابط.
}; // نهاية تعريف نوع الرابط.

/**
 * توحيد المسارات قبل المقارنة.
 * السبب:
 * - /services و /services/ يجب أن يُعتبرا نفس المسار.
 * - "/" يجب أن تبقى كما هي ولا تتحول إلى قيمة فارغة.
 */
function normalizePath(value: string): string { // دالة تنظيف المسار.
  const cleaned = value.replace(/\/+$/, ""); // حذف الشرطة المائلة الأخيرة إن وجدت.
  return cleaned === "" ? "/" : cleaned; // إذا صار المسار فارغًا نرجعه إلى الصفحة الرئيسية.
} // نهاية دالة normalizePath.

/**
 * تحديد هل الرابط الحالي هو الرابط النشط.
 * السبب:
 * - الصفحة /services/project-development يجب أن تجعل رابط الخدمات النشط منطقيًا عند الحاجة.
 * - صفحات الخدمات التابعة لها روابط مستقلة داخل منطقة الخدمات.
 */
function isActivePath(pathname: string, href: string): boolean { // دالة فحص الرابط النشط.
  const currentPath = normalizePath(pathname); // تنظيف المسار الحالي.
  const targetPath = normalizePath(href); // تنظيف مسار الرابط.

  if (targetPath === "/") { // إذا كان الرابط هو الرئيسية.
    return currentPath === "/"; // لا نجعله نشطًا إلا في الصفحة الرئيسية فقط.
  } // نهاية شرط الرئيسية.

  return currentPath === targetPath; // مقارنة مباشرة بعد التنظيف.
} // نهاية دالة isActivePath.

export default function SiteHeader({ lang }: SiteHeaderProps) { // بداية مكوّن الهيدر الموحد.
  const pathname = usePathname(); // قراءة المسار الحالي من المتصفح.

  const safePathname = pathname || "/"; // حماية احتياطية إذا رجع usePathname قيمة فارغة.

  const isArabic = lang === "ar"; // تحديد هل اللغة الحالية عربية.

  const isServicesArea = // تحديد هل المستخدم داخل صفحة الخدمات أو إحدى صفحاتها التابعة.
    safePathname === "/services" || safePathname.startsWith("/services/"); // شرط منطقة الخدمات.

  const mainLinks: HeaderLink[] = [ // روابط الهيدر العامة خارج منطقة الخدمات.
    { href: "/about", label: isArabic ? "نبذة مؤسسية" : "About" }, // رابط صفحة النبذة.
    { href: "/services", label: isArabic ? "الحلول الإستثمارية المتكاملة" : "Services" }, // رابط صفحة الخدمات.
    { href: "/portfolio", label: isArabic ? "الخدمات وسجل الأعمال" : "Portfolio" }, // رابط صفحة الأعمال.
    { href: "/faq", label: isArabic ? "الأسئلة الشائعة" : "FAQ" }, // رابط صفحة الأسئلة الشائعة.
    { href: "/contact", label: isArabic ? "تواصل" : "Contact" }, // رابط صفحة التواصل.
  ]; // نهاية روابط الهيدر العامة.

  const serviceLinks: HeaderLink[] = [ // روابط الهيدر داخل منطقة الخدمات فقط.
    { href: "/", label: isArabic ? "الرئيسية" : "Home" }, // رابط الرجوع للرئيسية.
    { href: "/services", label: isArabic ? "استكشف" : "Explore" }, // رابط صفحة الخدمات الرئيسية.
    { href: "/services/project-development", label: isArabic ? "تطوير المشاريع" : "Project Development" }, // رابط تطوير المشاريع.
    { href: "/services/asset-assessment", label: isArabic ? "تقييم الأصل" : "Asset Assessment" }, // رابط تقييم الأصل.
    { href: "/services/strategic-advisory", label: isArabic ? "الاستشارات" : "Advisory" }, // رابط الاستشارات.
    { href: "/services/market-positioning", label: isArabic ? "التموضع" : "Positioning" }, // رابط التموضع.
  ]; // نهاية روابط منطقة الخدمات.

  const links = isServicesArea ? serviceLinks : mainLinks; // اختيار مجموعة الروابط حسب الصفحة الحالية.

  const logoAlt = isArabic ? "شعار الزُهى" : "ALZUHA Logo"; // النص البديل للشعار حسب اللغة.

  return ( // بداية إخراج JSX.
    <header
      className="site-header"
      data-header-scope={isServicesArea ? "services" : "main"}
      dir={isArabic ? "rtl" : "ltr"}
    > {/* الهيدر الموحد بدون زر Request Consultation */}
      <div className="site-header__logo-side"> {/* جهة الشعار */}
        <Link
          href="/"
          className="site-header__logo-link"
          aria-label={isArabic ? "العودة إلى الصفحة الرئيسية" : "Go to home page"}
        > {/* رابط الشعار إلى الرئيسية */}
          <span className="site-header__logo-shell"> {/* إطار الشعار الموحد */}
            <img
              src="/images/alzuha-logo.png"
              alt={logoAlt}
              className="site-header__logo-img"
            /> {/* صورة الشعار الرسمية */}
          </span> {/* نهاية إطار الشعار */}
        </Link> {/* نهاية رابط الشعار */}
      </div> {/* نهاية جهة الشعار */}

      <nav
        className="site-header__nav"
        aria-label={isArabic ? "روابط الموقع" : "Site navigation"}
      > {/* روابط الديسكتوب */}
        {links.map((item) => { // توليد روابط الهيدر.
          const active = isActivePath(safePathname, item.href); // تحديد هل الرابط الحالي نشط.

          return ( // إرجاع الرابط.
            <Link
              key={item.href}
              href={item.href}
              className={active ? "site-header__nav-link is-active" : "site-header__nav-link"}
              aria-current={active ? "page" : undefined}
            > {/* رابط واحد داخل الهيدر */}
              {item.label} {/* نص الرابط */}
            </Link>
          ); // نهاية إرجاع الرابط.
        })} {/* نهاية توليد الروابط */}
      </nav> {/* نهاية روابط الديسكتوب */}

      <div className="site-header__tools"> {/* جهة أدوات الهيدر */}
        <LanguageSwitch /> {/* مبدّل اللغة */}

        <HomeMobileMenu
          lang={lang}
          variant={isServicesArea ? "services" : "main"}
        /> {/* قائمة الموبايل والآيباد بنفس نوع روابط الهيدر */}
      </div> {/* نهاية أدوات الهيدر */}
    </header> // نهاية الهيدر.
  ); // نهاية الإخراج.
} // نهاية مكوّن SiteHeader.