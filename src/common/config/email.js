import nodemailer from "nodemailer";
import APIError from "../utils/api-error.js";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendTestEmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: '"Dipesh Chaudary" <dipesh@example.com>',
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (err) {
    console.error("Error while sending mail:", err);
    throw APIError.internal("Failed to send email");
  }
}
async function sendVerificationEmail(to, token) {
  const verificationUrl = `${process.env.FRONTEND_URL}/api/v1/auth/verify-email/${token}`;
  const subject = "Email Verification";
  const text = `Please verify your email by clicking the following link: ${verificationUrl}`;
  const html = `<p>Please verify your email by clicking the following link:</p><a href="${verificationUrl}">Verify Email</a>`;
  return await sendTestEmail(to, subject, text, html);
}

async function sendResetPasswordEmail(to, token) {
  const resetUrl = `${process.env.FRONTEND_URL}/api/v1/auth/reset-password/${token}`;
  const subject = "Password Reset";
  const text = `You can reset your password by clicking the following link: ${resetUrl}`;
  const html = `<p>You can reset your password by clicking the following link:</p><a href="${resetUrl}">Reset Password</a>`;
  return await sendTestEmail(to, subject, text, html);
}

export { sendTestEmail, sendVerificationEmail, sendResetPasswordEmail };
