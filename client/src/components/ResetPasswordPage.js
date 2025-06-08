import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
} from "@mui/material";

import {
  Email,
  VpnKey,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const ResetPasswordPage = () => {
  const { requestPasswordReset, verifyResetCode, resetPassword } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialEmail = queryParams.get("email") || "";

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Ошибки для валидации на фронте
  const [errors, setErrors] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // Валидируем email
  const validateEmail = (value) => {
    if (!value) return "Email обязателен";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Некорректный email";
    return "";
  };

  // Валидируем код (например, длина 6 цифр)
  const validateCode = (value) => {
    if (!value) return "Код обязателен";
    if (!/^\d{6}$/.test(value)) return "Код должен состоять из 6 цифр";
    return "";
  };

  // Валидируем пароль (минимум 6 символов, без пробелов и кириллицы)
  const validatePassword = (value) => {
    if (!value) return "Пароль обязателен";
    if (value.length < 6) return "Пароль должен быть не менее 6 символов";
    if (/[а-яА-Я\s]/.test(value))
      return "Пароль не должен содержать кириллицу и пробелы";
    return "";
  };

  // Подтверждение пароля
  const validateConfirmPassword = (value) => {
    if (!value) return "Подтвердите пароль";
    if (value !== newPassword) return "Пароли не совпадают";
    return "";
  };

  // Обработчики с валидацией

  const handleEmailChange = (e) => {
    const val = e.target.value.replace(/[а-яА-Я\s]/g, "");
    setEmail(val);
    setErrors((prev) => ({ ...prev, email: validateEmail(val) }));
  };

  const handleCodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, ""); // только цифры
    setCode(val);
    setErrors((prev) => ({ ...prev, code: validateCode(val) }));
  };

  const handleNewPasswordChange = (e) => {
    const val = e.target.value.replace(/[а-яА-Я\s]/g, "");
    setNewPassword(val);
    setErrors((prev) => ({ ...prev, newPassword: validatePassword(val) }));
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value.replace(/[а-яА-Я\s]/g, "");
    setConfirmPassword(val);
    setErrors((prev) => ({
      ...prev,
      confirmPassword: validateConfirmPassword(val),
    }));
  };

  // Отправка формы шага 0
  const handleRequestReset = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    const result = await requestPasswordReset(email);
    setLoading(false);

    if (result.success) {
      setMessage("Код был отправлен на вашу почту.");
      setStep(1);
    } else {
      setError(result.message || "Ошибка при отправке кода.");
    }
  };

  // Отправка формы шага 1
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    const codeError = validateCode(code);
    if (codeError) {
      setErrors((prev) => ({ ...prev, code: codeError }));
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    const result = await verifyResetCode(email, code);
    setLoading(false);

    if (result.success) {
      setResetToken(result.token);
      setStep(2);
    } else {
      setError(result.message || "Неверный или истёкший код.");
    }
  };

  // Отправка формы шага 2
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Валидация паролей
    const newPassError = validatePassword(newPassword);
    const confirmPassError = validateConfirmPassword(confirmPassword);

    if (newPassError || confirmPassError) {
      setErrors((prev) => ({
        ...prev,
        newPassword: newPassError,
        confirmPassword: confirmPassError,
      }));
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    const result = await resetPassword(resetToken, newPassword);
    setLoading(false);

    if (result.success) {
      setMessage("Пароль успешно обновлён. Перенаправление...");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError(result.message || "Не удалось сбросить пароль.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 420,
        margin: "60px auto",
        padding: 4,
        backgroundColor: "background.paper",
        borderRadius: 3,
        boxShadow: 3,
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Восстановление пароля
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Fade in>
        <Box component="form" noValidate>
          {step === 0 && (
            <>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                margin="normal"
                value={email}
                onChange={handleEmailChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                onClick={handleRequestReset}
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? "Отправка..." : "Отправить код"}
              </Button>
            </>
          )}

          {step === 1 && (
            <>
              <TextField
                label="Код из письма"
                type="text"
                fullWidth
                required
                margin="normal"
                value={code}
                onChange={handleCodeChange}
                error={!!errors.code}
                helperText={errors.code}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                onClick={handleVerifyCode}
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? "Проверка..." : "Подтвердить код"}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <TextField
                label="Новый пароль"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                margin="normal"
                value={newPassword}
                onChange={handleNewPasswordChange}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Подтвердите пароль"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                required
                margin="normal"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        aria-label="toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                onClick={handleResetPassword}
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? "Сброс..." : "Сбросить пароль"}
              </Button>
            </>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default ResetPasswordPage;
