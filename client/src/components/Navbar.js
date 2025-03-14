import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Navbar = () => {
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
        <Button color="inherit" component={Link} to="/login">
          Вход
        </Button>
        <Button color="inherit" component={Link} to="/register">
          Регистрация
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
