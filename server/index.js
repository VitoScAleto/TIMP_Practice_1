const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const app = express();
const pool = new Pool({
  user: "your_username",
  host: "localhost",
  database: "your_database",
  password: "your_password",
  port: 5432,
});

app.use(bodyParser.json());

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
