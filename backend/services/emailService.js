const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

const sendVerificationEmail = async ({ email, name, token }) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verificationUrl = `${frontendUrl}/verify-email/${encodeURIComponent(token)}`;
  const transporter = createTransporter();

  if (!transporter) {
    if (process.env.NODE_ENV !== "production") console.log(`Email verification link for ${email}: ${verificationUrl}`);
    return { verificationUrl, delivered: false };
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Verify your TrackZone account",
    html: `<p>Hello ${name},</p><p>Verify your TrackZone account by clicking the link below:</p><p><a href="${verificationUrl}">Verify email address</a></p><p>This link expires in 24 hours.</p>`,
  });
  return { verificationUrl, delivered: true };
};

const sendPasswordResetEmail = async ({ email, name, token }) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password/${encodeURIComponent(token)}`;
  const transporter = createTransporter();
  if (!transporter) {
    if (process.env.NODE_ENV !== "production") console.log(`Password reset link for ${email}: ${resetUrl}`);
    return { resetUrl, delivered: false };
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Reset your TrackZone password",
    html: `<p>Hello ${name},</p><p>Use the link below to reset your TrackZone password:</p><p><a href="${resetUrl}">Reset password</a></p><p>This link expires in 1 hour.</p>`,
  });
  return { resetUrl, delivered: true };
};

const sendJobNotificationEmail = async ({ email, name, subject, details }) => {
  const transporter = createTransporter();
  if (!transporter) return { delivered: false };
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject,
    text: details,
  });
  return { delivered: true };
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendJobNotificationEmail };
