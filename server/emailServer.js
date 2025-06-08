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

const sendCodeEmail = async (
  email,
  code,
  purpose = "verification",
  name = "User"
) => {
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
      `Hello ${name},\n\nYour ${
        purpose === "reset" ? "password reset" : "verification"
      } code is: ${code}\n\n` +
      `Please enter this code in the app to ${textAction}.\n\n` +
      `This code is valid for 60 minutes.\n\nThank you!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <div style="text-align: center;">
          <img src="https://yourcdn.com/logo.png" alt="App Logo" style="max-width: 150px; margin-bottom: 20px;" />
        </div>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your ${
          purpose === "reset" ? "password reset" : "verification"
        } code is:</p>
        <h2 style="color: #007BFF; text-align: center;">${code}</h2>
        <p>Please enter this code in the app to <strong>${htmlAction}</strong>.</p>
        <p style="color: #555;">⏳ This code is valid for <strong>60 minutes</strong>.</p>
        <hr style="margin: 30px 0;" />
        <p style="font-size: 12px; color: #888;">If you did not request this, please ignore this message or contact support.</p>
        <p style="font-size: 12px; color: #888;">Thank you!<br/>Your App Team</p>
      </div>
    `,
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

const sendPasswordResetSuccessEmail = async (email, name = "User") => {
  const mailOptions = {
    from: `"Your App" <vitalya1markovchi@yandex.ru>`,
    to: email,
    subject: "✅ Password Changed Successfully",
    text:
      `Hello ${name},\n\nYour password has been successfully changed.\n\n` +
      `If you did not make this change, please contact support immediately.\n\nThank you!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <div style="text-align: center;">
          <img src="https://yourcdn.com/logo.png" alt="App Logo" style="max-width: 150px; margin-bottom: 20px;" />
        </div>
        <p>Hello <strong>${name}</strong>,</p>
        <p>✅ Your password has been <strong>successfully changed</strong>.</p>
        <p>If you did <u>not</u> request this change, please contact our support team immediately to secure your account.</p>
        <hr style="margin: 30px 0;" />
        <p style="font-size: 12px; color: #888;">Thank you,<br/>The Your App Team</p>
      </div>
    `,
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
