/* ========= مساعد: اختيار عنصر ========= */
const $ = (sel, root = document) => root.querySelector(sel);

/* ========= 1) قائمة الموبايل (بدون ما تخرب CSS) ========= */
const navBtn = $('.navBtn');
const nav = $('#nav');

if (navBtn && nav) {
  navBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('isOpen');
    navBtn.setAttribute('aria-expanded', String(open));
  });

  // إغلاق القائمة عند الضغط على رابط
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('isOpen');
      navBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ========= 2) سنة الفوتر ========= */
const year = $('#year');
if (year) year.textContent = String(new Date().getFullYear());

/* ========= 3) عداد الإحصائيات عند الظهور ========= */
const statEls = document.querySelectorAll('.stat__n[data-count]');

function animateNumber(el, to) {
  const duration = 900;
  const start = performance.now();

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const v = Math.floor(to * t);
    el.textContent = v.toLocaleString('en-US');
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const to = Number(el.getAttribute('data-count') || 0);
    animateNumber(el, to);
    io.unobserve(el);
  });
}, { threshold: 0.35 });

statEls.forEach((el) => io.observe(el));

/* ========= 4) نموذج الاهتمام (واجهة فقط — بدون سيرفر) ========= */
const form = $('#interestForm');
const hint = $('#formHint');

function setHint(msg) {
  if (hint) hint.textContent = msg;
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const firstName = String(fd.get('firstName') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const email = String(fd.get('email') || '').trim();

    if (!firstName || !phone || !email) {
      setHint('أكمل الحقول المطلوبة قبل الإرسال.');
      return;
    }

    setHint('تم استلام اهتمامك. سنقوم بالتواصل معك قريبًا.');
    form.reset();
  });
}
