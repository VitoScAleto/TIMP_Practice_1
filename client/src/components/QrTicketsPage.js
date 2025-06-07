// src/components/QrTicketsPage.jsx
import React from "react";
import { Typography, Box } from "@mui/material";

const QrTicketsPage = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Генерация QR-билетов
      </Typography>
      <Typography>
        Здесь будет функционал для создания и отображения QR-кодов для билетов.
      </Typography>
      {/* Можно добавить пример генератора или компонент QR-кода */}
    </Box>
  );
};

export default QrTicketsPage;
