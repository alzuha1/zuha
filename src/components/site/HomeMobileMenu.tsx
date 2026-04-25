"use client";
// قائمة الصفحة الرئيسية للموبايل والتابلت.
// لا نلمس src/app/page.tsx كـ Client Component.

import Link from "next/link";
import { useState } from "react";

type HomeMobileMenuProps = {
  lang: "ar" | "en";
};

export default function HomeMobileMenu({ lang }: HomeMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isArabic = lang === "ar";

  const labels = {
    openMenu: isArabic ? "فتح القائمة" : "Open menu",
    closeMenu: isArabic ? "إغلاق القائمة" : "Close menu",
    menu: isArabic ? "القائمة" : "Menu",
    home: isArabic ? "الرئيسية" : "Home",
    about: isArabic ? "من نحن" : "About",
    services: isArabic ? "الخدمات" : "Services",
    portfolio: isArabic ? "المشاريع" : "Portfolio",
    faq: isArabic ? "الأسئلة الشائعة" : "FAQ",
    contact: isArabic ? "تواصل معنا" : "Contact",
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <>
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

      <button
        type="button"
        className={`home-mobile-overlay ${isOpen ? "is-open" : ""}`}
        aria-label={labels.closeMenu}
        onClick={closeMenu}
      />

      <aside
        className={[
          "home-mobile-panel",
          isArabic ? "home-mobile-panel--rtl" : "home-mobile-panel--ltr",
          isOpen ? "is-open" : "",
        ].join(" ")}
        aria-hidden={!isOpen}
      >
        <div className="home-mobile-panel__header">
          <div>
            <strong>ALZUHA</strong>
            <span>{isArabic ? "العقارات" : "Real Estate"}</span>
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
          <Link href="/" onClick={closeMenu}>{labels.home}</Link>
          <Link href="/about" onClick={closeMenu}>{labels.about}</Link>
          <Link href="/services" onClick={closeMenu}>{labels.services}</Link>
          <Link href="/portfolio" onClick={closeMenu}>{labels.portfolio}</Link>
          <Link href="/faq" onClick={closeMenu}>{labels.faq}</Link>
          <Link href="/contact" onClick={closeMenu}>{labels.contact}</Link>
        </nav>
      </aside>
    </>
  );
}