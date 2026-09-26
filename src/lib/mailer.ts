import "server-only";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || process.env.MAIL_USER,
    pass: process.env.EMAIL_PASS || process.env.MAIL_PASS,
  },
});

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape user input before placing it in email HTML. */
export function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

/** Remove line breaks so user input can't inject extra mail headers into the subject. */
export function oneLine(value: unknown) {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim();
}

/** Render label/value rows as escaped HTML paragraphs. */
export function emailRows(rows: [label: string, value: unknown][]) {
  return rows
    .map(([label, value]) => {
      const v = value === undefined || value === null || value === "" ? "—" : value;
      return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(v).replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
}

export async function sendEmail(subject: string, htmlContent: string, replyTo?: string) {
  try {
    const to = process.env.CONTACT_EMAIL || process.env.MAIL_FROM || process.env.EMAIL_USER || process.env.MAIL_USER;
    const fromUser = process.env.EMAIL_USER || process.env.MAIL_USER;
    if (!to) {
      throw new Error("No recipient email configured in environment.");
    }

    await transporter.sendMail({
      from: `"Tranquil Sri Lanka" <${fromUser}>`,
      to,
      replyTo,
      subject: oneLine(subject),
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email." };
  }
}
