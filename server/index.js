const configServer = require("../server/configServer.json");
const configBD = require("../server/configBD.json");
const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const cors = require("cors");
const {
  sendCodeEmail,
  sendPasswordResetSuccessEmail,
  sendTicketEmail,
} = require("./emailServer");
const QRCode = require("qrcode");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
//FIXME: вынести
const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret_key";
const JWT_EXPIRES_IN = "1d"; // время жизни токена
//FIXME: вынести
app.use(
  cors({
    origin: "http://localhost:3000", // адрес фронта
    credentials: true, // позволяет передавать cookies и заголовки авторизации
  })
);
const pool = new Pool({
  user: configBD.userBD,
  host: configBD.hostBD,
  database: configBD.databaseBD,
  password: configBD.passwordBD,
  port: configBD.portBD,
});

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../client/build")));

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("[AUTH TOKEN] Проверка токена в куки");

  if (!token) {
    console.log("[AUTH TOKEN] Токен отсутствует");
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("[AUTH TOKEN] Ошибка верификации токена:", err.message);
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    console.log(`[AUTH TOKEN] Токен валиден, userId: ${decoded.userId}`);
    req.user = decoded;
    next();
  });
};

// --- Защищённый роут: добавление нового спортивного сооружения (требуется авторизация) ---
app.post("/api/facilities", authenticateToken, async (req, res) => {
  console.log(
    "[POST /api/facilities] Запрос на добавление нового спортивного сооружения"
  );
  console.log("[POST /api/facilities] Пользователь:", req.user);

  const { name, address, latitude, longitude } = req.body;

  if (
    !name ||
    !address ||
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    console.warn("[POST /api/facilities] Некорректные данные:", req.body);
    return res
      .status(400)
      .json({ success: false, message: "Некорректные данные" });
  }

  try {
    const query =
      "INSERT INTO sportfacilities (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [name, address, latitude, longitude];
    const result = await pool.query(query, values);
    console.log(
      "[POST /api/facilities] Успешно добавлено сооружение с id:",
      result.rows[0].fac_id
    );
    res.json({ success: true, facility: result.rows[0] });
  } catch (err) {
    console.error("[POST /api/facilities] Ошибка при добавлении объекта:", err);
    res.status(500).json({
      success: false,
      message: "Ошибка сервера при добавлении объекта",
    });
  }
});

app.put("/api/facilities/:id", authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, address, latitude, longitude } = req.body;

  if (
    !id ||
    !name ||
    !address ||
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Некорректные данные" });
  }

  try {
    const query =
      "UPDATE sportfacilities SET name=$1, address=$2, latitude=$3, longitude=$4 WHERE fac_id=$5 RETURNING *";
    const values = [name, address, latitude, longitude, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Объект не найден" });
    }

    res.json({ success: true, facility: result.rows[0] });
  } catch (err) {
    console.error(
      "[PUT /api/facilities/:id] Ошибка при обновлении объекта:",
      err
    );
    res.status(500).json({
      success: false,
      message: "Ошибка сервера при обновлении объекта",
    });
  }
});

