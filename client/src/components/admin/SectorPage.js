import React, { useEffect, useState } from "react";
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

// 🔧 Компонент отдельного места
const Seat = ({ seat }) => (
  <Box
    sx={{
      width: 24,
      height: 24,
      borderRadius: "50%",
      backgroundColor: seat.is_occupied ? "#f44336" : "#4caf50",
      color: "white",
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

// 🔁 Компонент отображения одного ряда
const RowView = ({ row, totalRows, seats }) => {
  const getRowStyle = (rowNumber) => {
    const curveIntensity = 0.5;
    const distance = Math.abs(rowNumber - totalRows / 2);
    return {
      transform: `perspective(600px) rotateX(${
        (distance - totalRows / 2) * curveIntensity
      }deg)`,
      margin: `${10 - distance * 0.5}px auto`,
      width: `${100 - distance * 5}%`,
    };
  };

  const rowStyle = getRowStyle(row.number);

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
          transform: `${rowStyle.transform} scale(1.05)`,
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

// 📦 Компонент сектора
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
          padding: 2,
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

// 🏟️ Основной вид стадиона
const StadiumView = ({ sectors, rowsBySector, seatsByRow }) => (
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
);

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

  // 📦 Загрузка объектов
  useEffect(() => {
    api.get("/facilities").then((res) => setFacilities(res.data));
  }, []);

  // 📥 Загрузка секторов, рядов и мест
  useEffect(() => {
    if (!selectedFac) return;

    (async () => {
      const sectors = (await api.get(`/facilities/${selectedFac}/sectors`))
        .data;
      setSectors(sectors);

      // Найти доступную букву (A, B, C...)
      const existingNames = sectors.map((s) => s.name.toUpperCase());
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const nextLetter =
        alphabet.split("").find((ch) => !existingNames.includes(ch)) || "";

      setNewSector((prev) => ({ ...prev, name: nextLetter }));

      const rowsMap = {};
      const seatsMap = {};

      for (let sector of sectors) {
        const rows = (await api.get(`/sectors/${sector.sector_id}/rows`)).data;
        rowsMap[sector.sector_id] = rows;

        for (let row of rows) {
          const seats = (await api.get(`/rows/${row.row_id}/seats`)).data;
          seatsMap[row.row_id] = seats;
        }
      }

      setRowsBySector(rowsMap);
      setSeatsByRow(seatsMap);
    })();
  }, [selectedFac]);

  const addSector = async () => {
    try {
      const res = await api.post(
        `/facilities/${selectedFac}/sectors`,
        newSector
      );
      setSectors((prev) => [...prev, res.data]);
      setNewSector({ name: "", capacity: 0, security_level: "low" });
    } catch (e) {
      console.error("Ошибка при добавлении сектора:", e);
    }
  };

  const addRow = async () => {
    try {
      const res = await api.post(`/sectors/${newRow.sector_id}/rows`, newRow);
      setRowsBySector((prev) => ({
        ...prev,
        [newRow.sector_id]: [...(prev[newRow.sector_id] || []), res.data],
      }));

      // Обновить места для нового ряда
      const seats = (await api.get(`/rows/${res.data.row_id}/seats`)).data;
      setSeatsByRow((prev) => ({
        ...prev,
        [res.data.row_id]: seats,
      }));

      setNewRow({ ...newRow, number: newRow.number + 1 });
    } catch (e) {
      console.error("Ошибка при добавлении ряда:", e);
    }
  };
  const getNextRowNumber = (sector_id) => {
    const rows = rowsBySector[sector_id] || [];
    if (rows.length === 0) return 1;
    return Math.max(...rows.map((r) => r.number)) + 1;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Управление стадионом
      </Typography>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Выберите объект</InputLabel>
        <Select
          value={selectedFac}
          onChange={(e) => setSelectedFac(e.target.value)}
          label="Выберите объект"
        >
          {facilities.map((f) => (
            <MenuItem key={f.fac_id} value={f.fac_id}>
              {f.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedFac && (
        <>
          <Grid container spacing={4}>
            {/* Блок добавления сектора */}
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
                      setNewSector({ ...newSector, name: e.target.value })
                    }
                  />
                  <TextField
                    type="number"
                    inputProps={{ min: 1 }}
                    label="Вместимость"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={newSector.capacity}
                    onChange={(e) =>
                      setNewSector({ ...newSector, capacity: +e.target.value })
                    }
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Уровень безопасности</InputLabel>
                    <Select
                      value={newSector.security_level}
                      label="Уровень безопасности"
                      onChange={(e) =>
                        setNewSector({
                          ...newSector,
                          security_level: e.target.value,
                        })
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

            {/* Блок добавления ряда */}
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
                      {sectors.map((s) => (
                        <MenuItem key={s.sector_id} value={s.sector_id}>
                          {s.name}
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
                      setNewRow({ ...newRow, number: +e.target.value })
                    }
                  />

                  <TextField
                    type="number"
                    label="Вместимость"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={newRow.capacity}
                    onChange={(e) =>
                      setNewRow({ ...newRow, capacity: +e.target.value })
                    }
                  />

                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={async () => {
                      try {
                        const res = await api.post(
                          `/sectors/${newRow.sector_id}/rows`,
                          {
                            number: newRow.number,
                            capacity: newRow.capacity,
                          }
                        );

                        // Задержка для гарантии завершения seat вставки
                        await new Promise((r) => setTimeout(r, 200));

                        const newSeats = (
                          await api.get(`/rows/${res.data.row_id}/seats`)
                        ).data;

                        // Обновление состояний, например rowsBySector и seatsByRow
                        setRowsBySector((prev) => ({
                          ...prev,
                          [newRow.sector_id]: [
                            ...(prev[newRow.sector_id] || []),
                            res.data,
                          ],
                        }));
                        setSeatsByRow((prev) => ({
                          ...prev,
                          [res.data.row_id]: newSeats,
                        }));

                        setNewRow({ sector_id: "", number: 1, capacity: 10 });
                      } catch (e) {
                        console.error("Ошибка при добавлении ряда:", e);
                        alert(
                          `Ошибка: ${e.response?.data?.error || e.message}`
                        );
                      }
                    }}
                    disabled={!newRow.sector_id}
                  >
                    Добавить ряд
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
