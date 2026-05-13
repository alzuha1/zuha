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


type AdvancedSectionStyle = {
  // إعدادات تصميم خاصة بقسم كامل مثل hero أو services.
  background: string;
  // لون خلفية القسم المحدد.
  textColor: string;
  // لون النص الافتراضي داخل القسم.
  padding: number;
  // المسافة الداخلية للقسم في المعاينة.
  radius: number;
  // تدوير زوايا حاوية القسم.
  shadow: number;
  // قوة ظل حاوية القسم.
};
// نهاية نوع تصميم القسم.

type AdvancedElementStyle = {
  // إعدادات تصميم خاصة بعنصر داخل القسم مثل العنوان أو الصورة أو الكرت.
  color: string;
  // لون النص أو الأيقونة.
  background: string;
  // خلفية العنصر إن كان كرتًا أو زرًا أو أيقونة.
  size: number;
  // حجم الخط أو حجم العنصر حسب نوعه.
  weight: number;
  // سماكة الخط للعناصر النصية.
  radius: number;
  // تدوير الزوايا للعنصر.
  shadow: number;
  // قوة الظل للعنصر.
  borderWidth: number;
  // سماكة الحد.
  borderColor: string;
  // لون الحد.
  opacity: number;
  // شفافية العنصر.
  scale: number;
  // تكبير العنصر بصريًا في المعاينة.
  padding: number;
  // المسافة الداخلية للكروت والأزرار.
  align: "start" | "center" | "end";
  // محاذاة النص داخل العنصر.
};
// نهاية نوع تصميم العنصر.

type AdvancedDesignSettings = {
  // نظام التصميم المتقدم: اختيار قسم ثم عنصر ثم تعديل خصائصه.
  activeSection: string;
  // القسم المحدد داخل لوحة التصميم.
  activeElement: string;
  // العنصر المحدد داخل القسم.
  sections: Record<string, AdvancedSectionStyle>;
  // إعدادات كل قسم على حدة.
  elements: Record<string, AdvancedElementStyle>;
  // إعدادات كل عنصر على حدة.
};
// نهاية نوع التصميم المتقدم.

type DesignSettings = {
  // يجمع إعدادات التصميم القابلة للتحكم من لوحة الهوم.
  colors: {
    // مجموعة ألوان الهوية والخلفيات والأزرار.
    primary: string;
    // اللون الأساسي للأزرار والمساحات المهمة.
    secondary: string;
    // اللون الثانوي مثل الذهبي أو لون التمييز.
    pageBg: string;
    // لون خلفية الصفحة أو الخلفية العامة.
    sectionBg: string;
    // لون خلفية الكروت والأقسام الفاتحة.
    text: string;
    // لون النص الأساسي.
    mutedText: string;
    // لون النصوص الثانوية والوصف.
    buttonBg: string;
    // لون خلفية الأزرار.
    buttonText: string;
    // لون نص الأزرار.
  };
  typography: {
    // إعدادات الخطوط والأحجام.
    heroTitleSize: number;
    // حجم عنوان الهيرو بالبكسل.
    sectionTitleSize: number;
    // حجم عناوين الأقسام بالبكسل.
    bodySize: number;
    // حجم النصوص العامة بالبكسل.
    buttonSize: number;
    // حجم نص الأزرار بالبكسل.
    fontWeight: number;
    // سماكة الخط العامة للعناوين المهمة.
    lineHeight: number;
    // ارتفاع السطر للنصوص.
  };
  images: {
    // إعدادات عرض الصور بدون تعديل ملف الصورة الأصلي.
    radius: number;
    // تدوير زوايا الصور بالبكسل.
    shadow: number;
    // قوة ظل الصور.
    borderWidth: number;
    // سماكة إطار الصورة.
    borderColor: string;
    // لون إطار الصورة.
    brightness: number;
    // سطوع الصورة.
    contrast: number;
    // تباين الصورة.
    saturation: number;
    // تشبع ألوان الصورة.
    scale: number;
    // تكبير الصورة داخل الإطار.
  };
  backgrounds: {
    // إعدادات الخلفيات والتدرجات.
    heroOverlay: number;
    // شفافية الطبقة الداكنة فوق صور الهيرو.
    gradientEnabled: boolean;
    // تفعيل أو تعطيل التدرج.
    gradientFrom: string;
    // بداية لون التدرج.
    gradientTo: string;
    // نهاية لون التدرج.
  };
  advanced: AdvancedDesignSettings;
  // إعدادات التصميم المتقدم لكل قسم ولكل عنصر داخل الصفحة.
};
// نهاية تعريف إعدادات التصميم.

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
  design: DesignSettings;
  // إعدادات التصميم الخاصة بالهوم.
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
  | "images"
  // قسم الصور والبيانات العامة.
  | "design";
  // قسم التحكم بالتصميم.

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
  design: string;
  designColors: string;
  designTypography: string;
  designImages: string;
  designBackgrounds: string;
  primaryColor: string;
  secondaryColor: string;
  pageBg: string;
  sectionBg: string;
  textColor: string;
  mutedTextColor: string;
  buttonBg: string;
  buttonText: string;
  heroTitleSize: string;
  sectionTitleSize: string;
  bodySize: string;
  buttonSize: string;
  fontWeight: string;
  lineHeight: string;
  imageRadius: string;
  imageShadow: string;
  imageBorderWidth: string;
  imageBorderColor: string;
  imageBrightness: string;
  imageContrast: string;
  imageSaturation: string;
  imageScale: string;
  heroOverlay: string;
  gradientEnabled: string;
  gradientFrom: string;
  gradientTo: string;
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
    design: "التصميم",
    // اسم قسم التحكم بالتصميم.
    designColors: "الألوان",
    // عنوان مجموعة الألوان.
    designTypography: "الخطوط والأحجام",
    // عنوان مجموعة الخطوط.
    designImages: "الصور والإطارات والظل",
    // عنوان مجموعة الصور.
    designBackgrounds: "الخلفيات والتدرجات",
    // عنوان مجموعة الخلفيات.
    primaryColor: "اللون الأساسي",
    // Label اللون الأساسي.
    secondaryColor: "اللون الثانوي",
    // Label اللون الثانوي.
    pageBg: "خلفية الصفحة",
    // Label خلفية الصفحة.
    sectionBg: "خلفية الأقسام",
    // Label خلفية الأقسام.
    textColor: "لون النص",
    // Label لون النص.
    mutedTextColor: "لون النص الثانوي",
    // Label النص الثانوي.
    buttonBg: "لون الزر",
    // Label لون الزر.
    buttonText: "لون نص الزر",
    // Label لون نص الزر.
    heroTitleSize: "حجم عنوان الهيرو",
    // Label حجم عنوان الهيرو.
    sectionTitleSize: "حجم عناوين الأقسام",
    // Label حجم عناوين الأقسام.
    bodySize: "حجم النص العام",
    // Label حجم النص العام.
    buttonSize: "حجم نص الزر",
    // Label حجم نص الزر.
    fontWeight: "سماكة الخط",
    // Label سماكة الخط.
    lineHeight: "ارتفاع السطر",
    // Label ارتفاع السطر.
    imageRadius: "تدوير زوايا الصور",
    // Label radius الصور.
    imageShadow: "قوة ظل الصور",
    // Label shadow الصور.
    imageBorderWidth: "سماكة الإطار",
    // Label إطار الصورة.
    imageBorderColor: "لون الإطار",
    // Label لون الإطار.
    imageBrightness: "سطوع الصورة",
    // Label السطوع.
    imageContrast: "تباين الصورة",
    // Label التباين.
    imageSaturation: "تشبع الألوان",
    // Label التشبع.
    imageScale: "تكبير الصورة",
    // Label التكبير.
    heroOverlay: "شفافية التظليل",
    // Label overlay.
    gradientEnabled: "تفعيل التدرج",
    // Label تفعيل التدرج.
    gradientFrom: "بداية التدرج",
    // Label بداية التدرج.
    gradientTo: "نهاية التدرج",
    // Label نهاية التدرج.
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
    design: "Design",
    // Design controls section label.
    designColors: "Colors",
    // Colors group label.
    designTypography: "Typography & Sizes",
    // Typography group label.
    designImages: "Images, Borders & Shadow",
    // Images group label.
    designBackgrounds: "Backgrounds & Gradients",
    // Background group label.
    primaryColor: "Primary Color",
    // Primary color label.
    secondaryColor: "Secondary Color",
    // Secondary color label.
    pageBg: "Page Background",
    // Page background label.
    sectionBg: "Section Background",
    // Section background label.
    textColor: "Text Color",
    // Text color label.
    mutedTextColor: "Muted Text Color",
    // Muted text label.
    buttonBg: "Button Color",
    // Button background label.
    buttonText: "Button Text Color",
    // Button text label.
    heroTitleSize: "Hero Title Size",
    // Hero title size label.
    sectionTitleSize: "Section Title Size",
    // Section title size label.
    bodySize: "Body Font Size",
    // Body font size label.
    buttonSize: "Button Font Size",
    // Button font size label.
    fontWeight: "Font Weight",
    // Font weight label.
    lineHeight: "Line Height",
    // Line height label.
    imageRadius: "Image Radius",
    // Image radius label.
    imageShadow: "Image Shadow",
    // Image shadow label.
    imageBorderWidth: "Border Width",
    // Image border width label.
    imageBorderColor: "Border Color",
    // Image border color label.
    imageBrightness: "Brightness",
    // Brightness label.
    imageContrast: "Contrast",
    // Contrast label.
    imageSaturation: "Saturation",
    // Saturation label.
    imageScale: "Image Scale",
    // Scale label.
    heroOverlay: "Overlay Opacity",
    // Overlay label.
    gradientEnabled: "Enable Gradient",
    // Gradient toggle label.
    gradientFrom: "Gradient From",
    // Gradient start label.
    gradientTo: "Gradient To",
    // Gradient end label.
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
  "design",
  // قسم التصميم.
];
// نهاية ترتيب الأقسام.

