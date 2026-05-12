import "./about-page.css";
// يستورد تنسيق صفحة About Admin بالكامل، بما في ذلك تنسيق الـ Live Builder.

import AboutPageEditor from "./about-page-editor";
// يستورد مكوّن محرر About الجديد: أقسام + محرر + معاينة حية.

export const dynamic = "force-dynamic";
// يجعل صفحة الأدمن ديناميكية حتى لا تعتمد على كاش ثابت.

export default function AdminAboutPage() {
  // غلاف صفحة إدارة About.
  return (
    <main className="about-admin-page">
      <section className="about-admin-shell about-admin-shell--builder">
        <header className="about-admin-header about-admin-header--compact">
          <div>
            <p className="about-admin-kicker">Admin / About Page</p>
            <h1 className="about-admin-title">About Page Live Builder</h1>
            <p className="about-admin-desc">
              لوحة تحكم منظمة لإدارة صفحة About: اختر القسم، عدّل الحقول، وشاهد المعاينة مباشرة من نفس النافذة.
            </p>
          </div>
        </header>

        <AboutPageEditor />
      </section>
    </main>
  );
}
