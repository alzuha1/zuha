"use client";
// يجعل هذا الملف Client Component لأن محرر الهوم يحتاج state وتفاعل وحفظ مباشر من المتصفح.

import { useEffect, useMemo, useState } from "react";
// نستورد useEffect للتحميل الأولي، و useMemo للحسابات المشتقة، و useState لإدارة حالة الواجهة.

type Lang = "ar" | "en";
// يحدد اللغات المدعومة داخل واجهة Home Builder.

type Device = "desktop" | "tablet" | "mobile";
// يحدد أحجام المعاينة المباشرة داخل لوحة الأدمن.

type Dict = Record<string, string>;
// يمثل قاموس نصوص الصفحة الرئيسية حسب اللغة.

type HomeSections = {
  // يمثل بنية sections_json المخزنة لسجل home داخل جدول pages.
  dict: {
    // يحتوي نصوص الصفحة الرئيسية بلغتين.
    ar: Dict;
    // قاموس النصوص العربية.
    en: Dict;
    // قاموس النصوص الإنجليزية.
  };
  site: {
    // يحتوي الصور وبيانات التواصل والأرقام العامة.
    statsValue: string;
    // القيمة الرقمية المعروضة في قسم الإحصائيات.
    location_ar: string;
    // الموقع باللغة العربية.
    location_en: string;
    // الموقع باللغة الإنجليزية.
    phone: string;
    // رقم الهاتف المعروض في الهوم.
    email: string;
    // البريد الإلكتروني المعروض في الهوم.
    hero_image: string;
    // صورة الهيرو الرئيسية.
    project_image_1: string;
    // صورة المشروع الأولى.
    project_image_2: string;
    // صورة المشروع الثانية.
    project_image_3: string;
    // صورة المشروع الثالثة.
    quote_image: string;
    // صورة قسم الاقتباس.
    team_image_1: string;
    // صورة عضو الفريق الأول.
    team_image_2: string;
    // صورة عضو الفريق الثاني.
    team_image_3: string;
    // صورة عضو الفريق الثالث.
    brand_wall_image: string;
    // صورة الفوتر/العرض النهائي في الهوم.
  };
};
// نهاية تعريف بنية HomeSections.

type HomeRecord = {
  // يمثل سجل صفحة home القادم من API.
  slug: string;
  // slug الصفحة ويجب أن يكون home.
  title_ar: string;
  // عنوان الصفحة بالعربية داخل قاعدة البيانات.
  title_en: string;
  // عنوان الصفحة بالإنجليزية داخل قاعدة البيانات.
  content_ar: string;
  // وصف عام للصفحة بالعربية.
  content_en: string;
  // وصف عام للصفحة بالإنجليزية.
  is_published: boolean;
  // حالة نشر الصفحة.
  page_type: string | null;
  // نوع الصفحة داخل جدول pages.
  sections_json: HomeSections;
  // محتوى الهوم التفصيلي.
};
// نهاية تعريف HomeRecord.

type SectionKey =
  // مفاتيح الأقسام التي تظهر في القائمة الجانبية.
  | "meta"
  // بيانات الصفحة العامة.
  | "hero"
  // قسم الهيرو.
  | "trust"
  // قسم الثقة والمؤشرات.
  | "services"
  // قسم الخدمات المختصرة.
  | "stats"
  // قسم الأرقام.
  | "projects"
  // قسم المشاريع.
  | "quote"
  // قسم الاقتباس.
  | "newsletter"
  // قسم النشرة البريدية.
  | "team"
  // قسم الفريق.
  | "faq"
  // قسم الأسئلة الشائعة.
  | "contact"
  // قسم التواصل والفوتر.
  | "images";
  // قسم الصور والبيانات العامة.

type UiCopy = {
  // قاموس ترجمة واجهة الأدمن نفسها وليس محتوى الموقع.
  title: string;
  desc: string;
  save: string;
  saving: string;
  reset: string;
  open: string;
  live: string;
  draft: string;
  sections: string;
  preview: string;
  meta: string;
  hero: string;
  trust: string;
  services: string;
  stats: string;
  projects: string;
  quote: string;
  newsletter: string;
  team: string;
  faq: string;
  contact: string;
  images: string;
  ready: string;
  saved: string;
  loading: string;
  desktop: string;
  tablet: string;
  mobile: string;
  status: string;
  published: string;
  arKeys: string;
  enKeys: string;
  imageCount: string;
  cms: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  statsValue: string;
  phone: string;
  email: string;
  locationAr: string;
  locationEn: string;
  heroImage: string;
  projectImage1: string;
  projectImage2: string;
  projectImage3: string;
  quoteImage: string;
  teamImage1: string;
  teamImage2: string;
  teamImage3: string;
  footerImage: string;
  eyebrow: string;
  fieldTitle: string;
  description: string;
  primaryButton: string;
  secondaryButton: string;
  logo1: string;
  logo2: string;
  logo3: string;
  logo4: string;
  logo5: string;
  logo6: string;
  service1Title: string;
  service1Desc: string;
  service2Title: string;
  service2Desc: string;
  service3Title: string;
  service3Desc: string;
  cta: string;
  brand: string;
  quoteText: string;
  author: string;
  role: string;
  placeholder: string;
  button: string;
  member1Name: string;
  member1Role: string;
  member2Name: string;
  member2Role: string;
  member3Name: string;
  member3Role: string;
  question1: string;
  answer1: string;
  question2: string;
  answer2: string;
  question3: string;
  answer3: string;
  question4: string;
  answer4: string;
};
// نهاية تعريف قاموس واجهة الأدمن.