type DesignElementKind = "text" | "image" | "card" | "button" | "icon";
// يحدد نوع العنصر داخل لوحة التصميم المتقدم حتى نعرض له حقولًا مناسبة.

type DesignSectionOption = { key: string; label: string };
// يمثل خيار قسم داخل قائمة اختيار القسم المراد تصميمه.

type DesignElementOption = { key: string; label: string; kind: DesignElementKind };
// يمثل خيار عنصر داخل القسم المختار مع نوعه التصميمي.

const designSectionOptions: DesignSectionOption[] = [
  // قائمة الأقسام التي يمكن تعديل تصميمها بشكل مستقل داخل المعاينة.
  { key: "hero", label: "Hero / الهيرو" },
  // قسم الهيرو.
  { key: "trust", label: "Trust / الثقة" },
  // قسم الثقة والمؤشرات.
  { key: "services", label: "Services / الخدمات" },
  // قسم الخدمات المختصرة.
  { key: "stats", label: "Stats / الأرقام" },
  // قسم الإحصائيات.
  { key: "projects", label: "Projects / المشاريع" },
  // قسم المشاريع.
  { key: "team", label: "Team / الفريق" },
  // قسم الفريق.
  { key: "faq", label: "FAQ / الأسئلة" },
  // قسم الأسئلة الشائعة.
  { key: "contact", label: "Contact / التواصل" },
  // قسم التواصل والفوتر.
];
// نهاية قائمة أقسام التصميم المتقدم.

