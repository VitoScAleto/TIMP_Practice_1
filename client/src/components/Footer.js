import React from "react";
import {
  Typography,
  Container,
  Link,
  Box,
  Stack,
  Tooltip,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import TelegramIcon from "@mui/icons-material/Telegram";
import { useTranslation } from "../hooks/useTranslation";

const Footer = () => {
  const { t } = useTranslation();

  const telegramQRCodeUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://t.me/VitoScaleto";

  return (
    <Container component="footer" sx={styles.footerContainer}>
      <Typography variant="h6" gutterBottom sx={styles.name}>
        {t("footer.name")}
      </Typography>

      <Typography variant="body1" gutterBottom sx={styles.email}>
        {t("footer.email")}{" "}
        <Link
          href="mailto:pushckaryovvitalya404@gmail.com"
          underline="hover"
          color="inherit"
          sx={styles.link}
        >
          pushckaryovvitalya404@gmail.com
        </Link>
      </Typography>

      <Typography variant="body2" gutterBottom sx={styles.education}>
        {t("footer.education")}
      </Typography>

      <Box mt={2}>
        <Stack
          direction="row"
          spacing={4}
          justifyContent="center"
          alignItems="center"
          sx={styles.iconStack}
        >
          <Tooltip title={t("footer.github")}>
            <Link
              href="https://github.com/VitoScAleto"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={styles.iconLink}
            >
              <GitHubIcon fontSize="large" />
            </Link>
          </Tooltip>

          <Tooltip title={t("footer.telegramQR")}>
            <Box
              component="img"
              src={telegramQRCodeUrl}
              alt={t("footer.telegramQR")}
              sx={styles.qrCode}
              onClick={() => window.open("https://t.me/VitoScaleto", "_blank")}
            />
          </Tooltip>
        </Stack>
      </Box>

      <Typography
        variant="caption"
        color="textSecondary"
        display="block"
        mt={3}
        sx={styles.copyright}
      >
        © 2025 {t("footer.projectName")}
      </Typography>
    </Container>
  );
};

const styles = {
  footerContainer: {
    mt: 4,
    p: 4,
    textAlign: "center",
    bgcolor: "#f0f2f5",
    borderRadius: 3,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  name: {
    fontWeight: 700,
    color: "#333333",
    fontSize: "1.5rem",
    letterSpacing: 1.2,
    textTransform: "none",
    mb: 1,
    fontFamily: "'Roboto', sans-serif",
  },
  email: {
    fontWeight: 600,
    color: "#555555",
    fontSize: "1.1rem",
    mb: 1,
    fontFamily: "'Roboto', sans-serif",
  },
  education: {
    fontSize: 14,
    color: "#666",
    maxWidth: 600,
    margin: "0 auto",
    lineHeight: 1.4,
  },
  link: {
    fontWeight: "600",
    color: "#1976d2",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
      color: "#004ba0",
    },
  },
  iconStack: {
    mt: 2,
  },
  iconLink: {
    color: "#555",
    transition: "color 0.3s ease, transform 0.3s ease",
    "&:hover": {
      color: "#1976d2",
      transform: "scale(1.2)",
    },
  },
  qrCode: {
    width: 50,
    height: 50,
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    borderRadius: 6,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    "&:hover": {
      transform: "scale(1.15)",
      boxShadow: "0 4px 20px rgba(25, 118, 210, 0.5)",
    },
  },
  copyright: {
    color: "#999",
    fontSize: 12,
    mt: 4,
    userSelect: "none",
  },
};

export default Footer;
