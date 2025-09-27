import dotenv from 'dotenv';
dotenv.config();
import nodemailer from "nodemailer";
// require("dotenv").config(); // Removed in favor of ES module import

async function sendTestEmail() {
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASS:', process.env.SMTP_PASS);
  try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: 465,
        secure: true, // must be true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: process.env.SMTP_USER,
      subject: "✅ SMTP Test Email",
      text: "Hello! This is a test email from your Event System SMTP setup.",
      html: "<b>Hello!</b><br>This is a test email from your Event System SMTP setup.",
    });

    console.log("📩 Test email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending test email:", error);
  }
}

sendTestEmail();
