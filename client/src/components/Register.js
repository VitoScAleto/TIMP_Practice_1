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
  Modal,
  Paper,
  IconButton,
} from "@mui/material";
import { Email, Lock, Person, Close } from "@mui/icons-material";
import api from "../api";
import { useAuth } from "../Context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";

const Register = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  const validate = () => {
    const newErrors = {};
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
    setResendMessage("");
    setVerificationCode("");
    setVerificationError("");

    try {
      const response = await api.post(
        "/auth/register",
        {
          username,
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setShowModal(true);
      } else {
        setErrorMessage(response.data.message || t("register.genericError"));
      }
    } catch (error) {
      console.error(error);
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || t("register.genericError");

      navigate("/error", { state: { status, message } });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendMessage("");
    try {
      const response = await api.post(
        "/auth/resend-code",
        { email },
        { withCredentials: true }
      );
      if (response.data.success) {
        setResendMessage(t("register.codeResent"));
      } else {
        setResendMessage(response.data.message);
      }
    } catch (error) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || t("register.genericError");

      navigate("/error", { state: { status, message } });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setVerificationError(t("register.enterCodeError"));
      return;
    }

    setIsVerifying(true);
    setVerificationError("");
    setErrorMessage("");

    try {
      const response = await api.post(
        "/auth/verify-email",
        {
          email,
          code: verificationCode,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        login(response.data.user);
        navigate("/dashboard");
        setShowModal(false);
      } else {
        setVerificationError(
          response.data.message || t("register.invalidCode")
        );
      }
    } catch (err) {
      const status = err.response?.status || 500;
      const message =
        err.response?.data?.message || t("register.verificationFailed");

      navigate("/error", { state: { status, message } });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Fade in timeout={500}>
        <Card elevation={3} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
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
              noValidate
              sx={{
                "& .MuiTextField-root": {
                  mb: 3,
                },
              }}
            >
              <TextField
                label={t("register.username")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!errors.username}
                helperText={errors.username}
                fullWidth
                required
                InputProps={{ startAdornment: <Person sx={{ mr: 1 }} /> }}
              />

              <TextField
                label={t("register.email")}
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value.replace(/[а-яА-Я\s]/g, ""))
                }
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                required
                InputProps={{ startAdornment: <Email sx={{ mr: 1 }} /> }}
              />

              <TextField
                label={t("register.password")}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value.replace(/[а-яА-Я\s]/g, ""))
                }
                error={!!errors.password}
                helperText={errors.password}
                fullWidth
                required
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1 }} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label={t("register.confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value.replace(/[а-яА-Я\s]/g, ""))
                }
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                fullWidth
                required
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1 }} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
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
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
                sx={{ mt: 2, height: 48 }}
              >
                {isLoading ? t("register.loading") : t("register.submit")}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Fade>

      <Modal open={showModal} onClose={handleCloseModal}>
        <Fade in={showModal}>
          <Paper
            sx={{
              maxWidth: 400,
              mx: "auto",
              mt: "20vh",
              p: 4,
              borderRadius: 3,
              position: "relative",
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <Close />
            </IconButton>
            <Typography variant="h6" gutterBottom>
              {t("register.emailConfirmationTitle")}
            </Typography>
            <Typography variant="body2" gutterBottom>
              📧 {t("register.emailSentMessage", { email })}
            </Typography>

            <TextField
              label={t("register.enterVerificationCode")}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.trim())}
              error={!!verificationError}
              helperText={verificationError}
              fullWidth
              sx={{ mt: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleVerifyCode}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                t("register.verifyCode")
              )}
            </Button>

            <Button
              variant="text"
              fullWidth
              sx={{ mt: 1 }}
              onClick={handleResendCode}
            >
              {t("register.resendCode")}
            </Button>

            {resendMessage && (
              <Typography variant="caption" sx={{ mt: 1, color: "gray" }}>
                {resendMessage}
              </Typography>
            )}
          </Paper>
        </Fade>
      </Modal>
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
