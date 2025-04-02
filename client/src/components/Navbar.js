import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/auth");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Спортивные сооружения
        </Typography>

        <Button color="inherit" component={Link} to="/">
          Главная
        </Button>
        <Button color="inherit" component={Link} to="/safety-measures">
          Меры безопасности
        </Button>
        <Button color="inherit" component={Link} to="/training">
          Обучение
        </Button>
        <Button color="inherit" component={Link} to="/resources">
          Ресурсы
        </Button>
        <Button color="inherit" component={Link} to="/feedback">
          Обратная связь
        </Button>

        {isAuthenticated ? (
          <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
            Выйти
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/auth" sx={{ ml: 2 }}>
            Войти
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
