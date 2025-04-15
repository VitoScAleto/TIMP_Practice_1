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
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

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

const SettingsModal = ({ open, onClose, user, onUpdateUser }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.put("json/auth/update-name", {
        userId: user.id,
        name: name.trim(),
      });

      if (response.data.success) {
        onUpdateUser(response.data.user);
        setSuccess(true);

        setTimeout(() => {
          onClose(); // Закрываем модалку
        }, 1000);

        setTimeout(() => {
          setSuccess(false); // Убираем Snackbar
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating name:", error);
    } finally {
      setIsLoading(false);
    }
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
                <Typography
                  id="settings-modal-title"
                  variant="h6"
                  component="h2"
                >
                  Настройки профиля
                </Typography>
                <Divider sx={{ my: 2 }} />

                <TextField
                  fullWidth
                  label="Имя"
                  margin="normal"
                  variant="outlined"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(false);
                  }}
                  error={error}
                  helperText={error && "Имя не может быть пустым"}
                />

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
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Имя успешно изменено!
        </Alert>
      </Snackbar>
    </>
  );
};

export default SettingsModal;
