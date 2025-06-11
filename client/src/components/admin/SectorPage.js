import React, { useEffect, useState, useCallback } from "react";
import api from "../../api";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

// Компонент отдельного места
const Seat = ({ seat }) => (
  <Box
    sx={{
      width: 24,
      height: 24,
      borderRadius: "50%",
      backgroundColor: seat.is_occupied ? "#f44336" : "#4caf50",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.7rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      transition: "transform 0.2s",
      "&:hover": {
        transform: "scale(1.2)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
      },
    }}
    title={`Место ${seat.number}`}
  >
    {seat.number}
  </Box>
);

// Компонент ряда с эффектом перспективы
const RowView = ({ row, totalRows, seats }) => {
  const curveIntensity = 0.5;
  const distance = Math.abs(row.number - totalRows / 2);
  const baseTransform = `perspective(600px) rotateX(${
    (distance - totalRows / 2) * curveIntensity
  }deg)`;
  const rowStyle = {
    transform: baseTransform,
    margin: `${10 - distance * 0.5}px auto`,
    width: `${100 - distance * 5}%`,
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 0.5,
        mb: 1,
        ...rowStyle,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: `${baseTransform} scale(1.05)`,
        },
      }}
    >
      {seats
        ?.sort((a, b) => a.number - b.number)
        .map((seat) => (
          <Seat key={seat.seat_id} seat={seat} />
        ))}
    </Box>
  );
};

// Компонент сектора
const SectorCard = ({ sector, rows, seatsByRow }) => (
  <Card sx={{ my: 3, width: "100%", backgroundColor: "#f5f5f5" }}>
    <CardHeader
      title={`Сектор ${sector.name} (вместимость: ${sector.capacity})`}
      sx={{ backgroundColor: "#e0e0e0" }}
    />
    <CardContent>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          p: 2,
        }}
      >
        {rows
          .sort((a, b) => a.number - b.number)
          .map((row) => (
            <RowView
              key={row.row_id}
              row={row}
              totalRows={rows.length}
              seats={seatsByRow[row.row_id]}
            />
          ))}
      </Box>
    </CardContent>
  </Card>
);

