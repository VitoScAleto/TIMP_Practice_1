import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import api from "../api";

const Login = ({ setIsAuthenticated }) => {
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
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error(error);
      // Можно добавить обработку ошибок сервера
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
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Вход
      </Typography>
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
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.replace(/[а-яА-Я\s]/g, ""))}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          helperText={errors.email && "Это поле обязательно для заполнения"}
          sx={
            errors.email
              ? {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "red" },
                    "&:hover fieldset": { borderColor: "red" },
                  },
                  "& .MuiFormLabel-root": { color: "red" },
                  "& .MuiFormHelperText-root": { color: "red" },
                }
              : null
          }
          fullWidth
          required
        />

        <TextField
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value.replace(/[а-яА-Я\s]/g, ""))
          }
          onBlur={() => handleBlur("password")}
          error={errors.password}
          helperText={errors.password && "Это поле обязательно для заполнения"}
          sx={
            errors.password
              ? {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "red" },
                    "&:hover fieldset": { borderColor: "red" },
                  },
                  "& .MuiFormLabel-root": { color: "red" },
                  "& .MuiFormHelperText-root": { color: "red" },
                }
              : null
          }
          fullWidth
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={
            isLoading ? <CircularProgress size={20} color="inherit" /> : null
          }
          fullWidth
          size="large"
          sx={{ mt: 2, height: 48 }}
        >
          {isLoading ? "Вход..." : "Войти"}
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
