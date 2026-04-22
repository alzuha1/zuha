(() => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
  const yearEl = $("#year");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ===== Mobile nav =====
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", (e) => {
      const t = e.target;
      const inside =
        (navMenu instanceof Element && navMenu.contains(t)) ||
        (navToggle instanceof Element && navToggle.contains(t));

      if (!inside) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ===== Dropdowns =====
  $$(".nav__dropdown").forEach((dd) => {
    const btn = dd.querySelector("[data-dd]");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      $$(".nav__dropdown.is-open").forEach((x) => {
        if (x !== dd) x.classList.remove("is-open");
      });

      dd.classList.toggle("is-open");
    });
  });

  document.addEventListener("click", () => {
    $$(".nav__dropdown.is-open").forEach((x) => x.classList.remove("is-open"));
  });

  // ===== Image placeholder system =====
  const markLoaded = (wrap) => wrap.classList.add("is-loaded");

  const initImages = () => {
    const wrappers = $$(".shot, .tile, .member, .quoteCard__media, .brandHuge");

    wrappers.forEach((w) => {
      const img = w.querySelector("img");
      if (!img) return;

      img.addEventListener("load", () => markLoaded(w), { once: true });
      img.addEventListener("error", () => {}, { once: true });

      if (img.complete && img.naturalWidth > 0) {
        markLoaded(w);
      }
    });
  };

  initImages();

  // ===== Newsletter submit (UI only) =====
  const nf = $("#newsForm");
  if (nf) {
    nf.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("تم الاستلام ✅");
      nf.reset();
    });
  }
})();