const ui: Record<Lang, UiCopy> = {
  // قاموس الترجمة الكامل للوحة Home Builder.
  ar: {
    // النصوص العربية للوحة الأدمن.
    title: "منشئ الصفحة الرئيسية",
    // عنوان لوحة Home Builder بالعربية.
    desc: "تحكم بالنصوص والصور الأساسية للواجهة الرئيسية بدون لمس كود التصميم.",
    // وصف مختصر للوحة.
    save: "حفظ التغييرات",
    // نص زر الحفظ.
    saving: "جارٍ الحفظ...",
    // نص حالة الحفظ.
    reset: "إلغاء التعديلات",
    // نص زر الرجوع لآخر نسخة محفوظة.
    open: "عرض الصفحة",
    // نص رابط فتح الصفحة العامة.
    live: "منشور",
    // نص حالة النشر.
    draft: "مسودة",
    // نص حالة المسودة.
    sections: "الأقسام",
    // عنوان قائمة الأقسام.
    preview: "معاينة مباشرة",
    // عنوان صندوق المعاينة.
    meta: "بيانات الصفحة",
    // اسم قسم بيانات الصفحة.
    hero: "الهيرو",
    // اسم قسم الهيرو.
    trust: "الثقة والمؤشرات",
    // اسم قسم الثقة.
    services: "الخدمات المختصرة",
    // اسم قسم الخدمات.
    stats: "الأرقام",
    // اسم قسم الأرقام.
    projects: "المشاريع",
    // اسم قسم المشاريع.
    quote: "الاقتباس",
    // اسم قسم الاقتباس.
    newsletter: "النشرة البريدية",
    // اسم قسم النشرة.
    team: "الفريق",
    // اسم قسم الفريق.
    faq: "الأسئلة الشائعة",
    // اسم قسم الأسئلة.
    contact: "التواصل والفوتر",
    // اسم قسم التواصل.
    images: "الصور والبيانات",
    // اسم قسم الصور.
    ready: "جاهز للتعديل.",
    // رسالة الحالة الافتراضية.
    saved: "تم حفظ الصفحة الرئيسية بنجاح.",
    // رسالة نجاح الحفظ.
    loading: "جارٍ تحميل منشئ الصفحة الرئيسية...",
    // رسالة التحميل.
    desktop: "ديسكتوب",
    // زر معاينة الديسكتوب.
    tablet: "تابلت",
    // زر معاينة التابلت.
    mobile: "موبايل",
    // زر معاينة الموبايل.
    status: "الحالة",
    // بطاقة الحالة.
    published: "منشور على الموقع",
    // Label تفعيل النشر.
    arKeys: "مفاتيح AR",
    // بطاقة عدد مفاتيح العربية.
    enKeys: "مفاتيح EN",
    // بطاقة عدد مفاتيح الإنجليزية.
    imageCount: "الصور",
    // بطاقة الصور.
    cms: "ALZUHA CMS",
    // اسم النظام.
    titleAr: "عنوان الصفحة AR",
    // Label عنوان الصفحة العربي.
    titleEn: "عنوان الصفحة EN",
    // Label عنوان الصفحة الإنجليزي.
    contentAr: "وصف الصفحة AR",
    // Label وصف الصفحة العربي.
    contentEn: "وصف الصفحة EN",
    // Label وصف الصفحة الإنجليزي.
    statsValue: "قيمة الإحصائية",
    // Label قيمة الإحصائية.
    phone: "الهاتف",
    // Label الهاتف.
    email: "البريد الإلكتروني",
    // Label البريد.
    locationAr: "الموقع AR",
    // Label الموقع العربي.
    locationEn: "الموقع EN",
    // Label الموقع الإنجليزي.
    heroImage: "صورة الهيرو",
    // Label صورة الهيرو.
    projectImage1: "صورة المشروع 1",
    // Label صورة المشروع الأولى.
    projectImage2: "صورة المشروع 2",
    // Label صورة المشروع الثانية.
    projectImage3: "صورة المشروع 3",
    // Label صورة المشروع الثالثة.
    quoteImage: "صورة الاقتباس",
    // Label صورة الاقتباس.
    teamImage1: "صورة الفريق 1",
    // Label صورة الفريق الأولى.
    teamImage2: "صورة الفريق 2",
    // Label صورة الفريق الثانية.
    teamImage3: "صورة الفريق 3",
    // Label صورة الفريق الثالثة.
    footerImage: "صورة الفوتر",
    // Label صورة الفوتر.
    eyebrow: "النص التمهيدي",
    // Label النص العلوي الصغير.
    fieldTitle: "العنوان",
    // Label العنوان.
    description: "الوصف",
    // Label الوصف.
    primaryButton: "الزر الرئيسي",
    // Label الزر الرئيسي.
    secondaryButton: "الزر الثانوي",
    // Label الزر الثانوي.
    logo1: "الشعار 1",
    // Label شعار الثقة الأول.
    logo2: "الشعار 2",
    // Label شعار الثقة الثاني.
    logo3: "الشعار 3",
    // Label شعار الثقة الثالث.
    logo4: "الشعار 4",
    // Label شعار الثقة الرابع.
    logo5: "الشعار 5",
    // Label شعار الثقة الخامس.
    logo6: "الشعار 6",
    // Label شعار الثقة السادس.
    service1Title: "عنوان الخدمة 1",
    // Label عنوان الخدمة الأولى.
    service1Desc: "وصف الخدمة 1",
    // Label وصف الخدمة الأولى.
    service2Title: "عنوان الخدمة 2",
    // Label عنوان الخدمة الثانية.
    service2Desc: "وصف الخدمة 2",
    // Label وصف الخدمة الثانية.
    service3Title: "عنوان الخدمة 3",
    // Label عنوان الخدمة الثالثة.
    service3Desc: "وصف الخدمة 3",
    // Label وصف الخدمة الثالثة.
    cta: "دعوة الإجراء",
    // Label CTA.
    brand: "العلامة",
    // Label اسم العلامة في الاقتباس.
    quoteText: "نص الاقتباس",
    // Label نص الاقتباس.
    author: "الاسم",
    // Label صاحب الاقتباس.
    role: "الدور / الموقع",
    // Label الدور.
    placeholder: "النص الافتراضي",
    // Label placeholder.
    button: "الزر",
    // Label الزر.
    member1Name: "اسم العضو 1",
    // Label اسم العضو الأول.
    member1Role: "دور العضو 1",
    // Label دور العضو الأول.
    member2Name: "اسم العضو 2",
    // Label اسم العضو الثاني.
    member2Role: "دور العضو 2",
    // Label دور العضو الثاني.
    member3Name: "اسم العضو 3",
    // Label اسم العضو الثالث.
    member3Role: "دور العضو 3",
    // Label دور العضو الثالث.
    question1: "السؤال 1",
    // Label السؤال الأول.
    answer1: "الإجابة 1",
    // Label الإجابة الأولى.
    question2: "السؤال 2",
    // Label السؤال الثاني.
    answer2: "الإجابة 2",
    // Label الإجابة الثانية.
    question3: "السؤال 3",
    // Label السؤال الثالث.
    answer3: "الإجابة 3",
    // Label الإجابة الثالثة.
    question4: "السؤال 4",
    // Label السؤال الرابع.
    answer4: "الإجابة 4",
    // Label الإجابة الرابعة.
  },
  en: {
    // النصوص الإنجليزية للوحة الأدمن.
    title: "Home Live Builder",
    // Builder title.
    desc: "Control the homepage text and core visuals without touching layout code.",
    // Builder description.
    save: "Save Changes",
    // Save button text.
    saving: "Saving...",
    // Saving state text.
    reset: "Reset Changes",
    // Reset button text.
    open: "View Page",
    // Public page button text.
    live: "Live",
    // Published state.
    draft: "Draft",
    // Draft state.
    sections: "Sections",
    // Sidebar title.
    preview: "Live Preview",
    // Preview title.
    meta: "Page Meta",
    // Meta section label.
    hero: "Hero",
    // Hero section label.
    trust: "Trust & Indicators",
    // Trust section label.
    services: "Services Preview",
    // Services section label.
    stats: "Stats",
    // Stats section label.
    projects: "Projects",
    // Projects section label.
    quote: "Quote",
    // Quote section label.
    newsletter: "Newsletter",
    // Newsletter section label.
    team: "Team",
    // Team section label.
    faq: "FAQ",
    // FAQ section label.
    contact: "Contact Footer",
    // Contact section label.
    images: "Images & Data",
    // Images section label.
    ready: "Ready to edit.",
    // Default status text.
    saved: "Home page saved successfully.",
    // Save success message.
    loading: "Loading Home Builder...",
    // Loading message.
    desktop: "Desktop",
    // Desktop preview button.
    tablet: "Tablet",
    // Tablet preview button.
    mobile: "Mobile",
    // Mobile preview button.
    status: "Status",
    // Status card label.
    published: "Published on website",
    // Publish toggle label.
    arKeys: "AR keys",
    // Arabic keys stat label.
    enKeys: "EN keys",
    // English keys stat label.
    imageCount: "Images",
    // Images stat label.
    cms: "ALZUHA CMS",
    // CMS label.
    titleAr: "Page Title AR",
    // Arabic title label.
    titleEn: "Page Title EN",
    // English title label.
    contentAr: "Page Content AR",
    // Arabic content label.
    contentEn: "Page Content EN",
    // English content label.
    statsValue: "Stats Value",
    // Stats value label.
    phone: "Phone",
    // Phone label.
    email: "Email",
    // Email label.
    locationAr: "Location AR",
    // Arabic location label.
    locationEn: "Location EN",
    // English location label.
    heroImage: "Hero Image",
    // Hero image label.
    projectImage1: "Project Image 1",
    // First project image label.
    projectImage2: "Project Image 2",
    // Second project image label.
    projectImage3: "Project Image 3",
    // Third project image label.
    quoteImage: "Quote Image",
    // Quote image label.
    teamImage1: "Team Image 1",
    // First team image label.
    teamImage2: "Team Image 2",
    // Second team image label.
    teamImage3: "Team Image 3",
    // Third team image label.
    footerImage: "Footer Image",
    // Footer image label.
    eyebrow: "Eyebrow",
    // Eyebrow label.
    fieldTitle: "Title",
    // Title label.
    description: "Description",
    // Description label.
    primaryButton: "Primary Button",
    // Primary button label.
    secondaryButton: "Secondary Button",
    // Secondary button label.
    logo1: "Logo 1",
    // First logo label.
    logo2: "Logo 2",
    // Second logo label.
    logo3: "Logo 3",
    // Third logo label.
    logo4: "Logo 4",
    // Fourth logo label.
    logo5: "Logo 5",
    // Fifth logo label.
    logo6: "Logo 6",
    // Sixth logo label.
    service1Title: "Service 1 Title",
    // First service title label.
    service1Desc: "Service 1 Description",
    // First service description label.
    service2Title: "Service 2 Title",
    // Second service title label.
    service2Desc: "Service 2 Description",
    // Second service description label.
    service3Title: "Service 3 Title",
    // Third service title label.
    service3Desc: "Service 3 Description",
    // Third service description label.
    cta: "CTA",
    // CTA label.
    brand: "Brand",
    // Brand label.
    quoteText: "Quote Text",
    // Quote text label.
    author: "Author",
    // Author label.
    role: "Role / Location",
    // Role label.
    placeholder: "Placeholder",
    // Placeholder label.
    button: "Button",
    // Button label.
    member1Name: "Member 1 Name",
    // Member one name label.
    member1Role: "Member 1 Role",
    // Member one role label.
    member2Name: "Member 2 Name",
    // Member two name label.
    member2Role: "Member 2 Role",
    // Member two role label.
    member3Name: "Member 3 Name",
    // Member three name label.
    member3Role: "Member 3 Role",
    // Member three role label.
    question1: "Question 1",
    // First question label.
    answer1: "Answer 1",
    // First answer label.
    question2: "Question 2",
    // Second question label.
    answer2: "Answer 2",
    // Second answer label.
    question3: "Question 3",
    // Third question label.
    answer3: "Answer 3",
    // Third answer label.
    question4: "Question 4",
    // Fourth question label.
    answer4: "Answer 4",
    // Fourth answer label.
  },
};
// نهاية قاموس الترجمة الكامل للوحة الأدمن.

