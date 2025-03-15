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
        backgroundImage: "url('/public/../../images/backForAuth.jpg')", // Укажите путь к изображению
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 1, // Прозрачность фона
      }}
    />
  );
};
