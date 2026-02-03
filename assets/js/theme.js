/* ==========================================================
   theme.js
   - ثيمات: light / dark / night
   - حفظ الثيم في localStorage
   - زر تبديل ثلاثي
   ========================================================== */

(function () {
  const Theme = {
    // الحصول على الثيم الحالي
    getTheme() {
      return localStorage.getItem("theme") || "dark";
    },

    // حفظ الثيم
    setTheme(next) {
      localStorage.setItem("theme", next);
      document.documentElement.setAttribute("data-theme", next);
    },

    // إرجاع تسمية الثيم حسب اللغة
    getThemeLabel(theme) {
      // استخدام i18n إن وجد
      if (window.I18N) {
        if (theme === "light") return window.I18N.t("theme.light");
        if (theme === "dark") return window.I18N.t("theme.dark");
        return window.I18N.t("theme.night");
      }
      // fallback
      return theme;
    },

    // تهيئة واجهة الزر
    initThemeUI() {
      const btn = document.getElementById("themeBtn");
      const label = document.getElementById("themeLabel");
      if (!btn || !label) return;

      // عرض اسم الثيم الحالي
      const cur = this.getTheme();
      label.textContent = this.getThemeLabel(cur);

      // دوران بين الثيمات الثلاثة
      btn.onclick = () => {
        const now = this.getTheme();
        const next = (now === "light") ? "dark" : (now === "dark") ? "night" : "light";
        this.setTheme(next);
        label.textContent = this.getThemeLabel(next);
      };
    },

    // تهيئة عامة
    init() {
      this.setTheme(this.getTheme());
    }
  };

  window.Theme = Theme;
})();
