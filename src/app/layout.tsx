import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import SiteHeader from "@/components/site/SiteHeader";
import { supabaseServer } from "@/lib/supabase-server";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = { title: "ALZUHA", description: "ALZUHA Real Estate" };

async function getLayoutLang(): Promise<"ar" | "en"> {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("lang")?.value;
  return langCookie === "en" ? "en" : "ar";
}

function defaultTheme() {
  return {
    colors: { pageBg: "#ffffff", text: "#171717", headerBg: "#244fca", headerText: "#ffffff", headerLink: "rgba(230,230,230,0.86)", headerActive: "#ffffff" },
    typography: { baseFontSize: 16, navFontSize: 15, navWeight: 850, lineHeight: 1.5 },
    header: { height: 92, paddingX: 90, navGap: 34, shadow: 0, borderOpacity: 0.1, logoWidth: 156, logoHeight: 74, logoRadius: 28, logoScale: 1.18, logoBg: "#cfcfcf", logoBorderColor: "#d7b85a", logoShadow: 22 },
  };
}

async function getThemeVars(): Promise<React.CSSProperties> {
  try {
    const supabase = supabaseServer();
    const { data } = await supabase.from("pages").select("sections_json").eq("slug", "theme").maybeSingle();
    const base = defaultTheme();
    const theme: any = data?.sections_json || {};
    const colors = { ...base.colors, ...(theme.colors || {}) };
    const typography = { ...base.typography, ...(theme.typography || {}) };
    const header = { ...base.header, ...(theme.header || {}) };
    return {
      "--zuha-page-bg": colors.pageBg,
      "--zuha-text": colors.text,
      "--zuha-base-font-size": `${typography.baseFontSize}px`,
      "--zuha-line-height": String(typography.lineHeight),
      "--zuha-header-bg": colors.headerBg,
      "--zuha-header-text": colors.headerText,
      "--zuha-header-link": colors.headerLink,
      "--zuha-header-active": colors.headerActive,
      "--zuha-header-height": `${header.height}px`,
      "--zuha-header-padding-x": `${header.paddingX}px`,
      "--zuha-header-shadow": `0 14px ${header.shadow}px rgba(15,23,42,.18)`,
      "--zuha-header-border": `rgba(255,255,255,${header.borderOpacity})`,
      "--zuha-logo-width": `${header.logoWidth}px`,
      "--zuha-logo-height": `${header.logoHeight}px`,
      "--zuha-logo-radius": `${header.logoRadius}px`,
      "--zuha-logo-scale": String(header.logoScale),
      "--zuha-logo-bg": header.logoBg,
      "--zuha-logo-border": header.logoBorderColor,
      "--zuha-logo-shadow": `${header.logoShadow}px`,
      "--zuha-nav-gap": `${header.navGap}px`,
      "--zuha-nav-font-size": `${typography.navFontSize}px`,
      "--zuha-nav-font-weight": String(typography.navWeight),
    } as React.CSSProperties;
  } catch (error) {
    console.error("Theme vars load failed:", error);
    return {};
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const lang = await getLayoutLang();
  const dir = lang === "ar" ? "rtl" : "ltr";
  const themeVars = await getThemeVars();
  return (
    <html lang={lang} dir={dir}>
      <head>
        <link rel="stylesheet" href="/pages/home/css/page.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={themeVars}>
        <SiteHeader lang={lang} />
        {children}
      </body>
    </html>
  );
}
