import { NextRequest, NextResponse } from "next/server";
import { sendEmail, buildEmailHtml } from "@/lib/email";
import { getBaseUrl } from "@/lib/utils/base-url";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const backendUrl = process.env.GLIMMORA_API_URL ?? process.env.NEXT_PUBLIC_GLIMMORA_API_URL;

    // Call backend to initiate the reset and get the token
    const backendRes = await fetch(`${backendUrl}/api/v1/auth/password/forgot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail }),
    });

    // Extract token from backend response
    let resetToken: string | null = null;
    let resetUrl: string | null = null;

    if (backendRes.ok) {
      const data = await backendRes.json().catch(() => ({}));
      resetToken = data?.token ?? data?.reset_token ?? data?.otp ?? null;
      resetUrl   = data?.reset_url ?? data?.resetUrl ?? null;
    }

    // Build the reset link
    const baseUrl = getBaseUrl();
    const link = resetUrl
      ? resetUrl
      : resetToken
      ? `${baseUrl}/auth/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(normalizedEmail)}`
      : `${baseUrl}/auth/reset-password?email=${encodeURIComponent(normalizedEmail)}`;

    // Send the email regardless of whether backend returned a token
    // (backend may handle token storage itself and just needs the email trigger)
    const bodyHtml = `
      <h2 style="font-size:22px;font-weight:700;color:#1a1a1a;margin:0 0 8px;">Reset Your Password</h2>
      <p style="color:#6b7280;margin:0 0 24px;">
        You requested a password reset for your GlimmoraTeam account associated with
        <strong style="color:#1a1a1a;">${normalizedEmail}</strong>.
      </p>
      <p style="margin:0 0 24px;">Click the button below to set a new password. This link expires in <strong>30 minutes</strong>.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${link}"
           style="display:inline-block;background:#A67763;color:#fff;font-size:15px;font-weight:700;
                  padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.01em;">
          Reset Password
        </a>
      </div>
      <p style="font-size:13px;color:#9ca3af;margin:0 0 8px;">
        Or copy and paste this link into your browser:
      </p>
      <p style="font-size:12px;color:#A67763;word-break:break-all;margin:0 0 24px;">
        <a href="${link}" style="color:#A67763;">${link}</a>
      </p>
      <p style="font-size:13px;color:#9ca3af;margin:0;">
        If you did not request this, you can safely ignore this email. Your password will not change.
      </p>
    `;

    const html = buildEmailHtml({
      bodyHtml,
      headerColor: "#A67763",
      footerText: "© GlimmoraTeam · AI-Governed Global Workforce Platform · This is an automated message.",
    });

    await sendEmail({
      to: normalizedEmail,
      subject: "Reset your GlimmoraTeam password",
      html,
    });

    // Always return success to avoid email enumeration
    return NextResponse.json({ success: true, message: "If an account exists for this email, a reset link has been sent." });
  } catch (err) {
    console.error("[forgot-password] error:", err);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
