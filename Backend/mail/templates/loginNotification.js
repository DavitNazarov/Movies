// Backend/mail/templates/loginNotification.js
import { baseTemplate } from "./base.js";

export function loginNotificationTemplate({
  name = "",
  deviceInfo = {},
  location = {},
  timestamp = new Date().toLocaleString(),
}) {
  const { browser = "Unknown", os = "Unknown", device = "Unknown" } = deviceInfo;
  const { city = "Unknown", country = "Unknown" } = location;

  const body = `
    <h1>New Login Detected</h1>
    <p>Hello${name ? `, ${escapeHtml(name)}` : ""}!</p>
    <p>We noticed a new login to your Movie Hub account.</p>
    <div style="background:#f3f4f6;border-radius:8px;padding:16px;margin:24px 0;">
      <p style="margin:8px 0;"><strong>Device:</strong> ${escapeHtml(device)}</p>
      <p style="margin:8px 0;"><strong>Browser:</strong> ${escapeHtml(browser)}</p>
      <p style="margin:8px 0;"><strong>Operating System:</strong> ${escapeHtml(os)}</p>
      <p style="margin:8px 0;"><strong>Location:</strong> ${escapeHtml(city)}, ${escapeHtml(country)}</p>
      <p style="margin:8px 0;"><strong>Time:</strong> ${escapeHtml(timestamp)}</p>
    </div>
    <p>If this wasn't you, please secure your account immediately by changing your password.</p>
    <p><a class="button" href="${process.env.APP_URL || ""}/profile" style="background:#3b82f6;color:#fff;">Go to Profile</a></p>
  `;
  return baseTemplate({ title: "New Login - Movie Hub", body });
}

function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

