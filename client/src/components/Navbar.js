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

const Navbar = ({ isAuthenticated, onLogout, user }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/auth");
  };

  // Открыть или закрыть Drawer
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
          {/* Для мобильных устройств - иконка меню */}
          <StyledIconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </StyledIconButton>

          {/* Кнопки навигации для десктопа */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, marginRight: 2 }}>
            <StyledButton color="inherit" component={Link} to="/">
              Главная
            </StyledButton>
            <StyledButton
              color="inherit"
              component={Link}
              to="/safety-measures"
            >
              Меры безопасности
            </StyledButton>
            <StyledButton color="inherit" component={Link} to="/training">
              Обучение
            </StyledButton>
            <StyledButton color="inherit" component={Link} to="/resources">
              Ресурсы
            </StyledButton>
            <StyledButton color="inherit" component={Link} to="/feedback">
              Обратная связь
            </StyledButton>
          </Box>

          {/* Меню пользователя или кнопка "Войти" */}
          {isAuthenticated ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <StyledButton color="inherit" component={Link} to="/auth">
              Войти
            </StyledButton>
          )}
        </Box>

        {/* Drawer для мобильных устройств */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <List>
            {drawerLinks.map((link, index) => (
              <ListItem
                button
                key={index}
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
