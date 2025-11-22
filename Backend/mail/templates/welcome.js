// Backend/mail/templates/welcome.js
import { baseTemplate } from "./base.js";

export function welcomeTemplate({ name }) {
  const appUrl = process.env.APP_URL || "";
  const body = `
    <h1>Welcome${name ? `, ${escapeHtml(name)}` : ""}!</h1>
    <p>Thanks for joining Movie Hub! Your email has been verified and your account is now active.</p>
    
    <h2 style="margin-top:24px;margin-bottom:16px;">🎬 What You Can Do:</h2>
    <div style="background:#f3f4f6;border-radius:8px;padding:16px;margin:16px 0;">
      <ul style="margin:0;padding-left:20px;line-height:1.8;">
        <li><strong>Browse Movies</strong> - Explore thousands of movies across different genres</li>
        <li><strong>Search & Discover</strong> - Find your favorite movies with our powerful search</li>
        <li><strong>Rate Movies</strong> - Share your opinion with our 5-star rating system</li>
        <li><strong>Save Favorites</strong> - Create your personal collection of favorite movies</li>
        <li><strong>Watch Trailers</strong> - Preview movies with embedded trailers</li>
        <li><strong>Manage Profile</strong> - Customize your account settings</li>
        <li><strong>Submit Ad Banners</strong> - Promote your content (for logged-in users)</li>
        <li><strong>Admin Features</strong> - Request admin access for additional privileges</li>
      </ul>
    </div>
    
    <p style="margin-top:24px;">
      <a class="button" href="${appUrl}" style="background:#3b82f6;color:#fff;">Start Exploring</a>
    </p>
    <p style="margin-top:16px;">We're excited to have you on board. Happy movie watching! 🎥</p>
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
