import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import api from "../../api"; // Подключение к вашему API для получения данных

const InspectorPage = () => {
  const [accessLogs, setAccessLogs] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [selectedAccessLog, setSelectedAccessLog] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("reported");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadAccessLogs = async () => {
    try {
      const response = await api.get("/accesslogs");
      setAccessLogs(response.data);
    } catch (err) {
      setError("Ошибка при загрузке данных из accesslog.");
    }
  };

  const loadIncidents = async () => {
    try {
      const response = await api.get("/incidents");
      setIncidents(response.data);
    } catch (err) {
      setError("Ошибка при загрузке инцидентов.");
    }
  };

  const createIncident = async () => {
    if (!selectedAccessLog || !title || !description) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await api.post("/incidents", {
        event_id: selectedAccessLog.event_id,
        reported_by: 1, // мб поменять
        log_id: selectedAccessLog.log_id,
        title,
        description,
        status,
      });

      setSuccessMessage("Инцидент успешно создан!");
      setTitle("");
      setDescription("");
      loadIncidents();
    } catch (err) {
      setError("Ошибка при создании инцидента.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccessLogs();
    loadIncidents();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Страница инспектора
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Создание инцидента
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Выберите запись</InputLabel>
          <Select
            value={selectedAccessLog?.log_id || ""}
            onChange={(e) =>
              setSelectedAccessLog(
                accessLogs.find((log) => log.log_id === e.target.value)
              )
            }
            label="Выберите запись"
          >
            {accessLogs.map((log) => (
              <MenuItem key={log.log_id} value={log.log_id}>
                {log.ticket_id} - {log.scan_time}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Название инцидента"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Описание инцидента"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Статус</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Статус"
          >
            <MenuItem value="reported">Reported</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </Select>
        </FormControl>

        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={createIncident}
            disabled={loading}
          >
            Создать инцидент
          </Button>
        </Box>
      </Box>

      {/* Список инцидентов */}
      <Box mt={5}>
        <Typography variant="h6" gutterBottom>
          Список инцидентов
        </Typography>
        <Box>
          {incidents.length === 0 ? (
            <Typography>Нет инцидентов.</Typography>
          ) : (
            incidents.map((incident) => (
              <Box
                key={incident.incident_id}
                mb={2}
                p={2}
                border={1}
                borderRadius={4}
              >
                <Typography variant="subtitle1">{incident.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Статус: {incident.status}
                </Typography>
                <Typography variant="body2">
                  Описание: {incident.description}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default InspectorPage;