// Основной компонент страницы
export default function SectorPage() {
  const [facilities, setFacilities] = useState([]);
  const [selectedFac, setSelectedFac] = useState("");
  const [sectors, setSectors] = useState([]);
  const [rowsBySector, setRowsBySector] = useState({});
  const [seatsByRow, setSeatsByRow] = useState({});
  const [newSector, setNewSector] = useState({
    name: "",
    capacity: 0,
    security_level: "low",
  });
  const [newRow, setNewRow] = useState({
    sector_id: "",
    number: 1,
    capacity: 10,
  });

  // Загрузка списка объектов
  useEffect(() => {
    api.get("/facilities").then(({ data }) => setFacilities(data));
  }, []);

  // Загрузка секторов, рядов и мест при выборе объекта
  useEffect(() => {
    if (!selectedFac) return;

    (async () => {
      try {
        const sectors = (await api.get(`/facilities/${selectedFac}/sectors`))
          .data;
        setSectors(sectors);

        // Автоматический подбор следующей буквы для названия сектора
        const existingNames = sectors.map((s) => s.name.toUpperCase());
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const nextLetter =
          alphabet.split("").find((ch) => !existingNames.includes(ch)) || "";
        setNewSector((prev) => ({ ...prev, name: nextLetter }));

        const rowsMap = {};
        const seatsMap = {};

        for (const sector of sectors) {
          const rows = (await api.get(`/sectors/${sector.sector_id}/rows`))
            .data;
          rowsMap[sector.sector_id] = rows;

          for (const row of rows) {
            const seats = (await api.get(`/rows/${row.row_id}/seats`)).data;
            seatsMap[row.row_id] = seats;
          }
        }

        setRowsBySector(rowsMap);
        setSeatsByRow(seatsMap);
      } catch (e) {
        console.error("Ошибка загрузки данных:", e);
      }
    })();
  }, [selectedFac]);

  // Добавить сектор
  const addSector = async () => {
    try {
      const { data } = await api.post(
        `/facilities/${selectedFac}/sectors`,
        newSector
      );
      setSectors((prev) => [...prev, data]);
      setNewSector({ name: "", capacity: 0, security_level: "low" });
    } catch (e) {
      console.error("Ошибка при добавлении сектора:", e);
    }
  };

  // Получить следующий номер ряда для сектора
  const getNextRowNumber = useCallback(
    (sector_id) => {
      const rows = rowsBySector[sector_id] || [];
      return rows.length === 0 ? 1 : Math.max(...rows.map((r) => r.number)) + 1;
    },
    [rowsBySector]
  );

  // Добавить ряд
  const addRow = async () => {
    if (!newRow.sector_id) return;
    try {
      const { data: rowData } = await api.post(
        `/sectors/${newRow.sector_id}/rows`,
        {
          number: newRow.number,
          capacity: newRow.capacity,
        }
      );

      // Обновляем ряды
      setRowsBySector((prev) => ({
        ...prev,
        [newRow.sector_id]: [...(prev[newRow.sector_id] || []), rowData],
      }));

      // Получаем места для нового ряда
      const seats = (await api.get(`/rows/${rowData.row_id}/seats`)).data;
      setSeatsByRow((prev) => ({ ...prev, [rowData.row_id]: seats }));

      // Сбрасываем форму добавления ряда
      setNewRow({ sector_id: "", number: 1, capacity: 10 });
    } catch (e) {
      console.error("Ошибка при добавлении ряда:", e);
      alert(`Ошибка: ${e.response?.data?.error || e.message}`);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Управление стадионом
      </Typography>

      {/* Выбор объекта */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Выберите объект</InputLabel>
        <Select
          value={selectedFac}
          onChange={(e) => setSelectedFac(e.target.value)}
          label="Выберите объект"
        >
          {facilities.map(({ fac_id, name }) => (
            <MenuItem key={fac_id} value={fac_id}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedFac && (
        <Grid container spacing={4}>
          {/* Добавление сектора */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Добавить сектор" />
              <CardContent>
                <TextField
                  label="Название (A, B...)"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={newSector.name}
                  onChange={(e) =>
                    setNewSector((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <TextField
                  type="number"
                  label="Вместимость"
                  fullWidth
                  sx={{ mb: 2 }}
                  inputProps={{ min: 1 }}
                  value={newSector.capacity}
                  onChange={(e) =>
                    setNewSector((prev) => ({
                      ...prev,
                      capacity: +e.target.value,
                    }))
                  }
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Уровень безопасности</InputLabel>
                  <Select
                    value={newSector.security_level}
                    label="Уровень безопасности"
                    onChange={(e) =>
                      setNewSector((prev) => ({
                        ...prev,
                        security_level: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="low">low</MenuItem>
                    <MenuItem value="medius">medius</MenuItem>
                    <MenuItem value="high">high</MenuItem>
                    <MenuItem value="critical">critical</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={addSector}
                  disabled={!newSector.name}
                >
                  Добавить сектор
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Добавление ряда */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Добавить ряд" />
              <CardContent>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Сектор</InputLabel>
                  <Select
                    value={newRow.sector_id}
                    label="Сектор"
                    onChange={(e) => {
                      const sector_id = e.target.value;
                      setNewRow((prev) => ({
                        ...prev,
                        sector_id,
                        number: getNextRowNumber(sector_id),
                      }));
                    }}
                  >
                    {sectors.map(({ sector_id, name }) => (
                      <MenuItem key={sector_id} value={sector_id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  type="number"
                  label="Номер ряда"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={newRow.number}
                  onChange={(e) =>
                    setNewRow((prev) => ({ ...prev, number: +e.target.value }))
                  }
                  inputProps={{ min: 1 }}
                />
                <TextField
                  type="number"
                  label="Вместимость"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={newRow.capacity}
                  onChange={(e) =>
                    setNewRow((prev) => ({
                      ...prev,
                      capacity: +e.target.value,
                    }))
                  }
                  inputProps={{ min: 1 }}
                />
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={addRow}
                  disabled={!newRow.sector_id}
                >
                  Добавить ряд
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Отображение структуры стадиона */}
          <Grid item xs={12}>
            <Box sx={{ mt: 6 }}>
              <Typography variant="h5" gutterBottom>
                Структура стадиона
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  perspective: "1000px",
                }}
              >
                {sectors.map((sector) => (
                  <SectorCard
                    key={sector.sector_id}
                    sector={sector}
                    rows={rowsBySector[sector.sector_id] || []}
                    seatsByRow={seatsByRow}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
