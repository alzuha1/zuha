"use client";
// هذا الملف Client Component لأنه يستخدم state وحفظ مباشر.

import { useMemo, useState } from "react";
// نستورد أدوات React المطلوبة.

export type ThemeSettings = {
  // نوع إعدادات الثيم العامة.
  colors: {
    primary: string;
    secondary: string;
    pageBg: string;
    text: string;
    muted: string;
    buttonBg: string;
    buttonText: string;
    headerBg: string;
    headerText: string;
    headerLink: string;
    headerActive: string;
    mobileMenuBg: string;
    mobileMenuText: string;
  };
  typography: {
    baseFontSize: number;
    navFontSize: number;
    navWeight: number;
    buttonFontSize: number;
    lineHeight: number;
  };
  header: {
    height: number;
    paddingX: number;
    navGap: number;
    shadow: number;
    borderOpacity: number;
    logoWidth: number;
    logoHeight: number;
    logoRadius: number;
    logoScale: number;
    logoBg: string;
    logoBorderColor: string;
    logoShadow: number;
  };
  buttons: {
    radius: number;
    shadow: number;
  };
};

export type ThemeAdminRecord = {
  // نوع سجل theme داخل جدول pages.
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  is_published: boolean;
  page_type: string | null;
  sections_json: ThemeSettings;
};

type Lang = "ar" | "en";
// لغة واجهة الأدمن.

export function defaultThemeSettings(): ThemeSettings {
  // القيم الافتراضية للثيم.
  return {
    colors: {
      primary: "#244fca",
      secondary: "#d7b85a",
      pageBg: "#ffffff",
      text: "#171717",
      muted: "#64748b",
      buttonBg: "#244fca",
      buttonText: "#ffffff",
      headerBg: "#244fca",
      headerText: "#ffffff",
      headerLink: "rgba(230,230,230,0.86)",
      headerActive: "#ffffff",
      mobileMenuBg: "#ffffff",
      mobileMenuText: "#111827",
    },
    typography: {
      baseFontSize: 16,
      navFontSize: 15,
      navWeight: 850,
      buttonFontSize: 16,
      lineHeight: 1.5,
    },
    header: {
      height: 92,
      paddingX: 90,
      navGap: 34,
      shadow: 0,
      borderOpacity: 0.1,
      logoWidth: 156,
      logoHeight: 74,
      logoRadius: 28,
      logoScale: 1.18,
      logoBg: "#cfcfcf",
      logoBorderColor: "#d7b85a",
      logoShadow: 22,
    },
    buttons: {
      radius: 999,
      shadow: 18,
    },
  };
}

function mergeTheme(value: ThemeSettings): ThemeSettings {
  // يدمج أي نقص في البيانات مع الافتراضي.
  const base = defaultThemeSettings();
  // الأساس.
  const incoming: any = value || {};
  // القادم.
  return {
    ...base,
    ...incoming,
    colors: { ...base.colors, ...(incoming.colors || {}) },
    typography: { ...base.typography, ...(incoming.typography || {}) },
    header: { ...base.header, ...(incoming.header || {}) },
    buttons: { ...base.buttons, ...(incoming.buttons || {}) },
  };
}

function clone<T>(value: T): T {
  // نسخ عميق لبيانات بسيطة.
  return JSON.parse(JSON.stringify(value)) as T;
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  // حقل لون مع input نصي.
  return (
    <label className="theme-field theme-field--color">
      <span>{label}</span>
      <div className="theme-color-row">
        <input type="color" value={value.startsWith("#") ? value : "#000000"} onChange={(event) => onChange(event.target.value)} />
        <input value={value} dir="ltr" onChange={(event) => onChange(event.target.value)} />
      </div>
    </label>
  );
}

