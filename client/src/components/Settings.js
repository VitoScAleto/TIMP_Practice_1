import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Divider,
} from "@mui/material";

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
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="settings-modal-title"
      BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,0.5)" } }}
    >
      <Box sx={style}>
        <Typography id="settings-modal-title" variant="h6" component="h2">
          Настройки профиля
        </Typography>
        <Divider sx={{ my: 2 }} />

        <TextField fullWidth label="Имя" margin="normal" variant="outlined" />

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          variant="outlined"
          type="email"
        />

        <TextField
          fullWidth
          label="Новый пароль"
          margin="normal"
          variant="outlined"
          type="password"
        />

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Отмена
          </Button>
          <Button variant="contained" color="primary">
            Сохранить
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SettingsModal;