const sectionOrder: SectionKey[] = [
  // يحدد ترتيب أزرار الأقسام في الشريط الجانبي.
  "meta",
  // قسم بيانات الصفحة.
  "hero",
  // قسم الهيرو.
  "trust",
  // قسم الثقة.
  "services",
  // قسم الخدمات.
  "stats",
  // قسم الأرقام.
  "projects",
  // قسم المشاريع.
  "quote",
  // قسم الاقتباس.
  "newsletter",
  // قسم النشرة.
  "team",
  // قسم الفريق.
  "faq",
  // قسم الأسئلة.
  "contact",
  // قسم التواصل.
  "images",
  // قسم الصور.
];
// نهاية ترتيب الأقسام.

function emptyRecord(): HomeRecord {
  // ينشئ سجلًا افتراضيًا حتى لا تظهر الواجهة فارغة أثناء تحميل API.
  return {
    // بداية سجل home الافتراضي.
    slug: "home",
    // slug الصفحة.
    title_ar: "الرئيسية",
    // عنوان عربي افتراضي.
    title_en: "Home",
    // عنوان إنجليزي افتراضي.
    content_ar: "محتوى الصفحة الرئيسية.",
    // محتوى عربي افتراضي.
    content_en: "Home page content.",
    // محتوى إنجليزي افتراضي.
    is_published: true,
    // الصفحة منشورة افتراضيًا.
    page_type: "home",
    // نوع الصفحة.
    sections_json: {
      // بداية sections_json الافتراضي.
      dict: { ar: {}, en: {} },
      // قواميس النصوص الافتراضية.
      site: {
        // بيانات الموقع والصور الافتراضية.
        statsValue: "1,024,125.02",
        // قيمة افتراضية للإحصائيات.
        location_ar: "العراق / النجف",
        // موقع عربي افتراضي.
        location_en: "Iraq / Najaf",
        // موقع إنجليزي افتراضي.
        phone: "+964 7802335555",
        // هاتف افتراضي.
        email: "info@zuha.us",
        // بريد افتراضي.
        hero_image: "/pages/home/img/img (1).jpg",
        // صورة هيرو افتراضية.
        project_image_1: "/pages/home/img/img (2).jpg",
        // صورة مشروع أولى.
        project_image_2: "/pages/home/img/img (3).jpg",
        // صورة مشروع ثانية.
        project_image_3: "/pages/home/img/img (4).jpg",
        // صورة مشروع ثالثة.
        quote_image: "/pages/home/img/img (5).jpg",
        // صورة اقتباس.
        team_image_1: "/pages/home/img/img (6).jpg",
        // صورة فريق أولى.
        team_image_2: "/pages/home/img/img (7).jpg",
        // صورة فريق ثانية.
        team_image_3: "/pages/home/img/img (8).jpg",
        // صورة فريق ثالثة.
        brand_wall_image: "/pages/home/img/img (9).jpg",
        // صورة الفوتر.
      },
      // نهاية بيانات الموقع الافتراضية.
    },
    // نهاية sections_json.
  };
  // نهاية return.
}
// نهاية emptyRecord.

