import { Resend } from "resend";

type SendAdminConsultationEmailInput = {
  fullName: string;
  phone: string;
  email: string;
  meetingType: string;
  meetingDate: string;
  meetingTime: string;
  requestId: string;
};

type SendAdminConsultationEmailResult =
  | {
      ok: true;
      skipped: false;
      data: unknown;
    }
  | {
      ok: false;
      skipped: true;
      reason: string;
    }
  | {
      ok: false;
      skipped: false;
      error: unknown;
    };

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendAdminConsultationEmail(
  input: SendAdminConsultationEmailInput
): Promise<SendAdminConsultationEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ADMIN_ALERT_EMAIL?.trim();
  const from = process.env.MAIL_FROM?.trim();

  console.log("SEND_ADMIN_EMAIL_ENV", {
    hasApiKey: !!apiKey,
    to,
    from,
  });

  if (!apiKey || !to || !from) {
    return {
      ok: false,
      skipped: true,
      reason: "Missing RESEND_API_KEY or ADMIN_ALERT_EMAIL or MAIL_FROM",
    };
  }

  const resend = new Resend(apiKey);

  const meetingTypeLabel =
    input.meetingType === "branch"
      ? "فرع الشركة"
      : input.meetingType === "zoom"
        ? "اجتماع Zoom"
        : input.meetingType === "phone"
          ? "اتصال هاتفي"
          : input.meetingType;

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject: `طلب استشارة جديد - ${input.fullName}`,
    replyTo: input.email || undefined,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.9; color: #111;">
        <h2 style="margin-bottom: 16px;">طلب استشارة جديد</h2>
        <p><strong>الاسم:</strong> ${escapeHtml(input.fullName)}</p>
        <p><strong>الهاتف:</strong> ${escapeHtml(input.phone)}</p>
        <p><strong>البريد الإلكتروني:</strong> ${escapeHtml(input.email)}</p>
        <p><strong>نوع المقابلة:</strong> ${escapeHtml(meetingTypeLabel)}</p>
        <p><strong>التاريخ:</strong> ${escapeHtml(input.meetingDate)}</p>
        <p><strong>الوقت:</strong> ${escapeHtml(input.meetingTime)}</p>
        <p><strong>معرّف الطلب:</strong> ${escapeHtml(input.requestId)}</p>
      </div>
    `,
  });

  console.log("RESEND_RAW_RESULT", { data, error });

  if (error) {
    return {
      ok: false,
      skipped: false,
      error,
    };
  }

  return {
    ok: true,
    skipped: false,
    data,
  };
}