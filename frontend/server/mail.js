async function sendResetEmail(email, token) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_FROM ||
    !process.env.APP_URL
  ) {
    throw Object.assign(
      new Error(
        "Password reset email is not configured. Please contact support.",
      ),
      { status: 503 },
    );
  }
  const nodemailer = require("nodemailer");
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    requireTLS: process.env.SMTP_SECURE !== "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });
  const url = new URL("/forgot-password", process.env.APP_URL);
  url.searchParams.set("token", token);
  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Reset your Ndlela password",
    text: `Use this link within one hour to reset your password: ${url}\n\nIf you did not request this, ignore this email.`,
  });
}
module.exports = { sendResetEmail };
