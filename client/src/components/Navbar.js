import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import UserMenu from "./UserMenu";
import { useAuth } from "../Context/AuthContext";
import { styled } from "@mui/material/styles";
import { AppBar, Toolbar, Button, Typography, IconButton } from "@mui/material";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
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
    { text: "Главная", to: "/" },
    { text: "Меры безопасности", to: "/safety-measures" },
    { text: "Обучение", to: "/training" },
    { text: "Ресурсы", to: "/resources" },
    { text: "Обратная связь", to: "/feedback" },
  ];

  return (
    <StyledAppBar position="static" elevation={6}>
      <StyledToolbar>
        <StyledTypography variant="h6">Спортивные сооружения</StyledTypography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Мобильное меню (гамбургер) */}
          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            size="large"
          >
            <MenuIcon fontSize="inherit" />
          </StyledIconButton>

          {/* Десктопное меню */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, marginRight: 3 }}>
            {drawerLinks.map(({ text, to }) => (
              <StyledButton
                key={to}
                color="inherit"
                component={Link}
                to={to}
                disableRipple
                disableElevation
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

          {/* Авторизация */}
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
              Войти
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
                  <ListItemText primary="Выйти" />
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

// ================= СТИЛИ =================

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background:
    "linear-gradient(90deg, rgba(25,118,210,1) 0%, rgba(21,101,192,1) 100%)",
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
