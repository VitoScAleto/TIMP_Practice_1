import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { useAuth } from "../Context/AuthContext";
import { useSettings } from "../Context/SettingsContext";
import { useTranslation } from "../hooks/useTranslation";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const SettingsModal = ({ open, onClose }) => {
  const { user, login } = useAuth();
  const { settings, updateSettings, changeTheme, changeLanguage } =
    useSettings();
  const [name, setName] = useState("");
  const [theme, setTheme] = useState(settings.theme);
  const [language, setLanguage] = useState(settings.language);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();
  const settingsText = t("settingsModal");

  useEffect(() => {
    if (user) {
      setName(user.username || "");
      setTheme(settings.theme);
      setLanguage(settings.language);
    }
  }, [user, settings]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.put("/auth/update-username", {
        newUsername: name.trim(),
      });

      if (response.data.success) {
        const updatedUser = response.data.user;

        login({
          user_id: updatedUser.user_id,
          username: updatedUser.username,
          email: updatedUser.email,
        });

        updateSettings({
          username: updatedUser.username,
          email: updatedUser.email,
        });

        changeTheme(theme);
        changeLanguage(language);

        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="settings-modal-title"
            BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,0.5)" } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={style}>
                <Typography variant="h6" component="h2">
                  {settingsText.profile}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <TextField
                  fullWidth
                  label={settingsText.name}
                  margin="normal"
                  variant="outlined"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(false);
                  }}
                  error={error}
                  helperText={error && settingsText.error}
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel id="language-select-label">
                    {settingsText.language}
                  </InputLabel>
                  <Select
                    labelId="language-select-label"
                    value={language}
                    label="Язык"
                    onChange={handleLanguageChange}
                  >
                    <MenuItem value="ru">Русский</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </FormControl>

                <Box
                  sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                >
                  <Button onClick={onClose} sx={{ mr: 2 }} disabled={isLoading}>
                    Отмена
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    startIcon={
                      isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : null
                    }
                  >
                    {isLoading ? "Сохранение..." : "Сохранить"}
                  </Button>
                </Box>
              </Box>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          Настройки успешно сохранены!
        </Alert>
      </Snackbar>
    </>
  );
};

export default SettingsModal;
