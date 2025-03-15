const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "Localhost",
  database: "TIMP_Practice_1",
  password: "0000",
  port: 5432,
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

app.use(bodyParser.json());

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

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

app.get("/api/test", (req, res) => {
  console.log("Test route hit");
  res.json({ message: "Server is working!" });
});
