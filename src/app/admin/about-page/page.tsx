import "./about-page.css";
import AboutPageEditor from "./about-page-editor";

// نجعل الصفحة ديناميكية لأن المحتوى يقرأ من API حيّة
export const dynamic = "force-dynamic";

export default function AdminAboutPage() {
  return (
    <main className="about-admin-page">
      <section className="about-admin-shell">
        <header className="about-admin-header">
          <div>
            <p className="about-admin-kicker">Admin / About Page</p>
            <h1 className="about-admin-title">About Page Editor</h1>
            <p className="about-admin-desc">
              تحكم كامل بمحتوى صفحة About عبر sections_json:
              النصوص، الصور، الخدمات، الإحصائيات، الفريق، والفوتر.
            </p>
          </div>
        </header>

        <AboutPageEditor />
      </section>
    </main>
  );
}