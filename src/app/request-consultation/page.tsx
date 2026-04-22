import "./request-consultation.css";
// استيراد CSS الخاص بصفحة طلب الاستشارة فقط

import { cookies } from "next/headers";
// قراءة اللغة الحالية من الكوكيز على جهة السيرفر

import RequestConsultationClient, {
  type Lang,
  type RequestConsultationCopy,
} from "./request-consultation-client";
// استيراد المكوّن العميل مع الأنواع اللازمة

export const dynamic = "force-dynamic";
// جعل الصفحة ديناميكية حتى تقرأ اللغة الحالية بشكل صحيح

const COPY: Record<Lang, RequestConsultationCopy> = {
  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      portfolio: "الأعمال",
      services: "الخدمات",
      contact: "تواصل",
      cta: "طلب استشارة",
      menuTitle: "القائمة",
    },
    hero: {
      kicker: "خدمة كبار العملاء VIP",
      title: "حدد وقتك، ودعنا نخطط لمستقبلك العقاري",
      desc: "احجز جلستك الاستشارية الخاصة مع نخبة من خبراء العقار والاستثمار في الزُهى.",
    },
    benefits: {
      title: "لماذا تحجز استشارتك معنا؟",
      items: [
        {
          icon: "📊",
          title: "تحليل دقيق للسوق",
          desc: "نقدم لك قراءة واقعية لحركة السوق العقاري مدعومة بالبيانات لضمان قرارك.",
        },
        {
          icon: "💰",
          title: "دراسة الميزانية والعوائد",
          desc: "نحلل ميزانيتك ونطابقها مع أفضل الفرص الاستثمارية لتحقيق أعلى عائد ممكن.",
        },
        {
          icon: "🏗️",
          title: "اقتراح مشاريع حصرية",
          desc: "وصول مبكر لمشاريع استثنائية تناسب تطلعاتك السكنية أو الاستثمارية.",
        },
      ],
    },
    form: {
      title: "تفاصيل الحجز",
      name: "الاسم الكامل",
      phName: "الاسم الثنائي",
      phone: "رقم الهاتف (واتساب)",
      phPhone: "07800000000",
      email: "البريد الإلكتروني",
      phEmail: "البريد الإلكتروني",
      typeLabel: "طريقة المقابلة الملائمة لك",
      typeBranch: "🏢 فرع الشركة",
      typeZoom: "💻 اجتماع Zoom",
      typePhone: "📞 اتصال هاتفي",
      date: "تاريخ المقابلة",
      dateError: "أيام العمل من الأحد للخميس فقط. يرجى اختيار يوم آخر.",
      time: "وقت المقابلة",
      optTimeSelect: "اختر الوقت...",
      submit: "تأكيد حجز الموعد",
      success:
        "تم إرسال طلب الاستشارة بنجاح. سنراجع الحجز ونتواصل معك قريبًا.",
      error:
        "تعذر إرسال الطلب حاليًا. تحقق من البيانات ثم حاول مرة أخرى.",
    },
    footer: {
      email: "info@alzharealestate.com",
      social1: "لينكدإن",
      social2: "انستغرام",
      social3: "دريبل",
      copy: "جميع الحقوق محفوظة © الزُهى 2026",
      privacy: "سياسة الخصوصية",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      portfolio: "Portfolio",
      services: "Services",
      contact: "Contact",
      cta: "Request Consultation",
      menuTitle: "Menu",
    },
    hero: {
      kicker: "VIP Client Service",
      title: "Set Your Time, Let’s Plan Your Real Estate Future",
      desc: "Book your private consultation session with top real estate and investment experts at ALZUHA.",
    },
    benefits: {
      title: "Why Book a Consultation With Us?",
      items: [
        {
          icon: "📊",
          title: "Accurate Market Analysis",
          desc: "We provide realistic, data-driven readings of real estate market movements.",
        },
        {
          icon: "💰",
          title: "Budget & ROI Study",
          desc: "We analyze your budget and match it with opportunities for maximum returns.",
        },
        {
          icon: "🏗️",
          title: "Exclusive Project Proposals",
          desc: "Early access to exceptional projects that suit your residential or investment goals.",
        },
      ],
    },
    form: {
      title: "Booking Details",
      name: "Full Name",
      phName: "John Doe",
      phone: "Phone Number (WhatsApp)",
      phPhone: "+964 XXX XXX XXXX",
      email: "Email Address",
      phEmail: "email@example.com",
      typeLabel: "Preferred Meeting Method",
      typeBranch: "🏢 Company Branch",
      typeZoom: "💻 Zoom Meeting",
      typePhone: "📞 Phone Call",
      date: "Meeting Date",
      dateError: "Working days are Sun to Thu only. Please select another day.",
      time: "Meeting Time",
      optTimeSelect: "Select Time...",
      submit: "Confirm Booking",
      success:
        "Your consultation request was sent successfully. We will contact you shortly.",
      error:
        "Unable to send your request right now. Please review your details and try again.",
    },
    footer: {
      email: "info@alzharealestate.com",
      social1: "LinkedIn",
      social2: "Instagram",
      social3: "Dribbble",
      copy: "All rights reserved © ALZUHA 2026",
      privacy: "Privacy Policy",
    },
  },
};
// هذه النصوص مأخوذة من جوهر السكربت المرفوع لكن بصيغة منظمة تناسب React وNext

export default async function RequestConsultationPage() {
  // جلب اللغة الحالية من الكوكيز
  const cookieStore: any = await Promise.resolve(cookies() as any);

  const lang: Lang = cookieStore?.get?.("lang")?.value === "en" ? "en" : "ar";
  // تحديد اللغة الحالية

  const dir = lang === "ar" ? "rtl" : "ltr";
  // تحديد الاتجاه المناسب

  return (
    <RequestConsultationClient
      lang={lang}
      dir={dir}
      copy={COPY[lang]}
    />
  );
}