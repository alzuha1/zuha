(async function () {
  const $ = (id) => document.getElementById(id);

  async function loadConfig() {
    // 1) إن كان فيه نسخة محلية من لوحة التحكم (localStorage) نستخدمها
    const saved = localStorage.getItem("site_config_v1");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // 2) غير كذا نقرأ config.json من الريبو
    const res = await fetch("config.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load config.json");
    return await res.json();
  }

  function iconSVG(name) {
    // أيقونات بسيطة inline (بدون مكتبات)
    const common = `width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"`;
    const icons = {
      chat: `<svg ${common}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>`,
      user: `<svg ${common}><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>`,
      check:`<svg ${common}><path d="M20 6L9 17l-5-5"/></svg>`,
      spark:`<svg ${common}><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z"/></svg>`,
      mail:`<svg ${common}><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>`,
      phone:`<svg ${common}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.06a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92z"/></svg>`,
      pin:`<svg ${common}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
    };
    return icons[name] || icons.spark;
  }

  function setText(el, text) {
    if (!el) return;
    el.textContent = text ?? "";
  }

  function setMultiline(el, text) {
    if (!el) return;
    const safe = (text ?? "").replace(/\n/g, "<br>");
    el.innerHTML = safe;
  }

  function renderNav(cfg) {
    const nav = $("nav");
    nav.innerHTML = "";
    cfg.nav.items.forEach(it => {
      const a = document.createElement("a");
      a.href = it.href;
      a.textContent = it.label;
      nav.appendChild(a);
    });
  }

  function renderPartners(cfg) {
    const row = $("partnersRow");
    row.innerHTML = "";
    cfg.partners.logos.forEach(name => {
      const d = document.createElement("div");
      d.className = "partner";
      d.innerHTML = `<span class="partner__dot"></span><span>${name}</span>`;
      row.appendChild(d);
    });
  }

  function renderFeatures(cfg) {
    setText($("featuresHeading"), cfg.features.heading);
    setText($("featuresSubheading"), cfg.features.subheading);

    const grid = $("featuresGrid");
    grid.innerHTML = "";

    cfg.features.cards.forEach((c, idx) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="card__top">
          <div class="icon">${iconSVG(c.icon)}</div>
        </div>
        <h3>${c.title}</h3>
        <p>${c.text}</p>
      `;
      grid.appendChild(card);
    });
  }

  function renderStats(cfg) {
    const stats = $("statsGrid");
    stats.innerHTML = "";
    cfg.stats.forEach(s => {
      const d = document.createElement("div");
      d.className = "stat";
      d.innerHTML = `
        <div class="stat__v">${s.value}</div>
        <p class="stat__l">${s.label}</p>
      `;
      stats.appendChild(d);
    });
  }

  function renderProjects(cfg) {
    setText($("projectsHeading"), cfg.projects.heading);
    setText($("projectsSubheading"), cfg.projects.subheading);

    const g = $("projectsGallery");
    g.innerHTML = "";
    cfg.projects.items.forEach((p) => {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.innerHTML = `<img src="${p.image}" alt="">`;
      g.appendChild(tile);
    });
  }

  function renderTrust(cfg) {
    setText($("trustHeading"), cfg.trust.heading);
    setText($("trustSubheading"), cfg.trust.subheading);
    setText($("trustLogo"), cfg.trust.logoText);
    setText($("trustText"), cfg.trust.text);
    setText($("trustMore"), cfg.trust.moreLinkText);

    $("trustImg").src = cfg.trust.image;

    const team = $("teamRow");
    team.innerHTML = "";
    cfg.trust.team.forEach(t => {
      const p = document.createElement("div");
      p.className = "person";
      p.innerHTML = `
        <div class="avatar" aria-hidden="true"></div>
        <div>
          <div class="person__name">${t.name}</div>
          <div class="person__role">${t.role}</div>
        </div>
      `;
      team.appendChild(p);
    });
  }

  function renderNews(cfg) {
    setText($("newsHeading"), cfg.news.heading);

    $("newsFeaturedImg").src = cfg.news.featured.image;
    setText($("newsFeaturedTag"), cfg.news.featured.tag);
    setText($("newsFeaturedTitle"), cfg.news.featured.title);
    setText($("newsFeaturedText"), cfg.news.featured.text);
    setText($("newsFeaturedAuthor"), cfg.news.featured.author);
    setText($("newsFeaturedDate"), cfg.news.featured.date);

    const grid = $("newsGrid");
    grid.innerHTML = "";
    cfg.news.grid.forEach(p => {
      const a = document.createElement("article");
      a.className = "post";
      a.innerHTML = `
        <div class="post__img"><img src="${p.image}" alt=""></div>
        <div class="post__body">
          <span class="tag">${p.tag}</span>
          <h4 class="post__title">${p.title}</h4>
          <p class="post__text">${p.text}</p>
        </div>
      `;
      grid.appendChild(a);
    });
  }

  function renderFAQ(cfg) {
    setText($("faqHeading"), cfg.faq.heading);
    setText($("faqSubheading"), cfg.faq.subheading);

    const grid = $("faqGrid");
    grid.innerHTML = "";
    cfg.faq.items.forEach(item => {
      const d = document.createElement("div");
      d.className = "qa";
      d.innerHTML = `<h4>${item.q}</h4><p>${item.a}</p>`;
      grid.appendChild(d);
    });

    setText($("faqCtaText"), cfg.faq.ctaText);
    $("faqCtaBtn").textContent = cfg.faq.ctaButton;
    $("faqCtaBtn").href = cfg.faq.ctaHref;
  }

  function renderContact(cfg) {
    setText($("contactHeading"), cfg.contact.heading);
    setText($("contactSubheading"), cfg.contact.subheading);

    const grid = $("contactGrid");
    grid.innerHTML = "";

    cfg.contact.cards.forEach(c => {
      const d = document.createElement("div");
      d.className = "contactCard";
      d.innerHTML = `
        <div class="contactCard__top">
          <div class="icon">${iconSVG(c.icon)}</div>
          <h4>${c.title}</h4>
        </div>
        <p>${c.text}</p>
        <a class="link" href="${c.href}">${c.linkText}</a>
      `;
      grid.appendChild(d);
    });
  }

  function renderHero(cfg) {
    setMultiline($("heroTitle"), cfg.hero.title);
    setText($("heroSubtitle"), cfg.hero.subtitle);

    $("heroImg").src = cfg.hero.image;

    $("heroPrimary").textContent = cfg.hero.primaryCta;
    $("heroPrimary").href = cfg.hero.primaryHref;

    $("heroSecondary").textContent = cfg.hero.secondaryCta;
    $("heroSecondary").href = cfg.hero.secondaryHref;
  }

  function renderBrand(cfg) {
    setText($("brandMark"), cfg.brand.logoText);
    setText($("brandName"), cfg.brand.siteName);

    $("topCta").textContent = cfg.brand.ctaTop;
  }

  function renderFooter(cfg) {
    setText($("footerCopy"), `${cfg.footer.copy} — ${new Date().getFullYear()}`);
    document.title = cfg.brand.siteName;
  }

  try {
    const cfg = await loadConfig();

    renderBrand(cfg);
    renderNav(cfg);
    renderHero(cfg);
    renderPartners(cfg);
    renderFeatures(cfg);
    renderStats(cfg);
    renderProjects(cfg);
    renderTrust(cfg);
    renderNews(cfg);
    renderFAQ(cfg);
    renderContact(cfg);
    renderFooter(cfg);

  } catch (err) {
    console.error(err);
    alert("تعذر تحميل إعدادات الموقع. تأكد من وجود ملف config.json.");
  }
})();