// --- Удаление спортивного сооружения (DELETE /api/facilities/:id) ---
app.delete("/api/facilities/:id", authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (!id) {
    return res.status(400).json({ success: false, message: "Некорректный ID" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM sportfacilities WHERE fac_id=$1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Объект не найден" });
    }

    res.json({ success: true, message: "Объект удалён" });
  } catch (err) {
    console.error(
      "[DELETE /api/facilities/:id] Ошибка при удалении объекта:",
      err
    );
    res.status(500).json({
      success: false,
      message: "Ошибка сервера при удалении объекта",
    });
  }
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  console.log(`[AUTH ME] Запрос данных пользователя userId=${req.user.userId}`);

  try {
    const userResult = await pool.query(
      `SELECT u.user_id, u.username, u.email, u.created_at, r.role_name 
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       WHERE u.user_id = $1`,
      [req.user.userId]
    );

    if (userResult.rows.length === 0) {
      console.log(`[AUTH ME] Пользователь не найден userId=${req.user.userId}`);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = userResult.rows[0];
    console.log(
      `[AUTH ME] Пользователь найден: ${user.username} (${user.email}), роль: ${user.role_name}`
    );
    res.json({
      success: true,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        role: user.role_name,
      },
    });
  } catch (err) {
    console.error("[AUTH ME] Ошибка при получении пользователя:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  console.log("[REGISTER] Incoming request body:", req.body);

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.log("[REGISTER] Missing fields:", { username, email, password });
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      console.log("[REGISTER] User already exists:", email);
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = generateCode();
    const now = new Date();

    console.log("[REGISTER] Creating user:", {
      username,
      email,
      hashedPassword,
      code,
      now,
    });

    const newUser = await pool.query(
      `INSERT INTO users (username, email, password_hash, role_id, verification_code, code_sent_at, is_verified)
       VALUES ($1, $2, $3, 1, $4, $5, false)
       RETURNING user_id, username, email`,
      [username, email, hashedPassword, code, now]
    );

    console.log("[REGISTER] User created with ID:", newUser.rows[0].user_id);

    await sendCodeEmail(email, code);
    console.log("[REGISTER] Verification email sent to:", email);

    return res
      .status(201)
      .json({ success: true, message: "Verification code sent" });
  } catch (err) {
    console.error("[REGISTER] Error:", err);
    return res.status(500).json({
      success: false,
      message: "Registration error",
      error: err.message,
    });
  }
});
app.post("/api/auth/verify-email", async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code)
    return res
      .status(400)
      .json({ success: false, message: "Email and code required" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.is_verified)
      return res
        .status(400)
        .json({ success: false, message: "Already verified" });

    if (user.verification_code !== code)
      return res.status(400).json({ success: false, message: "Invalid code" });

    await pool.query(
      "UPDATE users SET is_verified = true, verification_code = NULL WHERE email = $1",
      [email]
    );

    return res.json({
      success: true,
      message: "Email verified",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("[VERIFY] Error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Verification failed" });
  }
});
app.post("/api/auth/resend-code", async (req, res) => {
  const { email } = req.body;
  console.log("[RESEND CODE] Request received:", { email });

  if (!email)
    return res.status(400).json({ success: false, message: "Email required" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];
    console.log("[RESEND CODE] User lookup:", user);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.is_verified)
      return res
        .status(400)
        .json({ success: false, message: "Already verified" });

    const code = generateCode();
    const now = new Date();

    await pool.query(
      "UPDATE users SET verification_code = $1, code_sent_at = $2 WHERE email = $3",
      [code, now, email]
    );
    console.log("[RESEND CODE] Code updated in DB:", code);

    const emailResult = await sendCodeEmail(email, code, "verification");
    console.log("[RESEND CODE] Email sent result:", emailResult);

    return res.json({ success: true, message: "Verification code resent" });
  } catch (err) {
    console.error("[RESEND CODE] Error:", err.message, err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Error resending code" });
  }
});

