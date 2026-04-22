"use client";
// هذا الملف يعمل على جهة المتصفح لأنه يعتمد على useState و useEffect والتفاعل المباشر

import { useEffect, useMemo, useState } from "react";
// استيراد React hooks المطلوبة

type PageItem = {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  is_published: boolean;
  updated_at: string;
  page_type?: string;
};
// هذا النوع يمثل العنصر المختصر في قائمة الصفحات الجانبية

type JsonValue = Record<string, unknown>;
// نوع عام بسيط لتمثيل JSON object

type PageFull = {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  hero_image_url?: string | null;
  is_published: boolean;
  page_type: string;
  meta_json: JsonValue;
  sections_json: JsonValue;
};
// هذا النوع يمثل الصفحة الكاملة داخل المحرر

function prettyJson(value: unknown): string {
  // تحويل JSON إلى نص منسق وواضح داخل textarea
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

function parseJsonSafe(raw: string, label: string) {
  // محاولة قراءة JSON النصي بشكل آمن
  try {
    const parsed = raw.trim() ? JSON.parse(raw) : {};
    return { ok: true as const, value: parsed };
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Invalid JSON format";
    return { ok: false as const, message: `${label}: ${msg}` };
  }
}

export default function AdminPages() {
  // قائمة الصفحات المختصرة
  const [items, setItems] = useState<PageItem[]>([]);

  // الصفحة المفتوحة حاليًا داخل المحرر
  const [active, setActive] = useState<PageFull | null>(null);

  // النص الظاهر داخل textarea الخاصة بـ meta_json
  const [metaText, setMetaText] = useState("{}");

  // النص الظاهر داخل textarea الخاصة بـ sections_json
  const [sectionsText, setSectionsText] = useState("{}");

  // رسالة الحالة العامة: نجاح / فشل / تنبيه
  const [msg, setMsg] = useState<string | null>(null);

  // حالة الحفظ حتى لا يضغط المستخدم Save عدة مرات
  const [saving, setSaving] = useState(false);

  // حالة التحميل عند فتح صفحة من القائمة
  const [loadingPage, setLoadingPage] = useState(false);

  async function loadList() {
    // تحميل قائمة الصفحات المختصرة
    setMsg(null);

    const r = await fetch("/api/pages", { cache: "no-store" });
    const j = await r.json().catch(() => ({}));

    if (!r.ok) {
      setMsg(j?.message ?? "Failed to load pages list");
      return;
    }

    setItems(j?.items ?? []);
  }

  useEffect(() => {
    // تحميل القائمة أول مرة عند فتح الصفحة
    loadList();
  }, []);

  async function createNew() {
    // إنشاء صفحة جديدة
    const slug = prompt("Slug مثل: about أو services أو contact");
    if (!slug) return;

    const r = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        title_ar: "",
        title_en: "",
        content_ar: "",
        content_en: "",
        hero_image_url: "",
        is_published: false,
        page_type: "basic",
        meta_json: {},
        sections_json: {},
      }),
    });

    const j = await r.json().catch(() => ({}));

    if (!r.ok) {
      setMsg(j?.message ?? "Create failed");
      return;
    }

    await loadList();
    setMsg("تم إنشاء الصفحة بنجاح");
  }

  async function pick(item: PageItem) {
    // عند اختيار صفحة من القائمة نطلب النسخة الكاملة من API
    setMsg(null);
    setLoadingPage(true);

    const r = await fetch(`/api/pages?id=${encodeURIComponent(item.id)}`, {
      cache: "no-store",
    });

    const j = await r.json().catch(() => ({}));
    setLoadingPage(false);

    if (!r.ok) {
      setMsg(j?.message ?? "Failed to load page details");
      return;
    }

    const full = j?.item;
    if (!full) {
      setMsg("Page details not found");
      return;
    }

    const page: PageFull = {
      id: full.id,
      slug: full.slug ?? "",
      title_ar: full.title_ar ?? "",
      title_en: full.title_en ?? "",
      content_ar: full.content_ar ?? "",
      content_en: full.content_en ?? "",
      hero_image_url: full.hero_image_url ?? "",
      is_published: !!full.is_published,
      page_type: full.page_type ?? "basic",
      meta_json:
        typeof full.meta_json === "object" && full.meta_json !== null
          ? full.meta_json
          : {},
      sections_json:
        typeof full.sections_json === "object" && full.sections_json !== null
          ? full.sections_json
          : {},
    };
    // تطبيع الصفحة القادمة من API حتى لا ينهار المحرر إذا كان هناك نقص

    setActive(page);
    setMetaText(prettyJson(page.meta_json));
    setSectionsText(prettyJson(page.sections_json));
  }

  const activeSlug = useMemo(() => active?.slug ?? "", [active]);
  // حفظ slug الحالي بشكل سهل للاستخدام في العرض

  async function save() {
    // حفظ الصفحة الحالية
    if (!active) return;

    const metaParsed = parseJsonSafe(metaText, "meta_json");
    if (!metaParsed.ok) {
      setMsg(metaParsed.message);
      return;
    }

    const sectionsParsed = parseJsonSafe(sectionsText, "sections_json");
    if (!sectionsParsed.ok) {
      setMsg(sectionsParsed.message);
      return;
    }

    setSaving(true);
    setMsg(null);

    const payload = {
      ...active,
      hero_image_url: active.hero_image_url?.trim() || null,
      meta_json: metaParsed.value,
      sections_json: sectionsParsed.value,
    };
    // تجهيز payload النهائي قبل الإرسال

    const r = await fetch("/api/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const j = await r.json().catch(() => ({}));
    setSaving(false);

    if (!r.ok) {
      setMsg(j?.message ?? "Save failed");
      return;
    }

    await loadList();
    setMsg("تم حفظ الصفحة بنجاح");
  }

  async function remove() {
    // حذف الصفحة الحالية
    if (!active) return;

    if (!confirm(`هل تريد حذف الصفحة:\n${active.slug}`)) return;

    const r = await fetch(`/api/pages?id=${encodeURIComponent(active.id)}`, {
      method: "DELETE",
    });

    const j = await r.json().catch(() => ({}));

    if (!r.ok) {
      setMsg(j?.message ?? "Delete failed");
      return;
    }

    setActive(null);
    setMetaText("{}");
    setSectionsText("{}");
    await loadList();
    setMsg("تم حذف الصفحة بنجاح");
  }

  return (
    <main className="min-h-screen p-6">
      {/* الغلاف العام للوحة التحرير */}
      <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-3">
        {/* العمود الأيسر: قائمة الصفحات */}
        <div className="rounded-2xl border p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Pages</h2>

            <button
              className="rounded-xl border px-3 py-2 text-sm"
              onClick={createNew}
            >
              + New
            </button>
          </div>

          <div className="mt-4 grid gap-2">
            {items.map((p) => (
              <button
                key={p.id}
                onClick={() => pick(p)}
                className={`text-left rounded-xl border p-3 hover:bg-gray-50 ${
                  active?.id === p.id ? "border-black bg-gray-50" : ""
                }`}
              >
                <div className="text-sm font-medium">{p.slug}</div>

                <div className="mt-1 text-xs text-gray-500">
                  {p.is_published ? "Published" : "Draft"} •{" "}
                  {p.page_type || "basic"} •{" "}
                  {new Date(p.updated_at).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* العمود الأيمن: محرر الصفحة */}
        <div className="md:col-span-2 rounded-2xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Editor</h2>
              {activeSlug ? (
                <p className="mt-1 text-sm text-gray-500">
                  Editing: <strong>{activeSlug}</strong>
                </p>
              ) : null}
            </div>

            <div className="flex gap-2">
              <button
                disabled={!active || saving}
                className="rounded-xl bg-black text-white px-4 py-2 text-sm disabled:opacity-60"
                onClick={save}
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                disabled={!active}
                className="rounded-xl border px-4 py-2 text-sm disabled:opacity-60"
                onClick={remove}
              >
                Delete
              </button>
            </div>
          </div>

          {msg ? (
            <div className="mt-3 rounded-xl border p-3 text-sm">
              {msg}
            </div>
          ) : null}

          {loadingPage ? (
            <div className="mt-6 text-sm text-gray-600">Loading page details...</div>
          ) : null}

          {!active && !loadingPage ? (
            <div className="mt-6 text-sm text-gray-600">
              اختر صفحة من اليسار أو أنشئ صفحة جديدة.
            </div>
          ) : null}

          {active ? (
            <div className="mt-6 grid gap-4">
              {/* slug */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Slug</label>
                <input
                  className="rounded-xl border p-3"
                  value={active.slug}
                  onChange={(e) =>
                    setActive({ ...active, slug: e.target.value })
                  }
                />
              </div>

              {/* page type */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Page Type</label>
                <select
                  className="rounded-xl border p-3"
                  value={active.page_type}
                  onChange={(e) =>
                    setActive({ ...active, page_type: e.target.value })
                  }
                >
                  <option value="basic">basic</option>
                  <option value="institutional">institutional</option>
                </select>
              </div>

              {/* title ar */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title (AR)</label>
                <input
                  className="rounded-xl border p-3"
                  dir="rtl"
                  value={active.title_ar}
                  onChange={(e) =>
                    setActive({ ...active, title_ar: e.target.value })
                  }
                />
              </div>

              {/* title en */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title (EN)</label>
                <input
                  className="rounded-xl border p-3"
                  dir="ltr"
                  value={active.title_en}
                  onChange={(e) =>
                    setActive({ ...active, title_en: e.target.value })
                  }
                />
              </div>

              {/* content ar */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Content (AR)</label>
                <textarea
                  className="rounded-xl border p-3 min-h-[180px]"
                  dir="rtl"
                  value={active.content_ar}
                  onChange={(e) =>
                    setActive({ ...active, content_ar: e.target.value })
                  }
                />
              </div>

              {/* content en */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Content (EN)</label>
                <textarea
                  className="rounded-xl border p-3 min-h-[180px]"
                  dir="ltr"
                  value={active.content_en}
                  onChange={(e) =>
                    setActive({ ...active, content_en: e.target.value })
                  }
                />
              </div>

              {/* hero image */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Hero Image URL</label>
                <input
                  className="rounded-xl border p-3"
                  value={active.hero_image_url ?? ""}
                  onChange={(e) =>
                    setActive({ ...active, hero_image_url: e.target.value })
                  }
                />
              </div>

              {/* published */}
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={active.is_published}
                  onChange={(e) =>
                    setActive({ ...active, is_published: e.target.checked })
                  }
                />
                Published
              </label>

              {/* meta json */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Meta JSON</label>
                <textarea
                  className="rounded-xl border p-3 min-h-[180px] font-mono text-sm"
                  dir="ltr"
                  value={metaText}
                  onChange={(e) => setMetaText(e.target.value)}
                />
              </div>

              {/* sections json */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Sections JSON</label>
                <textarea
                  className="rounded-xl border p-3 min-h-[420px] font-mono text-sm"
                  dir="ltr"
                  value={sectionsText}
                  onChange={(e) => setSectionsText(e.target.value)}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}