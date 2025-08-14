import "dotenv/config";
import sgMail from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  console.error("SENDGRID_API_KEY is missing");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail({ to, subject, html, text }) {
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject,
    html, // make sure this is a non-empty string
    text: text || " ", // keep at least one char to avoid 'content value must be a string' error
    mailSettings: {
      sandboxMode: {
        enable: String(process.env.SENDGRID_SANDBOX).toLowerCase() === "true",
      },
    },
  };

  try {
    const [resp] = await sgMail.send(msg);
    console.log("SendGrid status:", resp.statusCode);
    return resp;
  } catch (e) {
    console.error("SendGrid error:", e?.response?.body || e);
    throw e;
  }
}
