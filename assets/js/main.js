// ====== تشغيل عند تحميل الصفحة ======

// جلب زر فتح القائمة (موبايل) من الصفحة
const navToggle = document.querySelector('.nav-toggle'); // زر القائمة

// جلب القائمة نفسها
const nav = document.querySelector('.nav'); // عنصر nav

// إذا الزر موجود (احتياط) نضيف له حدث الضغط
if (navToggle && nav) { // شرط وجود العناصر
  navToggle.addEventListener('click', () => { // عند الضغط
    const isOpen = nav.classList.toggle('open'); // يفتح/يغلق بإضافة/إزالة class
    navToggle.setAttribute('aria-expanded', String(isOpen)); // تحديث aria للنفاذية
  });
}

// ====== سكرول ناعم للروابط الداخلية ======
document.querySelectorAll('a[href^="#"]').forEach((link) => { // لكل رابط يبدأ بـ #
  link.addEventListener('click', (e) => { // عند الضغط
    const targetId = link.getAttribute('href'); // نجلب الهدف
    const target = document.querySelector(targetId); // نبحث عن العنصر
    if (!target) return; // إذا غير موجود نخرج
    e.preventDefault(); // منع السلوك الافتراضي
    target.scrollIntoView({ behavior: 'smooth', block: 'start' }); // سكرول ناعم
    nav?.classList.remove('open'); // إغلاق القائمة على الجوال
    navToggle?.setAttribute('aria-expanded', 'false'); // تحديث aria
  });
});

// ====== سنة الفوتر ديناميكيًا ======
const yearEl = document.getElementById('year'); // عنصر السنة
if (yearEl) yearEl.textContent = String(new Date().getFullYear()); // وضع سنة اليوم

// ====== تحريك أرقام الإحصائيات عند ظهورها ======

// جلب كل العناصر التي تحمل data-count
const counters = document.querySelectorAll('.stat-num[data-count]'); // عناصر الأرقام

// دالة لتحريك الرقم من 0 إلى القيمة المطلوبة
function animateCount(el, to) { // el عنصر الرقم، to القيمة النهائية
  const duration = 900; // مدة التحريك بالمللي ثانية
  const start = performance.now(); // وقت البداية

  function frame(now) { // now الوقت الحالي
    const progress = Math.min((now - start) / duration, 1); // نسبة التقدم 0..1
    const value = Math.floor(to * progress); // قيمة تدريجية
    el.textContent = `+${value.toLocaleString('en-US')}`; // تحديث النص بتنسيق أرقام
    if (progress < 1) requestAnimationFrame(frame); // استمرار حتى النهاية
  }

  requestAnimationFrame(frame); // بدء التحريك
}

// مراقب ظهور العناصر في الشاشة
const io = new IntersectionObserver((entries) => { // مراقبة
  entries.forEach((entry) => { // لكل عنصر مراقب
    if (!entry.isIntersecting) return; // إذا لم يظهر، تجاهل
    const el = entry.target; // العنصر
    const to = Number(el.getAttribute('data-count')); // القيمة الهدف
    animateCount(el, to); // حرّك الرقم
    io.unobserve(el); // أوقف مراقبته بعد التنفيذ مرة واحدة
  });
}, { threshold: 0.35 }); // يبدأ التحريك عندما يظهر 35% من العنصر

// ربط المراقب بعناصر الأرقام
counters.forEach((el) => io.observe(el)); // راقب كل رقم

// ====== نموذج سجل اهتمامك (تحقق بسيط) ======

// جلب النموذج
const form = document.getElementById('interestForm'); // النموذج

// جلب مكان الرسائل
const formHint = document.getElementById('formHint'); // الرسالة

// إذا النموذج موجود
if (form) {
  form.addEventListener('submit', (e) => { // عند الإرسال
    e.preventDefault(); // منع الإرسال الحقيقي (Static)

    // جمع البيانات من النموذج
    const data = new FormData(form); // FormData

    // استخراج القيم الأساسية
    const firstName = String(data.get('firstName') || '').trim(); // الاسم
    const phone = String(data.get('phone') || '').trim(); // الهاتف
    const email = String(data.get('email') || '').trim(); // البريد

    // تحقق بسيط
    if (!firstName || !phone || !email) { // إذا ناقص
      if (formHint) formHint.textContent = 'رجاءً أكمل الحقول المطلوبة قبل الإرسال.'; // رسالة
      return; // خروج
    }

    // عرض نجاح (محلي)
    if (formHint) formHint.textContent = 'تم استلام اهتمامك بنجاح. سنقوم بالتواصل معك قريبًا.'; // رسالة نجاح

    // تفريغ النموذج
    form.reset(); // إعادة تعيين الحقول
  });
}
