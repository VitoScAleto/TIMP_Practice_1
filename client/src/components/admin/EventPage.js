import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EventPage() {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "planned",
    safety: "medium",
    start_time: "",
    end_time: "",
  });

  // Для редактирования
  const [editingEventId, setEditingEventId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    api
      .get("/facilities")
      .then((res) => setFacilities(res.data))
      .catch((err) => console.error("Ошибка при загрузке сооружений:", err));
  }, []);

  useEffect(() => {
    if (selectedFacility) {
      api
        .get(`/facilities/${selectedFacility.fac_id}/events`)
        .then((res) => setEvents(res.data))
        .catch((err) => console.error("Ошибка при загрузке событий:", err));
    }
  }, [selectedFacility]);

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Создание нового события
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!selectedFacility) return alert("Выберите сооружение");

    try {
      await api.post(`/facilities/${selectedFacility.fac_id}/events`, {
        ...form,
      });
      setForm({
        name: "",
        description: "",
        status: "planned",
        safety: "medium",
        start_time: "",
        end_time: "",
      });
      const res = await api.get(
        `/facilities/${selectedFacility.fac_id}/events`
      );
      setEvents(res.data);
    } catch (err) {
      console.error("Ошибка создания события:", err);
      alert("Ошибка при создании события");
    }
  };

  // Открыть диалог редактирования
  const handleEditEvent = (event) => {
    setEditingEventId(event.event_id);
    setForm({
      name: event.name,
      description: event.description,
      status: event.status,
      safety: event.safety,
      start_time: event.start_time.slice(0, 16), // Для datetime-local
      end_time: event.end_time.slice(0, 16),
    });
    setEditDialogOpen(true);
  };

  // Сохранить изменения события
  const handleSaveEdit = async () => {
    try {
      await api.put(`/events/${editingEventId}`, { ...form });
      const res = await api.get(
        `/facilities/${selectedFacility.fac_id}/events`
      );
      setEvents(res.data);
      setEditDialogOpen(false);
      setEditingEventId(null);
      setForm({
        name: "",
        description: "",
        status: "planned",
        safety: "medium",
        start_time: "",
        end_time: "",
      });
    } catch (err) {
      console.error("Ошибка обновления события:", err);
      alert("Ошибка при обновлении события");
    }
  };

  // Отмена редактирования
  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setEditingEventId(null);
    setForm({
      name: "",
      description: "",
      status: "planned",
      safety: "medium",
      start_time: "",
      end_time: "",
    });
  };

  // Удаление события
  const handleDeleteEvent = async (event_id) => {
    if (!window.confirm("Удалить событие?")) return;

    try {
      await api.delete(`/events/${event_id}`);
      setEvents((prev) => prev.filter((e) => e.event_id !== event_id));
    } catch (err) {
      console.error("Ошибка удаления события:", err);
      alert("Не удалось удалить событие");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Управление событиями
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Выберите спортивное сооружение</InputLabel>
        <Select
          value={selectedFacility?.fac_id || ""}
          onChange={(e) =>
            setSelectedFacility(
              facilities.find((f) => f.fac_id == e.target.value)
            )
          }
          label="Выберите спортивное сооружение"
        >
          {facilities.map((fac) => (
            <MenuItem key={fac.fac_id} value={fac.fac_id}>
              {fac.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedFacility && (
        <>
          <Typography variant="h5" gutterBottom>
            События
          </Typography>
          {events.length === 0 ? (
            <Typography>Нет событий</Typography>
          ) : (
            <List>
              {events.map((e) => (
                <ListItem
                  key={e.event_id}
                  component={Paper}
                  sx={{ mb: 2 }}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditEvent(e)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteEvent(e.event_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={`${e.name} (${e.status}, ${e.safety})`}
                    secondary={
                      <>
                        <div>
                          {new Date(e.start_time).toLocaleString()} —{" "}
                          {new Date(e.end_time).toLocaleString()}
                        </div>
                        <div>{e.description}</div>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}

          {/* Форма создания */}
          {!editDialogOpen && (
            <Box
              component="form"
              onSubmit={handleCreateEvent}
              sx={{ mt: 4, p: 3, bgcolor: "#f9f9f9", borderRadius: 2 }}
            >
              <Typography variant="h6" gutterBottom>
                Создать новое событие
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Название"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="description"
                    label="Описание"
                    multiline
                    rows={3}
                    value={form.description}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Статус</InputLabel>
                    <Select
                      name="status"
                      value={form.status}
                      label="Статус"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="planned">Запланировано</MenuItem>
                      <MenuItem value="ongoing">В процессе</MenuItem>
                      <MenuItem value="completed">Завершено</MenuItem>
                      <MenuItem value="cancelled">Отменено</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Уровень риска</InputLabel>
                    <Select
                      name="safety"
                      value={form.safety}
                      label="Уровень риска"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="low">Низкий</MenuItem>
                      <MenuItem value="medium">Средний</MenuItem>
                      <MenuItem value="high">Высокий</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="start_time"
                    type="datetime-local"
                    label="Начало"
                    InputLabelProps={{ shrink: true }}
                    value={form.start_time}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="end_time"
                    type="datetime-local"
                    label="Окончание"
                    InputLabelProps={{ shrink: true }}
                    value={form.end_time}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button type="submit" variant="contained" fullWidth>
                    Добавить событие
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Диалог редактирования */}
          <Dialog
            open={editDialogOpen}
            onClose={handleCancelEdit}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Редактировать событие</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Название"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="description"
                    label="Описание"
                    multiline
                    rows={3}
                    value={form.description}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Статус</InputLabel>
                    <Select
                      name="status"
                      value={form.status}
                      label="Статус"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="planned">Запланировано</MenuItem>
                      <MenuItem value="ongoing">В процессе</MenuItem>
                      <MenuItem value="completed">Завершено</MenuItem>
                      <MenuItem value="cancelled">Отменено</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Уровень риска</InputLabel>
                    <Select
                      name="safety"
                      value={form.safety}
                      label="Уровень риска"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="low">Низкий</MenuItem>
                      <MenuItem value="medium">Средний</MenuItem>
                      <MenuItem value="high">Высокий</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="start_time"
                    type="datetime-local"
                    label="Начало"
                    InputLabelProps={{ shrink: true }}
                    value={form.start_time}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="end_time"
                    type="datetime-local"
                    label="Окончание"
                    InputLabelProps={{ shrink: true }}
                    value={form.end_time}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelEdit}>Отмена</Button>
              <Button variant="contained" onClick={handleSaveEdit}>
                Сохранить
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
}
