import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  StyledAppBar,
  StyledToolbar,
  StyledButton,
  StyledTypography,
  StyledIconButton,
} from "../styles/NavbarStyles";
import UserMenu from "./UserMenu";
import { useAuth } from "../Context/AuthContext";

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
    <StyledAppBar position="static">
      <StyledToolbar>
        <StyledTypography variant="h6">Спортивные сооружения</StyledTypography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Меню для мобильных */}
          <StyledIconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </StyledIconButton>

          {/* Десктопное меню */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, marginRight: 2 }}>
            {drawerLinks.map((link) => (
              <StyledButton
                key={link.to}
                color="inherit"
                component={Link}
                to={link.to}
              >
                {link.text}
              </StyledButton>
            ))}
          </Box>

          {/* Блок авторизации */}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <StyledButton color="inherit" component={Link} to="/auth">
              Войти
            </StyledButton>
          )}
        </Box>

        {/* Мобильное меню */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <List>
            {drawerLinks.map((link) => (
              <ListItem
                button
                key={link.to}
                component={Link}
                to={link.to}
                onClick={toggleDrawer(false)}
              >
                <ListItemText primary={link.text} />
              </ListItem>
            ))}
            {isAuthenticated && (
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Выйти" />
              </ListItem>
            )}
          </List>
        </Drawer>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
