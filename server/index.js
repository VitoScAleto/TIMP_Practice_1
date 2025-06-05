const config = require("../server/configServer.json");
const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../client/build")));

const PORT = process.env.PORT || 5000;

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "rgr",
  password: process.env.DB_PASSWORD || "0000",
  port: process.env.DB_PORT || 5432,
});

app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(`[REGISTER] Attempt to register user: ${username}, ${email}`);

  if (!username || !email || !password) {
    console.log("[REGISTER] Validation failed - missing fields");
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log(`[REGISTER] User with email ${email} already exists`);
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("[REGISTER] Password hashed successfully");

    // Создаем нового пользователя с ролью по умолчанию (предположим, что role_id=1 - обычный пользователь)
    const newUser = await pool.query(
      `INSERT INTO users (username, email, password_hash, role_id) 
       VALUES ($1, $2, $3, 1) 
       RETURNING user_id, username, email, created_at`,
      [username, email, hashedPassword]
    );

    console.log(
      `[REGISTER] User created successfully: ${newUser.rows[0].user_id}`
    );
    res.status(201).json({
      success: true,
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error("[REGISTER] Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: err.message,
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(`[LOGIN] Attempt to login with email: ${email}`);

  try {
    // Находим пользователя по email
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log(`[LOGIN] User not found with email: ${email}`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult.rows[0];
    console.log(`[LOGIN] User found: ${user.user_id}`);

    // Проверяем пароль
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      console.log(`[LOGIN] Invalid password for user: ${user.user_id}`);
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    console.log(`[LOGIN] Successful login for user: ${user.user_id}`);
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

app.put("/api/auth/update-username", async (req, res) => {
  const { userId, newUsername } = req.body;
  console.log(userId, newUsername);
  console.log(
    `[UPDATE USERNAME] Request from user ${userId} to change username to ${newUsername}`
  );

  if (!userId || !newUsername || !newUsername.trim()) {
    console.log("[UPDATE USERNAME] Validation failed - missing fields");
    return res.status(400).json({
      success: false,
      message: "User ID and new username are required",
    });
  }

  try {
    // Проверяем, существует ли пользователь
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

    // Обновляем имя пользователя
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
app.post("/api/post/feedback", async (req, res) => {
  const { userId, message } = req.body;
  console.log(
    `[CREATE FEEDBACK] Request from user ${userId} to create feedback`
  );

  if (!userId || !message || !message.trim()) {
    console.log("[CREATE FEEDBACK] Validation failed - missing fields");
    return res.status(400).json({
      success: false,
      message: "User ID and message are required",
    });
  }

  try {
    // Проверяем, существует ли пользователь
    const userResult = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      console.log(`[CREATE FEEDBACK] User not found: ${userId}`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Создаем отзыв
    const newFeedback = await pool.query(
      `INSERT INTO feedback (user_id_feed, data_feed) 
       VALUES ($1, $2) 
       RETURNING feed_id, data_feed, created_at`,
      [userId, message.trim()]
    );

    console.log(
      `[CREATE FEEDBACK] Feedback created with ID: ${newFeedback.rows[0].feed_id}`
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
    res.status(500).json({
      success: false,
      message: "Server error while creating feedback",
      error: err.message,
    });
  }
});
app.delete("/api/delete/feedback/:id", async (req, res) => {
  const feedbackId = req.params.id;
  const { userId } = req.body; // ID пользователя, который пытается удалить отзыв
  console.log(
    `[DELETE FEEDBACK] Request to delete feedback ${feedbackId} by user ${userId}`
  );

  if (!feedbackId || !userId) {
    console.log("[DELETE FEEDBACK] Validation failed - missing fields");
    return res.status(400).json({
      success: false,
      message: "Feedback ID and User ID are required",
    });
  }

  try {
    // Проверяем, существует ли отзыв и принадлежит ли он пользователю
    const feedbackResult = await pool.query(
      `SELECT * FROM feedback 
       WHERE feed_id = $1 AND user_id_feed = $2`,
      [feedbackId, userId]
    );

    if (feedbackResult.rows.length === 0) {
      console.log(
        `[DELETE FEEDBACK] Feedback not found or not owned by user: ${feedbackId}`
      );
      return res.status(404).json({
        success: false,
        message: "Feedback not found or you don't have permission to delete it",
      });
    }

    // Удаляем отзыв
    await pool.query("DELETE FROM feedback WHERE feed_id = $1", [feedbackId]);

    console.log(
      `[DELETE FEEDBACK] Feedback deleted successfully: ${feedbackId}`
    );
    res.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (err) {
    console.error("[DELETE FEEDBACK] Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while deleting feedback",
      error: err.message,
    });
  }
});
app.get("/api/test", (req, res) => {
  console.log("Test route hit");
  res.json({ message: "Server is working!" });
});

app.listen(PORT, config.listenIP, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
