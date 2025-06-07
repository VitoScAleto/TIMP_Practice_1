const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // или другой SMTP сервис
  auth: {
    user: "your.email@gmail.com",
    pass: "your-app-password", // не обычный пароль, а App Password
  },
});

const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: '"Your App" <your.email@gmail.com>',
    to: email,
    subject: "Email Verification Code",
    text: `Your verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
