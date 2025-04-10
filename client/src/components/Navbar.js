import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import {
  StyledAppBar,
  StyledToolbar,
  StyledButton,
  StyledTypography,
} from "../styles/NavbarStyles";
import UserMenu from "./UserMenu";
import Lottie from "lottie-react";
import animationData from "../Lottile/security.json";

const Navbar = ({ isAuthenticated, onLogout, user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/auth");
  };

  return (
    <StyledAppBar position="static">
      <StyledToolbar sx={{ position: "relative" }}>
        <StyledTypography variant="h6">Спортивные сооружения</StyledTypography>

        <Box sx={{ display: "flex", alignItems: "center", zIndex: 1 }}>
          <StyledButton color="inherit" component={Link} to="/">
            Главная
          </StyledButton>
          <StyledButton color="inherit" component={Link} to="/safety-measures">
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

          {isAuthenticated ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <StyledButton color="inherit" component={Link} to="/auth">
              Войти
            </StyledButton>
          )}

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "30px",
              transform: "translateY(-50%)",
              width: "100px",
              height: "100px",
              backgroundColor: "transparent",
              zIndex: 0,
            }}
          >
            <Lottie animationData={animationData} loop={true} />
          </Box>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
