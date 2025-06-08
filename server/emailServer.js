const nodemailer = require("nodemailer");

// Конфигурация транспорта (лучше вынести в конфиг)
const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: "vitalya1markovchi@yandex.ru",
    pass: "zbaafylzmjzlzwsv",
  },
});

const sendCodeEmail = async (email, code, purpose = "verification") => {
  const subject =
    purpose === "reset"
      ? "🔑 Password Reset Code"
      : "🔐 Email Verification Code";

  const textAction =
    purpose === "reset" ? "reset your password" : "verify your email address";

  const htmlAction =
    purpose === "reset" ? "reset your password" : "verify your email address";

  const mailOptions = {
    from: `"Your App" <vitalya1markovchi@yandex.ru>`,
    to: email,
    subject: subject,
    text:
      `Hello,\n\nYour ${
        purpose === "reset" ? "password reset" : "verification"
      } code is: ${code}\n\n` +
      `Please enter this code in the app to ${textAction}.\n\nThank you!`,
    html: `<p>Hello,</p>
           <p>Your ${
             purpose === "reset" ? "password reset" : "verification"
           } code is: <strong>${code}</strong></p>
           <p>Please enter this code in the app to ${htmlAction}.</p>
           <p>Thank you!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] ${purpose} code sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] Error sending ${purpose} code to ${email}:`, error);
    return false;
  }
};

const sendPasswordResetSuccessEmail = async (email) => {
  const mailOptions = {
    from: `"Your App" <vitalya1markovchi@yandex.ru>`,
    to: email,
    subject: "✅ Password Changed Successfully",
    text:
      `Hello,\n\nYour password has been successfully changed.\n\n` +
      `If you did not make this change, please contact support immediately.\n\nThank you!`,
    html: `<p>Hello,</p>
           <p>Your password has been successfully changed.</p>
           <p>If you did not make this change, please contact support immediately.</p>
           <p>Thank you!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Password reset confirmation sent to ${email}`);
    return true;
  } catch (error) {
    console.error(
      `[EMAIL] Error sending password reset confirmation to ${email}:`,
      error
    );
    return false;
  }
};

module.exports = {
  sendCodeEmail,
  sendPasswordResetSuccessEmail,
};
