import { NextResponse } from "next/server";
import { sendAdminConsultationEmail } from "@/lib/send-admin-email";

export async function GET() {
  try {
    console.log("TEST EMAIL ENV CHECK", {
      hasApiKey: !!process.env.RESEND_API_KEY,
      adminEmail: process.env.ADMIN_ALERT_EMAIL,
      mailFrom: process.env.MAIL_FROM,
    });

    const result = await sendAdminConsultationEmail({
      fullName: "Test From API Route",
      phone: "07800000000",
      email: "test@example.com",
      meetingType: "zoom",
      meetingDate: "2026-03-27",
      meetingTime: "10:00 AM",
      requestId: "manual-test-route",
    });

    console.log("TEST EMAIL RESULT", result);

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    console.error("TEST EMAIL ERROR", error);

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}