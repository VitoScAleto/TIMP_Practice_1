import React, { useState } from "react";
import { Button, Menu, MenuItem, Avatar, Typography, Box } from "@mui/material";
import SettingsModal from "./Settings";
import { useAuth } from "../Context/AuthContext";

const UserMenu = () => {
  const { user, login, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsOpen = () => {
    setOpenSettings(true);
    handleMenuClose();
  };

  const handleSettingsClose = () => {
    setOpenSettings(false);
  };

  return (
    <Box>
      <Button
        color="inherit"
        onClick={handleMenuOpen}
        startIcon={<Avatar src={user?.avatar} sx={{ width: 32, height: 32 }} />}
        sx={{ textTransform: "none", ml: 2 }}
      >
        <Typography variant="body1" sx={{ ml: 1 }}>
          {user?.username}
        </Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">{user?.email}</Typography>
        </MenuItem>
        <MenuItem onClick={handleSettingsOpen}>Настройки</MenuItem>
        <MenuItem onClick={logout}>Выйти</MenuItem>
      </Menu>

      <SettingsModal open={openSettings} onClose={handleSettingsClose} />
    </Box>
  );
};

export default UserMenu;
