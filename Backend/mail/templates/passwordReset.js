// Backend/mail/templates/passwordReset.js
import { baseTemplate } from "./base.js";

export function passwordResetTemplate({ name = "", resetLink = "" }) {
  const body = `
    <h1>Reset Your Password</h1>
    <p>Hello${name ? `, ${escapeHtml(name)}` : ""}!</p>
    <p>We received a request to reset your password for your Movie Hub account.</p>
    <p>Click the button below to reset your password:</p>
    <p style="margin:24px 0;">
      <a class="button" href="${resetLink}" style="background:#3b82f6;color:#fff;">Reset Password</a>
    </p>
    <p style="color:#6b7280;font-size:14px;">This link will expire in 1 hour.</p>
    <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    <p style="color:#dc2626;font-size:14px;margin-top:16px;"><strong>Security Tip:</strong> If you didn't request this, please secure your account immediately.</p>
  `;
  return baseTemplate({ title: "Reset Your Password - Movie Hub", body });
}

function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

