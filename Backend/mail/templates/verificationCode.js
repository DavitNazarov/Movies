// Backend/mail/templates/verificationCode.js
import { baseTemplate } from "./base.js";

export function verificationCodeTemplate({ name = "", code = "" }) {
  const body = `
    <h1>Verify Your Email</h1>
    <p>Hello${name ? `, ${escapeHtml(name)}` : ""}!</p>
    <p>Thank you for signing up for Movie Hub. Please use the following code to verify your email address:</p>
    <div style="background:#f3f4f6;border-radius:8px;padding:16px;text-align:center;margin:24px 0;">
      <div style="font-size:32px;font-weight:700;letter-spacing:4px;color:#1f2937;font-family:monospace;">${code}</div>
    </div>
    <p style="color:#6b7280;font-size:14px;">This code will expire in 15 minutes.</p>
    <p>If you didn't create an account, you can safely ignore this email.</p>
  `;
  return baseTemplate({ title: "Verify Your Email - Movie Hub", body });
}

function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

