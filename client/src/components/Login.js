import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
  Alert,
  Card,
  CardContent,
  Fade,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../api";
import { useAuth } from "../Context/AuthContext";
import { styled } from "@mui/material/styles";
import { useTranslation } from "../hooks/useTranslation";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetError, setResetError] = useState("");

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
    if (!validate()) return;
    setIsLoading(true);
    setLoginError("");
    try {
      const response = await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.data.success) {
        login(response.data.user);
        navigate("/dashboard");
      } else {
        setLoginError(response.data.message || t("login.invalidCredentials"));
      }
    } catch (error) {
      console.error("Login error:", error);
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || t("login.genericError");

      // Переход на /error с кодом и сообщением
      navigate("/error", {
        state: {
          status,
          message,
        },
      });
    }
  };

  const handleBlur = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: !eval(field).trim(),
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = async () => {
    if (!resetEmail.trim()) {
      setResetError(t("login.requiredField"));
      return;
    }

    try {
      setResetError("");
      setIsLoading(true);
      const response = await api.post("/auth/request-password-reset", {
        email: resetEmail,
      });

      if (response.data.success) {
        navigate(`/reset-password?email=${encodeURIComponent(resetEmail)}`);
      } else {
        setResetError(response.data.message || t("login.resetError"));
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setResetError(error.response?.data?.message || t("login.genericError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Fade in timeout={500}>
        <Card elevation={3} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {t("login.title")}
            </Typography>

            {loginError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {loginError}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                "& .MuiTextField-root": {
                  mb: 3,
                },
              }}
            >
              <TextField
                label={t("login.email")}
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value.replace(/[а-яА-Я\s]/g, ""))
                }
                onBlur={() => handleBlur("email")}
                error={!!errors.email}
                helperText={errors.email && t("login.requiredField")}
                fullWidth
                required
                InputProps={{ startAdornment: <Email sx={{ mr: 1 }} /> }}
              />

              <TextField
                label={t("login.password")}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value.replace(/[а-яА-Я\s]/g, ""))
                }
                onBlur={() => handleBlur("password")}
                error={!!errors.password}
                helperText={errors.password && t("login.requiredField")}
                fullWidth
                required
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1 }} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
                fullWidth
                size="large"
                sx={{ mt: 2, height: 48 }}
              >
                {isLoading ? t("login.loggingIn") : t("login.submit")}
              </Button>
            </Box>
            <Button
              onClick={() => navigate("/reset-password")}
              color="secondary"
              fullWidth
              sx={{ mt: 2 }}
            >
              {t("login.forgotPassword")}
            </Button>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
};

export default Login;