function clone<T>(value: T): T {
  // ينسخ الحالة بعمق حتى لا نعدل object الأصلي مباشرة.
  return JSON.parse(JSON.stringify(value)) as T;
  // JSON مناسب هنا لأن بياناتنا نصوص وأرقام وبوليان فقط.
}
// نهاية clone.

function clean(value: unknown) {
  // يحول أي قيمة إلى نص آمن للعرض داخل الحقول.
  return String(value ?? "");
  // يمنع ظهور undefined أو null داخل المدخلات.
}
// نهاية clean.

function TextInput({ label, value, onChange, dir }: { label: string; value: string; onChange: (value: string) => void; dir?: "rtl" | "ltr" }) {
  // مكوّن حقل نصي موحد لكل المدخلات القصيرة.
  return (
    // بداية JSX للحقل.
    <label className="admin-home-field">
      {/* حاوية label للمدخل. */}
      <span>{label}</span>
      {/* عنوان الحقل مترجم حسب القسم. */}
      <input className="admin-home-input" value={value} dir={dir} onChange={(event) => onChange(event.target.value)} />
      {/* input يرسل القيمة الجديدة للدالة القادمة من الأب. */}
    </label>
    // نهاية label.
  );
  // نهاية return.
}
// نهاية TextInput.

function TextArea({ label, value, onChange, rows = 4, dir }: { label: string; value: string; onChange: (value: string) => void; rows?: number; dir?: "rtl" | "ltr" }) {
  // مكوّن حقل نص طويل موحد للوصف والعناوين الطويلة.
  return (
    // بداية JSX للحقل الطويل.
    <label className="admin-home-field">
      {/* حاوية label للـ textarea. */}
      <span>{label}</span>
      {/* عنوان الحقل مترجم. */}
      <textarea className="admin-home-textarea" value={value} rows={rows} dir={dir} onChange={(event) => onChange(event.target.value)} />
      {/* textarea يرسل القيمة الجديدة عند الكتابة. */}
    </label>
    // نهاية label.
  );
  // نهاية return.
}
// نهاية TextArea.

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  // مكوّن تفعيل/تعطيل موحد لحالة النشر.
  return (
    // بداية JSX للتبديل.
    <label className="admin-home-toggle">
      {/* حاوية toggle. */}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {/* checkbox يرسل true/false للأب. */}
      <span>{label}</span>
      {/* نص التبديل مترجم. */}
    </label>
    // نهاية label.
  );
  // نهاية return.
}
// نهاية Toggle.

const previewFallbacks: Record<Lang, Dict> = {
  // قاموس احتياطي خاص بالمعاينة حتى لا تظهر مفاتيح مثل hero.title داخل لوحة الأدمن.
  ar: {
    // بداية القيم العربية الاحتياطية للمعاينة.
    "hero.eyebrow": "حلول عقارية موثوقة وشفافة",
    // النص التمهيدي للهيرو عند نقص القيمة من القاعدة.
    "hero.title": "استثمر بثقة. اكتشف فرصك",
    // عنوان الهيرو عند نقص القيمة من القاعدة.
    "hero.desc": "منصة رقمية متقدمة متخصصة في التطوير والاستثمار العقاري وإدارة الأصول.",
    // وصف الهيرو عند نقص القيمة من القاعدة.
    "services.eyebrow": "الخدمات الأساسية",
    // النص التمهيدي للخدمات عند نقص القيمة من القاعدة.
    "services.title": "خدمات عقارية موثوقة",
    // عنوان الخدمات عند نقص القيمة من القاعدة.
    "services.item1.title": "التطوير العقاري",
    // عنوان الخدمة الأولى عند نقص القيمة من القاعدة.
    "services.item2.title": "الاستشارات الاستثمارية",
    // عنوان الخدمة الثانية عند نقص القيمة من القاعدة.
    "services.item3.title": "إدارة الأصول",
    // عنوان الخدمة الثالثة عند نقص القيمة من القاعدة.
  },
  // نهاية القيم العربية الاحتياطية.
  en: {
    // بداية القيم الإنجليزية الاحتياطية للمعاينة.
    "hero.eyebrow": "Trusted, transparent real estate solutions",
    // Hero eyebrow fallback.
    "hero.title": "Invest with confidence. Discover your opportunities",
    // Hero title fallback.
    "hero.desc": "A modern platform focused on real-estate development, investment, and asset management.",
    // Hero description fallback.
    "services.eyebrow": "Core services",
    // Services eyebrow fallback.
    "services.title": "Reliable real-estate services",
    // Services title fallback.
    "services.item1.title": "Real Estate Development",
    // First service title fallback.
    "services.item2.title": "Investment Advisory",
    // Second service title fallback.
    "services.item3.title": "Asset Management",
    // Third service title fallback.
  },
  // نهاية القيم الإنجليزية الاحتياطية.
};
// نهاية قاموس المعاينة الاحتياطي.

