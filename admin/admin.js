/* ==========================================================
   admin.js
   - يقرأ content/site.json و content/policies.json
   - يسمح بتعديلها
   - يصدر ملفات JSON للتحميل (تسوي لها Commit يدويًا)
   ========================================================== */

(async function () {
  // تحميل ملفات JSON الحالية من الموقع
  const site = await fetch("../content/site.json", { cache: "no-store" }).then(r => r.json());
  const policies = await fetch("../content/policies.json", { cache: "no-store" }).then(r => r.json());

  // عناصر عامة
  const elEmail = document.getElementById("email");
  const elHeroBg = document.getElementById("heroBg");
  const elHeroTitleAr = document.getElementById("heroTitleAr");
  const elHeroTitleEn = document.getElementById("heroTitleEn");
  const elHeroSubAr = document.getElementById("heroSubAr");
  const elHeroSubEn = document.getElementById("heroSubEn");

  // تعبئة القيم الحالية
  elEmail.value = site.footer.email || "";
  elHeroBg.value = site.hero.bgImage || "";
  elHeroTitleAr.value = site.hero.title.ar || "";
  elHeroTitleEn.value = site.hero.title.en || "";
  elHeroSubAr.value = site.hero.subtitle.ar || "";
  elHeroSubEn.value = site.hero.subtitle.en || "";

  // ===== سياسات =====
  const policiesEditor = document.getElementById("policiesEditor");

  // بناء محرر السياسات
  function renderPolicies() {
    policiesEditor.innerHTML = "";

    policies.items.forEach((p, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "policyRow";

      wrap.innerHTML = `
        <label class="field">
          <span class="field__label">Slug</span>
          <input class="field__input" data-k="slug" data-i="${idx}" value="${p.slug}">
        </label>

        <label class="field">
          <span class="field__label">Title AR</span>
          <input class="field__input" data-k="title.ar" data-i="${idx}" value="${p.title.ar}">
        </label>

        <label class="field">
          <span class="field__label">Title EN</span>
          <input class="field__input" data-k="title.en" data-i="${idx}" value="${p.title.en}">
        </label>

        <label class="field">
          <span class="field__label">Body AR (HTML)</span>
          <textarea class="field__input" rows="4" data-k="body.ar" data-i="${idx}">${p.body.ar}</textarea>
        </label>

        <label class="field">
          <span class="field__label">Body EN (HTML)</span>
          <textarea class="field__input" rows="4" data-k="body.en" data-i="${idx}">${p.body.en}</textarea>
        </label>

        <button class="btn btn--ghost" type="button" data-del="${idx}">حذف</button>
      `;

      policiesEditor.appendChild(wrap);
    });

    // ربط الحذف
    policiesEditor.querySelectorAll("[data-del]").forEach(btn => {
      btn.onclick = () => {
        const i = Number(btn.getAttribute("data-del"));
        policies.items.splice(i, 1);
        renderPolicies();
      };
    });

    // ربط التحديث المباشر
    policiesEditor.querySelectorAll("[data-k]").forEach(input => {
      input.addEventListener("input", () => {
        const i = Number(input.getAttribute("data-i"));
        const key = input.getAttribute("data-k");
        setDeep(policies.items[i], key, input.value);
      });
    });
  }

  // إضافة سياسة جديدة
  document.getElementById("addPolicy").onclick = () => {
    policies.items.push({
      slug: `policy-${policies.items.length + 1}`,
      title: { ar: "سياسة جديدة", en: "New Policy" },
      body: { ar: "<p>اكتب هنا...</p>", en: "<p>Write here...</p>" }
    });
    renderPolicies();
  };

  // دالة لتعديل قيم عميقة مثل "title.ar"
  function setDeep(obj, path, value) {
    const parts = path.split(".");
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  }

  // تشغيل محرر السياسات
  renderPolicies();

  // ===== Export =====
  document.getElementById("exportBtn").onclick = () => {
    // تحديث site من المدخلات
    site.footer.email = elEmail.value.trim();
    site.hero.bgImage = elHeroBg.value.trim();
    site.hero.title.ar = elHeroTitleAr.value.trim();
    site.hero.title.en = elHeroTitleEn.value.trim();
    site.hero.subtitle.ar = elHeroSubAr.value.trim();
    site.hero.subtitle.en = elHeroSubEn.value.trim();

    // تنزيل الملفات
    downloadJSON("site.json", site);
    downloadJSON("policies.json", policies);

    alert("تم التصدير. ارفع الملفات إلى:\n/content/site.json\n/content/policies.json");
  };

  // تنزيل JSON كملف
  function downloadJSON(name, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }
})();
