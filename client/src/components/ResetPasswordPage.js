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

import { useTranslation } from "../hooks/useTranslation";

const ResetPasswordPage = () => {
  const { t } = useTranslation();
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

  const [errors, setErrors] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // Валидации с учетом новой локализации

  const validateEmail = (value) => {
    if (!value) return t("resetPassword.emailRequired");
    if (/[а-яА-Я\s]/.test(value)) return t("errors.email_latin_only"); // здесь можно заменить или расширить локализацию, если нужно
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return t("errors.email_invalid");
    return "";
  };

  const validateCode = (value) => {
    if (!value) return t("resetPassword.codeRequired");
    if (!/^\d{6}$/.test(value)) return t("resetPassword.invalidCode");
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return t("errors.password_required");
    if (value.length < 6) return t("resetPassword.passwordTooShort");
    if (/[а-яА-Я\s]/.test(value)) return t("errors.password_latin_only");
    if (!/[0-9]/.test(value)) return t("errors.password_digit_required");
    return "";
  };

  const validateConfirmPassword = (value) => {
    if (!value) return t("errors.confirm_password_required");
    if (value !== newPassword) return t("resetPassword.passwordsDontMatch");
    return "";
  };

  const handleEmailChange = (e) => {
    const val = e.target.value.replace(/[а-яА-Я\s]/g, "");
    setEmail(val);
    setErrors((prev) => ({ ...prev, email: validateEmail(val) }));
  };

  const handleCodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
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
      setMessage(t("resetPassword.codeSent"));
      setStep(1);
    } else {
      setError(result.message || t("resetPassword.requestError"));
    }
  };

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
      setError(result.message || t("resetPassword.invalidCode"));
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

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
      setMessage(t("resetPassword.success"));
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError(result.message || t("resetPassword.resetError"));
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
        {t("resetPassword.title")}
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
                label={t("labels.email")}
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
                {loading ? t("buttons.sending") : t("resetPassword.sendCode")}
              </Button>
            </>
          )}

          {step === 1 && (
            <>
              <TextField
                label={t("labels.code_from_email")}
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
                {loading ? t("buttons.verifying") : t("buttons.confirm_code")}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <TextField
                label={t("labels.new_password")}
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
                label={t("labels.confirm_password")}
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
                {loading
                  ? t("buttons.resetting")
                  : t("resetPassword.resetButton")}
              </Button>
            </>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default ResetPasswordPage;