const designElementOptions: Record<string, DesignElementOption[]> = {
  // خريطة العناصر القابلة للتصميم داخل كل قسم.
  hero: [
    // عناصر قسم الهيرو.
    { key: "hero.eyebrow", label: "Hero Eyebrow / النص التمهيدي", kind: "text" },
    // النص التمهيدي للهيرو.
    { key: "hero.title", label: "Hero Title / عنوان الهيرو", kind: "text" },
    // عنوان الهيرو.
    { key: "hero.desc", label: "Hero Description / وصف الهيرو", kind: "text" },
    // وصف الهيرو.
    { key: "hero.image", label: "Hero Image / صورة الهيرو", kind: "image" },
    // صورة الهيرو.
    { key: "button.primary", label: "Primary Button / الزر الرئيسي", kind: "button" },
    // الزر الرئيسي.
  ],
  trust: [
    // عناصر قسم الثقة.
    { key: "trust.title", label: "Trust Title / عنوان الثقة", kind: "text" },
    // عنوان الثقة.
    { key: "trust.card", label: "Trust Cards / بطاقات الثقة", kind: "card" },
    // بطاقات الثقة.
  ],
  services: [
    // عناصر قسم الخدمات.
    { key: "services.title", label: "Services Title / عنوان الخدمات", kind: "text" },
    // عنوان الخدمات.
    { key: "services.card", label: "Service Cards / كروت الخدمات", kind: "card" },
    // كروت الخدمات.
    { key: "services.icon", label: "Service Icons / أيقونات الخدمات", kind: "icon" },
    // أيقونات الخدمات.
  ],
  stats: [
    // عناصر قسم الإحصائيات.
    { key: "stats.value", label: "Stats Value / الرقم", kind: "text" },
    // الرقم الرئيسي.
    { key: "stats.card", label: "Stats Card / كرت الأرقام", kind: "card" },
    // كرت الأرقام.
  ],
  projects: [
    // عناصر قسم المشاريع.
    { key: "projects.title", label: "Projects Title / عنوان المشاريع", kind: "text" },
    // عنوان المشاريع.
    { key: "projects.image", label: "Project Images / صور المشاريع", kind: "image" },
    // صور المشاريع.
  ],
  team: [
    // عناصر قسم الفريق.
    { key: "team.title", label: "Team Title / عنوان الفريق", kind: "text" },
    // عنوان الفريق.
    { key: "team.card", label: "Team Cards / كروت الفريق", kind: "card" },
    // كروت الفريق.
  ],
  faq: [
    // عناصر قسم الأسئلة.
    { key: "faq.title", label: "FAQ Title / عنوان الأسئلة", kind: "text" },
    // عنوان الأسئلة.
    { key: "faq.card", label: "FAQ Cards / كروت الأسئلة", kind: "card" },
    // كروت الأسئلة.
  ],
  contact: [
    // عناصر قسم التواصل.
    { key: "contact.title", label: "Contact Title / عنوان التواصل", kind: "text" },
    // عنوان التواصل.
    { key: "contact.card", label: "Contact Cards / كروت التواصل", kind: "card" },
    // كروت التواصل.
  ],
};
// نهاية خريطة عناصر التصميم المتقدم.


function defaultAdvancedSection(background = "#ffffff", textColor = "#111827"): AdvancedSectionStyle {
  // يرجع إعدادات افتراضية آمنة لقسم واحد داخل التصميم المتقدم.
  return {
    // بداية إعدادات القسم.
    background,
    // خلفية القسم.
    textColor,
    // لون النص داخل القسم.
    padding: 22,
    // المسافة الداخلية الافتراضية.
    radius: 26,
    // تدوير الزوايا الافتراضي.
    shadow: 18,
    // قوة الظل الافتراضية.
  };
  // نهاية return.
}
// نهاية defaultAdvancedSection.

function defaultAdvancedElement(color = "#111827", background = "#ffffff", size = 18): AdvancedElementStyle {
  // يرجع إعدادات افتراضية آمنة لعنصر واحد داخل التصميم المتقدم.
  return {
    // بداية إعدادات العنصر.
    color,
    // لون النص أو الأيقونة.
    background,
    // خلفية العنصر.
    size,
    // حجم الخط أو العنصر.
    weight: 800,
    // سماكة الخط.
    radius: 18,
    // تدوير الزوايا.
    shadow: 12,
    // قوة الظل.
    borderWidth: 1,
    // سماكة الحد.
    borderColor: "#e5e7eb",
    // لون الحد.
    opacity: 1,
    // شفافية كاملة افتراضيًا.
    scale: 1,
    // لا يوجد تكبير افتراضي.
    padding: 14,
    // حشو داخلي مناسب.
    align: "start",
    // المحاذاة الافتراضية.
  };
  // نهاية return.
}
// نهاية defaultAdvancedElement.

function defaultAdvancedDesign(): AdvancedDesignSettings {
  // يرجع خريطة إعدادات متقدمة جاهزة لكل قسم وعنصر مهم داخل الهوم.
  return {
    // بداية إعدادات التصميم المتقدم.
    activeSection: "hero",
    // القسم الافتراضي المحدد عند فتح لوحة التصميم.
    activeElement: "hero.title",
    // العنصر الافتراضي المحدد عند فتح لوحة التصميم.
    sections: {
      // إعدادات الأقسام الرئيسية.
      hero: defaultAdvancedSection("#2148a3", "#ffffff"),
      // قسم الهيرو.
      trust: defaultAdvancedSection("#ffffff", "#111827"),
      // قسم الثقة.
      services: defaultAdvancedSection("#ffffff", "#111827"),
      // قسم الخدمات.
      stats: defaultAdvancedSection("#f8fafc", "#111827"),
      // قسم الأرقام.
      projects: defaultAdvancedSection("#ffffff", "#111827"),
      // قسم المشاريع.
      quote: defaultAdvancedSection("#f8fafc", "#111827"),
      // قسم الاقتباس.
      newsletter: defaultAdvancedSection("#ffffff", "#111827"),
      // قسم النشرة.
      team: defaultAdvancedSection("#ffffff", "#111827"),
      // قسم الفريق.
      faq: defaultAdvancedSection("#f8fafc", "#111827"),
      // قسم الأسئلة.
      contact: defaultAdvancedSection("#050505", "#ffffff"),
      // قسم التواصل والفوتر.
    },
    // نهاية sections.
    elements: {
      // إعدادات العناصر داخل الأقسام.
      "hero.title": defaultAdvancedElement("#ffffff", "transparent", 42),
      // عنوان الهيرو.
      "hero.desc": defaultAdvancedElement("#e5e7eb", "transparent", 16),
      // وصف الهيرو.
      "hero.eyebrow": defaultAdvancedElement("#dbeafe", "transparent", 14),
      // النص التمهيدي للهيرو.
      "hero.image": defaultAdvancedElement("#111827", "#ffffff", 18),
      // صورة الهيرو.
      "services.title": defaultAdvancedElement("#111827", "transparent", 30),
      // عنوان الخدمات.
      "services.card": defaultAdvancedElement("#111827", "#ffffff", 16),
      // كروت الخدمات.
      "services.icon": defaultAdvancedElement("#2148a3", "#eef4ff", 22),
      // أيقونات الخدمات.
      "stats.value": defaultAdvancedElement("#2148a3", "transparent", 34),
      // رقم الإحصائية.
      "projects.image": defaultAdvancedElement("#111827", "#ffffff", 18),
      // صور المشاريع.
      "team.card": defaultAdvancedElement("#111827", "#ffffff", 16),
      // كروت الفريق.
      "faq.card": defaultAdvancedElement("#111827", "#ffffff", 16),
      // كروت الأسئلة.
      "contact.card": defaultAdvancedElement("#ffffff", "#111111", 16),
      // كروت التواصل.
      "button.primary": defaultAdvancedElement("#ffffff", "#2148a3", 16),
      // الزر الرئيسي.
    },
    // نهاية elements.
  };
  // نهاية return.
}
// نهاية defaultAdvancedDesign.

