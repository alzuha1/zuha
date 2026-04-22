"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "ar" | "en";
type Dict = Record<string, string>;

export default function AdminI18nPage() {
  const [lang, setLang] = useState<Lang>("ar");
  const [dict, setDict] = useState<Dict>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setMsg(null);
    fetch(`/api/i18n?lang=${lang}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setDict(j?.dict ?? {}))
      .catch(() => setDict({}));
  }, [lang]);

  const rows = useMemo(() => {
    const entries = Object.entries(dict).sort(([a], [b]) => a.localeCompare(b));
    const q = filter.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(([k, v]) => k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q));
  }, [dict, filter]);

  function setValue(k: string, v: string) {
    setDict((prev) => ({ ...prev, [k]: v }));
  }

  function addKey() {
    const k = prompt("Key مثل: nav.about أو hero.title");
    if (!k) return;
    if (dict[k]) {
      alert("المفتاح موجود مسبقًا.");
      return;
    }
    setDict((prev) => ({ ...prev, [k]: "" }));
  }

  function removeKey(k: string) {
    if (!confirm(`حذف المفتاح؟\n${k}`)) return;
    setDict((prev) => {
      const copy = { ...prev };
      delete copy[k];
      return copy;
    });
    setMsg("⚠️ تم حذف المفتاح محليًا. اضغط Save لتطبيقه في DB (إذا تريد حذف فعلي لاحقًا نضيف API delete).");
  }

  async function save() {
    setSaving(true);
    setMsg(null);

    const res = await fetch("/api/i18n", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang, dict }),
    });

    setSaving(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMsg(j?.message ?? "فشل الحفظ");
      return;
    }

    const j = await res.json().catch(() => ({}));
    setMsg(`تم الحفظ ✅ (عدد السجلات: ${j?.count ?? "?"})`);
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">إدارة الترجمة (i18n)</h1>
            <p className="mt-1 text-gray-600">
              تعديل مباشر لجدول <code>public.i18n</code> في Supabase (lang + k + v)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang("ar")}
              className={`rounded-xl px-4 py-2 text-sm font-medium border ${
                lang === "ar" ? "bg-black text-white" : "bg-white"
              }`}
            >
              AR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`rounded-xl px-4 py-2 text-sm font-medium border ${
                lang === "en" ? "bg-black text-white" : "bg-white"
              }`}
            >
              EN
            </button>

            <button
              onClick={addKey}
              className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              + Key
            </button>

            <button
              onClick={save}
              disabled={saving}
              className="rounded-xl bg-black text-white px-5 py-2 text-sm font-medium disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {msg ? <div className="mt-4 rounded-xl border p-3 text-sm">{msg}</div> : null}

        <div className="mt-6 flex items-center gap-2">
          <input
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring"
            placeholder="بحث داخل المفاتيح والقيم..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="mt-6 grid gap-3">
          {rows.map(([k, v]) => (
            <div key={k} className="rounded-2xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-gray-500">Key</div>
                  <div className="font-mono text-sm break-all">{k}</div>
                </div>

                <button
                  onClick={() => removeKey(k)}
                  className="rounded-xl border px-3 py-2 text-xs hover:bg-gray-50"
                  title="حذف"
                >
                  Delete
                </button>
              </div>

              <div className="mt-3">
                <div className="text-xs text-gray-500">Value</div>
                <input
                  className="mt-2 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring"
                  value={v ?? ""}
                  onChange={(e) => setValue(k, e.target.value)}
                  dir={lang === "ar" ? "rtl" : "ltr"}
                />
              </div>
            </div>
          ))}

          {rows.length === 0 ? (
            <div className="rounded-2xl border p-6 text-sm text-gray-600">
              لا توجد مفاتيح مطابقة للبحث.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}