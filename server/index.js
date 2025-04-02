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

const USERS_JSON_PATH = path.join(
  __dirname,
  "../client/JSON_date",
  "users.json"
);
const FEEDBACK_JSON_PATH = path.join(
  __dirname,
  "../client/JSON_date",
  "feedback.json"
);

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "TIMP_Practice_1",
  password: process.env.DB_PASSWORD || "0000",
  port: process.env.DB_PORT || 5432,
});

async function initializeJsonFiles() {
  try {
    await fs.access(USERS_JSON_PATH);

    const content = await fs.readFile(USERS_JSON_PATH, "utf8");
    if (!content.trim()) {
      await fs.writeFile(USERS_JSON_PATH, JSON.stringify([]));
    } else {
      JSON.parse(content);
    }
  } catch (err) {
    await fs.writeFile(USERS_JSON_PATH, JSON.stringify([]));
  }

  try {
    await fs.access(FEEDBACK_JSON_PATH);

    const content = await fs.readFile(FEEDBACK_JSON_PATH, "utf8");
    if (!content.trim()) {
      await fs.writeFile(FEEDBACK_JSON_PATH, JSON.stringify([]));
    } else {
      JSON.parse(content);
    }
  } catch (err) {
    await fs.writeFile(FEEDBACK_JSON_PATH, JSON.stringify([]));
  }
}

initializeJsonFiles();

// Функции для работы с JSON

// Users
async function getUsersFromJson() {
  const data = await fs.readFile(USERS_JSON_PATH, "utf8");
  return JSON.parse(data);
}

async function saveUserToJson(user) {
  const users = await getUsersFromJson();
  users.push(user);
  await fs.writeFile(USERS_JSON_PATH, JSON.stringify(users, null, 2));
  return user;
}

async function findUserByEmailInJson(email) {
  const users = await getUsersFromJson();
  return users.find((u) => u.email === email);
}

// Feedback
async function getFeedbackFromJson() {
  const data = await fs.readFile(FEEDBACK_JSON_PATH, "utf8");
  return JSON.parse(data);
}

async function saveFeedbackToJson(feedback) {
  const feedbackList = await getFeedbackFromJson();
  feedbackList.push(feedback);
  await fs.writeFile(FEEDBACK_JSON_PATH, JSON.stringify(feedbackList, null, 2));
  return feedback;
}

// Маршруты для работы с JSON

// Регистрация (JSON)
app.post("/api/json/auth/register", async (req, res) => {
  console.log("JSON Registration request received");
  console.log(USERS_JSON_PATH);
  console.log(FEEDBACK_JSON_PATH);
  console.log("Request body:", req.body);

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        receivedData: req.body,
      });
    }

    const existingUser = await findUserByEmailInJson(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
    };

    await saveUserToJson(user);
    res.json({ success: true, user });
  } catch (err) {
    console.error("Error during JSON registration:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

// Вход (JSON)
app.post("/api/json/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmailInJson(email);
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        res.json({ success: true, user });
      } else {
        res.status(400).json({ success: false, message: "Неверный пароль" });
      }
    } else {
      res
        .status(404)
        .json({ success: false, message: "Пользователь не найден" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Получение отзывов (JSON)
app.get("/api/json/feedback", async (req, res) => {
  try {
    const feedback = await getFeedbackFromJson();
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Добавление отзыва (JSON)
app.post("/api/json/feedback", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res
      .status(400)
      .json({ success: false, message: "Message is required" });
  }

  try {
    const feedback = {
      id: Date.now(),
      message,
      createdAt: new Date().toISOString(),
    };
    await saveFeedbackToJson(feedback);
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

pool.query("SELECT NOW()", (err, res) => {
  // логирование подключения к бд
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log(
      "Database connection successful. Current time:",
      res.rows[0].now
    );
  }
});

// Маршрут для регистрации
app.post("/api/auth/register", async (req, res) => {
  console.log("Registration request received");
  const { name, email, password } = req.body;
  console.log("Received data:", { name, email, password });

  if (!name || !email || !password) {
    console.error("Missing fields");
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    const { rows } = await pool.query(
      "INSERT INTO users (nameuser, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );
    console.log("User inserted:", rows[0]);

    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Маршрут для входа
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (rows.length > 0) {
      const validPassword = await bcrypt.compare(password, rows[0].password);
      if (validPassword) {
        res.json({ success: true, user: rows[0] });
      } else {
        res.status(400).json({ success: false, message: "Неверный пароль" });
      }
    } else {
      res
        .status(404)
        .json({ success: false, message: "Пользователь не найден" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Маршрут для получения отзывов
app.get("/api/feedback", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM feedback");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Маршрут для добавления отзыва
app.post("/api/feedback", async (req, res) => {
  const { message } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO feedback (message) VALUES ($1) RETURNING *",
      [message]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/api/test", (req, res) => {
  console.log("Test route hit");
  res.json({ message: "Server is working!" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
