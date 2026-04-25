"use client";

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
    company: isArabic ? "الزُهى" : "ALZUHA",
    subtitle: isArabic ? "العقارات" : "Real Estate",
    home: isArabic ? "الرئيسية" : "Home",
    about: isArabic ? "من نحن" : "About",
    services: isArabic ? "الخدمات" : "Services",
    portfolio: isArabic ? "المشاريع" : "Portfolio",
    faq: isArabic ? "الأسئلة الشائعة" : "FAQ",
    contact: isArabic ? "تواصل معنا" : "Contact",
    serviceExplore: isArabic ? "استكشاف الخدمات" : "Explore Services",
    projectDevelopment: isArabic ? "تطوير المشاريع" : "Project Development",
    assetAssessment: isArabic ? "تقييم الأصول" : "Asset Assessment",
    strategicAdvisory: isArabic ? "الاستشارات الاستراتيجية" : "Strategic Advisory",
    marketPositioning: isArabic ? "التموضع والتسويق" : "Market Positioning",
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
        dir={isArabic ? "rtl" : "ltr"}
        aria-hidden={!isOpen}
      >
        <div className="home-mobile-panel__header">
          <div>
            <strong>{labels.company}</strong>
            <span>{labels.subtitle}</span>
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

        <nav className="home-mobile-panel__nav">
          <Link href="/" onClick={closeMenu}>{labels.home}</Link>
          <Link href="/about" onClick={closeMenu}>{labels.about}</Link>
          <Link href="/services" onClick={closeMenu}>{labels.services}</Link>

          <div className="home-mobile-panel__subnav">
            <Link href="/services/explore" onClick={closeMenu}>{labels.serviceExplore}</Link>
            <Link href="/services/project-development" onClick={closeMenu}>{labels.projectDevelopment}</Link>
            <Link href="/services/asset-assessment" onClick={closeMenu}>{labels.assetAssessment}</Link>
            <Link href="/services/strategic-advisory" onClick={closeMenu}>{labels.strategicAdvisory}</Link>
            <Link href="/services/market-positioning" onClick={closeMenu}>{labels.marketPositioning}</Link>
          </div>

          <Link href="/portfolio" onClick={closeMenu}>{labels.portfolio}</Link>
          <Link href="/faq" onClick={closeMenu}>{labels.faq}</Link>
          <Link href="/contact" onClick={closeMenu}>{labels.contact}</Link>
        </nav>
      </aside>
    </>
  );
}