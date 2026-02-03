/* ==========================================================
   i18n.js
   - تحميل ملفات الترجمة
   - تطبيق الترجمة على أي عنصر يحمل data-i18n
   - حفظ اللغة في localStorage
   ========================================================== */

(function () {
  // كائن عام لإدارة الترجمة
  const I18N = {
    // اللغة الافتراضية
    lang: "ar",
    // قاموس الترجمة الحالي
    dict: {},

    // جلب اللغة المحفوظة أو تحديد الافتراضي
    getLang() {
      return localStorage.getItem("lang") || "ar";
    },

    // حفظ اللغة
    setLang(next) {
      localStorage.setItem("lang", next);
      this.lang = next;
    },

    // تحميل ملف ترجمة JSON حسب اللغة
    async load(lang) {
      const res = await fetch(`i18n/${lang}.json`, { cache: "no-store" });
      this.dict = await res.json();
      this.lang = lang;
    },

    // قراءة مفتاح مثل "nav.about" من القاموس
    t(key) {
      const parts = key.split(".");
      let cur = this.dict;
      for (const p of parts) {
        if (!cur || typeof cur !== "object") return key;
        cur = cur[p];
      }
      return (typeof cur === "string") ? cur : key;
    },

    // تطبيق الترجمة على عناصر الصفحة
    apply(root = document) {
      const nodes = root.querySelectorAll("[data-i18n]");
      nodes.forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.textContent = this.t(key);
      });
    },

    // ضبط اتجاه الصفحة حسب اللغة
    applyDir() {
      const html = document.documentElement;
      if (this.lang === "ar") {
        html.lang = "ar";
        html.dir = "rtl";
      } else {
        html.lang = "en";
        html.dir = "ltr";
      }
    },

    // تهيئة الترجمة عند تحميل الصفحة
    async init() {
      const lang = this.getLang();
      await this.load(lang);
      this.applyDir();
      return lang;
    },

    // تهيئة زر اللغة
    initLangUI() {
      const btn = document.getElementById("langBtn");
      const label = document.getElementById("langLabel");
      if (!btn || !label) return;

      // عرض اللغة الحالية على الزر
      label.textContent = (this.lang === "ar") ? "AR" : "EN";

      // عند الضغط: قلب اللغة
      btn.onclick = async () => {
        const next = (this.lang === "ar") ? "en" : "ar";
        await this.load(next);
        this.setLang(next);
        this.applyDir();
        this.apply();

        // تحديث الملصق
        label.textContent = (next === "ar") ? "AR" : "EN";

        // إعادة رسم المحتوى الذي يعتمد على اللغة (app.js يعيد الرندر)
        if (window.App && typeof window.App.render === "function") {
          window.App.render();
        }
      };
    }
  };

  // نشره عالميًا
  window.I18N = I18N;
})();
