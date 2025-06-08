import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SettingsInputCompositeIcon from "@mui/icons-material/SettingsInputComposite";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import UserMenu from "./UserMenu";
import { useAuth } from "../Context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import { styled } from "@mui/material/styles";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true); // Устанавливаем mounted в true после монтирования компонента
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Основные ссылки для всех авторизованных пользователей
  const commonLinks = [
    { text: t("navbar.home"), to: "/", icon: null },
    { text: t("navbar.safety"), to: "/safety-measures", icon: null },
    { text: t("navbar.training"), to: "/training", icon: null },
    { text: t("navbar.resources"), to: "/resources", icon: null },
    { text: t("navbar.feedback"), to: "/feedback", icon: null },
    { text: t("navbar.qrTickets"), to: "/qr-tickets", icon: <QrCodeIcon /> },
  ];

  // Ссылки для администратора
  const adminLinks = [
    { text: "Admin Panel", to: "/admin", icon: <AdminPanelSettingsIcon /> },
  ];

  // Ссылки для оператора
  const operatorLinks = [
    {
      text: "Operator Panel",
      to: "/operator",
      icon: <SettingsInputCompositeIcon />,
    },
  ];

  // Ссылки для инспектора
  const inspectorLinks = [
    { text: "Inspector View", to: "/inspector", icon: <VerifiedUserIcon /> },
  ];

  // Получаем все доступные ссылки для текущего пользователя
  const getAllLinks = () => {
    let links = [...commonLinks];

    if (user?.role === "admin") {
      links = [...links, ...adminLinks];
    }
    if (user?.role === "operator") {
      links = [...links, ...operatorLinks];
    }
    if (user?.role === "inspector") {
      links = [...links, ...inspectorLinks];
    }

    return links;
  };

  const drawerLinks = getAllLinks();

  // Проверяем, есть ли специальные ссылки для роли
  const hasRoleSpecificLinks =
    user?.role && ["admin", "operator", "inspector"].includes(user.role);

  if (!mounted) {
    return null; // Не рендерим ничего до монтирования
  }

  return (
    <StyledAppBar position="static" elevation={6}>
      <StyledToolbar>
        <StyledTypography variant="h6">{t("navbar.title")}</StyledTypography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Кнопка меню (гамбургер) - только для мобильных */}
          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            size="large"
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon fontSize="inherit" />
          </StyledIconButton>

          {/* Навигационные кнопки на больших экранах */}
          <Box sx={{ display: { xs: "none", md: "flex" }, marginRight: 3 }}>
            {commonLinks.map(({ text, to, icon }) => (
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

            {/* Ролевые ссылки на десктопе */}
            {user?.role === "admin" &&
              adminLinks.map(({ text, to, icon }) => (
                <StyledButton
                  key={to}
                  color="inherit"
                  component={Link}
                  to={to}
                  disableRipple
                  disableElevation
                  startIcon={icon}
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

            {user?.role === "operator" &&
              operatorLinks.map(({ text, to, icon }) => (
                <StyledButton
                  key={to}
                  color="inherit"
                  component={Link}
                  to={to}
                  disableRipple
                  disableElevation
                  startIcon={icon}
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

            {user?.role === "inspector" &&
              inspectorLinks.map(({ text, to, icon }) => (
                <StyledButton
                  key={to}
                  color="inherit"
                  component={Link}
                  to={to}
                  disableRipple
                  disableElevation
                  startIcon={icon}
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
              width: 280,
              height: "100%",
              backgroundColor: "background.paper",
              paddingTop: 2,
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              {commonLinks.map(({ text, to, icon }) => (
                <ListItem button component={Link} to={to} key={to}>
                  {icon && <ListItemIcon>{icon}</ListItemIcon>}
                  <ListItemText primary={text} />
                </ListItem>
              ))}

              {hasRoleSpecificLinks && <Divider sx={{ my: 1 }} />}

              {user?.role === "admin" &&
                adminLinks.map(({ text, to, icon }) => (
                  <ListItem button component={Link} to={to} key={to}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}

              {user?.role === "operator" &&
                operatorLinks.map(({ text, to, icon }) => (
                  <ListItem button component={Link} to={to} key={to}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}

              {user?.role === "inspector" &&
                inspectorLinks.map(({ text, to, icon }) => (
                  <ListItem button component={Link} to={to} key={to}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}

              {isAuthenticated && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <ListItem button onClick={handleLogout}>
                    <ListItemText primary={t("navbar.logout")} />
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>
      </StyledToolbar>
    </StyledAppBar>
  );
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}));

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const StyledTypography = styled(Typography)({
  flexGrow: 1,
  fontWeight: 700,
  letterSpacing: "0.5px",
});

const StyledIconButton = styled(IconButton)({
  marginRight: "16px",
});

const StyledButton = styled(Button)({
  "&.MuiButton-root": {
    borderRadius: "8px",
    padding: "8px 16px",
  },
});

export default Navbar;
