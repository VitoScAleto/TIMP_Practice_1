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
import api from "../api";
import { useAuth } from "../Context/AuthContext";

const Register = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
  };

  const validate = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    let isValid = true;

    if (!username.trim()) {
      newErrors.username = "Это поле обязательно для заполнения";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Это поле обязательно для заполнения";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Введите корректный email";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Это поле обязательно для заполнения";
      isValid = false;
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Пароль должен содержать минимум 8 символов, включая хотя бы одну букву и одну цифру";
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Это поле обязательно для заполнения";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      if (response.data.success) {
        login(response.data.user);
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
    let value;
    switch (field) {
      case "username":
        value = username;
        if (!value.trim()) {
          setErrors((prev) => ({
            ...prev,
            username: "Это поле обязательно для заполнения",
          }));
        } else {
          setErrors((prev) => ({ ...prev, username: "" }));
        }
        break;

      case "email":
        value = email;
        if (!value.trim()) {
          setErrors((prev) => ({
            ...prev,
            email: "Это поле обязательно для заполнения",
          }));
        } else if (!validateEmail(value)) {
          setErrors((prev) => ({ ...prev, email: "Введите корректный email" }));
        } else {
          setErrors((prev) => ({ ...prev, email: "" }));
        }
        break;

      case "password":
        value = password;
        if (!value.trim()) {
          setErrors((prev) => ({
            ...prev,
            password: "Это поле обязательно для заполнения",
          }));
        } else if (!validatePassword(value)) {
          setErrors((prev) => ({
            ...prev,
            password:
              "Пароль должен содержать минимум 8 символов, включая хотя бы одну букву и одну цифру",
          }));
        } else {
          setErrors((prev) => ({ ...prev, password: "" }));
        }
        break;

      case "confirmPassword":
        value = confirmPassword;
        if (!value.trim()) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Это поле обязательно для заполнения",
          }));
        } else if (value !== password) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Пароли не совпадают",
          }));
        } else {
          setErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }
        break;

      default:
        break;
    }
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={() => handleBlur("username")}
          error={!!errors.username}
          helperText={errors.username}
          sx={errors.username ? styles.error : null}
          fullWidth
          required
        />

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.replace(/[а-яА-Я\s]/g, ""))}
          onBlur={() => handleBlur("email")}
          error={!!errors.email}
          helperText={errors.email}
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
          error={!!errors.password}
          helperText={errors.password}
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
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
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

const styles = {
  textField: {
    marginBottom: "28px",
    position: "relative",
    "& .MuiFormHelperText-root": {
      position: "absolute",
      bottom: "-22px",
      left: 0,
      margin: 0,
      transition: "color 0.3s ease",
    },
  },
  error: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "red",
      },
      "&:hover fieldset": {
        borderColor: "darkred",
      },
    },
    "& .MuiFormLabel-root": {
      color: "red",
    },
    "& .MuiFormHelperText-root": {
      color: "red",
      fontWeight: 600,
    },
  },
};
