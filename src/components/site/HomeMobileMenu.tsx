"use client";
// هذا المكوّن Client Component فقط لأنه يستخدم useState لفتح وإغلاق القائمة.
// لا نضع use client داخل src/app/page.tsx حتى لا نكسر Server Component.

import Link from "next/link";
import { useState } from "react";

type HomeMobileMenuProps = {
  lang: "ar" | "en";
};

export default function HomeMobileMenu({ lang }: HomeMobileMenuProps) {
  // حالة فتح وإغلاق القائمة الجانبية
  const [isOpen, setIsOpen] = useState(false);

  // النصوص حسب اللغة الحالية
  const labels = {
    menu: lang === "ar" ? "القائمة" : "Menu",
    openMenu: lang === "ar" ? "فتح القائمة" : "Open menu",
    closeMenu: lang === "ar" ? "إغلاق القائمة" : "Close menu",
    home: lang === "ar" ? "الرئيسية" : "Home",
    about: lang === "ar" ? "من نحن" : "About",
    services: lang === "ar" ? "الخدمات" : "Services",
    portfolio: lang === "ar" ? "المشاريع" : "Portfolio",
    faq: lang === "ar" ? "الأسئلة الشائعة" : "FAQ",
    contact: lang === "ar" ? "تواصل معنا" : "Contact",
  };

  // إغلاق القائمة عند النقر على أي رابط
  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <>
      {/* زر الثلاث خطوط: يظهر فقط في الموبايل والتابلت عبر CSS */}
      <button
        type="button"
        className="home-mobile-burger"
        aria-label={labels.openMenu}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* طبقة خلفية لإغلاق القائمة عند الضغط خارجها */}
      <button
        type="button"
        className={`home-mobile-overlay ${isOpen ? "is-open" : ""}`}
        aria-label={labels.closeMenu}
        onClick={closeMenu}
      />

      {/* القائمة الجانبية */}
      <aside
        className={`home-mobile-panel ${isOpen ? "is-open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="home-mobile-panel__header">
          <div>
            <strong>ALZUHA</strong>
            <span>{lang === "ar" ? "العقارات" : "Real Estate"}</span>
          </div>

          <button
            type="button"
            className="home-mobile-panel__close"
            aria-label={labels.closeMenu}
            onClick={closeMenu}
          >
            ×
          </button>
        </div>

        <nav className="home-mobile-panel__nav" aria-label={labels.menu}>
          <Link href="/" onClick={closeMenu}>
            {labels.home}
          </Link>

          <Link href="/about" onClick={closeMenu}>
            {labels.about}
          </Link>

          <Link href="/services" onClick={closeMenu}>
            {labels.services}
          </Link>

          <Link href="/portfolio" onClick={closeMenu}>
            {labels.portfolio}
          </Link>

          <Link href="/faq" onClick={closeMenu}>
            {labels.faq}
          </Link>

          <Link href="/contact" onClick={closeMenu}>
            {labels.contact}
          </Link>
        </nav>
      </aside>
    </>
  );
}