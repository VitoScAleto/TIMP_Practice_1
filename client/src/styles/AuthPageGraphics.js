import React from "react";
import { Box } from "@mui/material";

export const AuthPageBackground = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        backgroundImage: "url('/images/backForAuth.jpg')", // Убедитесь, что путь к изображению правильный
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.8, // Уменьшена непрозрачность для лучшего контраста с контентом
        transition: "opacity 0.5s ease-in-out", // Плавный переход для анимации
        "&:hover": {
          opacity: 1, // Увеличение непрозрачности при наведении
        },
      }}
    />
  );
};
