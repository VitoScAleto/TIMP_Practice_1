import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";

const statusMessages = {
  400: "Неверный запрос. Проверьте данные.",
  401: "Необходима авторизация. Пожалуйста, войдите.",
  403: "Доступ запрещён. У вас нет прав.",
  404: "Страница не найдена.",
  500: "Внутренняя ошибка сервера. Попробуйте позже.",
};

const ErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { status = "Ошибка", message } = location.state || {};

  const finalMessage =
    message || statusMessages[status] || "Произошла неизвестная ошибка.";

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#fdecea",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          maxWidth: 420,
          textAlign: "center",
          bgcolor: "#f8d7da",
          color: "#721c24",
          borderRadius: 3,
        }}
      >
        <Typography variant="h1" sx={{ fontSize: 80, m: 0 }}>
          {status}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2, mb: 4 }}>
          {finalMessage}
        </Typography>

        <Button
          variant="contained"
          color="error"
          onClick={() => navigate(-1)}
          size="large"
        >
          Назад
        </Button>
      </Paper>
    </Box>
  );
};

export default ErrorPage;
