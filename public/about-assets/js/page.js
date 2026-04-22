// ننتظر حتى تكتمل عناصر الصفحة كلها قبل تنفيذ أي كود
document.addEventListener("DOMContentLoaded", () => {
  // زر فتح القائمة الجانبية
  const menuToggle = document.getElementById("menuToggle");

  // زر إغلاق القائمة الجانبية
  const menuClose = document.getElementById("menuClose");

  // عنصر القائمة الجانبية نفسه
  const sideMenu = document.getElementById("sideMenu");

  // زر تبديل اللغة
  const langToggle = document.getElementById("langToggle");

  // مسار السلايدر الأفقي
  const heroSliderTrack = document.getElementById("heroSliderTrack");

  // زر السابق في السلايدر
  const heroPrevBtn = document.getElementById("heroPrevBtn");

  // زر التالي في السلايدر
  const heroNextBtn = document.getElementById("heroNextBtn");

  // كل النقاط الخاصة بالسلايدر
  const heroDots = document.querySelectorAll(".about-hero-slider__dot");

  // عدد السلايدات
  const totalSlides = heroDots.length;

  // عنوان شرح الصورة
  const heroSlideTitle = document.getElementById("heroSlideTitle");

  // وصف شرح الصورة
  const heroSlideDesc = document.getElementById("heroSlideDesc");

  // مفتاح تخزين اللغة داخل المتصفح
  const STORAGE_LANG_KEY = "alzuha_about_lang";

  // اللغة المحفوظة مسبقًا
  const savedLang = localStorage.getItem(STORAGE_LANG_KEY);

  // تحديد اللغة الحالية
  let currentLang = savedLang === "en" ? "en" : "ar";

  // رقم السلايد الحالي
  let currentSlide = 0;

  // مؤقت التشغيل التلقائي
  let sliderInterval = null;

  // مصفوفة بيانات شروحات السلايدر
  let heroSlidesData = [];

  // تغيير النص داخل عنصر حسب id
  function setText(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = value ?? "";
  }

  // تغيير الرابط داخل عنصر حسب id
  function setHref(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    element.setAttribute("href", value ?? "#");
  }

  // جلب ملف JSON
  async function fetchJson(url) {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to load JSON file: ${url}`);
    }

    return response.json();
  }

  // تطبيق اللغة والاتجاه على الصفحة
  function applyDocumentDirection(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    if (langToggle) {
      langToggle.textContent = lang === "ar" ? "EN" : "AR";
    }
  }

  // فتح القائمة الجانبية
  function openSideMenu() {
    if (sideMenu) {
      sideMenu.classList.add("is-open");
    }
  }

  // إغلاق القائمة الجانبية
  function closeSideMenu() {
    if (sideMenu) {
      sideMenu.classList.remove("is-open");
    }
  }

  // تحديث شرح الصورة أسفل السلايدر
  function updateHeroCaption(index) {
    const slideData = heroSlidesData[index] ?? {};

    if (heroSlideTitle) {
      heroSlideTitle.textContent = slideData.title ?? "";
    }

    if (heroSlideDesc) {
      heroSlideDesc.textContent = slideData.desc ?? "";
    }
  }

  // الانتقال إلى سلايد محدد
  function goToSlide(index) {
    if (!heroSliderTrack || totalSlides === 0) return;

    if (index < 0) {
      currentSlide = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentSlide = 0;
    } else {
      currentSlide = index;
    }

    heroSliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    heroDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentSlide);
    });

    updateHeroCaption(currentSlide);
  }

  // تشغيل الحركة التلقائية للسلايدر
  function startSliderAutoPlay() {
    stopSliderAutoPlay();

    sliderInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 4500);
  }

  // إيقاف الحركة التلقائية
  function stopSliderAutoPlay() {
    if (sliderInterval) {
      clearInterval(sliderInterval);
      sliderInterval = null;
    }
  }

  // بناء بطاقات الخدمات من JSON
  function buildServices(items) {
    const servicesCards = document.getElementById("servicesCards");
    if (!servicesCards) return;

    servicesCards.innerHTML = "";

    (items ?? []).forEach((item) => {
      const card = document.createElement("article");
      card.className = "service-card";

      card.innerHTML = `
        <div class="service-card__image-wrapper">
          <img
            class="service-card__img"
            src="${item.img ?? ""}"
            alt="${item.title ?? ""}"
          >
        </div>

        <div class="service-card__content">
          <span class="service-card__label">${item.label ?? ""}</span>
          <h3 class="service-card__title">${item.title ?? ""}</h3>
          <p class="service-card__text">${item.text ?? ""}</p>
          <a href="#contactBlock" class="service-card__btn">${item.btn ?? ""}</a>
        </div>
      `;

      servicesCards.appendChild(card);
    });
  }

  // بناء بطاقات الإحصائيات
  function buildStats(items) {
    const statsGrid = document.getElementById("statsGrid");
    if (!statsGrid) return;

    statsGrid.innerHTML = "";

    (items ?? []).forEach((item) => {
      const card = document.createElement("div");
      card.className = "stat-card";

      card.innerHTML = `
        <div class="stat-card__number">${item.num ?? ""}</div>
        <h3 class="stat-card__title">${item.title ?? ""}</h3>
        <p class="stat-card__desc">${item.desc ?? ""}</p>
      `;

      statsGrid.appendChild(card);
    });
  }

  // بناء بطاقات الفريق
  function buildTeam(members) {
    const teamGrid = document.getElementById("teamGrid");
    if (!teamGrid) return;

    teamGrid.innerHTML = "";

    (members ?? []).forEach((member) => {
      const card = document.createElement("div");
      card.className = "team-card";

      card.innerHTML = `
        <img
          src="${member.avatar ?? ""}"
          alt="${member.name ?? ""}"
          class="team-card__img"
        >
        <h3 class="team-card__name">${member.name ?? ""}</h3>
        <p class="team-card__role">${member.role ?? ""}</p>
      `;

      teamGrid.appendChild(card);
    });
  }

  // تحميل محتوى الصفحة حسب اللغة
  async function loadContent(lang) {
    try {
      const content = await fetchJson(`pages/about/data/content.${lang}.json`);

      applyDocumentDirection(lang);
      localStorage.setItem(STORAGE_LANG_KEY, lang);

      // الهيدر والقائمة
      setText("brandSub", content.brandSub);
      setText("ctaHeader", content.ctaHeader);
      setText("menuTitle", content.menu?.title);
      setText("menuHome", content.menu?.home);
      setText("menuAbout", content.menu?.about);
      setText("menuTeam", content.menu?.team);
      setText("menuContact", content.menu?.contact);
      setText("menuCta", content.menu?.cta);

      // السلايدر والرؤية
      setText("heroHint", content.heroHint);
      heroSlidesData = content.heroSlides ?? [];
      updateHeroCaption(currentSlide);

      setText("visionKicker", content.vision?.kicker);
      setText("visionTitle", content.vision?.title);
      setText("visionDesc", content.vision?.desc);

      // الخدمات
      setText("servicesTitle", content.services?.title);
      setText("servicesDesc", content.services?.desc);
      buildServices(content.services?.items);

      // الإحصائيات
      setText("statsMainTitle", content.stats?.title);
      buildStats(content.stats?.items);

      // الفريق
      setText("teamKicker", content.team?.kicker);
      setText("teamTitle", content.team?.title);
      setText("teamDesc", content.team?.desc);
      setText("teamContactBtn", content.team?.cta);
      buildTeam(content.team?.members);

      // الفوتر
      setText("footerEmail", content.footer?.email);
      setText("footerLocation", content.footer?.location);
      setText("footerBrand", content.footer?.brand);
      setText("footerCopy", content.footer?.copy);
      setText("footerPolicy", content.footer?.policy);

      setHref("footerEmail", `mailto:${content.footer?.email ?? ""}`);
    } catch (error) {
      console.error("ABOUT_PAGE_LOAD_ERROR", error);
    }
  }

  // ربط فتح القائمة
  if (menuToggle) {
    menuToggle.addEventListener("click", openSideMenu);
  }

  // ربط إغلاق القائمة
  if (menuClose) {
    menuClose.addEventListener("click", closeSideMenu);
  }

  // إغلاق القائمة عند الضغط على أي رابط داخلها
  document.querySelectorAll(".side-menu__nav a").forEach((link) => {
    link.addEventListener("click", closeSideMenu);
  });

  // تبديل اللغة
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      currentLang = currentLang === "ar" ? "en" : "ar";
      loadContent(currentLang);
    });
  }

  // زر السابق
  if (heroPrevBtn) {
    heroPrevBtn.addEventListener("click", () => {
      goToSlide(currentSlide - 1);
      startSliderAutoPlay();
    });
  }

  // زر التالي
  if (heroNextBtn) {
    heroNextBtn.addEventListener("click", () => {
      goToSlide(currentSlide + 1);
      startSliderAutoPlay();
    });
  }

  // نقاط السلايدر
  heroDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = Number(dot.dataset.slide || 0);
      goToSlide(target);
      startSliderAutoPlay();
    });
  });

  // التشغيل الأولي
  loadContent(currentLang);
  goToSlide(0);
  startSliderAutoPlay();
});