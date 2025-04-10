import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import { styles } from "../styles/RegisterStyle";
import api from "../api";

const Register = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validate = () => {
    const newErrors = {
      name: !name.trim(),
      email: !email.trim(),
      password: !password.trim(),
      confirmPassword: !confirmPassword.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (password !== confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    setIsLoading(true);
    setErrorMessage(""); // Сброс сообщения об ошибке

    try {
      const response = await api.post("json/auth/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        onLogin(response.data.user); // Автоматический вход после регистрации
      } else {
        setErrorMessage(response.data.message || "Ошибка регистрации");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Произошла ошибка. Пожалуйста, попробуйте еще раз.");
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
        Регистрация
      </Typography>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          "& .MuiTextField-root": styles.textField,
        }}
      >
        <TextField
          label="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => handleBlur("name")}
          error={errors.name}
          helperText={errors.name && "Это поле обязательно для заполнения"}
          sx={errors.name ? styles.error : null}
          fullWidth
          required
        />

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.replace(/[а-яА-Я\s]/g, ""))}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          helperText={errors.email && "Это поле обязательно для заполнения"}
          sx={errors.email ? styles.error : null}
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
          sx={errors.password ? styles.error : null}
          fullWidth
          required
        />

        <TextField
          label="Подтверждение пароля"
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value.replace(/[а-яА-Я\s]/g, ""))
          }
          onBlur={() => handleBlur("confirmPassword")}
          error={errors.confirmPassword}
          helperText={
            errors.confirmPassword && "Это поле обязательно для заполнения"
          }
          sx={errors.confirmPassword ? styles.error : null}
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
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
