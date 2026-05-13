"use client";
// هذا الملف يعمل على جهة المتصفح لأنه يحتوي على state وأحداث تفاعل مباشرة.

import { useEffect, useMemo, useState } from "react";
// يستورد hooks المطلوبة لإدارة الحالة والحسابات المشتقة والمزامنة.

export type ContactMessageStatus = "new" | "reviewed" | "replied" | "archived";
// يحدد الحالات الرسمية التي يمكن أن تأخذها رسالة التواصل.

export type ContactMessageAdminRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  message: string;
  status: ContactMessageStatus;
  admin_note: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};
// يصف شكل صف الرسالة القادم من جدول contact_messages.

type FilterStatus = ContactMessageStatus | "all";
// يضيف خيار all فوق الحالات الرسمية لاستخدامه في الفلاتر.

type AdminLang = "ar" | "en";
// يحدد لغة واجهة الأدمن: عربي أو إنجليزي.

type StatusTone = "new" | "reviewed" | "replied" | "archived";
// يحدد أسماء نغمات شارات الحالة في CSS.

const adminCopy = {
  ar: {
    pageTitle: "صندوق رسائل التواصل",
    pageDesc: "راجع الرسائل الواردة، حدّث حالتها، أضف ملاحظات داخلية، ونظّم الطلبات من لوحة واحدة.",
    refresh: "تحديث",
    refreshing: "جارٍ التحديث...",
    applyFilters: "تطبيق الفلاتر",
    filters: "الفلاتر",
    search: "البحث",
    searchPlaceholder: "ابحث بالاسم أو البريد أو الهاتف أو نص الرسالة...",
    status: "الحالة",
    all: "الكل",
    showDeleted: "إظهار المحذوف",
    total: "الإجمالي",
    new: "جديد",
    reviewed: "تمت المراجعة",
    replied: "تم الرد",
    archived: "مؤرشف",
    deleted: "محذوف",
    activeMessages: "الرسائل المعروضة",
    inbox: "الرسائل",
    details: "تفاصيل الرسالة",
    selectMessage: "اختر رسالة لعرض التفاصيل.",
    noMessages: "لا توجد رسائل مطابقة.",
    message: "الرسالة",
    adminNote: "ملاحظة إدارية",
    notePlaceholder: "اكتب ملاحظة داخلية لهذه الرسالة...",
    saveNote: "حفظ الملاحظة",
    actions: "الإجراءات",
    markReviewed: "تعليم كمراجعة",
    markReplied: "تعليم كتم الرد",
    archive: "أرشفة",
    delete: "حذف",
    restore: "استعادة",
    copyEmail: "نسخ البريد",
    copyPhone: "نسخ الهاتف",
    email: "البريد",
    phone: "الهاتف",
    created: "تاريخ الإنشاء",
    updated: "آخر تحديث",
    deletedState: "محذوفة",
    yes: "نعم",
    no: "لا",
    copied: "تم النسخ.",
    refreshed: "تم تحديث الرسائل بنجاح.",
    updatedOk: "تم تحديث الرسالة بنجاح.",
    deletedOk: "تم نقل الرسالة إلى حالة الحذف.",
    saveFailed: "فشل التحديث.",
    refreshFailed: "فشل تحديث الرسائل.",
    deleteFailed: "فشل حذف الرسالة.",
    openMail: "فتح البريد",
    call: "اتصال",
    language: "اللغة",
  },
  en: {
    pageTitle: "Contact Messages Inbox",
    pageDesc: "Review incoming contact requests, update status, add internal notes, and organize messages from one workspace.",
    refresh: "Refresh",
    refreshing: "Refreshing...",
    applyFilters: "Apply Filters",
    filters: "Filters",
    search: "Search",
    searchPlaceholder: "Search by name, email, phone, or message...",
    status: "Status",
    all: "All",
    showDeleted: "Show deleted",
    total: "Total",
    new: "New",
    reviewed: "Reviewed",
    replied: "Replied",
    archived: "Archived",
    deleted: "Deleted",
    activeMessages: "Visible messages",
    inbox: "Inbox",
    details: "Message Details",
    selectMessage: "Select a message to view details.",
    noMessages: "No matching messages found.",
    message: "Message",
    adminNote: "Administrative Note",
    notePlaceholder: "Write an internal note for this message...",
    saveNote: "Save Note",
    actions: "Actions",
    markReviewed: "Mark Reviewed",
    markReplied: "Mark Replied",
    archive: "Archive",
    delete: "Delete",
    restore: "Restore",
    copyEmail: "Copy Email",
    copyPhone: "Copy Phone",
    email: "Email",
    phone: "Phone",
    created: "Created",
    updated: "Updated",
    deletedState: "Deleted",
    yes: "Yes",
    no: "No",
    copied: "Copied.",
    refreshed: "Messages refreshed successfully.",
    updatedOk: "Message updated successfully.",
    deletedOk: "Message moved to deleted state.",
    saveFailed: "Update failed.",
    refreshFailed: "Failed to refresh messages.",
    deleteFailed: "Delete failed.",
    openMail: "Open Email",
    call: "Call",
    language: "Language",
  },
} as const;
// قاموس ترجمة داخلي للوحة رسائل التواصل بدون تغيير قاعدة البيانات.

