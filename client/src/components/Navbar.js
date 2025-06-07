import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import QrCodeIcon from "@mui/icons-material/QrCode";
import UserMenu from "./UserMenu";
import { useAuth } from "../Context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguage } from "../hooks/useLanguage";
import { styled } from "@mui/material/styles";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const drawerLinks = [
    { text: t("navbar.home"), to: "/" },
    { text: t("navbar.safety"), to: "/safety-measures" },
    { text: t("navbar.training"), to: "/training" },
    { text: t("navbar.resources"), to: "/resources" },
    { text: t("navbar.feedback"), to: "/feedback" },
    { text: t("navbar.qrTickets"), to: "/qr-tickets", icon: <QrCodeIcon /> },
  ];

  return (
    <StyledAppBar position="static" elevation={6}>
      <StyledToolbar>
        <StyledTypography variant="h6">{t("navbar.title")}</StyledTypography>

        {/* Боковая часть с меню и кнопками */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Кнопка меню (гамбургер) для мобильных */}
          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            size="large"
          >
            <MenuIcon fontSize="inherit" />
          </StyledIconButton>

          {/* Навигационные кнопки на больших экранах */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, marginRight: 3 }}>
            {drawerLinks.map(({ text, to, icon }) => (
              <StyledButton
                key={to}
                color="inherit"
                component={Link}
                to={to}
                disableRipple
                disableElevation
                startIcon={icon || null}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  marginLeft: 1.5,
                }}
              >
                {text}
              </StyledButton>
            ))}
          </Box>

          {/* Авторизация / UserMenu */}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <StyledButton
              color="inherit"
              component={Link}
              to="/auth"
              variant="outlined"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                marginLeft: 2,
                borderColor: "rgba(255,255,255,0.7)",
                "&:hover": {
                  borderColor: "#fff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              {t("navbar.login")}
            </StyledButton>
          )}
        </Box>

        {/* Drawer для мобильных */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{
              width: 250,
              height: "100%",
              backgroundColor: "#f5f5f5",
              paddingTop: 2,
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              {drawerLinks.map(({ text, to }) => (
                <ListItem button component={Link} to={to} key={to}>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
              {isAuthenticated && (
                <ListItem button onClick={handleLogout}>
                  <ListItemText primary={t("navbar.logout")} />
                </ListItem>
              )}
            </List>
          </Box>
        </Drawer>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;

// ========== СТИЛИ ==========

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)"
      : "linear-gradient(90deg, rgba(25,118,210,1) 0%, rgba(21,101,192,1) 100%)",
  boxShadow: theme.shadows[6],
  transition: "background-color 0.4s ease, box-shadow 0.4s ease",
}));

export const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingLeft: 16,
  paddingRight: 16,
  minHeight: 64,
});

export const StyledButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  borderRadius: 6,
  paddingLeft: 16,
  paddingRight: 16,
  fontWeight: 600,
  letterSpacing: 0.5,
  transition: "background-color 0.3s, box-shadow 0.3s",
  "&:hover": {
    backgroundColor: "#1565c0",
    boxShadow: "0 4px 12px rgba(21,101,192,0.5)",
  },
}));

export const StyledTypography = styled(Typography)({
  flexGrow: 1,
  fontWeight: "bold",
  userSelect: "none",
  cursor: "default",
  fontSize: "1.25rem",
  letterSpacing: 1.2,
  color: "#fff",
});

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  display: "none",
  color: "#fff",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
}));