function defaultDesign(): DesignSettings {
  // يرجع القيم الافتراضية الآمنة للتصميم حتى لا تنكسر الواجهة عند غياب design من قاعدة البيانات.
  return {
    // بداية إعدادات التصميم.
    colors: {
      // ألوان الهوية والخلفيات.
      primary: "#2148a3",
      // اللون الأساسي.
      secondary: "#d4af37",
      // اللون الثانوي الذهبي.
      pageBg: "#326bf6",
      // خلفية الصفحة الزرقاء الحالية.
      sectionBg: "#ffffff",
      // خلفية الكروت والأقسام.
      text: "#111827",
      // لون النص الأساسي.
      mutedText: "#64748b",
      // لون النصوص الثانوية.
      buttonBg: "#2148a3",
      // لون الأزرار.
      buttonText: "#ffffff",
      // لون نص الأزرار.
    },
    typography: {
      // أحجام الخطوط.
      heroTitleSize: 56,
      // حجم عنوان الهيرو الافتراضي.
      sectionTitleSize: 34,
      // حجم عنوان القسم.
      bodySize: 16,
      // حجم النص العام.
      buttonSize: 16,
      // حجم نص الزر.
      fontWeight: 800,
      // سماكة العناوين.
      lineHeight: 1.35,
      // ارتفاع السطر.
    },
    images: {
      // إعدادات الصور.
      radius: 28,
      // تدوير الزوايا.
      shadow: 28,
      // قوة الظل.
      borderWidth: 0,
      // سماكة الإطار.
      borderColor: "#d4af37",
      // لون الإطار.
      brightness: 1,
      // السطوع.
      contrast: 1,
      // التباين.
      saturation: 1,
      // التشبع.
      scale: 1,
      // التكبير.
    },
    backgrounds: {
      // الخلفيات.
      heroOverlay: 0.18,
      // شفافية التظليل.
      gradientEnabled: true,
      // تفعيل التدرج.
      gradientFrom: "#2148a3",
      // بداية التدرج.
      gradientTo: "#326bf6",
      // نهاية التدرج.
    },
    advanced: defaultAdvancedDesign(),
    // إعدادات التصميم المتقدم لكل قسم وعنصر.
  };
  // نهاية return.
}
// نهاية defaultDesign.

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
      design: defaultDesign(),
      // إعدادات التصميم الافتراضية.
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

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  // حقل لون موحد يجمع color picker مع input نصي للقيمة hex.
  return (
    // بداية حقل اللون.
    <label className="admin-home-field admin-home-color-field">
      {/* عنوان حقل اللون. */}
      <span>{label}</span>
      {/* صف اللون. */}
      <div className="admin-home-color-row">
        {/* Color picker سريع. */}
        <input type="color" value={value || "#000000"} onChange={(event) => onChange(event.target.value)} />
        {/* Input نصي يسمح بلصق HEX يدويًا. */}
        <input className="admin-home-input" value={value} dir="ltr" onChange={(event) => onChange(event.target.value)} />
      </div>
    </label>
    // نهاية label.
  );
  // نهاية return.
}
// نهاية ColorInput.

