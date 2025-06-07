import React, { useState } from "react";
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
import { useTranslation } from "../hooks/useTranslation"; // Используем ваш хук перевода

const Register = () => {
  const { t } = useTranslation(); // Используем ваш хук перевода
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
      newErrors.username = t("register.requiredField");
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = t("register.requiredField");
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = t("register.invalidEmail");
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = t("register.requiredField");
      isValid = false;
    } else if (!validatePassword(password)) {
      newErrors.password = t("register.passwordRequirements");
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = t("register.requiredField");
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t("register.passwordsMismatch");
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
        setErrorMessage(response.data.message || t("register.genericError"));
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(t("register.genericError"));
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
            username: t("register.requiredField"),
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
            email: t("register.requiredField"),
          }));
        } else if (!validateEmail(value)) {
          setErrors((prev) => ({ ...prev, email: t("register.invalidEmail") }));
        } else {
          setErrors((prev) => ({ ...prev, email: "" }));
        }
        break;

      case "password":
        value = password;
        if (!value.trim()) {
          setErrors((prev) => ({
            ...prev,
            password: t("register.requiredField"),
          }));
        } else if (!validatePassword(value)) {
          setErrors((prev) => ({
            ...prev,
            password: t("register.passwordRequirements"),
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
            confirmPassword: t("register.requiredField"),
          }));
        } else if (value !== password) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: t("register.passwordsMismatch"),
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
        {t("register.title")}
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
          label={t("register.username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={() => handleBlur("username")}
          error={!!errors.username}
          helperText={errors.username}
          fullWidth
          required
        />

        <TextField
          label={t("register.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value.replace(/[а-яА-Я\s]/g, ""))}
          onBlur={() => handleBlur("email")}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          required
        />

        <TextField
          label={t("register.password")}
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value.replace(/[а-яА-Я\s]/g, ""))
          }
          onBlur={() => handleBlur("password")}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
          required
        />

        <TextField
          label={t("register.confirmPassword")}
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value.replace(/[а-яА-Я\s]/g, ""))
          }
          onBlur={() => handleBlur("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
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
          {isLoading ? t("register.loading") : t("register.submit")}
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
      "& fieldset": { borderColor: "red" },
      "&:hover fieldset": { borderColor: "red" },
    },
    "& .MuiFormLabel-root": { color: "red" },
    "& .MuiFormHelperText-root": { color: "red" },
  },
};