function RangeField({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  // حقل رقم Range.
  return (
    <label className="theme-field theme-field--range">
      <span><em>{label}</em><strong>{value}</strong></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

const copy = {
  ar: {
    title: "ثيم الموقع العام",
    desc: "تحكم بالألوان، الهيدر، الشعار، الخطوط، والأزرار لكل صفحات الموقع.",
    colors: "الألوان العامة",
    header: "الهيدر والشعار",
    typography: "الخطوط والأحجام",
    buttons: "الأزرار",
    preview: "معاينة مباشرة",
    save: "حفظ الثيم",
    saving: "جارٍ الحفظ...",
    reset: "إلغاء التعديلات",
    saved: "تم حفظ الثيم بنجاح.",
    open: "عرض الموقع",
  },
  en: {
    title: "Global Site Theme",
    desc: "Control colors, header, logo, typography, and buttons across the website.",
    colors: "Global Colors",
    header: "Header & Logo",
    typography: "Typography & Sizes",
    buttons: "Buttons",
    preview: "Live Preview",
    save: "Save Theme",
    saving: "Saving...",
    reset: "Reset Changes",
    saved: "Theme saved successfully.",
    open: "View Site",
  },
};

export default function ThemeEditor({ initialItem }: { initialItem: ThemeAdminRecord }) {
  // محرر الثيم العام.
  const [lang, setLang] = useState<Lang>("ar");
  // لغة واجهة الأدمن.
  const [item, setItem] = useState<ThemeAdminRecord>({ ...initialItem, sections_json: mergeTheme(initialItem.sections_json) });
  // السجل الحالي.
  const [initial, setInitial] = useState<ThemeAdminRecord>({ ...initialItem, sections_json: mergeTheme(initialItem.sections_json) });
  // نسخة reset.
  const [saving, setSaving] = useState(false);
  // حالة الحفظ.
  const [notice, setNotice] = useState("");
  // رسالة نجاح.
  const [error, setError] = useState("");
  // رسالة خطأ.

  const t = copy[lang];
  // قاموس الواجهة.
  const dir = lang === "ar" ? "rtl" : "ltr";
  // اتجاه الواجهة.
  const theme = item.sections_json;
  // اختصار الثيم.

  const previewVars = useMemo(() => ({
    // متغيرات CSS للمعاينة.
    "--zuha-header-bg": theme.colors.headerBg,
    "--zuha-header-text": theme.colors.headerText,
    "--zuha-header-link": theme.colors.headerLink,
    "--zuha-header-active": theme.colors.headerActive,
    "--zuha-header-height": `${theme.header.height}px`,
    "--zuha-header-shadow": `0 14px ${theme.header.shadow}px rgba(15,23,42,.18)`,
    "--zuha-logo-width": `${theme.header.logoWidth}px`,
    "--zuha-logo-height": `${theme.header.logoHeight}px`,
    "--zuha-logo-radius": `${theme.header.logoRadius}px`,
    "--zuha-logo-scale": String(theme.header.logoScale),
    "--zuha-logo-bg": theme.header.logoBg,
    "--zuha-logo-border": theme.header.logoBorderColor,
    "--zuha-nav-font-size": `${theme.typography.navFontSize}px`,
    "--zuha-nav-font-weight": String(theme.typography.navWeight),
    "--zuha-nav-gap": `${theme.header.navGap}px`,
    background: theme.colors.pageBg,
    color: theme.colors.text,
  } as React.CSSProperties), [theme]);

  function setTheme(path: string[], value: string | number) {
    // تحديث قيمة داخل الثيم.
    setItem((prev) => {
      const next = clone(prev);
      const root: any = next.sections_json;
      let cursor = root;
      for (let i = 0; i < path.length - 1; i += 1) {
        const segment = path[i];
        if (!cursor[segment]) cursor[segment] = {};
        cursor = cursor[segment];
      }
      cursor[path[path.length - 1]] = value;
      return next;
    });
  }

  async function save() {
    // حفظ الثيم عبر API.
    try {
      setSaving(true);
      setNotice("");
      setError("");
      const response = await fetch("/api/admin/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok === false) throw new Error(payload?.message || "Failed to save theme.");
      const saved = { ...payload.item, sections_json: mergeTheme(payload.item.sections_json) } as ThemeAdminRecord;
      setItem(saved);
      setInitial(saved);
      setNotice(t.saved);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save theme.");
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    // رجوع لآخر نسخة محفوظة.
    setItem(clone(initial));
    setNotice("");
    setError("");
  }

  return (
    <main className="theme-admin" dir={dir}>
      <header className="theme-admin__header">
        <div>
          <p>ALZUHA CMS</p>
          <h1>{t.title}</h1>
          <span>{t.desc}</span>
        </div>
        <div className="theme-admin__actions">
          <div className="theme-admin__lang">
            <button type="button" className={lang === "ar" ? "is-active" : ""} onClick={() => setLang("ar")}>AR</button>
            <button type="button" className={lang === "en" ? "is-active" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
          <a className="theme-admin__ghost" href="/" target="_blank" rel="noreferrer">{t.open}</a>
          <button className="theme-admin__ghost" type="button" onClick={reset} disabled={saving}>{t.reset}</button>
          <button className="theme-admin__primary" type="button" onClick={save} disabled={saving}>{saving ? t.saving : t.save}</button>
        </div>
      </header>

      {notice ? <div className="theme-admin__notice theme-admin__notice--ok">{notice}</div> : null}
      {error ? <div className="theme-admin__notice theme-admin__notice--err">{error}</div> : null}

      <section className="theme-admin__grid">
        <div className="theme-admin__editor">
          <section className="theme-card">
            <h2>{t.colors}</h2>
            <div className="theme-grid2">
              <ColorField label={lang === "ar" ? "اللون الأساسي" : "Primary"} value={theme.colors.primary} onChange={(v) => setTheme(["colors", "primary"], v)} />
              <ColorField label={lang === "ar" ? "اللون الثانوي" : "Secondary"} value={theme.colors.secondary} onChange={(v) => setTheme(["colors", "secondary"], v)} />
              <ColorField label={lang === "ar" ? "خلفية الموقع" : "Page background"} value={theme.colors.pageBg} onChange={(v) => setTheme(["colors", "pageBg"], v)} />
              <ColorField label={lang === "ar" ? "لون النص" : "Text color"} value={theme.colors.text} onChange={(v) => setTheme(["colors", "text"], v)} />
              <ColorField label={lang === "ar" ? "لون الهيدر" : "Header background"} value={theme.colors.headerBg} onChange={(v) => setTheme(["colors", "headerBg"], v)} />
              <ColorField label={lang === "ar" ? "نص الهيدر" : "Header text"} value={theme.colors.headerText} onChange={(v) => setTheme(["colors", "headerText"], v)} />
              <ColorField label={lang === "ar" ? "الرابط النشط" : "Active link"} value={theme.colors.headerActive} onChange={(v) => setTheme(["colors", "headerActive"], v)} />
              <ColorField label={lang === "ar" ? "لون الزر" : "Button color"} value={theme.colors.buttonBg} onChange={(v) => setTheme(["colors", "buttonBg"], v)} />
            </div>
          </section>

          <section className="theme-card">
            <h2>{t.header}</h2>
            <div className="theme-grid2">
              <RangeField label={lang === "ar" ? "ارتفاع الهيدر" : "Header height"} value={theme.header.height} min={64} max={132} onChange={(v) => setTheme(["header", "height"], v)} />
              <RangeField label={lang === "ar" ? "تباعد الروابط" : "Nav gap"} value={theme.header.navGap} min={8} max={60} onChange={(v) => setTheme(["header", "navGap"], v)} />
              <RangeField label={lang === "ar" ? "ظل الهيدر" : "Header shadow"} value={theme.header.shadow} min={0} max={70} onChange={(v) => setTheme(["header", "shadow"], v)} />
              <RangeField label={lang === "ar" ? "عرض الشعار" : "Logo width"} value={theme.header.logoWidth} min={90} max={240} onChange={(v) => setTheme(["header", "logoWidth"], v)} />
              <RangeField label={lang === "ar" ? "ارتفاع الشعار" : "Logo height"} value={theme.header.logoHeight} min={42} max={120} onChange={(v) => setTheme(["header", "logoHeight"], v)} />
              <RangeField label={lang === "ar" ? "تدوير الشعار" : "Logo radius"} value={theme.header.logoRadius} min={0} max={60} onChange={(v) => setTheme(["header", "logoRadius"], v)} />
              <RangeField label={lang === "ar" ? "تكبير الشعار" : "Logo scale"} value={theme.header.logoScale} min={0.8} max={1.8} step={0.01} onChange={(v) => setTheme(["header", "logoScale"], v)} />
              <ColorField label={lang === "ar" ? "خلفية الشعار" : "Logo background"} value={theme.header.logoBg} onChange={(v) => setTheme(["header", "logoBg"], v)} />
            </div>
          </section>

          <section className="theme-card">
            <h2>{t.typography}</h2>
            <div className="theme-grid2">
              <RangeField label={lang === "ar" ? "حجم روابط الهيدر" : "Nav font size"} value={theme.typography.navFontSize} min={11} max={24} onChange={(v) => setTheme(["typography", "navFontSize"], v)} />
              <RangeField label={lang === "ar" ? "سماكة روابط الهيدر" : "Nav font weight"} value={theme.typography.navWeight} min={400} max={950} step={50} onChange={(v) => setTheme(["typography", "navWeight"], v)} />
              <RangeField label={lang === "ar" ? "حجم الخط العام" : "Base font size"} value={theme.typography.baseFontSize} min={13} max={22} onChange={(v) => setTheme(["typography", "baseFontSize"], v)} />
              <RangeField label={lang === "ar" ? "ارتفاع السطر" : "Line height"} value={theme.typography.lineHeight} min={1} max={2} step={0.05} onChange={(v) => setTheme(["typography", "lineHeight"], v)} />
            </div>
          </section>
        </div>

        <aside className="theme-preview" style={previewVars}>
          <div className="theme-preview__header">
            <div
  className="theme-preview-logoShell"
  style={{
    width: `${theme.header.logoWidth}px`,
    height: `${theme.header.logoHeight}px`,
    borderRadius: `${theme.header.logoRadius}px`,
  }}
>
  <img
    src="/images/alzuha-logo.png"
    alt="ALZUHA Logo"
    className="theme-preview-logoImg"
    style={{
      transform: `scale(${theme.header.logoScale})`,
    }}
  />
</div>
            <nav>
              <span>About</span>
              <span>Services</span>
              <span>Portfolio</span>
              <span>FAQ</span>
            </nav>
          </div>
          <div className="theme-preview__body">
            <p>{t.preview}</p>
            <h2>{lang === "ar" ? "واجهة موحدة لكل الموقع" : "Unified website interface"}</h2>
            <button>{lang === "ar" ? "زر تجريبي" : "Sample Button"}</button>
          </div>
        </aside>
      </section>
    </main>
  );
}
