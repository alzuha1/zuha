"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

// هذا المكوّن الداخلي هو الوحيد الذي يستخدم useSearchParams
function ConsultationsPageInner() {
  const searchParams = useSearchParams();
  // ضع هنا كل منطق الصفحة القديم الذي يعتمد على searchParams

  const status = searchParams.get("status") || "";

  return (
    <main>
      {/* الصق هنا JSX القديم الخاص بالصفحة */}
      <h1>Consultations</h1>
      <p>Status: {status}</p>
    </main>
  );
}

// هذا هو default export
// لا تستخدم useSearchParams هنا
export default function AdminConsultationsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen p-6">
          <div className="mx-auto max-w-6xl rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold">Consultations</h1>
            <p className="mt-3 text-sm text-black/60">Loading consultations...</p>
          </div>
        </main>
      }
    >
      <ConsultationsPageInner />
    </Suspense>
  );
}