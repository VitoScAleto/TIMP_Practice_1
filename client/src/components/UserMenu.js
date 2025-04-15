import React, { useState } from "react";
import { Button, Menu, MenuItem, Avatar, Typography, Box } from "@mui/material";
import SettingsModal from "./Settings";

const UserMenu = ({ user, onLogout, onUpdateUser }) => {
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
          {user?.name}
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
        <MenuItem onClick={onLogout}>Выйти</MenuItem>
      </Menu>

      <SettingsModal
        open={openSettings}
        onClose={handleSettingsClose}
        user={user}
        onUpdateUser={onUpdateUser}
      />
    </Box>
  );
};

export default UserMenu;
