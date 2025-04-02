import React from "react";
import { Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Container
      style={{ marginTop: "2rem", padding: "1rem", textAlign: "center" }}
    >
      <Typography variant="body2" color="textSecondary">
        © 2025 Спортивные сооружения. Все права защищены.
      </Typography>
    </Container>
  );
};

export default Footer;
