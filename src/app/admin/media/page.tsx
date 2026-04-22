"use client";

import { useMemo, useState } from "react";

type UploadRes = {
  ok: boolean;
  url?: string;
  path?: string;
  message?: string;
  name?: string;
  size?: number;
  type?: string;
};

export default function AdminMediaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [items, setItems] = useState<{ url: string; path: string; name?: string }[]>([]);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  async function upload() {
    if (!file) return;
    setBusy(true);
    setMsg(null);

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/media/upload", { method: "POST", body: fd });
    const j = (await res.json().catch(() => ({}))) as UploadRes;

    setBusy(false);

    if (!res.ok || !j.ok || !j.url || !j.path) {
      setMsg(j.message ?? "Upload failed");
      return;
    }

    setItems((x) => [{ url: j.url!, path: j.path!, name: j.name }, ...x]);
    setFile(null);
    setMsg("تم رفع الصورة ✅");
  }

  async function del(path: string) {
    setBusy(true);
    setMsg(null);

    const res = await fetch(`/api/media/delete?path=${encodeURIComponent(path)}`, {
      method: "DELETE",
    });

    setBusy(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMsg(j?.message ?? "Delete failed");
      return;
    }

    setItems((x) => x.filter((i) => i.path !== path));
    setMsg("تم حذف الصورة ✅");
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">مكتبة الصور</h1>
            <p className="mt-2 text-gray-600">رفع/حذف صور داخل Bucket: <code>media</code></p>
          </div>
        </div>

        {msg ? <div className="mt-4 rounded-xl border p-3 text-sm">{msg}</div> : null}

        <div className="mt-6 rounded-2xl border p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            <button
              onClick={upload}
              disabled={!file || busy}
              className="rounded-xl bg-black text-white px-5 py-3 text-sm font-medium disabled:opacity-60"
            >
              {busy ? "..." : "Upload"}
            </button>
          </div>

          {preview ? (
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-2">Preview</div>
              <img src={preview} className="max-h-64 rounded-xl border" />
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.path} className="rounded-2xl border p-3">
              <img src={it.url} className="h-44 w-full rounded-xl object-cover border" />
              <div className="mt-2 text-xs text-gray-600 break-all">{it.path}</div>

              <button
                onClick={() => del(it.path)}
                disabled={busy}
                className="mt-3 w-full rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="mt-6 text-sm text-gray-500">ارفع أول صورة حتى تظهر هنا.</div>
        ) : null}
      </div>
    </main>
  );
}