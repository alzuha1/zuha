"use client";
// هذا الملف يعمل على جهة المتصفح لأنه يحتوي على state وأحداث تفاعل

import { useEffect, useMemo, useState } from "react";
// useState للحالة
// useEffect لمزامنة الرسالة المحددة بعد تحديث القائمة
// useMemo لحساب الإحصائيات بشكل منظم

export type ContactMessageStatus = "new" | "reviewed" | "replied" | "archived";
// الحالات المعتمدة لرسائل التواصل

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
// تعريف شكل الرسالة القادمة من قاعدة البيانات

type FilterStatus = ContactMessageStatus | "all";
// نوع فلتر الحالة

function formatDate(value: string) {
  // تنسيق التاريخ بشكل مناسب للعرض في الواجهة
  try {
    return new Date(value).toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function statusLabel(status: ContactMessageStatus) {
  // تحويل قيمة الحالة إلى نص واضح في الواجهة
  switch (status) {
    case "new":
      return "New";
    case "reviewed":
      return "Reviewed";
    case "replied":
      return "Replied";
    case "archived":
      return "Archived";
    default:
      return status;
  }
}

export default function ContactMessagesClient({
  initialMessages,
}: {
  initialMessages: ContactMessageAdminRow[];
}) {
  const [messages, setMessages] = useState<ContactMessageAdminRow[]>(initialMessages);
  // جميع الرسائل المعروضة حاليًا

  const [selectedId, setSelectedId] = useState<string | null>(
    initialMessages[0]?.id ?? null
  );
  // الرسالة المحددة حاليًا في لوحة التفاصيل

  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  // الفلتر الحالي حسب الحالة

  const [searchQuery, setSearchQuery] = useState("");
  // نص البحث الحالي

  const [includeDeleted, setIncludeDeleted] = useState(false);
  // هل نعرض الرسائل المحذوفة منطقيًا أيضًا أم لا؟

  const [loading, setLoading] = useState(false);
  // حالة التحميل عند التحديث أو الجلب

  const [notice, setNotice] = useState<string>("");
  // رسالة حالة قصيرة في الأعلى

  const selectedMessage = messages.find((item) => item.id === selectedId) ?? null;
  // الرسالة المحددة فعليًا من القائمة

  const stats = useMemo(() => {
    // حساب إحصائيات الرسائل الحالية
    return {
      total: messages.length,
      newCount: messages.filter((item) => item.status === "new").length,
      reviewedCount: messages.filter((item) => item.status === "reviewed").length,
      repliedCount: messages.filter((item) => item.status === "replied").length,
      archivedCount: messages.filter((item) => item.status === "archived").length,
      deletedCount: messages.filter((item) => item.is_deleted).length,
    };
  }, [messages]);

  useEffect(() => {
    // إذا تغيرت القائمة بعد عملية تحديث، نضمن أن selectedId يبقى صالحًا
    if (!messages.length) {
      setSelectedId(null);
      return;
    }

    const stillExists = messages.some((item) => item.id === selectedId);

    if (!stillExists) {
      setSelectedId(messages[0].id);
    }
  }, [messages, selectedId]);

  async function refreshMessages() {
    // إعادة جلب الرسائل من الـ API حسب الفلاتر الحالية
    try {
      setLoading(true);
      setNotice("");

      const params = new URLSearchParams();
      // تجهيز بارامترات الاستعلام

      params.set("status", statusFilter);
      // تمرير فلتر الحالة

      params.set("q", searchQuery.trim());
      // تمرير نص البحث

      params.set("includeDeleted", includeDeleted ? "true" : "false");
      // تمرير خيار عرض المحذوف

      const response = await fetch(
        `/api/admin/contact-messages?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );
      // طلب الرسائل من الـ API الإداري

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.message || "Failed to fetch messages");
      }

      setMessages(payload.items ?? []);
      // تحديث الرسائل في الواجهة

      setNotice("Messages refreshed successfully.");
      // رسالة نجاح قصيرة
    } catch (error) {
      console.error("refreshMessages error:", error);
      setNotice(
        error instanceof Error ? error.message : "Failed to refresh messages."
      );
    } finally {
      setLoading(false);
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
    // تحديث رسالة واحدة: الحالة أو الملاحظة أو الحذف المنطقي/الاستعادة
    try {
      setLoading(true);
      setNotice("");

      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      // إرسال التحديث إلى API الرسالة الواحدة

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.message || "Update failed");
      }

      const updatedRow = payload.item as ContactMessageAdminRow;
      // الصف المحدّث القادم من الـ API

      setMessages((prev) =>
        prev.map((item) => (item.id === id ? updatedRow : item))
      );
      // تحديث الصف داخل القائمة الحالية مباشرة

      setNotice("Message updated successfully.");
    } catch (error) {
      console.error("updateMessage error:", error);
      setNotice(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteMessage(id: string) {
    // حذف منطقي للرسالة بدل حذفها فعليًا من القاعدة
    try {
      setLoading(true);
      setNotice("");

      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "DELETE",
      });
      // تنفيذ الحذف المنطقي

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.message || "Delete failed");
      }

      const updatedRow = payload.item as ContactMessageAdminRow;
      // الصف بعد تغيير is_deleted

      setMessages((prev) =>
        prev.map((item) => (item.id === id ? updatedRow : item))
      );

      setNotice("Message moved to deleted state.");
    } catch (error) {
      console.error("deleteMessage error:", error);
      setNotice(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-contact-messages">
      {/* الغلاف العام للصفحة */}

      <section className="admin-contact-messages__header">
        <div>
          <h1>Contact Messages</h1>
          <p>Review, update, archive, and organize incoming contact requests.</p>
        </div>

        <button
          type="button"
          className="admin-contact-messages__refreshBtn"
          onClick={refreshMessages}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </section>

      <section className="admin-contact-messages__stats">
        {/* بطاقات الإحصائيات */}
        <article className="admin-statCard">
          <span>Total</span>
          <strong>{stats.total}</strong>
        </article>

        <article className="admin-statCard">
          <span>New</span>
          <strong>{stats.newCount}</strong>
        </article>

        <article className="admin-statCard">
          <span>Reviewed</span>
          <strong>{stats.reviewedCount}</strong>
        </article>

        <article className="admin-statCard">
          <span>Replied</span>
          <strong>{stats.repliedCount}</strong>
        </article>

        <article className="admin-statCard">
          <span>Archived</span>
          <strong>{stats.archivedCount}</strong>
        </article>

        <article className="admin-statCard">
          <span>Deleted</span>
          <strong>{stats.deletedCount}</strong>
        </article>
      </section>

      <section className="admin-contact-messages__filters">
        {/* أدوات البحث والفلترة */}
        <div className="admin-filterGroup">
          <label htmlFor="messageStatus">Status</label>
          <select
            id="messageStatus"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as FilterStatus)}
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="admin-filterGroup admin-filterGroup--grow">
          <label htmlFor="messageSearch">Search</label>
          <input
            id="messageSearch"
            type="text"
            value={searchQuery}
            placeholder="Search by name, email, phone, or message..."
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={includeDeleted}
            onChange={(event) => setIncludeDeleted(event.target.checked)}
          />
          <span>Show deleted</span>
        </label>

        <button
          type="button"
          className="admin-contact-messages__applyBtn"
          onClick={refreshMessages}
          disabled={loading}
        >
          Apply Filters
        </button>
      </section>

      {notice ? (
        <div className="admin-contact-messages__notice">{notice}</div>
      ) : null}
      {/* رسالة حالة قصيرة */}

      <section className="admin-contact-messages__layout">
        {/* تقسيم الصفحة إلى قائمتين: قائمة الرسائل + التفاصيل */}

        <div className="admin-contact-messages__list">
          {messages.length === 0 ? (
            <div className="admin-emptyState">No messages found.</div>
          ) : (
            messages.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`admin-messageRow ${
                  selectedId === item.id ? "is-active" : ""
                } ${item.is_deleted ? "is-deleted" : ""}`}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="admin-messageRow__head">
                  <strong>{item.full_name}</strong>
                  <span className={`admin-statusBadge status-${item.status}`}>
                    {statusLabel(item.status)}
                  </span>
                </div>

                <div className="admin-messageRow__meta">
                  <span>{item.email}</span>
                  <span>{item.phone}</span>
                </div>

                <p className="admin-messageRow__snippet">{item.message}</p>

                <div className="admin-messageRow__date">
                  {formatDate(item.created_at)}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="admin-contact-messages__detail">
          {!selectedMessage ? (
            <div className="admin-emptyState">Select a message to view details.</div>
          ) : (
            <article className="admin-detailCard">
              <header className="admin-detailCard__header">
                <div>
                  <h2>{selectedMessage.full_name}</h2>
                  <p>{selectedMessage.email}</p>
                  <p>{selectedMessage.phone}</p>
                </div>

                <span
                  className={`admin-statusBadge status-${selectedMessage.status}`}
                >
                  {statusLabel(selectedMessage.status)}
                </span>
              </header>

              <section className="admin-detailCard__block">
                <h3>Message</h3>
                <p>{selectedMessage.message}</p>
              </section>

              <section className="admin-detailCard__block">
                <h3>Administrative Note</h3>

                <textarea
                  className="admin-detailCard__textarea"
                  value={selectedMessage.admin_note ?? ""}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setMessages((prev) =>
                      prev.map((item) =>
                        item.id === selectedMessage.id
                          ? { ...item, admin_note: nextValue }
                          : item
                      )
                    );
                  }}
                  placeholder="Write an internal note for this message..."
                />

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
                  Save Note
                </button>
              </section>

              <section className="admin-detailCard__block">
                <h3>Actions</h3>

                <div className="admin-detailCard__actions">
                  <button
                    type="button"
                    className="admin-secondaryBtn"
                    onClick={() =>
                      updateMessage(selectedMessage.id, { status: "reviewed" })
                    }
                    disabled={loading}
                  >
                    Mark Reviewed
                  </button>

                  <button
                    type="button"
                    className="admin-secondaryBtn"
                    onClick={() =>
                      updateMessage(selectedMessage.id, { status: "replied" })
                    }
                    disabled={loading}
                  >
                    Mark Replied
                  </button>

                  <button
                    type="button"
                    className="admin-secondaryBtn"
                    onClick={() =>
                      updateMessage(selectedMessage.id, { status: "archived" })
                    }
                    disabled={loading}
                  >
                    Archive
                  </button>

                  {!selectedMessage.is_deleted ? (
                    <button
                      type="button"
                      className="admin-dangerBtn"
                      onClick={() => deleteMessage(selectedMessage.id)}
                      disabled={loading}
                    >
                      Delete
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
                      Restore
                    </button>
                  )}
                </div>
              </section>

              <section className="admin-detailCard__block admin-detailCard__meta">
                <h3>Metadata</h3>
                <p>
                  <strong>Created:</strong> {formatDate(selectedMessage.created_at)}
                </p>
                <p>
                  <strong>Updated:</strong> {formatDate(selectedMessage.updated_at)}
                </p>
                <p>
                  <strong>Deleted:</strong> {selectedMessage.is_deleted ? "Yes" : "No"}
                </p>
              </section>
            </article>
          )}
        </div>
      </section>
    </main>
  );
}