import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import api from "../api";
import {
  StyledContainer,
  StyledTypography,
  StyledTextField,
  StyledButton,
} from "../styles/LoginStyles";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {
      email: !email.trim(),
      password: !password.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/json/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        onLogin(response.data.user);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: !eval(field).trim(),
    }));
  };

  return (
    <StyledContainer>
      <StyledTypography variant="h4" gutterBottom>
        Вход
      </StyledTypography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          "& .MuiTextField-root": {
            marginBottom: "28px",
            "& .MuiFormHelperText-root": {
              position: "absolute",
              bottom: "-24px",
              left: "0",
              margin: 0,
            },
          },
        }}
      >
        <StyledTextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.replace(/[а-яА-Я\s]/g, ""))}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          helperText={errors.email && "Это поле обязательно для заполнения"}
          fullWidth
          required
        />

        <StyledTextField
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value.replace(/[а-яА-Я\s]/g, ""))
          }
          onBlur={() => handleBlur("password")}
          error={errors.password}
          helperText={errors.password && "Это поле обязательно для заполнения"}
          fullWidth
          required
        />

        <StyledButton
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={
            isLoading ? <CircularProgress size={20} color="inherit" /> : null
          }
          fullWidth
          size="large"
        >
          {isLoading ? "Вход..." : "Войти"}
        </StyledButton>
      </Box>
      {/* Место для изображений */}
      <Box sx={{ mt: 4 }}>
        <img
          src="path/to/image.jpg"
          alt="Описание"
          style={{ width: "100%", borderRadius: "8px" }}
        />
      </Box>
    </StyledContainer>
  );
};

export default Login;
