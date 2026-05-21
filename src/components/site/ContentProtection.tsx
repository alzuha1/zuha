"use client";
// هذا الملف يعمل على المتصفح فقط لأنه يحتاج مراقبة أحداث المستخدم.

import { useEffect } from "react";
// استيراد useEffect لتفعيل الحماية بعد تحميل الصفحة.

import { usePathname } from "next/navigation";
// استيراد usePathname لمعرفة الصفحة الحالية وعدم تعطيل لوحة الأدمن.

function isEditableElement(target: EventTarget | null) {
  // دالة تفحص هل العنصر حقل كتابة أو عنصر قابل للتحرير.

  if (!(target instanceof HTMLElement)) {
    // إذا لم يكن العنصر HTML حقيقيًا.
    return false;
    // نرجع false.
  }

  const tagName = target.tagName.toLowerCase();
  // قراءة اسم العنصر مثل input أو textarea.

  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
  // السماح بالنسخ واللصق داخل الحقول حتى لا نخرب النماذج.
}

function isProtectedMedia(target: EventTarget | null) {
  // دالة تفحص هل العنصر صورة أو عنصر بصري محمي.

  if (!(target instanceof HTMLElement)) {
    // إذا لم يكن العنصر HTML.
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
  // حماية الصور والفيديو والكانفاس وأي عنصر نضع عليه data-protect-media.
}

export default function ContentProtection() {
  // مكوّن حماية المحتوى العام.

  const pathname = usePathname();
  // قراءة مسار الصفحة الحالية.

  useEffect(() => {
    // تفعيل الحماية بعد تحميل الصفحة.

    if (pathname?.startsWith("/admin")) {
      // إذا كنا داخل لوحة الأدمن.
      return;
      // لا نفعل الحماية حتى لا نزعج الإدارة أثناء التحرير.
    }

    const blockContextMenu = (event: MouseEvent) => {
      // منع قائمة كليك يمين على الصور والمحتوى المحمي.

      if (isEditableElement(event.target)) {
        // إذا كان المستخدم داخل حقل إدخال.
        return;
        // نسمح بالقائمة الطبيعية.
      }

      if (isProtectedMedia(event.target) || event.target instanceof HTMLElement) {
        // إذا كان العنصر صورة أو من محتوى الموقع العام.
        event.preventDefault();
        // منع ظهور قائمة النسخ/الحفظ.
      }
    };

    const blockDrag = (event: DragEvent) => {
      // منع سحب الصور إلى سطح المكتب أو تبويب آخر.

      if (isProtectedMedia(event.target)) {
        // إذا كان العنصر صورة أو ميديا.
        event.preventDefault();
        // منع السحب.
      }
    };

    const blockSelectStart = (event: Event) => {
      // منع تحديد المحتوى في الموقع العام مع السماح للحقول.

      if (isEditableElement(event.target)) {
        // إذا كان المستخدم داخل input أو textarea.
        return;
        // نسمح بالتحديد.
      }

      if (isProtectedMedia(event.target)) {
        // إذا كان المستخدم يحاول تحديد صورة أو عنصر بصري.
        event.preventDefault();
        // منع التحديد.
      }
    };

    const blockCopyCut = (event: ClipboardEvent) => {
      // منع النسخ والقص خارج الحقول.

      if (isEditableElement(event.target)) {
        // إذا كان المستخدم داخل حقل.
        return;
        // نسمح بالنسخ والقص.
      }

      event.preventDefault();
      // منع النسخ أو القص من محتوى الموقع العام.
    };

    document.addEventListener("contextmenu", blockContextMenu);
    // منع قائمة كليك يمين.

    document.addEventListener("dragstart", blockDrag);
    // منع سحب الصور.

    document.addEventListener("selectstart", blockSelectStart);
    // منع تحديد الصور والميديا.

    document.addEventListener("copy", blockCopyCut);
    // منع النسخ.

    document.addEventListener("cut", blockCopyCut);
    // منع القص.

    return () => {
      // تنظيف الأحداث عند مغادرة الصفحة.

      document.removeEventListener("contextmenu", blockContextMenu);
      // إزالة منع كليك يمين.

      document.removeEventListener("dragstart", blockDrag);
      // إزالة منع السحب.

      document.removeEventListener("selectstart", blockSelectStart);
      // إزالة منع التحديد.

      document.removeEventListener("copy", blockCopyCut);
      // إزالة منع النسخ.

      document.removeEventListener("cut", blockCopyCut);
      // إزالة منع القص.
    };
  }, [pathname]);
  // إعادة تفعيل الحماية عند تغيّر المسار.

  return null;
  // المكوّن لا يعرض شيئًا، فقط يفعّل الحماية.
}