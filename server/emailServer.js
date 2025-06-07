const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: "vitalya1markovchi@yandex.ru",
    pass: "zbaafylzmjzlzwsv", // не обычный пароль, а App Password
  },
});

const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: `"Your App" <vitalya1markovchi@yandex.ru>`,
    to: email,
    subject: "🔐 Email Verification Code",
    text: `Hello,\n\nYour verification code is: ${code}\n\nPlease enter this code in the app to verify your email address.\n\nThank you!`,
    html: `<p>Hello,</p>
           <p>Your verification code is: <strong>${code}</strong></p>
           <p>Please enter this code in the app to verify your email address.</p>
           <p>Thank you!</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
