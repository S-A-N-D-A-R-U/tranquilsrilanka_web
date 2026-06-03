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

export async function sendEmail(subject: string, htmlContent: string) {
  try {
    const to = process.env.CONTACT_EMAIL || process.env.MAIL_FROM || process.env.EMAIL_USER || process.env.MAIL_USER;
    const fromUser = process.env.EMAIL_USER || process.env.MAIL_USER;
    if (!to) {
      throw new Error("No recipient email configured in environment.");
    }
    
    await transporter.sendMail({
      from: `"Tranquil Sri Lanka" <${fromUser}>`,
      to,
      subject,
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email." };
  }
}