app.post("/api/auth/request-password-reset", async (req, res) => {
  const { email, username } = req.body;
  console.log("[REQUEST RESET] Request received:", { email });

  if (!email) {
    return res.status(400).json({ success: false, message: "Email required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];
    console.log("[REQUEST RESET] User lookup:", user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const resetCode = generateCode();
    const now = new Date();

    await pool.query(
      "UPDATE users SET verification_code = $1, code_sent_at = $2 WHERE email = $3",
      [resetCode, now, email]
    );
    console.log("[REQUEST RESET] Code saved in DB:", resetCode);

    const emailResult = await sendCodeEmail(
      email,
      resetCode,
      "reset",
      username
    );
    console.log("[REQUEST RESET] Email send result:", emailResult);

    return res.json({ success: true, message: "Reset code sent to email" });
  } catch (err) {
    console.error("[REQUEST RESET] Error:", err.message, err.stack);
    return res.status(500).json({
      success: false,
      message: "Error processing password reset",
    });
  }
});
app.post("/api/auth/verify-reset-code", async (req, res) => {
  const { email, code } = req.body;
  console.log("[VERIFY RESET CODE] Request received:", { email, code });

  if (!email || !code) {
    return res.status(400).json({
      success: false,
      message: "Email and code required",
    });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND verification_code = $2",
      [email, code]
    );
    const user = result.rows[0];
    console.log("[VERIFY RESET CODE] DB match:", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid code",
      });
    }

    const codeSentAt = user.code_sent_at;
    const now = new Date();
    const codeAge = (now - new Date(codeSentAt)) / (1000 * 60);
    console.log("[VERIFY RESET CODE] Code age (min):", codeAge);

    if (codeAge > 60) {
      return res.status(400).json({
        success: false,
        message: "Code expired",
      });
    }

    const resetToken = jwt.sign(
      { userId: user.user_id, email: user.email, reset: true },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    console.log("[VERIFY RESET CODE] Token issued for user:", user.email);

    return res.json({ success: true, token: resetToken });
  } catch (err) {
    console.error("[VERIFY RESET CODE] Error:", err.message, err.stack);
    return res.status(500).json({
      success: false,
      message: "Error verifying code",
    });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  console.log("[RESET PASSWORD] Request received");

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Token and new password required",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("[RESET PASSWORD] Token decoded:", decoded);

    if (!decoded.reset) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("[RESET PASSWORD] Password hashed");

    await pool.query(
      "UPDATE users SET password_hash = $1, verification_code = NULL WHERE user_id = $2",
      [hashedPassword, decoded.userId]
    );
    console.log("[RESET PASSWORD] DB updated for user:", decoded.userId);

    const emailResult = await sendPasswordResetSuccessEmail(
      decoded.email,
      decoded.name
    );
    console.log("[RESET PASSWORD] Confirmation email sent:", emailResult);

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("[RESET PASSWORD] Error:", err.message, err.stack);
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "Token expired",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error resetting password",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(`[LOGIN] Attempt to login with email: ${email}`);

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error("[LOGIN] Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: err.message,
    });
  }
});

app.put("/api/auth/update-username", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { newUsername } = req.body;

  console.log(
    `[UPDATE USERNAME] Request from user ${userId} to change username to ${newUsername}`
  );

  if (!newUsername || !newUsername.trim()) {
    console.log("[UPDATE USERNAME] Validation failed - missing newUsername");
    return res.status(400).json({
      success: false,
      message: "New username is required",
    });
  }

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      console.log(`[UPDATE USERNAME] User not found: ${userId}`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await pool.query(
      `UPDATE users SET username = $1 
       WHERE user_id = $2 
       RETURNING user_id, username, email, created_at`,
      [newUsername.trim(), userId]
    );

    console.log(`[UPDATE USERNAME] Username updated for user: ${userId}`);
    res.json({
      success: true,
      user: updatedUser.rows[0],
    });
  } catch (err) {
    console.error("[UPDATE USERNAME] Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error during username update",
      error: err.message,
    });
  }
});

