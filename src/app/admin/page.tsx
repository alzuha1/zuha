export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">إدارة المحتوى، الترجمة، والصور.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {/* Pages / Site Content */}
          <a
            href="/admin/content"
            className="rounded-2xl border p-5 block hover:bg-gray-50"
          >
            <div className="text-sm text-gray-500">Settings</div>
            <div className="mt-1 text-lg font-medium">Site Content</div>
          </a>

          {/* i18n */}
          <a
            href="/admin/i18n"
            className="rounded-2xl border p-5 block hover:bg-gray-50"
          >
            <div className="text-sm text-gray-500">Settings</div>
            <div className="mt-1 text-lg font-medium">Translations (AR/EN)</div>
          </a>

          {/* Media */}
          <a
            href="/admin/media"
            className="rounded-2xl border p-5 block hover:bg-gray-50"
          >
            <div className="text-sm text-gray-500">Media</div>
            <div className="mt-1 text-lg font-medium">Images Library</div>
          </a>

          {/* Pages Manager (CMS) */}
          <a
            href="/admin/pages"
            className="rounded-2xl border p-5 block hover:bg-gray-50"
          >
            <div className="text-sm text-gray-500">CMS</div>
            <div className="mt-1 text-lg font-medium">Pages</div>
          </a>

          {/* Projects (قادم) */}
          <a
            href="/admin/projects"
            className="rounded-2xl border p-5 block hover:bg-gray-50"
          >
            <div className="text-sm text-gray-500">CMS</div>
            <div className="mt-1 text-lg font-medium">Projects</div>
          </a>
        </div>
      </div>
    </main>
  );
}