function Preview({ item, lang, device }: { item: HomeRecord; lang: Lang; device: Device }) {
  // مكوّن المعاينة المباشرة لعرض أهم أجزاء الهوم أثناء التحرير.
  const dict = item.sections_json.dict[lang] || {};
  // اختيار قاموس النصوص حسب اللغة الحالية من بيانات الصفحة.
  const fallbacks = previewFallbacks[lang];
  // اختيار القاموس الاحتياطي حسب لغة المعاينة.
  const site = item.sections_json.site;
  // اختصار بيانات الصور والتواصل.
  const t = (key: string, fallback = "") => {
    // دالة قراءة النص داخل المعاينة مع منع ظهور مفاتيح التخزين الخام للمستخدم.
    const value = dict?.[key];
    // قراءة القيمة من قاموس الصفحة الحالي.
    if (typeof value === "string" && value.trim()) return value;
    // إذا كانت القيمة موجودة وغير فارغة نعرضها مباشرة.
    const fallbackValue = fallback || fallbacks?.[key] || "";
    // اختيار fallback صريح أولًا ثم fallback من قاموس المعاينة.
    return typeof fallbackValue === "string" ? fallbackValue : "";
    // إرجاع نص آمن بدل إرجاع key مثل hero.title.
  };
  // نهاية دالة قراءة نصوص المعاينة.

  return (
    // بداية JSX للمعاينة.
    <aside className="admin-home-preview">
      {/* صندوق المعاينة الخارجي. */}
      <div className="admin-home-preview__bar">
        {/* شريط رأس المعاينة. */}
        <strong>{ui[lang].preview}</strong>
        {/* عنوان المعاينة مترجم. */}
        <span>{ui[lang][device]}</span>
        {/* اسم الجهاز مترجم بدل النص الإنجليزي الثابت. */}
      </div>
      {/* نهاية شريط المعاينة. */}

      <div className="admin-home-preview__stage" data-device={device} dir={lang === "ar" ? "rtl" : "ltr"}>
        {/* منطقة عرض المعاينة مع اتجاه مناسب للغة. */}
        <div className="home-preview-card home-preview-card--blue">
          {/* كرت الهيرو داخل المعاينة. */}
          <img src={site.hero_image} alt="Hero" />
          {/* صورة الهيرو. */}
          <p>{t("hero.eyebrow")}</p>
          {/* النص التمهيدي للهيرو. */}
          <h2>{t("hero.title")}</h2>
          {/* عنوان الهيرو. */}
          <span>{t("hero.desc")}</span>
          {/* وصف الهيرو. */}
        </div>
        {/* نهاية كرت الهيرو. */}

        <div className="home-preview-card">
          {/* كرت الخدمات المختصرة. */}
          <p>{t("services.eyebrow")}</p>
          {/* النص التمهيدي للخدمات. */}
          <h3>{t("services.title")}</h3>
          {/* عنوان الخدمات. */}
          <div className="home-preview-grid">
            {/* شبكة عناوين الخدمات. */}
            <span>{t("services.item1.title")}</span>
            {/* عنوان الخدمة الأولى. */}
            <span>{t("services.item2.title")}</span>
            {/* عنوان الخدمة الثانية. */}
            <span>{t("services.item3.title")}</span>
            {/* عنوان الخدمة الثالثة. */}
          </div>
          {/* نهاية شبكة الخدمات. */}
        </div>
        {/* نهاية كرت الخدمات. */}

        <div className="home-preview-card">
          {/* كرت بيانات الإحصائيات والتواصل. */}
          <h3>${site.statsValue}</h3>
          {/* القيمة الرقمية. */}
          <p>{lang === "ar" ? site.location_ar : site.location_en}</p>
          {/* الموقع حسب اللغة. */}
          <p>{site.phone} · {site.email}</p>
          {/* الهاتف والبريد. */}
        </div>
        {/* نهاية كرت البيانات. */}

        <div className="home-preview-images">
          {/* صور المشاريع المختصرة. */}
          <img src={site.project_image_1} alt="Project 1" />
          {/* صورة المشروع الأولى. */}
          <img src={site.project_image_2} alt="Project 2" />
          {/* صورة المشروع الثانية. */}
          <img src={site.project_image_3} alt="Project 3" />
          {/* صورة المشروع الثالثة. */}
        </div>
        {/* نهاية صور المشاريع. */}
      </div>
      {/* نهاية منطقة المعاينة. */}
    </aside>
    // نهاية aside.
  );
  // نهاية return.
}
// نهاية Preview.

