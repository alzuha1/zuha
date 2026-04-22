"use client";

import { useEffect, useState } from "react";

type SiteContent = Record<string, string>;

const labels: Record<string, string> = {
  brand: "اسم العلامة",
  tagline: "الجملة التعريفية",
  heroText: "عنوان الهيرو",
  ctaPrimary: "زر رئيسي",
  ctaSecondary: "زر ثانوي",
  statsTitle: "عنوان الإحصائية",
  statsValue: "قيمة الإحصائية",
  email: "البريد الإلكتروني",
  phone: "الهاتف",
  location: "الموقع",
};

export default function AdminContentPage() {
  const [data, setData] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
     fetch("http://localhost:3001/api/site", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setData(j));
  }, []);

  async function save() {
    if (!data) return;
    setSaving(true);
    setMsg(null);

    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setSaving(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMsg(j?.message ?? "فشل الحفظ");
      return;
    }

    setMsg("تم الحفظ ✅");
  }

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <main className="min-h-screen p-6" dir="rtl">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">تحكم محتوى الصفحة الرئيسية</h1>
            <p className="mt-2 text-gray-600">
              تعديل مباشر لملف <code>content/site.json</code>
            </p>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-black text-white px-5 py-3 text-sm font-medium disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {msg ? (
          <div className="mt-4 rounded-xl border p-3 text-sm">{msg}</div>
        ) : null}

        <div className="mt-6 grid gap-4">
          {Object.entries(data).map(([k, v]) => (
            <div key={k}>
              <label className="text-sm font-medium">{labels[k] ?? k}</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 p-3 outline-none focus:ring"
                value={v ?? ""}
                onChange={(e) => setData({ ...data, [k]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}