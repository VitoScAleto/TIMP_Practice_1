import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../api";
import { useTranslation } from "../hooks/useTranslation";
import { useNavigate } from "react-router-dom";

const QrTicketsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const qrText = t("qr");

  const [facilities, setFacilities] = useState([]);
  const [eventsByFacility, setEventsByFacility] = useState({});
  const [structureByEvent, setStructureByEvent] = useState({});
  const [selectedSeat, setSelectedSeat] = useState({
    eventId: null,
    seatId: null,
  });
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      // Получаем текущего пользователя
      const meRes = await api.get("/auth/me");
      const userId = meRes.data.user.user_id;

      // Получаем разрешённые сооружения для пользователя
      const permissionsRes = await api.get(`/users/${userId}/permissions`);
      const allowedFacilityIds = permissionsRes.data.map(
        (p) => p.permission_facilities
      );

      // Получаем список всех сооружений
      const allFacilitiesRes = await api.get("/facilities");
      const allFacilities = allFacilitiesRes.data;

      // Фильтруем только разрешённые
      const allowedFacilities = allFacilities.filter((f) =>
        allowedFacilityIds.includes(f.fac_id)
      );
      setFacilities(allowedFacilities);

      // Загружаем события и структуру только для разрешённых объектов
      const eventsGrouped = {};
      const structureMap = {};

      for (const fac of allowedFacilities) {
        const evRes = await api.get(`/facilities/${fac.fac_id}/events`);
        eventsGrouped[fac.fac_id] = evRes.data;

        for (const event of evRes.data) {
          const [sectorsRes, ticketsRes] = await Promise.all([
            api.get(`/facilities/${event.fac_id}/sectors`),
            api.get(`/tickets?event_id=${event.event_id}`),
          ]);

          const rowsBySector = {};
          const seatsByRow = {};

          for (const sector of sectorsRes.data) {
            const rowsRes = await api.get(`/sectors/${sector.sector_id}/rows`);
            rowsBySector[sector.sector_id] = rowsRes.data;

            for (const row of rowsRes.data) {
              const seatsRes = await api.get(`/rows/${row.row_id}/seats`);
              seatsByRow[row.row_id] = seatsRes.data;
            }
          }

          structureMap[event.event_id] = {
            event,
            sectors: sectorsRes.data,
            rowsBySector,
            seatsByRow,
            tickets: ticketsRes.data,
          };
        }
      }

      setEventsByFacility(eventsGrouped);
      setStructureByEvent(structureMap);
    } catch (err) {
      console.error("Ошибка при загрузке данных:", err);
      const status = err.response?.status || 500;
      const message = err.response?.data?.message || qrText.loadError;
      navigate("/error", { state: { status, message } });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
    const interval = setInterval(() => loadAll(), 60000);
    return () => clearInterval(interval);
  }, [loadAll]);

  const isSeatTaken = (seat_id, tickets) =>
    tickets.some((ticket) => ticket.seat_id === seat_id && ticket.status);

  const handleBuyTicket = async () => {
    if (!selectedSeat.seatId || !selectedSeat.eventId) return;
    setBuying(true);
    try {
      const res = await api.put("/tickets/buy", {
        event_id: selectedSeat.eventId,
        seat_id: selectedSeat.seatId,
        qr_data: {},
      });

      if (res.data.success) {
        setSnackbar({
          open: true,
          message: qrText.success,
          severity: "success",
        });
        setSelectedSeat({ eventId: null, seatId: null });
        await loadAll();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSnackbar({
          open: true,
          message: res.data.message || qrText.error,
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Ошибка при покупке:", err);
      const status = err.response?.status || 500;
      const message = err.response?.data?.message || qrText.error;
      navigate("/error", { state: { status, message } });
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {qrText.title}
      </Typography>

      {facilities.map((fac) => (
        <Box key={fac.fac_id} mb={5}>
          <Typography variant="h5" gutterBottom>
            {fac.name}
          </Typography>

          {(eventsByFacility[fac.fac_id] || []).map((event) => {
            const structure = structureByEvent[event.event_id];
            if (!structure) return null;

            const { sectors, rowsBySector, seatsByRow, tickets } = structure;

            return (
              <Accordion key={event.event_id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box>
                    <Typography variant="subtitle1">{event.name}</Typography>
                    <Typography variant="body2">
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
                            <Typography>
                              {qrText.sector} {sector.name}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {rowsBySector[sector.sector_id]?.map((row) => (
                              <Box key={row.row_id} mb={1}>
                                <Typography variant="subtitle2">
                                  {qrText.row} {row.number}
                                </Typography>
                                <Grid container spacing={0.5}>
                                  {seatsByRow[row.row_id]?.map((seat) => {
                                    const taken = isSeatTaken(
                                      seat.seat_id,
                                      tickets
                                    );
                                    const isSelected =
                                      selectedSeat.eventId === event.event_id &&
                                      selectedSeat.seatId === seat.seat_id;

                                    return (
                                      <Grid item key={seat.seat_id}>
                                        <Paper
                                          elevation={1}
                                          onClick={() => {
                                            if (!taken) {
                                              setSelectedSeat({
                                                eventId: event.event_id,
                                                seatId: seat.seat_id,
                                              });
                                            }
                                          }}
                                          sx={{
                                            width: 30,
                                            height: 30,
                                            backgroundColor: taken
                                              ? "red"
                                              : isSelected
                                              ? "blue"
                                              : "green",
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 12,
                                            borderRadius: "4px",
                                            cursor: taken
                                              ? "not-allowed"
                                              : "pointer",
                                          }}
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

                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={
                        buying ||
                        !selectedSeat.seatId ||
                        selectedSeat.eventId !== event.event_id
                      }
                      onClick={handleBuyTicket}
                    >
                      {buying ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        qrText.buy
                      )}
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      ))}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QrTicketsPage;
