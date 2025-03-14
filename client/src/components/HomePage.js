import React from "react";
import { Typography, Container } from "@mui/material";

const HomePage = () => {
  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Добро пожаловать!
      </Typography>
      <Typography variant="body1">
        На этом сайте вы найдете информацию о мерах безопасности в спортивных
        сооружениях, обучении и полезных ресурсах.
      </Typography>
    </Container>
  );
};

export default HomePage;
