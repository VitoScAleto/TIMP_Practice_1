// Импорты остаются прежними
import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Компонент визуализации карты мест по секторам
const SeatMapVisualization = ({ sector, rows, seatsByRow }) => {
  if (!rows || !seatsByRow) return null;

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Места в секторе {sector.name}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {rows.map((row) => (
          <Box key={row.row} sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="caption"
              sx={{ width: "60px", textAlign: "right", mr: 1 }}
            >
              Ряд {row.number}
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {seatsByRow[row.row]?.map((seat) => (
                <Box
                  key={seat.seat_id}
                  title={`Место ${seat.number} — ${
                    seat.status ? "Занято" : "Свободно"
                  }`}
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: seat.status ? "#f44336" : "#4caf50",
                    color: "#fff",
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                  }}
                >
                  {seat.number}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default function MapPage() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedFacility, setExpandedFacility] = useState(null);
  const [sectorsByFacility, setSectorsByFacility] = useState({});
  const [rowsBySector, setRowsBySector] = useState({});
  const [seatsByRow, setSeatsByRow] = useState({});
  const [expandedSector, setExpandedSector] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/facilities")
      .then((res) => setFacilities(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleFacilityToggle = async (fac_id) => {
    if (expandedFacility === fac_id) {
      setExpandedFacility(null);
      setExpandedSector(null);
      return;
    }

    setExpandedFacility(fac_id);
    setExpandedSector(null);

    if (!sectorsByFacility[fac_id]) {
      try {
        const sectorsRes = await api.get(`/facilities/${fac_id}/sectors`);
        setSectorsByFacility((prev) => ({
          ...prev,
          [fac_id]: sectorsRes.data,
        }));

        for (let sector of sectorsRes.data) {
          const rowsRes = await api.get(`/sectors/${sector.sector_id}/rows`);
          setRowsBySector((prev) => ({
            ...prev,
            [sector.sector_id]: rowsRes.data,
          }));

          for (let row of rowsRes.data) {
            const seatsRes = await api.get(`/rows/${row.row}/seats`);
            setSeatsByRow((prev) => ({
              ...prev,
              [row.row]: seatsRes.data,
            }));
          }
        }
      } catch (e) {
        console.error("Ошибка при загрузке данных:", e);
      }
    }
  };

  const handleSectorToggle = (sector_id) => {
    setExpandedSector(expandedSector === sector_id ? null : sector_id);
  };

  if (loading) return <CircularProgress />;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Список спортивных сооружений
      </Typography>

      {facilities.length === 0 && (
        <Typography>Нет доступных спортивных сооружений.</Typography>
      )}

      {facilities.map((fac) => (
        <Accordion
          key={fac.fac_id}
          expanded={expandedFacility === fac.fac_id}
          onChange={() => handleFacilityToggle(fac.fac_id)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {fac.name} — {fac.address}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {!sectorsByFacility[fac.fac_id] ? (
              <CircularProgress size={24} />
            ) : sectorsByFacility[fac.fac_id].length === 0 ? (
              <Typography>Секторы не найдены.</Typography>
            ) : (
              sectorsByFacility[fac.fac_id].map((sector) => (
                <Accordion
                  key={sector.sector_id}
                  sx={{ mb: 1 }}
                  expanded={expandedSector === sector.sector_id}
                  onChange={() => handleSectorToggle(sector.sector_id)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      Сектор {sector.name} (Вместимость: {sector.capacity},
                      Уровень безопасности: {sector.security_level})
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    {expandedSector === sector.sector_id &&
                      rowsBySector[sector.sector_id] && (
                        <SeatMapVisualization
                          sector={sector}
                          rows={rowsBySector[sector.sector_id]}
                          seatsByRow={seatsByRow}
                        />
                      )}
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
}
