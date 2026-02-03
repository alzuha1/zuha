/* ==========================================================
   app.js
   - تحميل content/site.json
   - بناء الأقسام ديناميكيًا
   - بناء روابط السياسات تلقائيًا
   - تجهيز نموذج التواصل
   - منع مشاكل الهيدر على الجوال (nav toggle)
   ========================================================== */

(function () {
  const App = {
    site: null,

    // تحميل JSON إعدادات الموقع
    async loadSite() {
      const res = await fetch("content/site.json", { cache: "no-store" });
      this.site = await res.json();
    },

    // اختيار نص حسب اللغة
    pick(obj) {
      const lang = window.I18N.getLang();
      return (obj && obj[lang]) ? obj[lang] : (obj && obj.ar) ? obj.ar : "";
    },

    // رندر كامل
    async render() {
      // تأكد من تحميل إعدادات الترجمة والثيم
      await window.I18N.init();
      window.I18N.apply();
      window.Theme.init();
      window.Theme.initThemeUI();
      window.I18N.initLangUI();

      // تحميل بيانات الموقع
      await this.loadSite();

      // ===== HERO =====
      const heroBg = document.getElementById("heroBg");
      const heroTitle = document.getElementById("heroTitle");
      const heroSubtitle = document.getElementById("heroSubtitle");

      if (heroBg) heroBg.style.backgroundImage = `url("${this.site.hero.bgImage}")`;
      if (heroTitle) heroTitle.textContent = this.pick(this.site.hero.title);
      if (heroSubtitle) heroSubtitle.textContent = this.pick(this.site.hero.subtitle);

      // ===== About + Stats =====
      const aboutTitle = document.getElementById("aboutTitle");
      const aboutDesc = document.getElementById("aboutDesc");
      if (aboutTitle) aboutTitle.textContent = this.pick(this.site.about.title);
      if (aboutDesc) aboutDesc.textContent = this.pick(this.site.about.desc);

      const statsGrid = document.getElementById("statsGrid");
      if (statsGrid) {
        statsGrid.innerHTML = this.site.stats.map(s => {
          const label = this.pick(s.label);
          return `
            <div class="statCard">
              <div class="statCard__num">${s.value}</div>
              <div class="statCard__label">${label}</div>
            </div>
          `;
        }).join("");
      }

      // ===== Projects =====
      const projectsGrid = document.getElementById("projectsGrid");
      if (projectsGrid) {
        projectsGrid.innerHTML = this.site.projects.map(p => {
          const title = this.pick(p.title);
          const sub = this.pick(p.sub);
          return `
            <article class="card">
              <div class="card__media" style="background-image:url('${p.image}')"></div>
              <div class="card__overlay">
                <h3 class="card__title">${title}</h3>
                <p class="card__sub">${sub}</p>
              </div>
            </article>
          `;
        }).join("");
      }

      // ===== Units =====
      const unitsGrid = document.getElementById("unitsGrid");
      if (unitsGrid) {
        unitsGrid.innerHTML = this.site.units.map(u => {
          const desc = this.pick(u.desc);
          return `
            <article class="card unitCard" style="background: var(--card);">
              <div class="card__media" style="background-image:url('${u.image}')"></div>
              <div class="unitPanel" style="background: color-mix(in oklab, ${u.tint} 28%, var(--card));">
                <h3 class="unit__en">${u.en}</h3>
                <h3 class="unit__ar">${u.ar}</h3>
                <p class="unit__desc">${desc}</p>
              </div>
            </article>
          `;
        }).join("");
      }

      // ===== Articles =====
      const articlesGrid = document.getElementById("articlesGrid");
      if (articlesGrid) {
        articlesGrid.innerHTML = this.site.articles.map(a => {
          const title = this.pick(a.title);
          const meta = this.pick(a.meta);
          return `
            <article class="card newsCard">
              <h3 class="newsTitle">${title}</h3>
              <div class="newsMeta">${meta}</div>
              <a class="newsLink" href="#">Read More</a>
            </article>
          `;
        }).join("");
      }

      // ===== Contact: project select =====
      const projectSelect = document.getElementById("projectSelect");
      if (projectSelect) {
        projectSelect.innerHTML = this.site.projects.map(p => {
          const title = this.pick(p.title);
          return `<option value="${title}">${title}</option>`;
        }).join("");
      }

      // ===== Footer =====
      const footerAbout = document.getElementById("footerAbout");
      if (footerAbout) footerAbout.textContent = this.pick(this.site.footer.about);

      const workHours = document.getElementById("workHours");
      if (workHours) workHours.textContent = this.pick(this.site.footer.workHours);

      const callCenterHours = document.getElementById("callCenterHours");
      if (callCenterHours) callCenterHours.textContent = this.pick(this.site.footer.callCenterHours);

      const mapFrame = document.getElementById("mapFrame");
      if (mapFrame) mapFrame.innerHTML = this.site.footer.mapEmbed || "";

      const footerEmail = document.getElementById("footerEmail");
      if (footerEmail) {
        footerEmail.textContent = this.site.footer.email;
        footerEmail.href = `mailto:${this.site.footer.email}`;
      }

      const copy = document.getElementById("copyright");
      if (copy) copy.textContent = this.pick(this.site.footer.copyright);

      // ===== Policies Links (تلقائي) =====
      const policiesLinks = document.getElementById("policiesLinks");
      if (policiesLinks) {
        const policies = await fetch("content/policies.json", { cache: "no-store" }).then(r => r.json());
        const lang = window.I18N.getLang();

        policiesLinks.innerHTML = policies.items.map(item => {
          const title = item.title[lang] || item.title.ar;
          return `<a class="footerLink" href="policy.html?slug=${encodeURIComponent(item.slug)}">${title}</a>`;
        }).join("");
      }

      // ===== Nav toggle for mobile =====
      this.initNavToggle();

      // ===== Form submit (Demo) =====
      this.initForm();
    },

    initNavToggle() {
      const navToggle = document.getElementById("navToggle");
      const nav = document.getElementById("nav");
      if (!navToggle || !nav) return;

      navToggle.onclick = () => {
        const isOpen = nav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
      };

      // إذا ضغط المستخدم على رابط داخل القائمة، اغلقها
      nav.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => {
          nav.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });
    },

    initForm() {
      const form = document.getElementById("leadForm");
      if (!form) return;

      form.addEventListener("submit", (e) => {
        e.preventDefault();

        // قراءة البيانات
        const data = Object.fromEntries(new FormData(form).entries());

        // هنا تربطها لاحقًا بـ Email API/CRM/Sheets
        // حاليًا مجرد تأكيد بسيط
        alert(`تم استلام الطلب:\n${JSON.stringify(data, null, 2)}`);

        // تفريغ النموذج
        form.reset();
      });
    }
  };

  window.App = App;

  // تشغيل الرندر مباشرة
  document.addEventListener("DOMContentLoaded", () => App.render());
})();