function RangeInput({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  // حقل Range للأحجام والفلاتر مع إظهار الرقم الحالي.
  return (
    // بداية حقل range.
    <label className="admin-home-field admin-home-range-field">
      {/* رأس الحقل: الاسم والقيمة الحالية. */}
      <span className="admin-home-range-field__head">
        {/* اسم الحقل. */}
        <span>{label}</span>
        {/* القيمة الرقمية الحالية. */}
        <strong>{value}</strong>
      </span>
      {/* شريط التحكم. */}
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
    // نهاية label.
  );
  // نهاية return.
}
// نهاية RangeInput.

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
  const design = item.sections_json.design || defaultDesign();
  // إعدادات التصميم الحالية أو الافتراضية.
  const advanced = design.advanced || defaultAdvancedDesign();
  // إعدادات التصميم المتقدم أو الافتراضية إذا كان السجل قديمًا.
  const sectionStyle = (key: string) => advanced.sections?.[key] || defaultAdvancedSection();
  // قراءة تصميم قسم محدد بشكل آمن.
  const elementStyle = (key: string) => advanced.elements?.[key] || defaultAdvancedElement();
  // قراءة تصميم عنصر محدد بشكل آمن.
  const sectionPreviewStyle = (key: string): React.CSSProperties => {
    // تحويل تصميم القسم إلى CSS مباشر للمعاينة.
    const entry = sectionStyle(key);
    // قراءة إعدادات القسم.
    return {
      // بداية CSS section.
      background: entry.background,
      // خلفية القسم.
      color: entry.textColor,
      // لون النص داخل القسم.
      padding: `${entry.padding}px`,
      // الحشو الداخلي.
      borderRadius: `${entry.radius}px`,
      // تدوير الزوايا.
      boxShadow: `0 18px ${entry.shadow}px rgba(15, 23, 42, 0.18)`,
      // ظل القسم.
    };
    // نهاية return.
  };
  // نهاية sectionPreviewStyle.
  const textPreviewStyle = (key: string, fallbackSize: number): React.CSSProperties => {
    // تحويل تصميم النص إلى CSS مباشر للمعاينة.
    const entry = elementStyle(key);
    // قراءة إعدادات العنصر.
    return {
      // بداية CSS text.
      color: entry.color,
      // لون النص.
      fontSize: `${entry.size || fallbackSize}px`,
      // حجم الخط.
      fontWeight: entry.weight,
      // سماكة الخط.
      textAlign: entry.align as React.CSSProperties["textAlign"],
      // المحاذاة.
      opacity: entry.opacity,
      // الشفافية.
    };
    // نهاية return.
  };
  // نهاية textPreviewStyle.
  const boxPreviewStyle = (key: string): React.CSSProperties => {
    // تحويل تصميم الكرت أو الأيقونة إلى CSS مباشر.
    const entry = elementStyle(key);
    // قراءة إعدادات العنصر.
    return {
      // بداية CSS box.
      color: entry.color,
      // لون النص.
      background: entry.background,
      // خلفية الكرت أو الأيقونة.
      borderRadius: `${entry.radius}px`,
      // تدوير الزوايا.
      boxShadow: `0 16px ${entry.shadow}px rgba(15, 23, 42, 0.16)`,
      // الظل.
      border: `${entry.borderWidth}px solid ${entry.borderColor}`,
      // الحد.
      padding: `${entry.padding}px`,
      // الحشو الداخلي.
      transform: `scale(${entry.scale})`,
      // التكبير.
      opacity: entry.opacity,
      // الشفافية.
    };
    // نهاية return.
  };
  // نهاية boxPreviewStyle.
  const imageStyle = {
    // نمط موحد للصور داخل المعاينة.
    borderRadius: `${design.images.radius}px`,
    // تدوير زوايا الصور.
    border: `${design.images.borderWidth}px solid ${design.images.borderColor}`,
    // إطار الصورة.
    boxShadow: `0 18px ${design.images.shadow}px rgba(15, 23, 42, 0.28)`,
    // ظل الصورة.
    filter: `brightness(${design.images.brightness}) contrast(${design.images.contrast}) saturate(${design.images.saturation})`,
    // فلاتر الصورة.
    transform: `scale(${design.images.scale})`,
    // تكبير الصورة.
  };
  // نهاية imageStyle.
  const advancedImageStyle = (key: string): React.CSSProperties => {
    // دمج إعدادات الصور العامة مع إعدادات الصورة المحددة داخل التصميم المتقدم.
    const entry = elementStyle(key);
    // قراءة إعدادات العنصر.
    return {
      // بداية CSS image.
      ...imageStyle,
      // تطبيق إعدادات الصور العامة أولًا.
      borderRadius: `${entry.radius || design.images.radius}px`,
      // تدوير خاص بالصورة المحددة أو العام.
      border: `${entry.borderWidth}px solid ${entry.borderColor}`,
      // حد الصورة المحددة.
      boxShadow: `0 18px ${entry.shadow}px rgba(15, 23, 42, 0.28)`,
      // ظل الصورة المحددة.
      transform: `scale(${entry.scale || design.images.scale})`,
      // تكبير الصورة المحددة.
      opacity: entry.opacity,
      // شفافية الصورة.
    };
    // نهاية return.
  };
  // نهاية advancedImageStyle.
  const stageStyle = {
    // متغيرات CSS داخل المعاينة.
    background: design.backgrounds.gradientEnabled
      ? `linear-gradient(135deg, ${design.backgrounds.gradientFrom}, ${design.backgrounds.gradientTo})`
      : design.colors.pageBg,
    // خلفية المعاينة من التدرج أو لون الصفحة.
    color: design.colors.text,
    // لون النص.
    fontSize: `${design.typography.bodySize}px`,
    // حجم النص العام.
    lineHeight: design.typography.lineHeight,
    // ارتفاع السطر.
  } as React.CSSProperties;
  // نهاية stageStyle.
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

      <div className="admin-home-preview__stage" data-device={device} dir={lang === "ar" ? "rtl" : "ltr"} style={stageStyle}>
        {/* منطقة عرض المعاينة مع اتجاه مناسب للغة وتصميم حي. */}
        <div className="home-preview-card home-preview-card--blue" style={sectionPreviewStyle("hero")}>
          {/* كرت الهيرو داخل المعاينة بتصميم خاص بالقسم. */}
          <img src={site.hero_image} alt="Hero" style={advancedImageStyle("hero.image")} />
          {/* صورة الهيرو بتصميم خاص. */}
          <p style={textPreviewStyle("hero.eyebrow", 14)}>{t("hero.eyebrow")}</p>
          {/* النص التمهيدي للهيرو. */}
          <h2 style={textPreviewStyle("hero.title", design.typography.heroTitleSize)}>{t("hero.title")}</h2>
          {/* عنوان الهيرو. */}
          <span style={textPreviewStyle("hero.desc", design.typography.bodySize)}>{t("hero.desc")}</span>
          {/* وصف الهيرو. */}
        </div>
        {/* نهاية كرت الهيرو. */}

        <div className="home-preview-card" style={sectionPreviewStyle("services")}>
          {/* كرت الخدمات المختصرة بتصميم خاص بالقسم. */}
          <p style={textPreviewStyle("services.eyebrow", 14)}>{t("services.eyebrow")}</p>
          {/* النص التمهيدي للخدمات. */}
          <h3 style={textPreviewStyle("services.title", design.typography.sectionTitleSize)}>{t("services.title")}</h3>
          {/* عنوان الخدمات. */}
          <div className="home-preview-grid">
            {/* شبكة عناوين الخدمات. */}
            <span style={boxPreviewStyle("services.card")}>{t("services.item1.title")}</span>
            {/* عنوان الخدمة الأولى. */}
            <span style={boxPreviewStyle("services.card")}>{t("services.item2.title")}</span>
            {/* عنوان الخدمة الثانية. */}
            <span style={boxPreviewStyle("services.card")}>{t("services.item3.title")}</span>
            {/* عنوان الخدمة الثالثة. */}
          </div>
          {/* نهاية شبكة الخدمات. */}
        </div>
        {/* نهاية كرت الخدمات. */}

        <div className="home-preview-card" style={sectionPreviewStyle("stats")}>
          {/* كرت بيانات الإحصائيات والتواصل بتصميم خاص. */}
          <h3 style={textPreviewStyle("stats.value", 34)}>${site.statsValue}</h3>
          {/* القيمة الرقمية. */}
          <p>{lang === "ar" ? site.location_ar : site.location_en}</p>
          {/* الموقع حسب اللغة. */}
          <p>{site.phone} · {site.email}</p>
          {/* الهاتف والبريد. */}
        </div>
        {/* نهاية كرت البيانات. */}

        <div className="home-preview-images">
          {/* صور المشاريع المختصرة. */}
          <img src={site.project_image_1} alt="Project 1" style={advancedImageStyle("projects.image")} />
          {/* صورة المشروع الأولى بتصميم خاص. */}
          <img src={site.project_image_2} alt="Project 2" style={advancedImageStyle("projects.image")} />
          {/* صورة المشروع الثانية بتصميم خاص. */}
          <img src={site.project_image_3} alt="Project 3" style={advancedImageStyle("projects.image")} />
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
  const design = item.sections_json.design || defaultDesign();
  // إعدادات التصميم الحالية لهذا السجل.

  const advanced = design.advanced || defaultAdvancedDesign();
  // إعدادات التصميم المتقدم المستخدمة داخل محرر قسم التصميم حتى لا يظهر خطأ advanced is not defined.

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

  function setDesign(path: Array<string>, value: string | number | boolean) {
    // تحديث قيمة داخل إعدادات التصميم حسب مسار مثل colors.primary أو images.radius.
    setItem((prev) => {
      // تحديث آمن اعتمادًا على الحالة السابقة.
      const next = clone(prev);
      // نسخ عميق للسجل.
      const currentDesign: any = next.sections_json.design || defaultDesign();
      // ضمان وجود design حتى لو كان السجل قديمًا.
      let cursor = currentDesign;
      // مؤشر يتحرك داخل object.
      for (let index = 0; index < path.length - 1; index += 1) {
        // المرور حتى نصل إلى الحاوية قبل المفتاح الأخير.
        const segment = path[index];
        // المقطع الحالي من المسار.
        if (!cursor[segment]) cursor[segment] = {};
        // إنشاء object فرعي إذا كان ناقصًا.
        cursor = cursor[segment];
        // النزول إلى المستوى التالي.
      }
      // نهاية الحلقة.
      cursor[path[path.length - 1]] = value;
      // تعيين القيمة الجديدة.
      next.sections_json.design = currentDesign;
      // إعادة design إلى sections_json.
      return next;
      // إرجاع السجل المحدث.
    });
    // نهاية setItem.
  }
  // نهاية setDesign.

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

    if (active === "design") {
      // إذا كان القسم المختار هو التحكم بالتصميم.
      return (
        // بداية كرت التحكم بالتصميم.
        <div className="admin-home-card">
          {/* عنوان قسم التصميم. */}
          <h2>{copy.design}</h2>
          {/* عنوان قسم التصميم. */}

          <section className="admin-home-design-group admin-home-design-group--advanced">
            {/* مجموعة التصميم المتقدم حسب القسم والعنصر. */}
            <h3>{lang === "ar" ? "تصميم كل قسم وعنصر" : "Section & Element Design"}</h3>
            {/* عنوان المجموعة المتقدمة. */}
            <p className="admin-home-design-note">
              {lang === "ar"
                ? "اختر القسم ثم العنصر المطلوب، وبعدها عدّل ألوانه وحجمه وحدوده وظله دون التأثير على بقية الصفحة."
                : "Choose a section, then choose an element, and control its colors, size, borders, and shadow without affecting the rest of the page."}
            </p>
            {/* شرح مختصر لطريقة العمل. */}

            <div className="admin-home-grid admin-home-grid--2">
              {/* شبكة اختيار القسم والعنصر. */}
              <label className="admin-home-field">
                {/* حقل اختيار القسم. */}
                <span>{lang === "ar" ? "القسم المراد تعديله" : "Target section"}</span>
                {/* عنوان الحقل. */}
                <select
                  className="admin-home-input"
                  value={advanced.activeSection || "hero"}
                  onChange={(event) => {
                    const nextSection = event.target.value;
                    const firstElement = designElementOptions[nextSection]?.[0]?.key || "hero.title";
                    setDesign(["advanced", "activeSection"], nextSection);
                    setDesign(["advanced", "activeElement"], firstElement);
                  }}
                >
                  {/* قائمة الأقسام. */}
                  {designSectionOptions.map((entry) => (
                    <option key={entry.key} value={entry.key}>{entry.label}</option>
                  ))}
                  {/* نهاية خيارات الأقسام. */}
                </select>
                {/* نهاية select القسم. */}
              </label>
              {/* نهاية اختيار القسم. */}

              <label className="admin-home-field">
                {/* حقل اختيار العنصر. */}
                <span>{lang === "ar" ? "العنصر داخل القسم" : "Element inside section"}</span>
                {/* عنوان الحقل. */}
                <select
                  className="admin-home-input"
                  value={advanced.activeElement || designElementOptions[advanced.activeSection || "hero"]?.[0]?.key || "hero.title"}
                  onChange={(event) => setDesign(["advanced", "activeElement"], event.target.value)}
                >
                  {/* قائمة عناصر القسم المحدد. */}
                  {(designElementOptions[advanced.activeSection || "hero"] || designElementOptions.hero).map((entry) => (
                    <option key={entry.key} value={entry.key}>{entry.label}</option>
                  ))}
                  {/* نهاية خيارات العناصر. */}
                </select>
                {/* نهاية select العنصر. */}
              </label>
              {/* نهاية اختيار العنصر. */}
            </div>
            {/* نهاية شبكة الاختيار. */}

            {(() => {
              const selectedSection = advanced.activeSection || "hero";
              const selectedElement = advanced.activeElement || "hero.title";
              const sectionSettings = advanced.sections?.[selectedSection] || defaultAdvancedSection();
              const elementSettings = advanced.elements?.[selectedElement] || defaultAdvancedElement();
              const elementKind = (designElementOptions[selectedSection] || []).find((entry) => entry.key === selectedElement)?.kind || "text";

              return (
                <>
                  <div className="admin-home-design-subtitle">
                    {lang === "ar" ? "إعدادات القسم المحدد" : "Selected section settings"}
                  </div>
                  {/* عنوان إعدادات القسم. */}
                  <div className="admin-home-grid admin-home-grid--2">
                    {/* شبكة إعدادات القسم. */}
                    <ColorInput label={lang === "ar" ? "خلفية القسم" : "Section background"} value={sectionSettings.background} onChange={(v) => setDesign(["advanced", "sections", selectedSection, "background"], v)} />
                    {/* لون خلفية القسم. */}
                    <ColorInput label={lang === "ar" ? "لون نص القسم" : "Section text color"} value={sectionSettings.textColor} onChange={(v) => setDesign(["advanced", "sections", selectedSection, "textColor"], v)} />
                    {/* لون النص داخل القسم. */}
                    <RangeInput label={lang === "ar" ? "حشو القسم" : "Section padding"} value={sectionSettings.padding} min={0} max={80} onChange={(v) => setDesign(["advanced", "sections", selectedSection, "padding"], v)} />
                    {/* الحشو الداخلي للقسم. */}
                    <RangeInput label={lang === "ar" ? "تدوير القسم" : "Section radius"} value={sectionSettings.radius} min={0} max={60} onChange={(v) => setDesign(["advanced", "sections", selectedSection, "radius"], v)} />
                    {/* تدوير زوايا القسم. */}
                    <RangeInput label={lang === "ar" ? "ظل القسم" : "Section shadow"} value={sectionSettings.shadow} min={0} max={80} onChange={(v) => setDesign(["advanced", "sections", selectedSection, "shadow"], v)} />
                    {/* قوة ظل القسم. */}
                  </div>
                  {/* نهاية إعدادات القسم. */}

                  <div className="admin-home-design-subtitle">
                    {lang === "ar" ? "إعدادات العنصر المحدد" : "Selected element settings"}
                  </div>
                  {/* عنوان إعدادات العنصر. */}
                  <div className="admin-home-grid admin-home-grid--2">
                    {/* شبكة إعدادات العنصر. */}
                    <ColorInput label={lang === "ar" ? "لون العنصر" : "Element color"} value={elementSettings.color} onChange={(v) => setDesign(["advanced", "elements", selectedElement, "color"], v)} />
                    {/* لون العنصر. */}
                    <ColorInput label={lang === "ar" ? "خلفية العنصر" : "Element background"} value={elementSettings.background} onChange={(v) => setDesign(["advanced", "elements", selectedElement, "background"], v)} />
                    {/* خلفية العنصر. */}
                    <RangeInput label={elementKind === "image" ? (lang === "ar" ? "حجم الصورة" : "Image scale") : (lang === "ar" ? "حجم الخط / العنصر" : "Font / element size")} value={elementSettings.size} min={8} max={90} onChange={(v) => setDesign(["advanced", "elements", selectedElement, "size"], v)} />
                    {/* حجم العنصر. */}
                    <RangeInput label={lang === "ar" ? "سماكة الخط" : "Font weight"} value={elementSettings.weight} min={300} max={950} step={50} onChange={(v) => setDesign(["advanced", "elements", selectedElement, "weight"], v)} />
                    {/* سماكة الخط. */}
                    <RangeInput label={lang === "ar" ? "تدوير الزوايا" : "Radius"} value={elementSettings.radius} min={0} max={80} onChange={(v) => setDesign(["advanced", "elements", selectedElement, "radius"], v)} />
                    {/* تدوير العنصر. */}
                    <RangeInput label={lang === "ar" ? "الظل" : "Shadow"} value={elementSettings.shadow} min={0} max={90} onChange={(v) => setDesign(["advanced", "elements", selectedElement, "shadow"], v)} />
                    {/* ظل العنصر. */}
                    <RangeInput label={lang === "ar" ? "سماكة الحد" : "Border width"} value={elementSettings.borderWidth} min={0} max={10} onChange={(v) => setDesign(["advanced", "elements", selectedElement, "borderWidth"], v)} />
                    {/* سماكة الحد. */}
                    <ColorInput label={lang === "ar" ? "لون الحد" : "Border color"} value={elementSettings.borderColor} onChange={(v) => setDesign(["advanced", "elements", selectedElement, "borderColor"], v)} />
                    {/* لون الحد. */}
                    <RangeInput label={lang === "ar" ? "الشفافية" : "Opacity"} value={elementSettings.opacity} min={0.2} max={1} step={0.01} onChange={(v) => setDesign(["advanced", "elements", selectedElement, "opacity"], v)} />
                    {/* شفافية العنصر. */}
                    <RangeInput label={lang === "ar" ? "تكبير العنصر" : "Element scale"} value={elementSettings.scale} min={0.85} max={1.3} step={0.01} onChange={(v) => setDesign(["advanced", "elements", selectedElement, "scale"], v)} />
                    {/* تكبير العنصر. */}
                    <RangeInput label={lang === "ar" ? "الحشو الداخلي" : "Inner padding"} value={elementSettings.padding} min={0} max={50} onChange={(v) => setDesign(["advanced", "elements", selectedElement, "padding"], v)} />
                    {/* الحشو الداخلي. */}
                  </div>
                  {/* نهاية إعدادات العنصر. */}
                </>
              );
            })()}
            {/* نهاية إعدادات القسم والعنصر المحدد. */}
          </section>
          {/* نهاية التصميم المتقدم. */}

          {/* مجموعة الألوان. */}
          <section className="admin-home-design-group">
            {/* عنوان مجموعة الألوان. */}
            <h3>{copy.designColors}</h3>
            {/* شبكة حقول الألوان. */}
            <div className="admin-home-grid admin-home-grid--2">
              <ColorInput label={copy.primaryColor} value={design.colors.primary} onChange={(v) => setDesign(["colors", "primary"], v)} />
              {/* اللون الأساسي. */}
              <ColorInput label={copy.secondaryColor} value={design.colors.secondary} onChange={(v) => setDesign(["colors", "secondary"], v)} />
              {/* اللون الثانوي. */}
              <ColorInput label={copy.pageBg} value={design.colors.pageBg} onChange={(v) => setDesign(["colors", "pageBg"], v)} />
              {/* خلفية الصفحة. */}
              <ColorInput label={copy.sectionBg} value={design.colors.sectionBg} onChange={(v) => setDesign(["colors", "sectionBg"], v)} />
              {/* خلفية الأقسام. */}
              <ColorInput label={copy.textColor} value={design.colors.text} onChange={(v) => setDesign(["colors", "text"], v)} />
              {/* لون النص. */}
              <ColorInput label={copy.mutedTextColor} value={design.colors.mutedText} onChange={(v) => setDesign(["colors", "mutedText"], v)} />
              {/* لون النص الثانوي. */}
              <ColorInput label={copy.buttonBg} value={design.colors.buttonBg} onChange={(v) => setDesign(["colors", "buttonBg"], v)} />
              {/* لون الزر. */}
              <ColorInput label={copy.buttonText} value={design.colors.buttonText} onChange={(v) => setDesign(["colors", "buttonText"], v)} />
              {/* لون نص الزر. */}
            </div>
            {/* نهاية شبكة الألوان. */}
          </section>
          {/* نهاية مجموعة الألوان. */}
          <section className="admin-home-design-group">
            {/* مجموعة الخطوط والأحجام. */}
            <h3>{copy.designTypography}</h3>
            {/* عنوان مجموعة الخطوط. */}
            <div className="admin-home-grid admin-home-grid--2">
              {/* شبكة حقول الأحجام. */}
              <RangeInput label={copy.heroTitleSize} value={design.typography.heroTitleSize} min={32} max={86} onChange={(v) => setDesign(["typography", "heroTitleSize"], v)} />
              {/* حجم عنوان الهيرو. */}
              <RangeInput label={copy.sectionTitleSize} value={design.typography.sectionTitleSize} min={24} max={64} onChange={(v) => setDesign(["typography", "sectionTitleSize"], v)} />
              {/* حجم عناوين الأقسام. */}
              <RangeInput label={copy.bodySize} value={design.typography.bodySize} min={14} max={24} onChange={(v) => setDesign(["typography", "bodySize"], v)} />
              {/* حجم النص العام. */}
              <RangeInput label={copy.buttonSize} value={design.typography.buttonSize} min={12} max={24} onChange={(v) => setDesign(["typography", "buttonSize"], v)} />
              {/* حجم نص الزر. */}
              <RangeInput label={copy.fontWeight} value={design.typography.fontWeight} min={400} max={950} step={50} onChange={(v) => setDesign(["typography", "fontWeight"], v)} />
              {/* سماكة الخط. */}
              <RangeInput label={copy.lineHeight} value={design.typography.lineHeight} min={1} max={2} step={0.05} onChange={(v) => setDesign(["typography", "lineHeight"], v)} />
              {/* ارتفاع السطر. */}
            </div>
            {/* نهاية شبكة الخطوط. */}
          </section>
          {/* نهاية مجموعة الخطوط. */}
          <section className="admin-home-design-group">
            {/* مجموعة الصور. */}
            <h3>{copy.designImages}</h3>
            {/* عنوان مجموعة الصور. */}
            <div className="admin-home-grid admin-home-grid--2">
              {/* شبكة تحكم الصور. */}
              <RangeInput label={copy.imageRadius} value={design.images.radius} min={0} max={60} onChange={(v) => setDesign(["images", "radius"], v)} />
              {/* تدوير الصورة. */}
              <RangeInput label={copy.imageShadow} value={design.images.shadow} min={0} max={80} onChange={(v) => setDesign(["images", "shadow"], v)} />
              {/* قوة الظل. */}
              <RangeInput label={copy.imageBorderWidth} value={design.images.borderWidth} min={0} max={8} onChange={(v) => setDesign(["images", "borderWidth"], v)} />
              {/* سماكة الإطار. */}
              <ColorInput label={copy.imageBorderColor} value={design.images.borderColor} onChange={(v) => setDesign(["images", "borderColor"], v)} />
              {/* لون الإطار. */}
              <RangeInput label={copy.imageBrightness} value={design.images.brightness} min={0.75} max={1.25} step={0.01} onChange={(v) => setDesign(["images", "brightness"], v)} />
              {/* سطوع الصورة. */}
              <RangeInput label={copy.imageContrast} value={design.images.contrast} min={0.8} max={1.4} step={0.01} onChange={(v) => setDesign(["images", "contrast"], v)} />
              {/* تباين الصورة. */}
              <RangeInput label={copy.imageSaturation} value={design.images.saturation} min={0.6} max={1.6} step={0.01} onChange={(v) => setDesign(["images", "saturation"], v)} />
              {/* تشبع الصورة. */}
              <RangeInput label={copy.imageScale} value={design.images.scale} min={1} max={1.25} step={0.01} onChange={(v) => setDesign(["images", "scale"], v)} />
              {/* تكبير الصورة. */}
            </div>
            {/* نهاية شبكة الصور. */}
          </section>
          {/* نهاية مجموعة الصور. */}
          <section className="admin-home-design-group">
            {/* مجموعة الخلفيات. */}
            <h3>{copy.designBackgrounds}</h3>
            {/* عنوان مجموعة الخلفيات. */}
            <div className="admin-home-grid admin-home-grid--2">
              {/* شبكة الخلفيات. */}
              <Toggle label={copy.gradientEnabled} checked={design.backgrounds.gradientEnabled} onChange={(v) => setDesign(["backgrounds", "gradientEnabled"], v)} />
              {/* تفعيل التدرج. */}
              <RangeInput label={copy.heroOverlay} value={design.backgrounds.heroOverlay} min={0} max={0.75} step={0.01} onChange={(v) => setDesign(["backgrounds", "heroOverlay"], v)} />
              {/* شفافية التظليل. */}
              <ColorInput label={copy.gradientFrom} value={design.backgrounds.gradientFrom} onChange={(v) => setDesign(["backgrounds", "gradientFrom"], v)} />
              {/* بداية التدرج. */}
              <ColorInput label={copy.gradientTo} value={design.backgrounds.gradientTo} onChange={(v) => setDesign(["backgrounds", "gradientTo"], v)} />
              {/* نهاية التدرج. */}
            </div>
            {/* نهاية شبكة الخلفيات. */}
          </section>
          {/* نهاية مجموعة الخلفيات. */}
        </div>
        // نهاية كرت التصميم.
      );
      // نهاية return.
    }
    // نهاية شرط design.

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

    const map: Record<Exclude<SectionKey, "meta" | "images" | "design">, Array<{ key: string; label: string; type?: "text" | "area" }>> = {
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
          {map[active as Exclude<SectionKey, "meta" | "images" | "design">].map((field) => {
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
