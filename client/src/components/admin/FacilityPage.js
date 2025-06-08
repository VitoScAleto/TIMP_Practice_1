import React, { useState, useEffect, useCallback } from "react";
import api from "../../api";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import debounce from "lodash.debounce";

const PAGE_SIZE = 6;

const FacilityList = () => {
  const [facilities, setFacilities] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [ymaps, setYmaps] = useState(null);
  const [addressSuggestions, setAddressSuggestions] = useState([]);

  // Загрузка списка сооружений
  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await api.get("/facilities");
      const data = res.data.map((f) => ({
        ...f,
        latitude: Number(f.latitude),
        longitude: Number(f.longitude),
      }));
      setFacilities(data);
    } catch (err) {
      console.error("Ошибка загрузки объектов:", err);
      setMessage({
        type: "error",
        text: "Ошибка загрузки спортивных сооружений",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // Дебаунс для вызова геокодера, зависит от ymaps
  const debounceGeocode = useCallback(
    debounce(async (query) => {
      if (!ymaps) return;
      try {
        const response = await ymaps.geocode(query, { results: 5 });
        const geoObjects = response.geoObjects.toArray();
        const suggestions = geoObjects.map((obj) => ({
          address: obj.getAddressLine(),
          coords: obj.geometry.getCoordinates(),
        }));
        setAddressSuggestions(suggestions);
      } catch {
        setAddressSuggestions([]);
      }
    }, 500),
    [ymaps]
  );

  // При изменении адреса вызываем автозаполнение
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "address" && value.trim().length > 2) {
      debounceGeocode(value);
    } else if (name === "address") {
      setAddressSuggestions([]);
    }
  };

  // Выбор подсказки адреса из списка
  const handleSuggestionClick = (suggestion) => {
    setFormData({
      name: formData.name,
      address: suggestion.address,
      latitude: suggestion.coords[0].toFixed(6),
      longitude: suggestion.coords[1].toFixed(6),
    });
    setAddressSuggestions([]);
  };

  // Сброс формы
  const handleReset = () => {
    setFormData({
      name: "",
      address: "",
      latitude: "",
      longitude: "",
    });
    setEditId(null);
    setMessage(null);
    setAddressSuggestions([]);
  };

  // Добавление / редактирование объекта
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, address, latitude, longitude } = formData;

    if (
      !name.trim() ||
      !address.trim() ||
      isNaN(parseFloat(latitude)) ||
      isNaN(parseFloat(longitude))
    ) {
      setMessage({
        type: "error",
        text: "Пожалуйста, заполните все поля корректно",
      });
      return;
    }

    try {
      if (editId) {
        await api.put(`/facilities/${editId}`, {
          name,
          address,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        });
        setMessage({ type: "success", text: "Объект обновлен" });
      } else {
        await api.post("/facilities", {
          name,
          address,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        });
        setMessage({ type: "success", text: "Объект добавлен" });
      }
      handleReset();
      fetchFacilities();
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      setMessage({
        type: "error",
        text: "Ошибка при сохранении объекта",
      });
    }
  };

  // Начинаем редактирование
  const handleEdit = (facility) => {
    setFormData({
      name: facility.name,
      address: facility.address,
      latitude: facility.latitude.toFixed(6),
      longitude: facility.longitude.toFixed(6),
    });
    setEditId(facility.fac_id);
    setMessage(null);
    setAddressSuggestions([]);
  };

  // Удаление с подтверждением
  const handleDelete = async (id) => {
    if (!window.confirm("Удалить этот объект?")) return;
    try {
      await api.delete(`/facilities/${id}`);
      setMessage({ type: "success", text: "Объект удалён" });
      fetchFacilities();
    } catch (err) {
      console.error("Ошибка при удалении:", err);
      setMessage({
        type: "error",
        text: "Ошибка при удалении объекта",
      });
    }
  };

  // Клик по карте — обновляем координаты
  const handleMapClick = (e) => {
    const coords = e.get("coords");
    setFormData((prev) => ({
      ...prev,
      latitude: coords[0].toFixed(6),
      longitude: coords[1].toFixed(6),
    }));
  };

  // Пагинация
  const maxPage = Math.ceil(facilities.length / PAGE_SIZE);
  const paginatedFacilities = facilities.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <YMaps
      query={{ apikey: "d3e69dae-1e98-405f-854c-3042ab6594f4", lang: "ru_RU" }}
      onLoad={(ymapsInstance) => setYmaps(ymapsInstance)}
    >
      <Box maxWidth={700} mx="auto" p={3}>
        <Typography variant="h4" align="center" gutterBottom>
          Спортивные сооружения
        </Typography>

        {message && (
          <Alert
            severity={message.type}
            onClose={() => setMessage(null)}
            sx={{ mb: 3 }}
          >
            {message.text}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Название"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
                size="medium"
                sx={{ "& .MuiInputBase-input": { fontSize: 16 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{ position: "relative" }}>
              <TextField
                label="Адрес"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                fullWidth
                size="medium"
                autoComplete="off"
                sx={{ "& .MuiInputBase-input": { fontSize: 16 } }}
              />
              {/* Список подсказок */}
              {addressSuggestions.length > 0 && (
                <Paper
                  sx={{
                    position: "absolute",
                    zIndex: 10,
                    top: "100%",
                    left: 0,
                    right: 0,
                    maxHeight: 200,
                    overflowY: "auto",
                  }}
                  elevation={3}
                >
                  <List dense disablePadding>
                    {addressSuggestions.map((suggestion, i) => (
                      <ListItem
                        key={i}
                        disablePadding
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <ListItemButton>
                          <ListItemText primary={suggestion.address} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Широта"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                required
                fullWidth
                size="medium"
                type="number"
                inputProps={{ step: "0.000001" }}
                sx={{ "& .MuiInputBase-input": { fontSize: 16 } }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Долгота"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                required
                fullWidth
                size="medium"
                type="number"
                inputProps={{ step: "0.000001" }}
                sx={{ "& .MuiInputBase-input": { fontSize: 16 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Выберите координаты на карте:
              </Typography>
              <Box height={300} sx={{ position: "relative", mb: 2 }}>
                <Map
                  key={`${formData.latitude}-${formData.longitude}`}
                  defaultState={{
                    center: [55.751574, 37.573856],
                    zoom: 10,
                  }}
                  width="100%"
                  height="100%"
                  onClick={handleMapClick}
                  options={{ suppressMapOpenBlock: true }}
                >
                  {formData.latitude && formData.longitude && (
                    <Placemark
                      geometry={[
                        parseFloat(formData.latitude),
                        parseFloat(formData.longitude),
                      ]}
                    />
                  )}
                </Map>
              </Box>
            </Grid>

            <Grid item xs={12} display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleReset}
                size="large"
                sx={{ flexGrow: 1, maxWidth: 140 }}
              >
                Очистить
              </Button>
              <Button
                variant="contained"
                type="submit"
                size="large"
                sx={{ flexGrow: 1, maxWidth: 140 }}
              >
                {editId ? "Обновить" : "Добавить"}
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box textAlign="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedFacilities.map((facility) => (
                <Grid item xs={12} sm={6} key={facility.fac_id}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      borderRadius: 2,
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#1976d2",
                        fontFamily: "'Roboto', sans-serif",
                        mb: 1,
                      }}
                    >
                      {facility.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#555" }}>
                      Адрес: {facility.address}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#555" }}>
                      Координаты: {facility.latitude.toFixed(6)},{" "}
                      {facility.longitude.toFixed(6)}
                    </Typography>

                    <Box
                      mt={1}
                      display="flex"
                      justifyContent="flex-end"
                      gap={1}
                    >
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(facility)}
                        aria-label="Редактировать"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(facility.fac_id)}
                        aria-label="Удалить"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {facilities.length > PAGE_SIZE && (
              <Box display="flex" justifyContent="center" mt={4} gap={2}>
                <Button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  variant="outlined"
                >
                  Назад
                </Button>
                <Typography variant="body1" sx={{ alignSelf: "center" }}>
                  Страница {page} из {maxPage}
                </Typography>
                <Button
                  disabled={page >= maxPage}
                  onClick={() => setPage((p) => p + 1)}
                  variant="outlined"
                >
                  Вперёд
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </YMaps>
  );
};

export default FacilityList;
