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
const { sendVerificationEmail } = require("./emailServer");
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

const pool = new Pool({
  user: configBD.userBD,
  host: configBD.hostBD,
  database: configBD.databaseBD,
  password: configBD.passwordBD,
  port: configBD.portBD,
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  console.log(`[AUTH ME] Запрос данных пользователя userId=${req.user.userId}`);

  try {
    const userResult = await pool.query(
      "SELECT user_id, username, email, created_at FROM users WHERE user_id = $1",
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
      `[AUTH ME] Пользователь найден: ${user.username} (${user.email})`
    );
    res.json({ success: true, user });
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

    await sendVerificationEmail(email, code);
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
  if (!email)
    return res.status(400).json({ success: false, message: "Email required" });

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

    const code = generateCode();
    const now = new Date();

    await pool.query(
      "UPDATE users SET verification_code = $1, code_sent_at = $2 WHERE email = $3",
      [code, now, email]
    );

    await sendVerificationEmail(email, code);

    return res.json({ success: true, message: "Verification code resent" });
  } catch (err) {
    console.error("[RESEND CODE] Error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Error resending code" });
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

app.post("/api/auth/logout", (req, res) => {
  console.log("LOGOUT CALLED");
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: false,
  });
  res.json({ success: true, message: "Вы вышли из системы" });
});

app.get("/api/test", (req, res) => {
  console.log("Test route hit");
  res.json({ message: "Server is working!" });
});

app.listen(configServer.port, configServer.listenIP, () => {
  console.log(`Сервер запущен на порту ${configServer.port}`);
});
