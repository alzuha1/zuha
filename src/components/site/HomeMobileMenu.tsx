"use client"; // هذا المكوّن يعمل في المتصفح لأنه يستخدم useState لفتح وإغلاق القائمة.

import Link from "next/link"; // استيراد Link للتنقل الداخلي بين صفحات Next.js.

import { useState } from "react"; // استيراد useState للتحكم بحالة القائمة.

type MenuVariant = "main" | "services"; // نوع القائمة: عامة أو خاصة بالخدمات.

type HomeMobileMenuProps = { // تعريف خصائص مكوّن القائمة.
  lang: "ar" | "en"; // اللغة الحالية.
  variant?: MenuVariant; // نوع القائمة المطلوب عرضها، والقيمة الافتراضية main.
}; // نهاية تعريف الخصائص.

type MobileMenuLink = { // تعريف نوع الرابط داخل القائمة.
  href: string; // مسار الرابط.
  label: string; // النص المعروض.
}; // نهاية تعريف نوع الرابط.

export default function HomeMobileMenu({ lang, variant = "main" }: HomeMobileMenuProps) { // بداية مكوّن القائمة الجانبية.
  const [isOpen, setIsOpen] = useState(false); // حالة فتح وإغلاق القائمة.

  const isArabic = lang === "ar"; // تحديد هل اللغة عربية.

  const isServicesMenu = variant === "services"; // تحديد هل القائمة خاصة بالخدمات.
  const mainLinks: MobileMenuLink[] = [ // روابط القائمة العامة للموقع، ويجب أن تطابق أسماء هيدر اللابتوب.
    { href: "/", label: isArabic ? "الرئيسية" : "Home" }, // رابط الصفحة الرئيسية.
    { href: "/about", label: isArabic ? "نبذة مؤسسية" : "About" }, // اسم About في الموبايل مطابق للديسكتوب.
    { href: "/services", label: isArabic ? "الحلول الاستثمارية المتكاملة" : "Services" }, // اسم Services في الموبايل مطابق للديسكتوب.
    { href: "/portfolio", label: isArabic ? "الخدمات وسجل الأعمال" : "Portfolio" }, // اسم Portfolio في الموبايل مطابق للديسكتوب.
    { href: "/faq", label: isArabic ? "الأسئلة الشائعة" : "FAQ" }, // اسم FAQ كما هو.
    { href: "/contact", label: isArabic ? "تواصل" : "Contact" }, // اسم Contact كما هو.
  ]; // نهاية روابط القائمة العامة.

      const serviceLinks: MobileMenuLink[] = [ // روابط قائمة الخدمات، ويجب أن تطابق أسماء هيدر اللابتوب داخل صفحات الخدمات.
    { href: "/", label: isArabic ? "الرئيسية" : "Home" }, // الرجوع إلى الصفحة الرئيسية.
    { href: "/services", label: isArabic ? "استكشف" : "Explore" }, // اسم Explore مطابق للديسكتوب.
    { href: "/services/project-development", label: isArabic ? "تطوير المشاريع" : "Project Development" }, // رابط Project Development.
    { href: "/services/asset-assessment", label: isArabic ? "تقييم الأصل" : "Asset Assessment" }, // رابط Asset Assessment.
    { href: "/services/strategic-advisory", label: isArabic ? "الاستشارات" : "Advisory" }, // رابط Advisory.
    { href: "/services/market-positioning", label: isArabic ? "التموضع" : "Positioning" }, // اسم Positioning مطابق للديسكتوب.
  ]; // نهاية روابط الخدمات.

  
  const links = isServicesMenu ? serviceLinks : mainLinks; // اختيار الروابط المناسبة حسب نوع القائمة.

  const labels = { // نصوص التحكم حسب اللغة.
    openMenu: isArabic ? "فتح القائمة" : "Open menu", // نص زر فتح القائمة.
    closeMenu: isArabic ? "إغلاق القائمة" : "Close menu", // نص زر إغلاق القائمة.
    logoAlt: isArabic ? "شعار الزُهى" : "ALZUHA Logo", // النص البديل للشعار.
    navLabel: isArabic ? "روابط الموقع" : "Site links", // عنوان تنقلي لقارئات الشاشة.
  }; // نهاية نصوص التحكم.

  const closeMenu = () => setIsOpen(false); // دالة إغلاق القائمة.

  return ( // بداية JSX.
    <> {/* Fragment لتجميع عناصر القائمة بدون عنصر زائد */}
      <button
        type="button"
        className="home-mobile-burger"
        aria-label={labels.openMenu}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      > {/* زر الثلاث خطوط */}
        <span /> {/* الخط الأول */}
        <span /> {/* الخط الثاني */}
        <span /> {/* الخط الثالث */}
      </button>

      <button
        type="button"
        className={`home-mobile-overlay ${isOpen ? "is-open" : ""}`}
        aria-label={labels.closeMenu}
        onClick={closeMenu}
      /> {/* طبقة الخلفية التي تغلق القائمة عند الضغط عليها */}

      <aside
        className={[
          "home-mobile-panel",
          isArabic ? "home-mobile-panel--rtl" : "home-mobile-panel--ltr",
          isOpen ? "is-open" : "",
        ].join(" ")}
        dir={isArabic ? "rtl" : "ltr"}
        aria-hidden={!isOpen}
        data-menu-variant={variant}
      > {/* لوحة القائمة الجانبية */}
        <div className="home-mobile-panel__header"> {/* رأس القائمة */}
          <div className="home-mobile-panel__brand"> {/* حاوية الشعار */}
            <img
              src="/images/alzuha-logo.png"
              alt={labels.logoAlt}
              className="home-mobile-panel__logo"
            /> {/* صورة شعار زها */}
          </div> {/* نهاية حاوية الشعار */}

          <button
            type="button"
            className="home-mobile-panel__close"
            aria-label={labels.closeMenu}
            onClick={closeMenu}
          > {/* زر إغلاق القائمة */}
            ×
          </button>
        </div> {/* نهاية رأس القائمة */}

        <nav className="home-mobile-panel__nav" aria-label={labels.navLabel}> {/* روابط القائمة */}
          {links.map((item) => ( // توليد الروابط حسب نوع الصفحة.
            <Link key={item.href} href={item.href} onClick={closeMenu}> {/* رابط داخل القائمة */}
              {item.label} {/* نص الرابط */}
            </Link>
          ))} {/* نهاية توليد الروابط */}
        </nav> {/* نهاية روابط القائمة */}
      </aside> {/* نهاية لوحة القائمة */}
    </>
  ); // نهاية الإخراج.
} // نهاية مكوّن HomeMobileMenu.