const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: "vitalya1markovchi@yandex.ru",
    pass: "zbaafylzmjzlzwsv",
  },
});

// Функция для отправки кода (подтверждение или сброс пароля)
const sendCodeEmail = async (
  email,
  code,
  purpose = "verification", // цель: verification или reset
  name = "Пользователь"
) => {
  const subject =
    purpose === "reset"
      ? "🔑 Код для сброса пароля"
      : "🔐 Код подтверждения электронной почты";

  const textAction =
    purpose === "reset"
      ? "сбросить пароль"
      : "подтвердить адрес электронной почты";

  const htmlAction =
    purpose === "reset"
      ? "сбросить пароль"
      : "подтвердить адрес электронной почты";

  const mailOptions = {
    from: `"Безопасность спортивных сооружений" <vitalya1markovchi@yandex.ru>`,
    to: email,
    subject: subject,
    text:
      `Здравствуйте, ${name}!\n\nВаш код для ${
        purpose === "reset"
          ? "сброса пароля"
          : "подтверждения электронной почты"
      }: ${code}\n\n` +
      `Пожалуйста, введите этот код в приложении, чтобы ${textAction}.\n\n` +
      `Этот код действует 60 минут.\n\nСпасибо!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <div style="text-align: center;">
          <img src="https://yourcdn.com/logo.png" alt="Логотип приложения" style="max-width: 150px; margin-bottom: 20px;" />
        </div>
        <p>Здравствуйте, <strong>${name}</strong>!</p>
        <p>Ваш код для ${
          purpose === "reset"
            ? "сброса пароля"
            : "подтверждения электронной почты"
        }:</p>
        <h2 style="color: #007BFF; text-align: center;">${code}</h2>
        <p>Пожалуйста, введите этот код в приложении, чтобы <strong>${htmlAction}</strong>.</p>
        <p style="color: #555;">⏳ Этот код действует <strong>60 минут</strong>.</p>
        <hr style="margin: 30px 0;" />
        <p style="font-size: 12px; color: #888;">Если вы не запрашивали этот код, просто проигнорируйте это письмо или свяжитесь с поддержкой.</p>
        <p style="font-size: 12px; color: #888;">Спасибо!<br/>Команда Безопасности спортивных сооружений</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Код для ${purpose} отправлен на ${email}`);
    return true;
  } catch (error) {
    console.error(
      `[EMAIL] Ошибка при отправке кода для ${purpose} на ${email}:`,
      error
    );
    return false;
  }
};

// Функция для отправки письма об успешной смене пароля
const sendPasswordResetSuccessEmail = async (email, name = "Пользователь") => {
  const mailOptions = {
    from: `"Безопасность спортивных сооружений" <vitalya1markovchi@yandex.ru>`,
    to: email,
    subject: "✅ Пароль успешно изменён",
    text:
      `Здравствуйте, ${name}!\n\nВаш пароль успешно изменён.\n\n` +
      `Если это были не вы, пожалуйста, немедленно свяжитесь с поддержкой.\n\nСпасибо!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <div style="text-align: center;">
          <img src="https://yourcdn.com/logo.png" alt="Логотип приложения" style="max-width: 150px; margin-bottom: 20px;" />
        </div>
        <p>Здравствуйте, <strong>${name}</strong>!</p>
        <p>✅ Ваш пароль был <strong>успешно изменён</strong>.</p>
        <p>Если вы <u>не</u> запрашивали это изменение, пожалуйста, немедленно свяжитесь с нашей службой поддержки для защиты вашего аккаунта.</p>
        <hr style="margin: 30px 0;" />
        <p style="font-size: 12px; color: #888;">Спасибо,<br/>Команда Безопасности спортивных сооружений</p>
      </div>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Подтверждение смены пароля отправлено на ${email}`);
    return true;
  } catch (error) {
    console.error(
      `[EMAIL] Ошибка при отправке подтверждения смены пароля на ${email}:`,
      error
    );
    return false;
  }
};

// Функция для отправки билета с QR-кодом
const sendTicketEmail = async (
  email,
  name,
  event,
  seatNumber,
  qrCodeDataURL
) => {
  const mailOptions = {
    from: `"Безопасность спортивных сооружений" <vitalya1markovchi@yandex.ru>`,
    to: email,
    subject: `🎟 Ваш билет на мероприятие: ${event.name}`,
    text:
      `Здравствуйте, ${name}!\n\n` +
      `Вы успешно приобрели билет на мероприятие "${event.name}".\n` +
      `Сектор: ${seatNumber.sector}\n` +
      `Место: ряд ${seatNumber.row}, место ${seatNumber.seat}\n\n` +
      `Ваш QR-код приложен ниже.\n\nСпасибо, что выбрали нас!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="text-align:center;">🎟 Ваш билет на "${event.name}"</h2>
        <p>Здравствуйте, <strong>${name}</strong>!</p>
        <p>Вы приобрели билет:</p>
        <ul>
          <li><strong>Мероприятие:</strong> ${event.name}</li>
          <li><strong>Дата:</strong> ${new Date(
            event.start_time
          ).toLocaleString()}</li>
          <li><strong>Сектор:</strong> ${seatNumber.sector}</li>
          <li><strong>Место:</strong> ряд ${seatNumber.row}, место ${
      seatNumber.seat
    }</li>
        </ul>
        <p>Ваш QR-код для входа:</p>
        <div style="text-align:center; margin: 20px 0;">
          <img src="${qrCodeDataURL}" alt="QR-код" style="max-width: 200px;" />
        </div>
        <p style="color: #555;">📩 Не удаляйте это письмо — вы можете показать этот QR-код на входе.</p>
        <hr />
        <p style="font-size: 12px; color: #888;">Спасибо, что выбрали нас!<br/>Команда Безопасности спортивных сооружений</p>
      </div>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Билет отправлен на ${email}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] Ошибка при отправке билета на ${email}:`, error);
    return false;
  }
};
module.exports = {
  sendCodeEmail,
  sendPasswordResetSuccessEmail,
  sendTicketEmail,
};