function readInitialLang(): AdminLang {
  // يقرأ لغة الواجهة من cookie عند فتح الصفحة.
  if (typeof document === "undefined") {
    // أثناء SSR لا يوجد document.
    return "en";
    // نستخدم الإنجليزية كقيمة آمنة.
  }

  const cookieLang = document.cookie
    .split("; ")
    .find((row) => row.startsWith("lang="))
    ?.split("=")[1];
  // يبحث عن كوكي lang.

  return cookieLang === "ar" ? "ar" : "en";
  // يرجع ar فقط إذا كانت القيمة ar، وإلا en.
}

function writeLangCookie(nextLang: AdminLang) {
  // يكتب لغة الواجهة في cookie حتى تبقى بعد إعادة التحميل.
  if (typeof document === "undefined") {
    // حماية من التنفيذ على السيرفر.
    return;
    // لا نفعل شيئًا.
  }

  document.cookie = `lang=${nextLang}; path=/; max-age=31536000`;
  // يحفظ اللغة لمدة سنة كاملة على مستوى الموقع.
}

function formatDate(value: string, lang: AdminLang) {
  // ينسق التاريخ حسب لغة واجهة الأدمن.
  try {
    return new Date(value).toLocaleString(lang === "ar" ? "ar-IQ" : "en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    // يعرض التاريخ بشكل قابل للقراءة.
  } catch {
    return value;
    // إذا فشل التنسيق نعرض القيمة الأصلية.
  }
}

function statusLabel(status: ContactMessageStatus, lang: AdminLang) {
  // يرجع تسمية الحالة حسب اللغة.
  const copy = adminCopy[lang];
  // يختار قاموس اللغة الحالي.

  switch (status) {
    case "new":
      return copy.new;
    case "reviewed":
      return copy.reviewed;
    case "replied":
      return copy.replied;
    case "archived":
      return copy.archived;
    default:
      return status;
  }
}

function normalizeStatus(status: string): ContactMessageStatus {
  // يمنع دخول حالة غير معروفة من البيانات.
  if (status === "reviewed" || status === "replied" || status === "archived") {
    return status;
    // يرجع الحالة إذا كانت ضمن الحالات المعروفة.
  }

  return "new";
  // أي قيمة غير معروفة تصبح new.
}

function safeText(value: string | null | undefined, fallback = "—") {
  // يضمن أن النص لا يظهر فارغًا في الواجهة.
  const clean = String(value ?? "").trim();
  // ينظف القيمة.
  return clean || fallback;
  // يرجع fallback إذا كانت فارغة.
}

function truncateText(value: string, maxLength = 130) {
  // يختصر نص الرسالة في قائمة الرسائل.
  const clean = String(value || "").trim();
  // ينظف النص.
  if (clean.length <= maxLength) {
    return clean;
    // إذا النص قصير نرجعه كما هو.
  }

  return `${clean.slice(0, maxLength)}…`;
  // إذا طويل نختصره ونضيف علامة استمرار.
}

export default function ContactMessagesClient({
  initialMessages,
}: {
  initialMessages: ContactMessageAdminRow[];
}) {
  const [builderLang, setBuilderLang] = useState<AdminLang>("en");
  // لغة واجهة الأدمن الحالية.

  const [messages, setMessages] = useState<ContactMessageAdminRow[]>(
    initialMessages.map((item) => ({
      ...item,
      status: normalizeStatus(item.status),
    }))
  );
  // كل الرسائل المعروضة في الواجهة مع تطبيع الحالة.

  const [selectedId, setSelectedId] = useState<string | null>(
    initialMessages[0]?.id ?? null
  );
  // معرف الرسالة المحددة في لوحة التفاصيل.

  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  // فلتر الحالة الحالي.

  const [searchQuery, setSearchQuery] = useState("");
  // نص البحث الحالي.

  const [includeDeleted, setIncludeDeleted] = useState(false);
  // هل يتم إظهار الرسائل المحذوفة منطقيًا.

  const [loading, setLoading] = useState(false);
  // حالة التحميل أثناء التحديث والحفظ.

  const [notice, setNotice] = useState<string>("");
  // رسالة تنبيه/نجاح/خطأ أعلى الواجهة.

  const copy = adminCopy[builderLang];
  // اختصار نصوص الواجهة حسب اللغة الحالية.

  const isArabic = builderLang === "ar";
  // هل الواجهة عربية.

  const selectedMessage = messages.find((item) => item.id === selectedId) ?? null;
  // الرسالة المختارة فعليًا من القائمة.

  const stats = useMemo(() => {
    // يحسب إحصائيات صندوق الرسائل.
    return {
      total: messages.length,
      newCount: messages.filter((item) => item.status === "new" && !item.is_deleted).length,
      reviewedCount: messages.filter((item) => item.status === "reviewed" && !item.is_deleted).length,
      repliedCount: messages.filter((item) => item.status === "replied" && !item.is_deleted).length,
      archivedCount: messages.filter((item) => item.status === "archived" && !item.is_deleted).length,
      deletedCount: messages.filter((item) => item.is_deleted).length,
    };
  }, [messages]);

  const localFilteredMessages = useMemo(() => {
    // يطبق فلترة محلية فورية حتى قبل ضغط Apply.
    const query = searchQuery.trim().toLowerCase();
    // يجهز نص البحث.

    return messages.filter((item) => {
      // يمر على كل رسالة.
      if (!includeDeleted && item.is_deleted) {
        return false;
        // يخفي المحذوف إذا لم يتم تفعيل الخيار.
      }

      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
        // يطبق فلتر الحالة.
      }

      if (!query) {
        return true;
        // بدون بحث نعرض الرسالة.
      }

      const haystack = [
        item.full_name,
        item.email,
        item.phone,
        item.message,
        item.admin_note ?? "",
      ]
        .join(" ")
        .toLowerCase();
      // يجمع الحقول القابلة للبحث.

      return haystack.includes(query);
      // يرجع الرسائل التي تحتوي نص البحث.
    });
  }, [includeDeleted, messages, searchQuery, statusFilter]);

  useEffect(() => {
    // يقرأ اللغة من cookie بعد تحميل الصفحة.
    const initialLang = readInitialLang();
    // يحدد اللغة المبدئية.
    setBuilderLang(initialLang);
    // يطبق اللغة على واجهة الأدمن.
  }, []);

  useEffect(() => {
    // يحافظ على selectedId صالحًا بعد تغيير الرسائل أو الفلترة.
    if (!localFilteredMessages.length) {
      setSelectedId(null);
      return;
    }

    const stillExists = localFilteredMessages.some((item) => item.id === selectedId);
    // يفحص هل الرسالة المختارة ما زالت ضمن القائمة الحالية.

    if (!stillExists) {
      setSelectedId(localFilteredMessages[0].id);
      // يختار أول رسالة إذا الرسالة القديمة لم تعد ظاهرة.
    }
  }, [localFilteredMessages, selectedId]);

  function changeLanguage(nextLang: AdminLang) {
    // يغيّر لغة واجهة صندوق الرسائل.
    setBuilderLang(nextLang);
    // يحدث state.
    writeLangCookie(nextLang);
    // يحفظ الاختيار في cookie.
  }

  async function copyToClipboard(value: string) {
    // ينسخ نصًا إلى الحافظة.
    try {
      await navigator.clipboard.writeText(value);
      // يستخدم Clipboard API.
      setNotice(copy.copied);
      // يعرض رسالة نجاح.
    } catch {
      setNotice(value);
      // إذا فشل النسخ، يعرض القيمة حتى ينسخها المستخدم يدويًا.
    }
  }

  async function refreshMessages() {
    // يعيد جلب الرسائل من API حسب الفلاتر.
    try {
      setLoading(true);
      // يفعل حالة التحميل.
      setNotice("");
      // يمسح التنبيه القديم.

      const params = new URLSearchParams();
      // ينشئ بارامترات الاستعلام.

      params.set("status", statusFilter);
      // يضيف فلتر الحالة.

      params.set("q", searchQuery.trim());
      // يضيف البحث.

      params.set("includeDeleted", includeDeleted ? "true" : "false");
      // يضيف خيار المحذوف.

      const response = await fetch(`/api/admin/contact-messages?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });
      // يطلب الرسائل من API الإداري.

      const payload = await response.json().catch(() => ({}));
      // يقرأ JSON بدون كسر الواجهة لو الرد غير متوقع.

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.message || copy.refreshFailed);
        // يرمي خطأ برسالة مفهومة.
      }

      const nextItems = (payload.items ?? []) as ContactMessageAdminRow[];
      // يستخرج الرسائل من الرد.

      setMessages(
        nextItems.map((item) => ({
          ...item,
          status: normalizeStatus(item.status),
        }))
      );
      // يحدث القائمة بعد تطبيع الحالة.

      setNotice(copy.refreshed);
      // يعرض رسالة نجاح.
    } catch (error) {
      console.error("refreshMessages error:", error);
      // يسجل الخطأ للمطور.

      setNotice(error instanceof Error ? error.message : copy.refreshFailed);
      // يعرض رسالة خطأ للمستخدم.
    } finally {
      setLoading(false);
      // يوقف التحميل دائمًا.
    }
  }

  async function updateMessage(
    id: string,
    body: {
      status?: ContactMessageStatus;
      adminNote?: string;
      isDeleted?: boolean;
    }
  ) {
    // يحدّث رسالة واحدة: حالة، ملاحظة، حذف منطقي، أو استعادة.
    try {
      setLoading(true);
      // يفعل حالة التحميل.
      setNotice("");
      // يمسح التنبيه.

      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      // يرسل التحديث إلى API الرسالة الواحدة.

      const payload = await response.json().catch(() => ({}));
      // يقرأ الرد بشكل آمن.

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.message || copy.saveFailed);
        // يرمي خطأ عند فشل التحديث.
      }

      const updatedRow = payload.item as ContactMessageAdminRow;
      // يستخرج الرسالة المحدثة من الرد.

      setMessages((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...updatedRow,
                status: normalizeStatus(updatedRow.status),
              }
            : item
        )
      );
      // يستبدل الرسالة داخل القائمة بدون إعادة تحميل الصفحة.

      setNotice(copy.updatedOk);
      // يعرض رسالة نجاح.
    } catch (error) {
      console.error("updateMessage error:", error);
      // يسجل الخطأ.

      setNotice(error instanceof Error ? error.message : copy.saveFailed);
      // يعرض رسالة فشل.
    } finally {
      setLoading(false);
      // يوقف التحميل.
    }
  }

  async function deleteMessage(id: string) {
    // ينفذ حذفًا منطقيًا للرسالة.
    try {
      setLoading(true);
      // يفعل التحميل.
      setNotice("");
      // يمسح التنبيه.

      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "DELETE",
      });
      // يرسل طلب حذف إلى API الرسالة الواحدة.

      const payload = await response.json().catch(() => ({}));
      // يقرأ الرد بشكل آمن.

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.message || copy.deleteFailed);
        // يرمي خطأ عند فشل الحذف.
      }

      const updatedRow = payload.item as ContactMessageAdminRow;
      // يستخرج الرسالة بعد تحديث is_deleted.

      setMessages((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...updatedRow,
                status: normalizeStatus(updatedRow.status),
              }
            : item
        )
      );
      // يحدث القائمة محليًا.

      setNotice(copy.deletedOk);
      // يعرض رسالة نجاح.
    } catch (error) {
      console.error("deleteMessage error:", error);
      // يسجل الخطأ.

      setNotice(error instanceof Error ? error.message : copy.deleteFailed);
      // يعرض رسالة فشل.
    } finally {
      setLoading(false);
      // يوقف التحميل.
    }
  }

  return (
    <main className="admin-contact-messages" dir={isArabic ? "rtl" : "ltr"}>
      {/* الغلاف العام لصندوق رسائل التواصل */}

      <section className="admin-contact-messages__hero">
        {/* شريط عنوان الصفحة */}
        <div>
          <p className="admin-contact-messages__kicker">ALZUHA CMS</p>
          {/* وسم صغير للوحة الإدارة */}
          <h1>{copy.pageTitle}</h1>
          {/* عنوان الصفحة */}
          <p>{copy.pageDesc}</p>
          {/* وصف وظيفي مختصر */}
        </div>

        <div className="admin-contact-messages__heroActions">
          {/* أزرار أعلى الصفحة */}
          <div className="admin-contact-messages__lang" aria-label={copy.language}>
            {/* زر تبديل اللغة */}
            <button
              type="button"
              className={builderLang === "ar" ? "is-active" : ""}
              onClick={() => changeLanguage("ar")}
            >
              AR
            </button>
            {/* اختيار العربية */}
            <button
              type="button"
              className={builderLang === "en" ? "is-active" : ""}
              onClick={() => changeLanguage("en")}
            >
              EN
            </button>
            {/* اختيار الإنجليزية */}
          </div>

          <button
            type="button"
            className="admin-contact-messages__refreshBtn"
            onClick={refreshMessages}
            disabled={loading}
          >
            {loading ? copy.refreshing : copy.refresh}
          </button>
          {/* زر تحديث الرسائل */}
        </div>
      </section>

      <section className="admin-contact-messages__stats">
        {/* بطاقات الإحصائيات */}
        <article className="admin-statCard">
          <span>{copy.total}</span>
          <strong>{stats.total}</strong>
          <small>{copy.activeMessages}</small>
        </article>
        {/* إجمالي الرسائل */}

        <article className="admin-statCard">
          <span>{copy.new}</span>
          <strong>{stats.newCount}</strong>
          <small>{copy.status}</small>
        </article>
        {/* الرسائل الجديدة */}

        <article className="admin-statCard">
          <span>{copy.reviewed}</span>
          <strong>{stats.reviewedCount}</strong>
          <small>{copy.status}</small>
        </article>
        {/* الرسائل التي تمت مراجعتها */}

        <article className="admin-statCard">
          <span>{copy.replied}</span>
          <strong>{stats.repliedCount}</strong>
          <small>{copy.status}</small>
        </article>
        {/* الرسائل التي تم الرد عليها */}

        <article className="admin-statCard">
          <span>{copy.archived}</span>
          <strong>{stats.archivedCount}</strong>
          <small>{copy.status}</small>
        </article>
        {/* الرسائل المؤرشفة */}

        <article className="admin-statCard">
          <span>{copy.deleted}</span>
          <strong>{stats.deletedCount}</strong>
          <small>{copy.deletedState}</small>
        </article>
        {/* الرسائل المحذوفة منطقيًا */}
      </section>

      <section className="admin-contact-messages__filters">
        {/* أدوات البحث والفلترة */}
        <div className="admin-filterGroup">
          <label htmlFor="messageStatus">{copy.status}</label>
          {/* عنوان فلتر الحالة */}
          <select
            id="messageStatus"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as FilterStatus)}
          >
            <option value="all">{copy.all}</option>
            <option value="new">{copy.new}</option>
            <option value="reviewed">{copy.reviewed}</option>
            <option value="replied">{copy.replied}</option>
            <option value="archived">{copy.archived}</option>
          </select>
          {/* قائمة الحالات */}
        </div>

        <div className="admin-filterGroup admin-filterGroup--grow">
          <label htmlFor="messageSearch">{copy.search}</label>
          {/* عنوان حقل البحث */}
          <input
            id="messageSearch"
            type="text"
            value={searchQuery}
            placeholder={copy.searchPlaceholder}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          {/* حقل البحث المباشر */}
        </div>

        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={includeDeleted}
            onChange={(event) => setIncludeDeleted(event.target.checked)}
          />
          {/* اختيار عرض المحذوف */}
          <span>{copy.showDeleted}</span>
          {/* نص اختيار عرض المحذوف */}
        </label>

        <button
          type="button"
          className="admin-contact-messages__applyBtn"
          onClick={refreshMessages}
          disabled={loading}
        >
          {copy.applyFilters}
        </button>
        {/* زر تطبيق الفلاتر من السيرفر */}
      </section>

      {notice ? (
        <div className="admin-contact-messages__notice">{notice}</div>
      ) : null}
      {/* رسالة حالة تظهر فقط عند وجود notice */}

      <section className="admin-contact-messages__workspace">
        {/* مساحة العمل الأساسية: قائمة الرسائل + تفاصيل الرسالة */}

        <aside className="admin-contact-messages__listPanel">
          {/* لوحة قائمة الرسائل */}
          <div className="admin-contact-messages__panelHead">
            <p>{copy.inbox}</p>
            {/* عنوان قائمة الرسائل */}
            <strong>{localFilteredMessages.length}</strong>
            {/* عدد الرسائل الظاهرة */}
          </div>

          <div className="admin-contact-messages__list">
            {/* القائمة القابلة للتمرير */}
            {localFilteredMessages.length === 0 ? (
              <div className="admin-emptyState">{copy.noMessages}</div>
            ) : (
              localFilteredMessages.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`admin-messageRow ${
                    selectedId === item.id ? "is-active" : ""
                  } ${item.is_deleted ? "is-deleted" : ""}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className="admin-messageRow__head">
                    <strong>{safeText(item.full_name)}</strong>
                    {/* اسم المرسل */}
                    <span className={`admin-statusBadge status-${item.status as StatusTone}`}>
                      {statusLabel(item.status, builderLang)}
                    </span>
                    {/* شارة الحالة */}
                  </div>

                  <div className="admin-messageRow__meta">
                    <span>{safeText(item.email)}</span>
                    {/* البريد */}
                    <span>{safeText(item.phone)}</span>
                    {/* الهاتف */}
                  </div>

                  <p className="admin-messageRow__snippet">
                    {truncateText(item.message)}
                  </p>
                  {/* مقتطف الرسالة */}

                  <div className="admin-messageRow__date">
                    {formatDate(item.created_at, builderLang)}
                  </div>
                  {/* تاريخ الرسالة */}
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="admin-contact-messages__detailPanel">
          {/* لوحة التفاصيل */}
          <div className="admin-contact-messages__panelHead">
            <p>{copy.details}</p>
            {/* عنوان تفاصيل الرسالة */}
            {selectedMessage ? (
              <span className={`admin-statusBadge status-${selectedMessage.status as StatusTone}`}>
                {statusLabel(selectedMessage.status, builderLang)}
              </span>
            ) : null}
            {/* شارة الحالة للرسالة المحددة */}
          </div>

          {!selectedMessage ? (
            <div className="admin-emptyState">{copy.selectMessage}</div>
          ) : (
            <article className="admin-detailCard">
              <header className="admin-detailCard__header">
                <div>
                  <h2>{safeText(selectedMessage.full_name)}</h2>
                  {/* اسم المرسل */}
                  <p>{copy.email}: {safeText(selectedMessage.email)}</p>
                  {/* البريد */}
                  <p>{copy.phone}: {safeText(selectedMessage.phone)}</p>
                  {/* الهاتف */}
                </div>
              </header>

              <section className="admin-detailCard__quickActions">
                {/* إجراءات سريعة للتواصل */}
                <a
                  className="admin-secondaryBtn"
                  href={`mailto:${selectedMessage.email}`}
                >
                  {copy.openMail}
                </a>
                {/* فتح برنامج البريد */}
                <a
                  className="admin-secondaryBtn"
                  href={`tel:${selectedMessage.phone}`}
                >
                  {copy.call}
                </a>
                {/* اتصال مباشر إذا الجهاز يدعم ذلك */}
                <button
                  type="button"
                  className="admin-secondaryBtn"
                  onClick={() => copyToClipboard(selectedMessage.email)}
                >
                  {copy.copyEmail}
                </button>
                {/* نسخ البريد */}
                <button
                  type="button"
                  className="admin-secondaryBtn"
                  onClick={() => copyToClipboard(selectedMessage.phone)}
                >
                  {copy.copyPhone}
                </button>
                {/* نسخ الهاتف */}
              </section>

              <section className="admin-detailCard__block">
                <h3>{copy.message}</h3>
                {/* عنوان نص الرسالة */}
                <p>{safeText(selectedMessage.message)}</p>
                {/* نص الرسالة */}
              </section>

              <section className="admin-detailCard__block">
                <h3>{copy.adminNote}</h3>
                {/* عنوان الملاحظة الإدارية */}
                <textarea
                  className="admin-detailCard__textarea"
                  value={selectedMessage.admin_note ?? ""}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    // قيمة الملاحظة الجديدة.
                    setMessages((prev) =>
                      prev.map((item) =>
                        item.id === selectedMessage.id
                          ? { ...item, admin_note: nextValue }
                          : item
                      )
                    );
                    // تحديث محلي مباشر قبل الحفظ.
                  }}
                  placeholder={copy.notePlaceholder}
                />
                {/* حقل الملاحظة الإدارية */}

                <button
                  type="button"
                  className="admin-secondaryBtn"
                  onClick={() =>
                    updateMessage(selectedMessage.id, {
                      adminNote: selectedMessage.admin_note ?? "",
                    })
                  }
                  disabled={loading}
                >
                  {copy.saveNote}
                </button>
                {/* زر حفظ الملاحظة */}
              </section>

              <section className="admin-detailCard__block">
                <h3>{copy.actions}</h3>
                {/* عنوان الإجراءات */}
                <div className="admin-detailCard__actions">
                  <button
                    type="button"
                    className="admin-secondaryBtn"
                    onClick={() =>
                      updateMessage(selectedMessage.id, { status: "reviewed" })
                    }
                    disabled={loading}
                  >
                    {copy.markReviewed}
                  </button>
                  {/* تعليم كمراجعة */}

                  <button
                    type="button"
                    className="admin-secondaryBtn"
                    onClick={() =>
                      updateMessage(selectedMessage.id, { status: "replied" })
                    }
                    disabled={loading}
                  >
                    {copy.markReplied}
                  </button>
                  {/* تعليم كتم الرد */}

                  <button
                    type="button"
                    className="admin-secondaryBtn"
                    onClick={() =>
                      updateMessage(selectedMessage.id, { status: "archived" })
                    }
                    disabled={loading}
                  >
                    {copy.archive}
                  </button>
                  {/* أرشفة */}

                  {!selectedMessage.is_deleted ? (
                    <button
                      type="button"
                      className="admin-dangerBtn"
                      onClick={() => deleteMessage(selectedMessage.id)}
                      disabled={loading}
                    >
                      {copy.delete}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="admin-secondaryBtn"
                      onClick={() =>
                        updateMessage(selectedMessage.id, { isDeleted: false })
                      }
                      disabled={loading}
                    >
                      {copy.restore}
                    </button>
                  )}
                  {/* حذف أو استعادة حسب حالة الرسالة */}
                </div>
              </section>

              <section className="admin-detailCard__block admin-detailCard__meta">
                <h3>Metadata</h3>
                {/* بيانات تقنية مختصرة */}
                <p>
                  <strong>{copy.created}:</strong>{" "}
                  {formatDate(selectedMessage.created_at, builderLang)}
                </p>
                {/* تاريخ الإنشاء */}
                <p>
                  <strong>{copy.updated}:</strong>{" "}
                  {formatDate(selectedMessage.updated_at, builderLang)}
                </p>
                {/* تاريخ التحديث */}
                <p>
                  <strong>{copy.deletedState}:</strong>{" "}
                  {selectedMessage.is_deleted ? copy.yes : copy.no}
                </p>
                {/* حالة الحذف */}
              </section>
            </article>
          )}
        </section>
      </section>
    </main>
  );
}
