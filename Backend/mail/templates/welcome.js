// Backend/mail/templates/welcome.js
import { baseTemplate } from "./base.js";

export function welcomeTemplate({ name }) {
  const body = `
    <h1>Welcome${name ? `, ${escapeHtml(name)}` : ""}!</h1>
    <p>Thanks for joining Movie Hub.</p>
    <p><a class="button" href="${process.env.APP_URL}">Open app</a></p>
  `;
  return baseTemplate({ title: "Welcome to Movie Hub", body });
}

function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
