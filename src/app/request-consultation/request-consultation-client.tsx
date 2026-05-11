"use client";
// هذا الملف عميل لأنه يحتوي على state وأحداث submit وتبديل القائمة

import { useMemo, useState } from "react";
// useMemo لحساب تاريخ اليوم مرة واحدة، و useState لإدارة الصورة والنموذج وحالة الإرسال.

export type Lang = "ar" | "en";
// نوع اللغة المدعومة

type BenefitItem = {
  icon: string;
  title: string;
  desc: string;
};

export type RequestConsultationCopy = {
  nav: {
    home: string;
    about: string;
    portfolio: string;
    services: string;
    contact: string;
    cta: string;
    menuTitle: string;
  };
  hero: {
    kicker: string;
    title: string;
    desc: string;
  };
  benefits: {
    title: string;
    items: BenefitItem[];
  };
  form: {
    title: string;
    name: string;
    phName: string;
    phone: string;
    phPhone: string;
    email: string;
    phEmail: string;
    typeLabel: string;
    typeBranch: string;
    typeZoom: string;
    typePhone: string;
    date: string;
    dateError: string;
    time: string;
    optTimeSelect: string;
    submit: string;
    success: string;
    error: string;
  };
  footer: {
    email: string;
    social1: string;
    social2: string;
    social3: string;
    copy: string;
    privacy: string;
  };
};
// نوع نسخة النصوص التي ستصل من page.tsx

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  meetingType: "branch" | "zoom" | "phone";
  meetingDate: string;
  meetingTime: string;
};
// نوع بيانات الفورم

const TIME_OPTIONS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];
// أوقات المقابلات المتاحة

const ADVISOR_IMAGE = "/pages/contact/img/img%20(1).jpg";
// صورة توضيحية من مجلد contact
// إذا لم توجد فعليًا فسيظهر placeholder بدل الانكسار

function isBlockedWeekend(value: string) {
  // منع الجمعة والسبت كما في السكربت الأصلي
  if (!value) return false;

  const selectedDate = new Date(`${value}T00:00:00`);
  const day = selectedDate.getDay();

  return day === 5 || day === 6;
}