app.get("/api/get/feedback", async (req, res) => {
  console.log("[GET FEEDBACK] Request to get all feedback");

  try {
    const feedbackResult = await pool.query(`
      SELECT f.feed_id, f.data_feed, f.created_at, 
             u.user_id, u.username
      FROM feedback f
      JOIN users u ON f.user_id_feed = u.user_id
      ORDER BY f.created_at DESC
    `);

    console.log(
      `[GET FEEDBACK] Retrieved ${feedbackResult.rows.length} feedback items`
    );
    res.json({
      success: true,
      feedback: feedbackResult.rows,
    });
  } catch (err) {
    console.error("[GET FEEDBACK] Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching feedback",
      error: err.message,
    });
  }
});
app.post("/api/post/feedback", authenticateToken, async (req, res) => {
  const { message } = req.body;
  const userId = req.user.userId;

  if (!message || !message.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Message is required" });
  }

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const newFeedback = await pool.query(
      `INSERT INTO feedback (user_id_feed, data_feed) 
       VALUES ($1, $2) 
       RETURNING feed_id, data_feed, created_at`,
      [userId, message.trim()]
    );

    res.status(201).json({
      success: true,
      feedback: {
        ...newFeedback.rows[0],
        user_id: userId,
        username: userResult.rows[0].username,
      },
    });
  } catch (err) {
    console.error("[CREATE FEEDBACK] Error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});
app.delete("/api/delete/feedback/:id", authenticateToken, async (req, res) => {
  const feedbackId = req.params.id;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT * FROM feedback WHERE feed_id = $1 AND user_id_feed = $2`,
      [feedbackId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found or not owned by you",
      });
    }

    await pool.query("DELETE FROM feedback WHERE feed_id = $1", [feedbackId]);

    res.json({ success: true, message: "Feedback deleted" });
  } catch (err) {
    console.error("[DELETE FEEDBACK] Error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

app.post("/api/auth/logout", authenticateToken, (req, res) => {
  console.log("LOGOUT CALLED");
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: production,
  });
  res.json({ success: true, message: "Вы вышли из системы" });
});
app.put("/api/events/:event_id", authenticateToken, async (req, res) => {
  const { event_id } = req.params;
  const { name, description, status, safety, start_time, end_time } = req.body;
  console.log(`[PUT] /api/events/${event_id} — Обновление события`, req.body);

  try {
    console.log(`Обновляем событие с ID ${event_id}...`);
    const result = await pool.query(
      `UPDATE events SET
         name = $1,
         description = $2,
         status = $3,
         safety = $4,
         start_time = $5,
         end_time = $6
       WHERE event_id = $7
       RETURNING *`,
      [name, description, status, safety, start_time, end_time, event_id]
    );

    if (result.rows.length === 0) {
      console.log(`Событие с ID ${event_id} не найдено для обновления`);
      return res.status(404).json({ message: "Событие не найдено" });
    }

    console.log(`Событие с ID ${event_id} успешно обновлено`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(
      `[ERROR] Ошибка при обновлении события event_id=${event_id}:`,
      err
    );
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.post(
  //создание билетов и событий
  "/api/facilities/:fac_id/events",
  authenticateToken,
  async (req, res) => {
    const { fac_id } = req.params;
    const { name, description, status, safety, start_time, end_time } =
      req.body;

    console.log(
      `[POST] /api/facilities/${fac_id}/events — Создание события`,
      req.body
    );

    const client = await pool.connect(); // подключаем транзакцию

    try {
      await client.query("BEGIN");

      // 1. Создание события
      console.log("Вставляем новое событие в базу...");
      const eventResult = await client.query(
        `INSERT INTO events (fac_id, name, description, status, safety, start_time, end_time)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [fac_id, name, description, status, safety, start_time, end_time]
      );

      const event = eventResult.rows[0];
      const event_id = event.event_id;
      console.log(`Событие создано с ID ${event_id}`);

      // 2. Получаем все seat_id для данного объекта
      const seatsResult = await client.query(
        `SELECT s.seat_id
         FROM seats s
         JOIN row r ON s.row_id = r.row_id
         JOIN sector sec ON r.sector_id = sec.sector_id
         WHERE sec.fac_id = $1`,
        [fac_id]
      );

      const seatIds = seatsResult.rows.map((row) => row.seat_id);

      // 3. Вставляем билеты
      if (seatIds.length > 0) {
        const insertValues = seatIds
          .map((_, i) => `($1, $${i + 2})`)
          .join(", ");
        const insertParams = [event_id, ...seatIds];

        await client.query(
          `INSERT INTO tickets (event_id, seat_id)
           VALUES ${insertValues}`,
          insertParams
        );

        console.log(
          `Создано ${seatIds.length} билетов для события ${event_id}`
        );
      } else {
        console.warn("Нет доступных мест для создания билетов");
      }

      await client.query("COMMIT");
      res.status(201).json(event);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(`[ERROR] Ошибка при создании события и билетов:`, err);
      res.status(500).json({ message: "Ошибка сервера" });
    } finally {
      client.release();
    }
  }
);

app.delete("/api/events/:event_id", authenticateToken, async (req, res) => {
  const { event_id } = req.params;
  console.log(`[DELETE] /api/events/${event_id} — Удаление события`);

  try {
    const result = await pool.query(
      "DELETE FROM events WHERE event_id = $1 RETURNING *",
      [event_id]
    );
    if (result.rows.length === 0) {
      console.log(`Событие с ID ${event_id} не найдено для удаления`);
      return res.status(404).json({ message: "Событие не найдено" });
    }

    console.log(`Событие с ID ${event_id} успешно удалено`);
    res.json({ message: "Событие удалено", event: result.rows[0] });
  } catch (err) {
    console.error(
      `[ERROR] Ошибка при удалении события event_id=${event_id}:`,
      err
    );
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get("/api/test", (req, res) => {
  console.log("Test route hit");
  res.json({ message: "Server is working!" });
});

app.listen(configServer.port, configServer.listenIP, () => {
  console.log(`Сервер запущен на порту ${configServer.port}`);
});

// Добавить сектор
app.post(
  "/api/facilities/:fac_id/sectors",
  authenticateToken,
  async (req, res) => {
    const { fac_id } = req.params;
    const { name, capacity, security_level } = req.body;
    console.log(`[POST] Добавление сектора в объект ${fac_id}`, req.body);

    try {
      const result = await pool.query(
        `INSERT INTO sector (fac_id, name, capacity, security_level)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
        [fac_id, name, capacity, security_level]
      );
      console.log(`[OK] Сектор добавлен:`, result.rows[0]);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(`[ERR] Добавление сектора:`, err);
      res.status(500).json({ error: "Ошибка при добавлении сектора" });
    }
  }
);

// Добавить ряд и места
app.post(
  "/api/sectors/:sector_id/rows",
  authenticateToken,
  async (req, res) => {
    const { sector_id } = req.params;
    const { number, capacity } = req.body;
    console.log(
      `[POST] Добавление ряда в сектор ${sector_id}: номер=${number}, вместимость=${capacity}`
    );

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const totalSeatsResult = await client.query(
        `SELECT COALESCE(SUM(r.capacity), 0) AS total FROM row r WHERE r.sector_id = $1`,
        [sector_id]
      );
      const totalSeats = totalSeatsResult.rows[0].total;

      const sectorCapacity = await client.query(
        `SELECT capacity FROM sector WHERE sector_id = $1`,
        [sector_id]
      );
      const sectorCap = sectorCapacity.rows[0].capacity;

      console.log(
        `[INFO] Суммарно мест до добавления: ${totalSeats}, вместимость сектора: ${sectorCap}`
      );

      // if (totalSeats + capacity > sectorCap) {
      // console.warn(`[WARN] Превышение вместимости сектора`);
      //   throw new Error("Превышение вместимости сектора");
      // }

      const rowRes = await client.query(
        `INSERT INTO row (sector_id, number, capacity)
       VALUES ($1, $2, $3) RETURNING *`,
        [sector_id, number, capacity]
      );
      const row_id = rowRes.rows[0].row_id;

      console.log(`[OK] Ряд добавлен с ID: ${row_id}, добавляем места...`);

      for (let i = 1; i <= capacity; i++) {
        await client.query(
          `INSERT INTO seats (row_id, number) VALUES ($1, $2)`,
          [row_id, i]
        );
      }

      console.log(`[OK] Добавлено ${capacity} мест`);
      await client.query("COMMIT");

      res.status(201).json(rowRes.rows[0]);
    } catch (e) {
      await client.query("ROLLBACK");
      console.error(`[ERR] Ошибка при добавлении ряда или мест:`, e.message);
      res.status(400).json({ error: e.message });
    } finally {
      client.release();
    }
  }
);
/*
// Добавить места в существующий ряд
app.post("/api/rows/:row_id/seats", authenticateToken, async (req, res) => {
  const { row_id } = req.params;
  const { count } = req.body;
  console.log(`[POST] Добавление ${count} мест в ряд ${row_id}`);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (let i = 1; i <= count; i++) {
      await client.query(`INSERT INTO seats (row_id, number) VALUES ($1, $2)`, [
        row_id,
        i,
      ]);
    }
    await client.query("COMMIT");
    console.log(`[OK] Добавлено ${count} мест в ряд ${row_id}`);
    res.status(201).json({ success: true, message: "Места добавлены" });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(`[ERR] Ошибка при добавлении мест:`, e.message);
    res
      .status(500)
      .json({ success: false, message: "Ошибка при добавлении мест" });
  } finally {
    client.release();
  }
});
*/
/////=========================================================

app.get(
  "/api/facilities/:fac_id/events",
  authenticateToken,
  async (req, res) => {
    const { fac_id } = req.params;
    console.log(
      `[GET] /api/facilities/${fac_id}/events — Запрос на получение событий для сооружения ${fac_id}`
    );

    try {
      console.log("Выполняется запрос к базе для получения событий...");
      const result = await pool.query(
        "SELECT * FROM events WHERE fac_id = $1 ORDER BY start_time ASC",
        [fac_id]
      );
      console.log(`Найдено событий: ${result.rows.length}`);
      res.json(result.rows);
    } catch (err) {
      console.error(
        `[ERROR] Ошибка при получении событий для fac_id=${fac_id}:`,
        err
      );
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
);

app.get("/api/events/:event_id", authenticateToken, async (req, res) => {
  const { event_id } = req.params;
  console.log(`[GET] /api/events/${event_id} — Запрос на получение события`);

  try {
    console.log(`Ищем событие с ID ${event_id} в базе...`);
    const result = await pool.query(
      "SELECT * FROM events WHERE event_id = $1",
      [event_id]
    );
    if (result.rows.length === 0) {
      console.log(`Событие с ID ${event_id} не найдено`);
      return res.status(404).json({ message: "Событие не найдено" });
    }
    console.log(`Событие с ID ${event_id} найдено`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(
      `[ERROR] Ошибка при получении события event_id=${event_id}:`,
      err
    );
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получить сектора объекта
app.get(
  "/api/facilities/:fac_id/sectors",
  authenticateToken,
  async (req, res) => {
    const { fac_id } = req.params;
    console.log(`[GET] /facilities/${fac_id}/sectors`);

    try {
      const result = await pool.query(
        "SELECT * FROM sector WHERE fac_id = $1",
        [fac_id]
      );
      console.log(`[OK] Получено секторов: ${result.rows.length}`);
      res.json(result.rows);
    } catch (err) {
      console.error(`[ERR] Получение секторов:`, err);
      res.status(500).json({ error: "Ошибка сервера при получении секторов" });
    }
  }
);

// Получить ряды сектора
app.get("/api/sectors/:sector_id/rows", authenticateToken, async (req, res) => {
  const { sector_id } = req.params;
  console.log(`[GET] Получение рядов сектора ${sector_id}`);

  try {
    const result = await pool.query("SELECT * FROM row WHERE sector_id = $1", [
      sector_id,
    ]);
    console.log(`[OK] Рядов найдено: ${result.rows.length}`);
    res.json(result.rows);
  } catch (err) {
    console.error(`[ERR] Получение рядов:`, err);
    res.status(500).json({ error: "Ошибка при получении рядов" });
  }
});

// Получить места по ряду
app.get("/api/rows/:row_id/seats", authenticateToken, async (req, res) => {
  const { row_id } = req.params;
  console.log(`[GET] Получение мест по ряду ${row_id}`);

  try {
    const result = await pool.query(
      "SELECT * FROM seats WHERE row_id = $1 ORDER BY number ASC",
      [row_id]
    );
    console.log(`[OK] Найдено мест: ${result.rows.length}`);
    res.json(result.rows);
  } catch (err) {
    console.error(`[ERR] Получение мест:`, err);
    res.status(500).json({ error: "Ошибка при получении мест" });
  }
});
app.get("/api/facilities", async (req, res) => {
  console.log(
    "[GET /api/facilities] Запрос на получение списка спортивных сооружений"
  );
  try {
    const result = await pool.query(
      "SELECT * FROM sportfacilities ORDER BY fac_id ASC"
    );
    console.log(
      `[GET /api/facilities] Успешно получено ${result.rowCount} объектов`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("[GET /api/facilities] Ошибка при получении объектов:", err);
    res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении объектов",
    });
  }
});
//====================================//
app.get("/api/tickets", authenticateToken, async (req, res) => {
  const { event_id } = req.query;
  if (!event_id) {
    return res.status(400).json({ message: "event_id обязателен" });
  }

  try {
    const query = `
      SELECT
        t.ticket_id,
        t.event_id,
        t.seat_id,
        t.user_id,
        t.status,
        t.buy_time,
        s.number AS seat_number,
        r.row_id,
        r.number AS row_number,
        sec.sector_id,
        sec.name AS sector_name
      FROM tickets t
      JOIN seats s ON t.seat_id = s.seat_id
      JOIN row r ON s.row_id = r.row_id
      JOIN sector sec ON r.sector_id = sec.sector_id
      WHERE t.event_id = $1
      ORDER BY sec.name, r.number, s.number
    `;

    const result = await pool.query(query, [event_id]);
    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении билетов:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

/// билеты

app.put("/api/tickets/buy", authenticateToken, async (req, res) => {
  const { event_id, seat_id, qr_data = {} } = req.body;
  const user_id = req.user.userId;

  console.log(
    `[BUY_TICKET] User ${user_id} attempts to buy ticket for event ${event_id}, seat ${seat_id}`
  );

  if (!event_id || !seat_id) {
    console.warn("[BUY_TICKET] Missing event_id or seat_id in request body");
    return res
      .status(400)
      .json({ success: false, message: "Missing event_id or seat_id" });
  }

  try {
    // Получение информации о пользователе и событии
    const userRes = await pool.query(
      "SELECT email, username FROM users WHERE user_id = $1",
      [user_id]
    );
    const eventRes = await pool.query(
      "SELECT * FROM events WHERE event_id = $1",
      [event_id]
    );
    const seatInfo = await pool.query(
      `SELECT r.number as row, s.number as seat FROM seats s
       JOIN row r ON s.row_id = r.row_id
       WHERE s.seat_id = $1`,
      [seat_id]
    );

    if (
      userRes.rows.length === 0 ||
      eventRes.rows.length === 0 ||
      seatInfo.rows.length === 0
    ) {
      return res
        .status(404)
        .json({ success: false, message: "User, event or seat not found" });
    }

    const { email, username } = userRes.rows[0];
    const event = eventRes.rows[0];
    const seatNumber = seatInfo.rows[0];

    const qrPayload = {
      event_id,
      seat_id,
      user_id,
      timestamp: new Date().toISOString(),
      ...qr_data,
    };

    console.log("[BUY_TICKET] Generating QR code with payload:", qrPayload);

    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrPayload));

    console.log("[BUY_TICKET] QR code generated successfully");

    const updateRes = await pool.query(
      `UPDATE tickets SET user_id = $1, qr_code_data = $2, status = TRUE
       WHERE event_id = $3 AND seat_id = $4 RETURNING *`,
      [user_id, { qrCode: qrCodeDataURL, data: qrPayload }, event_id, seat_id]
    );

    if (updateRes.rows.length === 0) {
      console.warn(
        `[BUY_TICKET] Ticket not found for event ${event_id}, seat ${seat_id}`
      );
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found for updating" });
    }

    console.log(
      `[BUY_TICKET] Ticket successfully updated for user ${user_id}:`,
      updateRes.rows[0]
    );

    // Отправка email с QR-кодом
    const emailSent = await sendTicketEmail(
      email,
      username,
      event,

      seatNumber,
      qrCodeDataURL
    );

    res.json({ success: true, ticket: updateRes.rows[0], emailSent });
  } catch (err) {
    console.error("[BUY_TICKET] Error processing ticket purchase:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
