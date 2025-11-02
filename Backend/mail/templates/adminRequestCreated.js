import { baseTemplate } from "./base.js";

const ACTION_MESSAGES = {
  delete_user: {
    title: "Delete user request",
    description:
      "A secondary admin requested permission to delete the following account.",
  },
  promote_admin: {
    title: "Promote user to admin",
    description:
      "A secondary admin would like to promote this user to an admin role.",
  },
  demote_admin: {
    title: "Remove admin access",
    description:
      "A secondary admin is requesting removal of admin privileges for this user.",
  },
};

export function adminRequestCreatedTemplate({
  requesterName,
  requesterEmail,
  action,
  targetName,
  targetEmail,
  dashboardUrl,
  message,
}) {
  const strings = ACTION_MESSAGES[action] ?? ACTION_MESSAGES.delete_user;

  const body = `
    <h1 style="margin-bottom:16px; font-size:22px;">${strings.title}</h1>
    <p style="margin:0 0 12px 0; color:#4b5563;">${strings.description}</p>
    <table role="presentation" style="width:100%; margin:18px 0; border-collapse:separate; border-spacing:0;">
      <tbody>
        <tr>
          <td style="padding:12px 16px; background:#f3f4f6; border-radius:12px;">
            <div style="font-size:14px; color:#1f2937;">Requester</div>
            <div style="font-size:16px; font-weight:600;">${escapeHtml(
              requesterName ?? "Unknown"
            )}</div>
            <div style="font-size:13px; color:#4b5563;">${escapeHtml(
              requesterEmail ?? ""
            )}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <table role="presentation" style="width:100%; margin:0 0 18px 0; border-collapse:separate; border-spacing:0;">
      <tbody>
        <tr>
          <td style="padding:12px 16px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px;">
            <div style="font-size:14px; color:#1f2937;">Target user</div>
            <div style="font-size:16px; font-weight:600;">${escapeHtml(
              targetName ?? "Unknown"
            )}</div>
            ${
              targetEmail
                ? `<div style="font-size:13px; color:#4b5563;">${escapeHtml(
                    targetEmail
                  )}</div>`
                : ""
            }
          </td>
        </tr>
      </tbody>
    </table>
    ${
      message
        ? `<div style="margin-bottom:18px; padding:14px 16px; border-left:4px solid #6366f1; background:#eef2ff; border-radius:10px;">
            <div style="font-size:13px; color:#4338ca; text-transform:uppercase; letter-spacing:0.04em; font-weight:600;">Requester note</div>
            <div style="font-size:15px; color:#312e81; margin-top:6px;">${escapeHtml(
              message
            )}</div>
          </div>`
        : ""
    }
    <div style="margin:22px 0; text-align:center;">
      <a href="${dashboardUrl}" style="display:inline-block; padding:12px 20px; border-radius:10px; background:#111827; color:#ffffff; font-weight:600; font-size:15px;">Review in dashboard</a>
    </div>
    <p style="margin-top:24px; font-size:13px; color:#6b7280;">This notification was sent to all super admins.</p>
  `;

  return baseTemplate({
    title: "Admin action request",
    body,
  });
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
