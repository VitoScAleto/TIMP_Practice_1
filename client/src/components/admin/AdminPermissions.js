import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  Paper,
} from "@mui/material";
import api from "../../api";

const AdminPermissionsPage = () => {
  const [users, setUsers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, facilitiesRes] = await Promise.all([
          api.get("/users"),
          api.get("/facilities"),
        ]);
        setUsers(usersRes.data);
        setFacilities(facilitiesRes.data);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFacilityToggle = (facId) => {
    setSelectedFacilities((prev) =>
      prev.includes(facId)
        ? prev.filter((id) => id !== facId)
        : [...prev, facId]
    );
  };

  const handleSubmit = async () => {
    setStatusMessage(null);

    if (!selectedUser || selectedFacilities.length === 0) {
      setStatusMessage({
        type: "error",
        text: "Выберите пользователя и хотя бы одно сооружение.",
      });
      return;
    }

    try {
      for (const facId of selectedFacilities) {
        await api.post("/permissions", {
          user_id: selectedUser,
          fac_id: facId,
        });
      }
      setStatusMessage({
        type: "success",
        text: "Разрешения успешно назначены.",
      });
    } catch (err) {
      console.error("Ошибка при назначении разрешений:", err);
      setStatusMessage({
        type: "error",
        text: "Ошибка при сохранении разрешений.",
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Назначение разрешений пользователям
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="user-select-label">Пользователь</InputLabel>
          <Select
            labelId="user-select-label"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            label="Пользователь"
          >
            {users.map((user) => (
              <MenuItem key={user.user_id} value={user.user_id}>
                {user.username} ({user.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h6" gutterBottom>
          Доступные спортивные сооружения:
        </Typography>
        <FormGroup>
          {facilities.map((fac) => (
            <FormControlLabel
              key={fac.fac_id}
              control={
                <Checkbox
                  checked={selectedFacilities.includes(fac.fac_id)}
                  onChange={() => handleFacilityToggle(fac.fac_id)}
                />
              }
              label={`${fac.name} (${fac.address})`}
            />
          ))}
        </FormGroup>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Назначить доступ
        </Button>

        {statusMessage && (
          <Alert severity={statusMessage.type} sx={{ mt: 2 }}>
            {statusMessage.text}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default AdminPermissionsPage;
