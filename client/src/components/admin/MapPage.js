import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../../api";

const MapPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [eventsByFacility, setEventsByFacility] = useState({});
  const [structureByEvent, setStructureByEvent] = useState({});
  const [loading, setLoading] = useState(true);

  // Проверка занятости места
  const isSeatTaken = (seat_id, tickets) =>
    tickets.some((ticket) => ticket.seat_id === seat_id && ticket.status);

  // Загрузка структуры для одного события
  const loadStructureForEvent = async (event) => {
    try {
      // Получаем секторы для текущего события (через facility)
      const sectorsRes = await api.get(`/facilities/${event.fac_id}/sectors`);
      const sectors = sectorsRes.data;

      // Загружаем билеты для события
      const ticketsRes = await api.get(`/tickets?event_id=${event.event_id}`);
      const tickets = ticketsRes.data;

      const rowsBySector = {};
      const seatsByRow = {};

      // Загружаем ряды и места для каждого сектора
      for (const sector of sectors) {
        const rowsRes = await api.get(`/sectors/${sector.sector_id}/rows`);
        rowsBySector[sector.sector_id] = rowsRes.data;

        for (const row of rowsRes.data) {
          const seatsRes = await api.get(`/rows/${row.row_id}/seats`);
          seatsByRow[row.row_id] = seatsRes.data;
        }
      }

      return {
        event,
        sectors,
        rowsBySector,
        seatsByRow,
        tickets,
      };
    } catch (err) {
      console.error(
        `Ошибка загрузки структуры для события ${event.event_id}:`,
        err
      );
      return null;
    }
  };

  // Загрузка всех данных
  const loadAll = async () => {
    try {
      const facilitiesRes = await api.get("/facilities");
      const facilitiesData = facilitiesRes.data;
      setFacilities(facilitiesData);

      const eventsGrouped = {};
      const newStructureByEvent = {};

      for (const fac of facilitiesData) {
        const eventsRes = await api.get(`/facilities/${fac.fac_id}/events`);
        const events = eventsRes.data;
        eventsGrouped[fac.fac_id] = events;

        // Загружаем структуру для каждого события
        const structurePromises = events.map((event) =>
          loadStructureForEvent(event)
        );
        const structures = await Promise.all(structurePromises);

        structures.forEach((structure) => {
          if (structure)
            newStructureByEvent[structure.event.event_id] = structure;
        });
      }

      setEventsByFacility(eventsGrouped);
      setStructureByEvent(newStructureByEvent);
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Карта мест по событиям
      </Typography>

      {facilities.map((facility) => (
        <Box key={facility.fac_id} mb={5}>
          <Typography variant="h5" gutterBottom>
            {facility.name}
          </Typography>

          {(eventsByFacility[facility.fac_id] || []).map((event) => {
            const structure = structureByEvent[event.event_id];
            if (!structure) return null;

            const { sectors, rowsBySector, seatsByRow, tickets } = structure;

            return (
              <Accordion key={event.event_id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box>
                    <Typography variant="subtitle1">{event.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(event.start_time).toLocaleString()} –{" "}
                      {new Date(event.end_time).toLocaleString()}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {sectors.map((sector) => (
                      <Grid item xs={12} sm={6} md={4} key={sector.sector_id}>
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Сектор {sector.name}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {rowsBySector[sector.sector_id]?.map((row) => (
                              <Box key={row.row_id} mb={1}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Ряд {row.number}
                                </Typography>
                                <Grid container spacing={0.5}>
                                  {seatsByRow[row.row_id]?.map((seat) => {
                                    const taken = isSeatTaken(
                                      seat.seat_id,
                                      tickets
                                    );
                                    return (
                                      <Grid item key={seat.seat_id}>
                                        <Paper
                                          elevation={1}
                                          sx={{
                                            width: 30,
                                            height: 30,
                                            backgroundColor: taken
                                              ? "#d32f2f"
                                              : "#388e3c",
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 12,
                                            borderRadius: 1,
                                            userSelect: "none",
                                          }}
                                          title={
                                            taken
                                              ? "Место занято"
                                              : "Свободное место"
                                          }
                                        >
                                          {seat.number}
                                        </Paper>
                                      </Grid>
                                    );
                                  })}
                                </Grid>
                              </Box>
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default MapPage;
