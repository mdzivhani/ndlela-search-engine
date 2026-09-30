const { test } = require("node:test");
const assert = require("node:assert/strict");
const nodemailer = require("nodemailer");
const { sendResetEmail } = require("../mail");
test("reset mail uses SMTP TLS and delivers the secret only in the email link", async () => {
  const original = nodemailer.createTransport;
  const previous = { ...process.env };
  let options, message;
  try {
    Object.assign(process.env, {
      SMTP_HOST: "smtp.example.test",
      SMTP_PORT: "587",
      SMTP_FROM: "Ndlela <support@example.test>",
      SMTP_USER: "mailer",
      SMTP_PASSWORD: "test",
      APP_URL: "https://ndlela.example.test",
    });
    nodemailer.createTransport = (config) => {
      options = config;
      return {
        sendMail: async (mail) => {
          message = mail;
        },
      };
    };
    await sendResetEmail("traveller@example.test", "private-reset-token");
    assert.equal(options.requireTLS, true);
    assert.equal(options.host, "smtp.example.test");
    assert.equal(message.to, "traveller@example.test");
    assert.match(
      message.text,
      /https:\/\/ndlela.example.test\/forgot-password\?token=private-reset-token/,
    );
    delete process.env.SMTP_HOST;
    await assert.rejects(
      sendResetEmail("traveller@example.test", "token"),
      /not configured/,
    );
  } finally {
    nodemailer.createTransport = original;
    for (const key of [
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_FROM",
      "SMTP_USER",
      "SMTP_PASSWORD",
      "APP_URL",
    ]) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});
