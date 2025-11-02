import { baseTemplate } from "./base.js";

const ACTION_LABELS = {
  delete_user: "Delete user",
  promote_admin: "Promote to admin",
  demote_admin: "Remove admin access",
};

export function adminRequestDecisionTemplate({
  requesterName,
  action,
  status,
  targetName,
  targetEmail,
  dashboardUrl,
  responseMessage,
}) {
  const label = ACTION_LABELS[action] || "Admin request";
  const approved = status === "approved";
  const statusChipColor = approved ? "#047857" : "#b91c1c";
  const statusBg = approved ? "#d1fae5" : "#fee2e2";

  const body = `
    <h1 style="margin-bottom:16px; font-size:22px;">${label}</h1>
    <p style="margin:0 0 14px 0; color:#4b5563;">Your request has been ${
      approved ? "approved" : "declined"
    } by the super admin.</p>
    <div style="display:inline-flex; align-items:center; gap:8px; padding:6px 12px; background:${statusBg}; border-radius:999px; font-size:13px; color:${statusChipColor}; font-weight:600; margin-bottom:18px;">
      ${approved ? "Approved" : "Declined"}
    </div>
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
      responseMessage
        ? `<div style="margin-bottom:18px; padding:14px 16px; border-left:4px solid ${statusChipColor}; background:${
            approved ? "#ecfdf5" : "#fee2e2"
          }; border-radius:10px;">
            <div style="font-size:13px; font-weight:600;">Super admin note</div>
            <div style="font-size:15px; margin-top:6px;">${escapeHtml(
              responseMessage
            )}</div>
          </div>`
        : ""
    }
    <div style="margin:22px 0; text-align:center;">
      <a href="${dashboardUrl}" style="display:inline-block; padding:12px 20px; border-radius:10px; background:#111827; color:#ffffff; font-weight:600; font-size:15px;">Open dashboard</a>
    </div>
    <p style="margin-top:24px; font-size:13px; color:#6b7280;">You’re receiving this message because you created the request.</p>
  `;

  return baseTemplate({
    title: "Admin request update",
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
