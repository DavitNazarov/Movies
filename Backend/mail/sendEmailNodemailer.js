import "dotenv/config";
import nodemailer from "nodemailer";

/**
 * Email service using Nodemailer
 * Works with Gmail, Outlook, or any SMTP server
 *
 * Setup options:
 * 1. Gmail (easiest, free, no domain verification)
 * 2. Outlook/Hotmail (free, no domain verification)
 * 3. Custom SMTP server
 */

// Configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_SECURE = process.env.SMTP_SECURE === "true"; // true for 465, false for other ports
const SMTP_USER = process.env.SMTP_USER; // Your email address
const SMTP_PASS = process.env.SMTP_PASS; // Your email password or app password
const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "Movie Hub";

let transporter = null;

// Initialize Nodemailer transporter
if (!SMTP_USER || !SMTP_PASS) {
  console.warn(
    "SMTP_USER and SMTP_PASS are missing; emails will not be delivered until they are set"
  );
} else {
  // Use 'service: gmail' for Gmail (more reliable than manual host/port)
  if (SMTP_HOST === "smtp.gmail.com") {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ SMTP connection error:", error.message);
      if (error.code === "EAUTH") {
        console.error("\n🔧 Gmail Authentication Error - Common fixes:");
        console.error("1. Make sure you're using an APP PASSWORD, not your regular Gmail password");
        console.error("2. Enable 2-Step Verification: https://myaccount.google.com/security");
        console.error("3. Get App Password: https://myaccount.google.com/apppasswords");
        console.error("4. Remove spaces from the app password in your .env file");
        console.error("5. Make sure SMTP_USER is your full email address (e.g., yourname@gmail.com)");
      }
    } else {
      console.log("✅ SMTP server is ready to send emails");
    }
  });
}

export async function sendEmail({ to, subject, html, text, category }) {
  if (!transporter) {
    console.warn("Nodemailer transporter not configured; email skipped");
    return null;
  }

  if (!to) {
    throw new Error("Email recipient is required");
  }

  const recipients = (Array.isArray(to) ? to : [to])
    .filter(Boolean)
    .map((recipient) =>
      typeof recipient === "string" ? recipient : recipient?.email
    )
    .filter(Boolean);

  if (!recipients.length) {
    throw new Error("No valid recipient email provided");
  }

  try {
    const mailOptions = {
      from: EMAIL_FROM_NAME ? `${EMAIL_FROM_NAME} <${EMAIL_FROM}>` : EMAIL_FROM,
      to: recipients.join(", "), // Nodemailer accepts comma-separated string
      subject,
      html: html || text,
      text: text || undefined,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully via Nodemailer:", {
      to: recipients,
      subject,
      messageId: info.messageId,
    });

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error("❌ Nodemailer send error:", {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      fullError: error,
    });
    throw error;
  }
}