export default function RequestConsultationClient({
  lang,
  dir,
  copy,
}: {
  lang: Lang;
  dir: "rtl" | "ltr";
  copy: RequestConsultationCopy;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  // حالة تحميل الصورة التوضيحية

  const [form, setForm] = useState<FormState>({
    fullName: "",
    phone: "",
    email: "",
    meetingType: "branch",
    meetingDate: "",
    meetingTime: "",
  });
  // بيانات الفورم الحالية

  const [dateError, setDateError] = useState("");
  // رسالة خطأ التاريخ

  const [submitting, setSubmitting] = useState(false);
  // حالة الإرسال

  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  // رسالة النجاح أو الخطأ بعد الإرسال

  const today = useMemo(() => {
    // تاريخ اليوم لتعيين الحد الأدنى في حقل التاريخ
    return new Date().toISOString().split("T")[0];
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    // تحديث أي حقل داخل الـ state بشكل آمن
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "meetingDate") {
      // تحقق مباشر من التاريخ عند تغييره
      if (isBlockedWeekend(String(value))) {
        setDateError(copy.form.dateError);
      } else {
        setDateError("");
      }
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // إرسال النموذج إلى الـ API
    event.preventDefault();

    setNotice(null);
    // مسح أي رسالة سابقة

    if (isBlockedWeekend(form.meetingDate)) {
      setDateError(copy.form.dateError);
      return;
    }

    if (!form.meetingTime) {
      setNotice({
        type: "error",
        text: copy.form.error,
      });
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/consultation-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          meetingType: form.meetingType,
          meetingDate: form.meetingDate,
          meetingTime: form.meetingTime,
        }),
      });
      // الإرسال بنفس الحقول الأساسية التي استخدمتها سابقًا في المشروع

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.message || "Request failed");
      }

      setNotice({
        type: "success",
        text: copy.form.success,
      });
      // إظهار رسالة نجاح

      setForm({
        fullName: "",
        phone: "",
        email: "",
        meetingType: "branch",
        meetingDate: "",
        meetingTime: "",
      });
      // تصفير الحقول بعد النجاح

      setDateError("");
    } catch (error) {
      console.error("Consultation request failed:", error);

      setNotice({
        type: "error",
        text: copy.form.error,
      });
      // إظهار رسالة خطأ واضحة
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main dir={dir} className="consult-page">
      {/* الغلاف العام للصفحة فقط؛ لا يوجد هنا أي هيدر داخلي قديم حتى لا يتكرر مع SiteHeader العام. */}
      {/* الهيرو: يبدأ محتوى الصفحة مباشرة لأن الهيدر الموحد SiteHeader يُعرض من layout.tsx. */}
      <section className="consult-hero">
        <div className="consult-container consult-center">
          <span className="consult-kicker">{copy.hero.kicker}</span>
          <h1 className="consult-hero__title">{copy.hero.title}</h1>
          <p className="consult-hero__desc">{copy.hero.desc}</p>
        </div>
      </section>

      {/* المحتوى الرئيسي */}
      <section className="consult-main">
        <div className="consult-container consult-split">
          {/* الجهة اليسرى: الفوائد والصورة */}
          <div className="consult-info">
            <h2 className="consult-benefits__title">{copy.benefits.title}</h2>

            <ul className="consult-benefits__list">
              {copy.benefits.items.map((item, index) => (
                <li key={index}>
                  <div className="consult-benefits__icon">{item.icon}</div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <figure className="consult-visual consult-imgPlaceholder" data-num="01">
              <img
                className={`consult-dynamicImage ${imageLoaded ? "is-loaded" : ""}`}
                src={ADVISOR_IMAGE}
                alt={copy.hero.title}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(false)}
              />
            </figure>
          </div>

          {/* الجهة اليمنى: نموذج الحجز */}
          <div className="consult-formCard">
            <h2 className="consult-formCard__title">{copy.form.title}</h2>

            <form className="consult-form" onSubmit={handleSubmit}>
              <div className="consult-formGroup">
                <label htmlFor="inputName">{copy.form.name}</label>
                <input
                  id="inputName"
                  type="text"
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  placeholder={copy.form.phName}
                  required
                />
              </div>

              <div className="consult-formRow">
                <div className="consult-formGroup">
                  <label htmlFor="inputPhone">{copy.form.phone}</label>
                  <input
                    id="inputPhone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder={copy.form.phPhone}
                    required
                  />
                </div>

                <div className="consult-formGroup">
                  <label htmlFor="inputEmail">{copy.form.email}</label>
                  <input
                    id="inputEmail"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder={copy.form.phEmail}
                    required
                  />
                </div>
              </div>

              <div className="consult-formGroup">
                <label>{copy.form.typeLabel}</label>

                <div className="consult-radioGrid">
                  <label className="consult-radioCard">
                    <input
                      type="radio"
                      name="meetingType"
                      checked={form.meetingType === "branch"}
                      onChange={() => updateField("meetingType", "branch")}
                    />
                    <span>{copy.form.typeBranch}</span>
                  </label>

                  <label className="consult-radioCard">
                    <input
                      type="radio"
                      name="meetingType"
                      checked={form.meetingType === "zoom"}
                      onChange={() => updateField("meetingType", "zoom")}
                    />
                    <span>{copy.form.typeZoom}</span>
                  </label>

                  <label className="consult-radioCard">
                    <input
                      type="radio"
                      name="meetingType"
                      checked={form.meetingType === "phone"}
                      onChange={() => updateField("meetingType", "phone")}
                    />
                    <span>{copy.form.typePhone}</span>
                  </label>
                </div>
              </div>

              <div className="consult-formRow">
                <div className="consult-formGroup">
                  <label htmlFor="bookingDate">{copy.form.date}</label>
                  <input
                    id="bookingDate"
                    type="date"
                    value={form.meetingDate}
                    min={today}
                    onChange={(event) =>
                      updateField("meetingDate", event.target.value)
                    }
                    required
                  />

                  {dateError ? (
                    <p className="consult-errorText">{dateError}</p>
                  ) : null}
                </div>

                <div className="consult-formGroup">
                  <label htmlFor="meetingTime">{copy.form.time}</label>
                  <select
                    id="meetingTime"
                    value={form.meetingTime}
                    onChange={(event) =>
                      updateField("meetingTime", event.target.value)
                    }
                    required
                  >
                    <option value="">{copy.form.optTimeSelect}</option>

                    {TIME_OPTIONS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {notice ? (
                <div
                  className={`consult-notice consult-notice--${notice.type}`}
                >
                  {notice.text}
                </div>
              ) : null}

              <button
                type="submit"
                className="consult-submitBtn"
                disabled={submitting || !!dateError}
              >
                {submitting
                  ? lang === "ar"
                    ? "جاري الإرسال..."
                    : "Sending..."
                  : copy.form.submit}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* الفوتر */}
      <footer className="consult-footer">
        <div className="consult-container consult-footer__inner">
          <a className="consult-footer__email" href={`mailto:${copy.footer.email}`}>
            {copy.footer.email}
          </a>

          <div className="consult-footer__socials">
            <a href="#">{copy.footer.social1}</a>
            <a href="#">{copy.footer.social2}</a>
            <a href="#">{copy.footer.social3}</a>
          </div>

          <div className="consult-footer__bottom">
            <span>{copy.footer.copy}</span>
            <a href="/privacy-policy">{copy.footer.privacy}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}