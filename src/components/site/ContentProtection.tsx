"use client";
// هذا المكوّن يعمل في المتصفح فقط لأنه يتعامل مع أحداث المستخدم.

import { useEffect } from "react";
// استيراد useEffect لتفعيل الحماية بعد تحميل الصفحة.

import { usePathname } from "next/navigation";
// استيراد usePathname لمعرفة المسار الحالي واستثناء لوحة الأدمن.

function isEditableElement(target: EventTarget | null) {
  // دالة تتحقق هل العنصر قابلًا للكتابة أو التحرير.

  if (!(target instanceof HTMLElement)) {
    // إذا لم يكن الهدف عنصر HTML.
    return false;
    // نرجع false.
  }

  const tagName = target.tagName.toLowerCase();
  // قراءة اسم العنصر بصيغة صغيرة مثل input أو textarea.

  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
  // السماح بالنسخ واللصق والتحديد داخل الحقول فقط.
}

function isProtectedMedia(target: EventTarget | null) {
  // دالة تتحقق هل العنصر صورة أو ميديا محمية.

  if (!(target instanceof HTMLElement)) {
    // إذا لم يكن الهدف عنصر HTML.
    return false;
    // نرجع false.
  }

  return Boolean(
    target.closest("img") ||
      target.closest("picture") ||
      target.closest("video") ||
      target.closest("canvas") ||
      target.closest("svg") ||
      target.closest("[data-protect-media='true']")
  );
  // نعتبر الصور والفيديو والـ canvas والـ svg عناصر محمية.
}

export default function ContentProtection() {
  // مكوّن حماية المحتوى العام.

  const pathname = usePathname();
  // قراءة مسار الصفحة الحالي.

  useEffect(() => {
    // تفعيل الحماية بعد تحميل الصفحة.

    if (pathname?.startsWith("/admin")) {
      // إذا كان المستخدم داخل لوحة الأدمن.
      return;
      // لا نفعّل الحماية داخل الأدمن حتى لا نكسر التحرير والنسخ.
    }

    const blockContextMenu = (event: MouseEvent) => {
      // منع قائمة كليك يمين أو قائمة الضغط المطول عندما تتحول إلى contextmenu.

      if (isEditableElement(event.target)) {
        // إذا كان المستخدم داخل حقل كتابة.
        return;
        // نسمح بالقائمة الطبيعية.
      }

      event.preventDefault();
      // منع قائمة النسخ والحفظ في الواجهة العامة.
    };

    const blockDrag = (event: DragEvent) => {
      // منع سحب الصور من الموقع.

      if (isProtectedMedia(event.target)) {
        // إذا كان الهدف صورة أو ميديا.
        event.preventDefault();
        // منع السحب.
      }
    };

    const blockSelectStart = (event: Event) => {
      // منع تحديد النصوص والصور خارج الحقول.

      if (isEditableElement(event.target)) {
        // إذا كان الهدف حقل إدخال.
        return;
        // نسمح بالتحديد داخل الحقول.
      }

      event.preventDefault();
      // منع التحديد في الواجهة العامة.
    };

    const blockCopyCut = (event: ClipboardEvent) => {
      // منع النسخ والقص خارج الحقول.

      if (isEditableElement(event.target)) {
        // إذا كان الهدف حقل إدخال.
        return;
        // نسمح بالنسخ والقص داخل الحقول.
      }

      event.preventDefault();
      // منع النسخ والقص من محتوى الموقع العام.
    };

    const blockMobileLongPress = (event: TouchEvent) => {
      // منع قائمة الضغط المطول في الجوال على الصور والميديا.

      if (isEditableElement(event.target)) {
        // إذا كان الهدف حقل إدخال.
        return;
        // نسمح بالسلوك الطبيعي داخل الحقول.
      }

      if (isProtectedMedia(event.target)) {
        // إذا كان الضغط على صورة أو ميديا.
        event.preventDefault();
        // منع Touch Callout في iOS وAndroid قدر الإمكان.
      }
    };

    document.addEventListener("contextmenu", blockContextMenu, true);
    // منع قائمة السياق بنمط capture حتى نمسك الحدث مبكرًا.

    document.addEventListener("dragstart", blockDrag, true);
    // منع سحب الصور.

    document.addEventListener("selectstart", blockSelectStart, true);
    // منع التحديد.

    document.addEventListener("copy", blockCopyCut, true);
    // منع النسخ.

    document.addEventListener("cut", blockCopyCut, true);
    // منع القص.

    document.addEventListener("touchstart", blockMobileLongPress, {
      capture: true,
      passive: false,
    });
    // منع الضغط المطول على الصور في الجوال، ويجب أن يكون passive:false حتى يعمل preventDefault.

    return () => {
      // تنظيف الأحداث عند مغادرة الصفحة.

      document.removeEventListener("contextmenu", blockContextMenu, true);
      // إزالة منع قائمة السياق.

      document.removeEventListener("dragstart", blockDrag, true);
      // إزالة منع السحب.

      document.removeEventListener("selectstart", blockSelectStart, true);
      // إزالة منع التحديد.

      document.removeEventListener("copy", blockCopyCut, true);
      // إزالة منع النسخ.

      document.removeEventListener("cut", blockCopyCut, true);
      // إزالة منع القص.

      document.removeEventListener("touchstart", blockMobileLongPress, true);
      // إزالة منع الضغط المطول.
    };
  }, [pathname]);
  // إعادة ضبط الحماية عند تغير المسار.

  return null;
  // المكوّن لا يرسم شيئًا في الصفحة.
}