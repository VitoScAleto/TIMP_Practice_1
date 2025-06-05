import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import api from "../api";
import { useAuth } from "../Context/AuthContext";

import { styled } from "@mui/material/styles";
import { Container, Button, TextField, Typography } from "@mui/material";
const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

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
    setLoginError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        login(response.data.user);
      } else {
        setLoginError(response.data.message || "Неверные учетные данные");
      }
    } catch (error) {
      console.error("Ошибка входа:", error);
      setLoginError(
        error.response?.data?.message ||
          "Произошла ошибка. Пожалуйста, попробуйте еще раз."
      );
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
      {loginError && (
        <Box sx={{ color: "error.main", mb: 2, textAlign: "center" }}>
          {loginError}
        </Box>
      )}
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

// ================= СТИЛИ =================

const StyledContainer = styled(Container)({
  maxWidth: "sm",
  marginTop: "20px",
});

const StyledTypography = styled(Typography)({
  marginBottom: "28px",
});

const StyledTextField = styled(TextField)(({ error }) => ({
  marginBottom: "28px",
  ...(error && {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "red" },
      "&:hover fieldset": { borderColor: "red" },
    },
    "& .MuiFormLabel-root": { color: "red" },
    "& .MuiFormHelperText-root": { color: "red" },
  }),
}));

const StyledButton = styled(Button)({
  marginTop: "16px",
  height: "48px",
});
