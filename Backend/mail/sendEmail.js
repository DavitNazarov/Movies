import "dotenv/config";
import { Resend } from "resend";

const RESEND_API_KEY =
  process.env.RESEND_API_KEY || process.env.RESEND_API_TOKEN;

let resendClient = null;

if (!RESEND_API_KEY) {
  console.warn(
    "RESEND_API_KEY is missing; emails will not be delivered until it is set"
  );
} else {
  resendClient = new Resend(RESEND_API_KEY);
}

const defaultFromEmail =
  process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function sendEmail({ to, subject, html, text, category }) {
  if (!resendClient) {
    console.warn("Resend client not configured; email skipped");
    return null;
  }

  if (!to) {
    throw new Error("Email recipient is required");
  }

  const recipients = (Array.isArray(to) ? to : [to])
    .filter(Boolean)
    .map((recipient) =>
      typeof recipient === "string"
        ? recipient
        : recipient?.email
          ? recipient.email
          : null
    )
    .filter(Boolean);

  if (!recipients.length) {
    throw new Error("No valid recipient email provided");
  }

  try {
    const response = await resendClient.emails.send({
      from: defaultFromEmail,
      to: recipients,
      subject,
      html: html || undefined,
      text: text || undefined,
      tags: category ? [{ name: "category", value: category }] : undefined,
    });
    return response;
  } catch (error) {
    console.error(
      "Resend send error:",
      error?.response?.body || error?.message || error
    );
    throw error;
  }
}
