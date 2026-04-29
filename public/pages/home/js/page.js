(() => { // بداية دالة فورية لعزل كود الصفحة ومنع تلويث المتغيرات العامة في المتصفح.
  "use strict"; // تفعيل الوضع الصارم لاكتشاف الأخطاء البرمجية مبكرًا بدل تركها تمر بصمت.

  const $ = (s, p = document) => p.querySelector(s); // دالة مختصرة لجلب أول عنصر يطابق المحدد CSS من الصفحة أو من عنصر أب محدد.
  const $$ = (s, p = document) => Array.from(p.querySelectorAll(s)); // دالة مختصرة لجلب كل العناصر المطابقة وتحويلها إلى Array حتى نستخدم forEach و map بسهولة.

  const navToggle = $("#navToggle"); // جلب زر فتح/إغلاق قائمة الموبايل.
  const navMenu = $("#navMenu"); // جلب قائمة التنقل الخاصة بالموبايل.
  const yearEl = $("#year"); // جلب عنصر السنة في الفوتر إن وجد.

  if (yearEl) yearEl.textContent = String(new Date().getFullYear()); // إذا كان عنصر السنة موجودًا، نضع فيه السنة الحالية تلقائيًا.

  // ===== Mobile nav ===== // بداية قسم التحكم بقائمة الموبايل.
  if (navToggle && navMenu) { // تشغيل كود قائمة الموبايل فقط إذا كان الزر والقائمة موجودين.
    navToggle.addEventListener("click", (e) => { // إضافة حدث عند الضغط على زر القائمة.
      e.stopPropagation(); // منع انتقال النقر إلى document حتى لا تُغلق القائمة فور فتحها.
      const open = navMenu.classList.toggle("is-open"); // تبديل كلاس الفتح وإرجاع هل القائمة أصبحت مفتوحة أم لا.
      navToggle.setAttribute("aria-expanded", open ? "true" : "false"); // تحديث حالة الوصول لذوي الاحتياجات: هل القائمة مفتوحة.
    }); // نهاية حدث الضغط على زر القائمة.

    document.addEventListener("click", (e) => { // إضافة حدث عام على الصفحة لإغلاق القائمة عند الضغط خارجها.
      const t = e.target; // حفظ العنصر الذي تم الضغط عليه.

      const inside = // متغير يحدد هل الضغط كان داخل القائمة أو داخل زر القائمة.
        (navMenu instanceof Element && navMenu.contains(t)) || // فحص هل العنصر المضغوط داخل قائمة الموبايل.
        (navToggle instanceof Element && navToggle.contains(t)); // فحص هل العنصر المضغوط داخل زر القائمة.

      if (!inside) { // إذا كان الضغط خارج القائمة وخارج الزر.
        navMenu.classList.remove("is-open"); // إغلاق قائمة الموبايل.
        navToggle.setAttribute("aria-expanded", "false"); // تحديث حالة الوصول إلى مغلق.
      } // نهاية شرط الضغط خارج القائمة.
    }); // نهاية حدث النقر العام.
  } // نهاية كود قائمة الموبايل.

  // ===== Dropdowns ===== // بداية قسم القوائم المنسدلة في الناف.
  $$(".nav__dropdown").forEach((dd) => { // المرور على كل قائمة منسدلة موجودة في الهيدر.
    const btn = dd.querySelector("[data-dd]"); // جلب الزر المسؤول عن فتح القائمة المنسدلة الحالية.
    if (!btn) return; // إذا لم يوجد زر داخل القائمة، نتركها بدون تعديل.

    btn.addEventListener("click", (e) => { // إضافة حدث عند الضغط على زر القائمة المنسدلة.
      e.stopPropagation(); // منع إغلاق القائمة مباشرة بسبب حدث document.

      $$(".nav__dropdown.is-open").forEach((x) => { // البحث عن أي قائمة منسدلة مفتوحة حاليًا.
        if (x !== dd) x.classList.remove("is-open"); // إغلاق أي قائمة أخرى غير القائمة الحالية.
      }); // نهاية إغلاق القوائم الأخرى.

      dd.classList.toggle("is-open"); // فتح أو إغلاق القائمة الحالية.
    }); // نهاية حدث الضغط على زر القائمة المنسدلة.
  }); // نهاية المرور على القوائم المنسدلة.

  document.addEventListener("click", () => { // عند الضغط في أي مكان في الصفحة.
    $$(".nav__dropdown.is-open").forEach((x) => x.classList.remove("is-open")); // إغلاق كل القوائم المنسدلة المفتوحة.
  }); // نهاية حدث إغلاق القوائم المنسدلة.

  // ===== Image placeholder system ===== // بداية نظام إخفاء أرقام الصور المؤقتة بعد تحميل الصور.
  const markLoaded = (wrap) => wrap.classList.add("is-loaded"); // دالة تضيف كلاس is-loaded على حاوية الصورة عند اكتمال تحميلها.

  const initImages = () => { // دالة تهيئة الصور في الصفحة.
    const wrappers = $$(".shot, .tile, .member, .quoteCard__media, .brandHuge"); // جمع كل حاويات الصور التي تستخدم نظام placeholder.

    wrappers.forEach((w) => { // المرور على كل حاوية صورة.
      const img = w.querySelector("img"); // جلب الصورة داخل الحاوية.
      if (!img) return; // إذا لا توجد صورة داخل الحاوية، نتركها.

      img.addEventListener("load", () => markLoaded(w), { once: true }); // عند تحميل الصورة، نضيف is-loaded مرة واحدة فقط.
      img.addEventListener("error", () => {}, { once: true }); // عند فشل الصورة لا نكسر السكربت، فقط نتجاهل الخطأ.

      if (img.complete && img.naturalWidth > 0) { // إذا كانت الصورة محملة مسبقًا من الكاش.
        markLoaded(w); // نضيف is-loaded فورًا حتى لا يبقى الرقم فوق الصورة.
      } // نهاية فحص الصورة المحملة مسبقًا.
    }); // نهاية المرور على حاويات الصور.
  }; // نهاية دالة initImages.

  initImages(); // تشغيل نظام الصور قبل السلايدر حتى تكون الصور جاهزة بصريًا.

  // ===== Projects slider - safe add-on ===== // بداية إضافة السلايدر الآمنة لقسم المشاريع فقط.
  const initProjectsSlider = () => { // تعريف دالة مستقلة لتشغيل سلايدر المشاريع بدون المساس ببقية الموقع.
    const section = $(".projects"); // تحديد قسم المشاريع الوسطي في الصفحة.
    if (!section) return; // إذا لم يوجد قسم المشاريع، نخرج فورًا بدون أخطاء.

    const gallery = $(".gallery", section); // تحديد مسار الصور داخل قسم المشاريع فقط.
    if (!gallery) return; // إذا لم يوجد مسار gallery، نخرج فورًا بدون أخطاء.

    const tiles = $$(".tile", gallery); // جمع بطاقات المشاريع الموجودة داخل السلايدر.
    if (tiles.length <= 1) return; // إذا توجد بطاقة واحدة أو أقل، لا نحتاج أسهمًا ولا نقاطًا.

    if (section.dataset.projectsSlider === "ready") return; // منع تشغيل السلايدر مرتين حتى لا تتكرر الأسهم والنقاط.
    section.dataset.projectsSlider = "ready"; // وضع علامة أن السلايدر تم تفعيله بنجاح.

    const container = $(".container", section) || section; // اختيار حاوية القسم لإضافة الأسهم والنقاط داخلها.
    const pageDir = document.documentElement.getAttribute("dir") || document.body.getAttribute("dir") || "ltr"; // قراءة اتجاه الصفحة من html أو body.
    const isRtl = pageDir.toLowerCase() === "rtl"; // تحديد هل الصفحة RTL مثل العربية أم LTR مثل الإنجليزية.

    let activeIndex = 0; // تخزين رقم البطاقة النشطة حاليًا.
    let scrollTimer = 0; // مؤقت لتقليل عدد الحسابات أثناء السحب اليدوي للسلايدر.

    const controls = document.createElement("div"); // إنشاء عنصر حاوية الأسهم.
    controls.className = "projectsSlider__controls"; // إعطاء حاوية الأسهم الكلاس المطلوب من CSS.

    const prevButton = document.createElement("button"); // إنشاء زر السابق.
    prevButton.type = "button"; // تحديد نوع الزر حتى لا يتصرف كزر إرسال نموذج.
    prevButton.className = "projectsSlider__btn projectsSlider__btn--prev"; // إضافة كلاس زر السابق للتنسيق.
    prevButton.setAttribute("aria-label", isRtl ? "المشروع السابق" : "Previous project"); // إضافة وصف وصول مناسب حسب اللغة.
    prevButton.textContent = isRtl ? "›" : "‹"; // اختيار رمز السهم حسب اتجاه الصفحة.

    const nextButton = document.createElement("button"); // إنشاء زر التالي.
    nextButton.type = "button"; // تحديد نوع الزر حتى لا يسبب submit.
    nextButton.className = "projectsSlider__btn projectsSlider__btn--next"; // إضافة كلاس زر التالي للتنسيق.
    nextButton.setAttribute("aria-label", isRtl ? "المشروع التالي" : "Next project"); // إضافة وصف وصول مناسب حسب اللغة.
    nextButton.textContent = isRtl ? "‹" : "›"; // اختيار رمز السهم التالي حسب اتجاه الصفحة.

    controls.appendChild(prevButton); // إضافة زر السابق داخل حاوية الأسهم.
    controls.appendChild(nextButton); // إضافة زر التالي داخل حاوية الأسهم.

    const dots = document.createElement("div"); // إنشاء حاوية نقاط التنقل.
    dots.className = "projectsSlider__dots"; // إعطاء النقاط الكلاس المطلوب من CSS.

    const dotButtons = tiles.map((_tile, index) => { // إنشاء نقطة تنقل لكل بطاقة مشروع.
      const dot = document.createElement("button"); // إنشاء زر نقطة.
      dot.type = "button"; // تحديد نوع الزر حتى لا يرسل نموذج.
      dot.className = "projectsSlider__dot"; // إضافة كلاس النقطة للتنسيق.
      dot.setAttribute("aria-label", isRtl ? `اذهب إلى المشروع ${index + 1}` : `Go to project ${index + 1}`); // وصف النقطة لقارئات الشاشة.
      dot.addEventListener("click", () => scrollToIndex(index)); // عند الضغط على النقطة ننتقل للبطاقة المطابقة.
      dots.appendChild(dot); // إضافة النقطة داخل حاوية النقاط.
      return dot; // إرجاع النقطة حتى نستخدمها لاحقًا في التفعيل.
    }); // نهاية إنشاء نقاط التنقل.

    container.appendChild(controls); // إضافة الأسهم داخل حاوية قسم المشاريع.
    container.appendChild(dots); // إضافة نقاط التنقل أسفل السلايدر.

    const clampIndex = (index) => Math.max(0, Math.min(index, tiles.length - 1)); // دالة تمنع رقم البطاقة من الخروج عن أول وآخر بطاقة.

    function scrollToIndex(index) { // دالة الانتقال إلى بطاقة محددة.
      activeIndex = clampIndex(index); // ضبط الرقم المطلوب داخل الحدود الصحيحة.
      tiles[activeIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }); // تمرير البطاقة إلى منتصف السلايدر بسلاسة.
      updateUI(); // تحديث حالة الأسهم والنقاط مباشرة بعد الانتقال.
    } // نهاية دالة scrollToIndex.

    function getClosestIndex() { // دالة تحديد البطاقة الأقرب إلى مركز السلايدر.
      const galleryBox = gallery.getBoundingClientRect(); // قراءة أبعاد ومكان السلايدر في الشاشة.
      const galleryCenter = galleryBox.left + galleryBox.width / 2; // حساب مركز السلايدر أفقيًا.

      let closestIndex = 0; // افتراض أن أول بطاقة هي الأقرب كبداية.
      let closestDistance = Number.POSITIVE_INFINITY; // وضع مسافة كبيرة جدًا كبداية للمقارنة.

      tiles.forEach((tile, index) => { // المرور على كل بطاقة في السلايدر.
        const tileBox = tile.getBoundingClientRect(); // قراءة أبعاد ومكان البطاقة في الشاشة.
        const tileCenter = tileBox.left + tileBox.width / 2; // حساب مركز البطاقة أفقيًا.
        const distance = Math.abs(tileCenter - galleryCenter); // حساب المسافة بين مركز البطاقة ومركز السلايدر.

        if (distance < closestDistance) { // إذا كانت البطاقة الحالية أقرب من البطاقة السابقة.
          closestDistance = distance; // حفظ المسافة الجديدة كأقرب مسافة.
          closestIndex = index; // حفظ رقم البطاقة الأقرب.
        } // نهاية شرط الأقرب.
      }); // نهاية المرور على البطاقات.

      return closestIndex; // إرجاع رقم البطاقة الأقرب لمركز السلايدر.
    } // نهاية دالة getClosestIndex.

    function updateUI() { // دالة تحديث واجهة السلايدر.
      activeIndex = clampIndex(activeIndex); // ضمان أن رقم البطاقة النشطة داخل الحدود.
      prevButton.disabled = activeIndex === 0; // تعطيل زر السابق إذا كنا عند أول بطاقة.
      nextButton.disabled = activeIndex === tiles.length - 1; // تعطيل زر التالي إذا كنا عند آخر بطاقة.
      dotButtons.forEach((dot, index) => dot.classList.toggle("is-active", index === activeIndex)); // تفعيل النقطة المطابقة للبطاقة الحالية.
    } // نهاية دالة updateUI.

    prevButton.addEventListener("click", () => scrollToIndex(activeIndex - 1)); // عند الضغط على السابق ننتقل للبطاقة السابقة.
    nextButton.addEventListener("click", () => scrollToIndex(activeIndex + 1)); // عند الضغط على التالي ننتقل للبطاقة التالية.

    gallery.addEventListener("scroll", () => { // عند سحب السلايدر يدويًا.
      window.clearTimeout(scrollTimer); // إلغاء أي مؤقت سابق حتى لا تتكرر الحسابات.
      scrollTimer = window.setTimeout(() => { // تأخير بسيط حتى يهدأ التمرير.
        activeIndex = getClosestIndex(); // تحديد البطاقة الأقرب إلى المركز بعد السحب.
        updateUI(); // تحديث الأسهم والنقاط حسب البطاقة الجديدة.
      }, 80); // مدة انتظار قصيرة لتحسين الأداء.
    }, { passive: true }); // passive يحسن أداء التمرير ويمنع تعطيل السحب.

    window.addEventListener("resize", () => { // عند تغيير حجم النافذة.
      activeIndex = getClosestIndex(); // إعادة حساب أقرب بطاقة للمركز.
      updateUI(); // تحديث الواجهة بعد تغير المقاسات.
    }); // نهاية حدث resize.

    updateUI(); // تحديث أولي للواجهة بعد إنشاء الأسهم والنقاط.
  }; // نهاية دالة initProjectsSlider.

  initProjectsSlider(); // تشغيل السلايدر داخل نفس الدالة حتى يستطيع استخدام $ و $$ بدون خطأ.

  // ===== Newsletter submit (UI only) ===== // بداية قسم نموذج النشرة، بقي كما هو لكن انتقل بعد السلايدر.
  const nf = $("#newsForm"); // جلب نموذج النشرة إن وجد.
  if (nf) { // تشغيل كود النموذج فقط إذا كان موجودًا.
    nf.addEventListener("submit", (e) => { // إضافة حدث عند إرسال النموذج.
      e.preventDefault(); // منع إعادة تحميل الصفحة عند الإرسال.
      alert("تم الاستلام ✅"); // إظهار رسالة تأكيد للمستخدم.
      nf.reset(); // تفريغ حقول النموذج بعد الإرسال.
    }); // نهاية حدث إرسال النموذج.
  } // نهاية شرط وجود النموذج.
})(); // نهاية الدالة الفورية؛ لا تضع أي كود يستخدم $ أو $$ بعد هذا السطر.