export default function HomePageEditor() {
  // المكوّن الرئيسي للـ Home Builder.
  const [item, setItem] = useState<HomeRecord>(emptyRecord());
  // حالة السجل الحالي الذي يتم تحريره.
  const [initial, setInitial] = useState<HomeRecord>(emptyRecord());
  // آخر نسخة محملة من السيرفر لاستخدامها عند reset.
  const [lang, setLang] = useState<Lang>("ar");
  // لغة واجهة الأدمن الحالية.
  const [device, setDevice] = useState<Device>("desktop");
  // جهاز المعاينة الحالي.
  const [active, setActive] = useState<SectionKey>("hero");
  // القسم النشط في المحرر.
  const [saving, setSaving] = useState(false);
  // حالة الحفظ.
  const [loading, setLoading] = useState(true);
  // حالة التحميل الأولي.
  const [notice, setNotice] = useState("");
  // رسالة نجاح أو تنبيه.
  const [error, setError] = useState("");
  // رسالة الخطأ.

  const copy = ui[lang];
  // قاموس واجهة الأدمن حسب اللغة الحالية.
  const dir = lang === "ar" ? "rtl" : "ltr";
  // اتجاه الواجهة حسب اللغة.
  const dict = item.sections_json.dict[lang] || {};
  // قاموس محتوى الهوم حسب اللغة.
  const site = item.sections_json.site;
  // بيانات الصور والتواصل.

  const stats = useMemo(() => {
    // حساب بطاقات الإحصائيات أعلى الصفحة.
    const arCount = Object.keys(item.sections_json.dict.ar || {}).length;
    // عدد مفاتيح العربية.
    const enCount = Object.keys(item.sections_json.dict.en || {}).length;
    // عدد مفاتيح الإنجليزية.
    return { arCount, enCount, imageCount: 9, published: item.is_published };
    // إرجاع الإحصائيات المطلوبة للعرض.
  }, [item]);
  // إعادة الحساب فقط عند تغير item.

  useEffect(() => {
    // تحميل سجل home من API عند فتح صفحة الأدمن.
    async function load() {
      // دالة داخلية حتى نستعمل async داخل useEffect.
      try {
        // بداية محاولة التحميل.
        setLoading(true);
        // تفعيل حالة التحميل.
        const response = await fetch("/api/admin/home-page", { cache: "no-store" });
        // طلب سجل home من API بدون كاش.
        const payload = await response.json();
        // قراءة JSON القادم من API.
        if (!response.ok || payload?.ok === false) throw new Error(payload?.message || "Failed to load home page.");
        // رمي خطأ واضح إذا فشل API.
        setItem(payload.item);
        // وضع السجل المحمل في حالة التحرير.
        setInitial(payload.item);
        // حفظ نسخة أصلية للرجوع إليها.
      } catch (loadError) {
        // التعامل مع فشل التحميل.
        setError(loadError instanceof Error ? loadError.message : "Failed to load home page.");
        // عرض رسالة خطأ للمستخدم.
      } finally {
        // تنفيذ نهائي بعد نجاح أو فشل.
        setLoading(false);
        // إيقاف حالة التحميل.
      }
      // نهاية try/catch/finally.
    }
    // نهاية دالة load.

    load();
    // تشغيل التحميل عند mount.
  }, []);
  // مصفوفة فارغة تعني تشغيل مرة واحدة.

  function switchLang(nextLang: Lang) {
    // تغيير لغة واجهة الأدمن ومزامنتها مع الكوكي.
    setLang(nextLang);
    // تحديث state اللغة.
    document.cookie = `lang=${nextLang}; path=/; max-age=31536000`;
    // حفظ اللغة في cookie لمدة سنة.
  }
  // نهاية switchLang.

  function setRoot(field: keyof Pick<HomeRecord, "title_ar" | "title_en" | "content_ar" | "content_en" | "is_published">, value: string | boolean) {
    // تحديث حقل رئيسي من سجل الصفحة.
    setItem((prev) => ({ ...prev, [field]: value }));
    // ننسخ السجل ونغير الحقل المطلوب فقط.
  }
  // نهاية setRoot.

  function setDict(key: string, value: string) {
    // تحديث نص داخل قاموس اللغة الحالية.
    setItem((prev) => {
      // استخدام functional update لتجنب مشاكل state القديم.
      const next = clone(prev);
      // نسخ عميق للسجل.
      next.sections_json.dict[lang][key] = value;
      // تحديث المفتاح المطلوب داخل قاموس اللغة النشطة.
      return next;
      // إرجاع السجل الجديد.
    });
    // نهاية setItem.
  }
  // نهاية setDict.

  function setSite<K extends keyof HomeSections["site"]>(key: K, value: string) {
    // تحديث صورة أو معلومة تواصل داخل site.
    setItem((prev) => {
      // استخدام functional update.
      const next = clone(prev);
      // نسخ عميق للسجل.
      next.sections_json.site[key] = value;
      // تحديث قيمة المفتاح المطلوب.
      return next;
      // إرجاع السجل الجديد.
    });
    // نهاية setItem.
  }
  // نهاية setSite.

  async function save() {
    // حفظ جميع تغييرات الصفحة الرئيسية عبر API.
    try {
      // بداية محاولة الحفظ.
      setSaving(true);
      // تشغيل حالة الحفظ.
      setNotice("");
      // مسح رسالة النجاح القديمة.
      setError("");
      // مسح رسالة الخطأ القديمة.
      const response = await fetch("/api/admin/home-page", {
        // إرسال طلب PATCH إلى API الهوم.
        method: "PATCH",
        // طريقة الحفظ.
        headers: { "Content-Type": "application/json" },
        // تحديد نوع المحتوى.
        body: JSON.stringify(item),
        // إرسال السجل الحالي كاملًا.
      });
      // نهاية fetch.
      const payload = await response.json().catch(() => ({}));
      // قراءة الاستجابة بأمان حتى لو لم تكن JSON.
      if (!response.ok || payload?.ok === false) throw new Error(payload?.message || "Failed to save home page.");
      // رمي خطأ إذا فشل الحفظ.
      setItem(payload.item);
      // تحديث الحالة بالسجل المحفوظ من السيرفر.
      setInitial(payload.item);
      // تحديث نسخة reset.
      setNotice(copy.saved);
      // عرض رسالة نجاح مترجمة.
    } catch (saveError) {
      // التعامل مع خطأ الحفظ.
      setError(saveError instanceof Error ? saveError.message : "Failed to save home page.");
      // عرض رسالة الخطأ.
    } finally {
      // بعد انتهاء الحفظ.
      setSaving(false);
      // إيقاف حالة الحفظ.
    }
    // نهاية try/catch/finally.
  }
  // نهاية save.

  function reset() {
    // الرجوع لآخر نسخة محملة أو محفوظة.
    setItem(clone(initial));
    // استرجاع النسخة الأصلية.
    setNotice("");
    // مسح التنبيه.
    setError("");
    // مسح الخطأ.
  }
  // نهاية reset.

  function renderActiveEditor() {
    // يعرض محرر القسم المختار فقط بدل إظهار كل الحقول مرة واحدة.
    if (active === "meta") {
      // إذا كان القسم المختار هو بيانات الصفحة.
      return (
        // بداية كرت بيانات الصفحة.
        <div className="admin-home-card">
          {/* كرت محرر بيانات الصفحة. */}
          <h2>{copy.meta}</h2>
          {/* عنوان القسم مترجم. */}
          <div className="admin-home-grid admin-home-grid--2">
            {/* شبكة حقول بعمودين. */}
            <TextInput label={copy.titleAr} value={item.title_ar} dir="rtl" onChange={(v) => setRoot("title_ar", v)} />
            {/* حقل العنوان العربي. */}
            <TextInput label={copy.titleEn} value={item.title_en} dir="ltr" onChange={(v) => setRoot("title_en", v)} />
            {/* حقل العنوان الإنجليزي. */}
            <TextArea label={copy.contentAr} value={item.content_ar} dir="rtl" onChange={(v) => setRoot("content_ar", v)} />
            {/* حقل المحتوى العربي. */}
            <TextArea label={copy.contentEn} value={item.content_en} dir="ltr" onChange={(v) => setRoot("content_en", v)} />
            {/* حقل المحتوى الإنجليزي. */}
          </div>
          {/* نهاية الشبكة. */}
          <Toggle label={copy.published} checked={item.is_published} onChange={(v) => setRoot("is_published", v)} />
          {/* مفتاح حالة النشر. */}
        </div>
        // نهاية الكرت.
      );
      // نهاية return.
    }
    // نهاية شرط meta.

    if (active === "images") {
      // إذا كان القسم المختار هو الصور والبيانات.
      return (
        // بداية كرت الصور والبيانات.
        <div className="admin-home-card">
          {/* كرت محرر الصور. */}
          <h2>{copy.images}</h2>
          {/* عنوان القسم مترجم. */}
          <div className="admin-home-grid admin-home-grid--2">
            {/* شبكة الحقول. */}
            <TextInput label={copy.statsValue} value={site.statsValue} onChange={(v) => setSite("statsValue", v)} />
            {/* قيمة الإحصائية. */}
            <TextInput label={copy.phone} value={site.phone} onChange={(v) => setSite("phone", v)} />
            {/* الهاتف. */}
            <TextInput label={copy.email} value={site.email} onChange={(v) => setSite("email", v)} />
            {/* البريد الإلكتروني. */}
            <TextInput label={copy.locationAr} value={site.location_ar} dir="rtl" onChange={(v) => setSite("location_ar", v)} />
            {/* الموقع العربي. */}
            <TextInput label={copy.locationEn} value={site.location_en} dir="ltr" onChange={(v) => setSite("location_en", v)} />
            {/* الموقع الإنجليزي. */}
            <TextInput label={copy.heroImage} value={site.hero_image} onChange={(v) => setSite("hero_image", v)} />
            {/* صورة الهيرو. */}
            <TextInput label={copy.projectImage1} value={site.project_image_1} onChange={(v) => setSite("project_image_1", v)} />
            {/* صورة المشروع الأولى. */}
            <TextInput label={copy.projectImage2} value={site.project_image_2} onChange={(v) => setSite("project_image_2", v)} />
            {/* صورة المشروع الثانية. */}
            <TextInput label={copy.projectImage3} value={site.project_image_3} onChange={(v) => setSite("project_image_3", v)} />
            {/* صورة المشروع الثالثة. */}
            <TextInput label={copy.quoteImage} value={site.quote_image} onChange={(v) => setSite("quote_image", v)} />
            {/* صورة الاقتباس. */}
            <TextInput label={copy.teamImage1} value={site.team_image_1} onChange={(v) => setSite("team_image_1", v)} />
            {/* صورة الفريق الأولى. */}
            <TextInput label={copy.teamImage2} value={site.team_image_2} onChange={(v) => setSite("team_image_2", v)} />
            {/* صورة الفريق الثانية. */}
            <TextInput label={copy.teamImage3} value={site.team_image_3} onChange={(v) => setSite("team_image_3", v)} />
            {/* صورة الفريق الثالثة. */}
            <TextInput label={copy.footerImage} value={site.brand_wall_image} onChange={(v) => setSite("brand_wall_image", v)} />
            {/* صورة الفوتر. */}
          </div>
          {/* نهاية الشبكة. */}
        </div>
        // نهاية الكرت.
      );
      // نهاية return.
    }
    // نهاية شرط images.

    const map: Record<Exclude<SectionKey, "meta" | "images">, Array<{ key: string; label: string; type?: "text" | "area" }>> = {
      // خريطة الحقول لكل قسم، وكل label فيها مترجم من copy.
      hero: [
        // حقول الهيرو.
        { key: "hero.eyebrow", label: copy.eyebrow },
        // النص التمهيدي.
        { key: "hero.title", label: copy.fieldTitle, type: "area" },
        // العنوان.
        { key: "hero.desc", label: copy.description, type: "area" },
        // الوصف.
        { key: "hero.btn1", label: copy.primaryButton },
        // الزر الرئيسي.
        { key: "hero.btn2", label: copy.secondaryButton },
        // الزر الثانوي.
      ],
      trust: [
        // حقول الثقة.
        { key: "trust.eyebrow", label: copy.eyebrow },
        // النص التمهيدي.
        { key: "trust.title", label: copy.fieldTitle },
        // العنوان.
        { key: "trust.desc", label: copy.description, type: "area" },
        // الوصف.
        { key: "trust.logo1", label: copy.logo1 },
        // شعار 1.
        { key: "trust.logo2", label: copy.logo2 },
        // شعار 2.
        { key: "trust.logo3", label: copy.logo3 },
        // شعار 3.
        { key: "trust.logo4", label: copy.logo4 },
        // شعار 4.
        { key: "trust.logo5", label: copy.logo5 },
        // شعار 5.
        { key: "trust.logo6", label: copy.logo6 },
        // شعار 6.
      ],
      services: [
        // حقول الخدمات.
        { key: "services.eyebrow", label: copy.eyebrow },
        // النص التمهيدي.
        { key: "services.title", label: copy.fieldTitle },
        // العنوان.
        { key: "services.desc", label: copy.description, type: "area" },
        // الوصف.
        { key: "services.item1.title", label: copy.service1Title },
        // عنوان الخدمة 1.
        { key: "services.item1.desc", label: copy.service1Desc, type: "area" },
        // وصف الخدمة 1.
        { key: "services.item2.title", label: copy.service2Title },
        // عنوان الخدمة 2.
        { key: "services.item2.desc", label: copy.service2Desc, type: "area" },
        // وصف الخدمة 2.
        { key: "services.item3.title", label: copy.service3Title },
        // عنوان الخدمة 3.
        { key: "services.item3.desc", label: copy.service3Desc, type: "area" },
        // وصف الخدمة 3.
        { key: "services.cta", label: copy.cta },
        // CTA.
      ],
      stats: [
        // حقول الأرقام.
        { key: "stats.eyebrow", label: copy.eyebrow },
        // النص التمهيدي.
        { key: "stats.title", label: copy.fieldTitle },
        // العنوان.
        { key: "stats.desc", label: copy.description, type: "area" },
        // الوصف.
      ],
      projects: [
        // حقول المشاريع.
        { key: "projects.title", label: copy.fieldTitle },
        // العنوان.
        { key: "projects.desc", label: copy.description, type: "area" },
        // الوصف.
      ],
      quote: [
        // حقول الاقتباس.
        { key: "quote.brand", label: copy.brand },
        // العلامة.
        { key: "quote.text", label: copy.quoteText, type: "area" },
        // نص الاقتباس.
        { key: "quote.author", label: copy.author },
        // صاحب الاقتباس.
        { key: "quote.role", label: copy.role },
        // الدور.
        { key: "quote.cta", label: copy.cta },
        // CTA.
      ],
      newsletter: [
        // حقول النشرة.
        { key: "newsletter.title", label: copy.fieldTitle },
        // العنوان.
        { key: "newsletter.desc", label: copy.description, type: "area" },
        // الوصف.
        { key: "newsletter.placeholder", label: copy.placeholder },
        // Placeholder.
        { key: "newsletter.btn", label: copy.button },
        // الزر.
      ],
      team: [
        // حقول الفريق.
        { key: "team.eyebrow", label: copy.eyebrow },
        // النص التمهيدي.
        { key: "team.title", label: copy.fieldTitle },
        // العنوان.
        { key: "team.desc", label: copy.description, type: "area" },
        // الوصف.
        { key: "team.item1.name", label: copy.member1Name },
        // اسم العضو 1.
        { key: "team.item1.role", label: copy.member1Role },
        // دور العضو 1.
        { key: "team.item2.name", label: copy.member2Name },
        // اسم العضو 2.
        { key: "team.item2.role", label: copy.member2Role },
        // دور العضو 2.
        { key: "team.item3.name", label: copy.member3Name },
        // اسم العضو 3.
        { key: "team.item3.role", label: copy.member3Role },
        // دور العضو 3.
      ],
      faq: [
        // حقول الأسئلة.
        { key: "faq.title", label: copy.fieldTitle },
        // العنوان.
        { key: "faq.desc", label: copy.description, type: "area" },
        // الوصف.
        { key: "faq.q1", label: copy.question1 },
        // السؤال 1.
        { key: "faq.a1", label: copy.answer1, type: "area" },
        // الإجابة 1.
        { key: "faq.q2", label: copy.question2 },
        // السؤال 2.
        { key: "faq.a2", label: copy.answer2, type: "area" },
        // الإجابة 2.
        { key: "faq.q3", label: copy.question3 },
        // السؤال 3.
        { key: "faq.a3", label: copy.answer3, type: "area" },
        // الإجابة 3.
        { key: "faq.q4", label: copy.question4 },
        // السؤال 4.
        { key: "faq.a4", label: copy.answer4, type: "area" },
        // الإجابة 4.
        { key: "faq.cta", label: copy.cta },
        // CTA.
      ],
      contact: [
        // حقول التواصل.
        { key: "contact.eyebrow", label: copy.eyebrow },
        // النص التمهيدي.
        { key: "contact.desc", label: copy.description, type: "area" },
        // الوصف.
      ],
    };
    // نهاية خريطة الحقول.

    return (
      // بداية كرت القسم الديناميكي.
      <div className="admin-home-card">
        {/* كرت محرر القسم النشط. */}
        <h2>{copy[active]}</h2>
        {/* عنوان القسم مترجم بالكامل. */}
        <div className="admin-home-grid admin-home-grid--2">
          {/* شبكة الحقول. */}
          {map[active as Exclude<SectionKey, "meta" | "images">].map((field) => {
            // المرور على حقول القسم الحالي.
            const value = clean(dict[field.key]);
            // قراءة القيمة الحالية من قاموس اللغة.
            const fieldDir = lang === "ar" ? "rtl" : "ltr";
            // تحديد اتجاه الحقل حسب اللغة.
            return field.type === "area" ? (
              // إذا كان الحقل طويلًا نعرض textarea.
              <TextArea key={field.key} label={field.label} value={value} dir={fieldDir} onChange={(v) => setDict(field.key, v)} />
              // TextArea للقيمة الحالية.
            ) : (
              // إذا كان الحقل قصيرًا نعرض input.
              <TextInput key={field.key} label={field.label} value={value} dir={fieldDir} onChange={(v) => setDict(field.key, v)} />
              // TextInput للقيمة الحالية.
            );
            // نهاية return الشرطي.
          })}
          {/* نهاية map. */}
        </div>
        {/* نهاية الشبكة. */}
      </div>
      // نهاية الكرت.
    );
    // نهاية return.
  }
  // نهاية renderActiveEditor.

  if (loading) {
    // إذا كانت البيانات لا تزال تُحمّل.
    return <main className="admin-home-page"><div className="admin-home-card">{copy.loading}</div></main>;
    // عرض رسالة تحميل مترجمة.
  }
  // نهاية شرط التحميل.

  return (
    // بداية واجهة Home Builder.
    <main className="admin-home-page" dir={dir}>
      {/* الغلاف الرئيسي باتجاه اللغة الحالية. */}
      <header className="admin-home-header">
        {/* رأس الصفحة وفيه العنوان والأزرار. */}
        <div>
          {/* حاوية النصوص الرئيسية. */}
          <p>{copy.cms}</p>
          {/* اسم النظام. */}
          <h1>{copy.title}</h1>
          {/* عنوان الصفحة. */}
          <span>{copy.desc}</span>
          {/* وصف الصفحة. */}
        </div>
        {/* نهاية النصوص الرئيسية. */}

        <div className="admin-home-actions">
          {/* أزرار التحكم. */}
          <div className="admin-home-lang">
            {/* مبدل اللغة الداخلي. */}
            <button className={lang === "ar" ? "is-active" : ""} onClick={() => switchLang("ar")} type="button">AR</button>
            {/* زر العربية. */}
            <button className={lang === "en" ? "is-active" : ""} onClick={() => switchLang("en")} type="button">EN</button>
            {/* زر الإنجليزية. */}
          </div>
          {/* نهاية مبدل اللغة. */}
          <a href="/" target="_blank" rel="noreferrer" className="admin-home-ghost">{copy.open}</a>
          {/* رابط فتح الصفحة العامة. */}
          <button type="button" className="admin-home-ghost" onClick={reset} disabled={saving}>{copy.reset}</button>
          {/* زر إلغاء التعديلات. */}
          <button type="button" className="admin-home-primary" onClick={save} disabled={saving}>{saving ? copy.saving : copy.save}</button>
          {/* زر الحفظ. */}
        </div>
        {/* نهاية أزرار التحكم. */}
      </header>
      {/* نهاية رأس الصفحة. */}

      <section className="admin-home-stats">
        {/* بطاقات الإحصائيات. */}
        <article><span>{copy.arKeys}</span><strong>{stats.arCount}</strong></article>
        {/* بطاقة مفاتيح العربية. */}
        <article><span>{copy.enKeys}</span><strong>{stats.enCount}</strong></article>
        {/* بطاقة مفاتيح الإنجليزية. */}
        <article><span>{copy.imageCount}</span><strong>{stats.imageCount}</strong></article>
        {/* بطاقة عدد الصور. */}
        <article><span>{copy.status}</span><strong>{stats.published ? copy.live : copy.draft}</strong></article>
        {/* بطاقة حالة النشر. */}
      </section>
      {/* نهاية الإحصائيات. */}

      {notice ? <div className="admin-home-notice admin-home-notice--ok">{notice}</div> : null}
      {/* رسالة نجاح الحفظ عند وجودها. */}
      {error ? <div className="admin-home-notice admin-home-notice--error">{error}</div> : null}
      {/* رسالة الخطأ عند وجودها. */}

      <section className="admin-home-workspace">
        {/* مساحة العمل بثلاث مناطق: القائمة، المحرر، المعاينة. */}
        <nav className="admin-home-sidebar" aria-label={copy.sections}>
          {/* قائمة الأقسام الجانبية. */}
          <h2>{copy.sections}</h2>
          {/* عنوان القائمة. */}
          {sectionOrder.map((key) => (
            // توليد أزرار الأقسام.
            <button key={key} type="button" className={active === key ? "is-active" : ""} onClick={() => setActive(key)}>
              {/* زر قسم واحد. */}
              {copy[key]}
              {/* اسم القسم مترجم. */}
            </button>
            // نهاية زر القسم.
          ))}
          {/* نهاية توليد الأقسام. */}
        </nav>
        {/* نهاية القائمة. */}

        <section className="admin-home-editor">
          {/* منطقة المحرر المركزي. */}
          {renderActiveEditor()}
          {/* عرض القسم النشط فقط. */}
        </section>
        {/* نهاية المحرر. */}

        <section className="admin-home-previewWrap">
          {/* منطقة المعاينة اليمنى. */}
          <div className="admin-home-deviceTabs">
            {/* أزرار تبديل الجهاز. */}
            {(["desktop", "tablet", "mobile"] as Device[]).map((entry) => (
              // توليد أزرار الأجهزة.
              <button key={entry} type="button" className={device === entry ? "is-active" : ""} onClick={() => setDevice(entry)}>
                {/* زر جهاز واحد. */}
                {copy[entry]}
                {/* اسم الجهاز مترجم. */}
              </button>
              // نهاية زر الجهاز.
            ))}
            {/* نهاية توليد أزرار الأجهزة. */}
          </div>
          {/* نهاية أزرار الأجهزة. */}
          <Preview item={item} lang={lang} device={device} />
          {/* المعاينة المباشرة. */}
        </section>
        {/* نهاية المعاينة. */}
      </section>
      {/* نهاية مساحة العمل. */}
    </main>
    // نهاية main.
  );
  // نهاية return.
}
// نهاية HomePageEditor.
