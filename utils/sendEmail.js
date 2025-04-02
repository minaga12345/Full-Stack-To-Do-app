const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io", // Mailtrap SMTP
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Reset Service" <noreply@example.com>',
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
