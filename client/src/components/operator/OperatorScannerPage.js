import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import api from "../../api";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Alert,
} from "@mui/material";

const OperatorScanner = () => {
  const [ticketInfo, setTicketInfo] = useState(null);
  const [error, setError] = useState("");
  const [logMessage, setLogMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const handleScan = async (data) => {
    if (data && data !== scannedData) {
      setScannedData(data);
      setError("");
      setTicketInfo(null);
      setLogMessage("");
      setLoading(true);

      try {
        let qrDataParsed;
        try {
          qrDataParsed = JSON.parse(data);
        } catch {
          qrDataParsed = data;
        }

        const response = await api.post("/tickets/scan", {
          qr_code_data: qrDataParsed,
        });

        setTicketInfo(response.data);
      } catch (err) {
        const msg =
          err.response?.data?.message || "Ошибка при сканировании QR-кода";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  const logAccess = async (access_status) => {
    if (!ticketInfo) return;

    setLogMessage("");
    try {
      await api.post("/accesslog", {
        ticket_id: ticketInfo.ticket_id,
        access_status,
      });

      setLogMessage("Результат доступа сохранён");
      setTicketInfo(null);
      setScannedData(null);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Ошибка при логировании доступа";
      setLogMessage(msg);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Сканер QR-кодов
      </Typography>

      <Box maxWidth={360} mx="auto" mb={3}>
        <QrReader
          onResult={(result, error) => {
            if (result?.text) {
              handleScan(result.text);
            }
          }}
          constraints={{ facingMode: "environment" }}
          containerStyle={{ width: "100%" }}
          videoStyle={{ width: "100%" }}
        />
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {ticketInfo && (
        <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Информация по билету
          </Typography>
          <Typography>Ticket ID: {ticketInfo.ticket_id}</Typography>
          <Typography>Событие: {ticketInfo.event_name}</Typography>
          <Typography>
            Начало: {new Date(ticketInfo.start_time).toLocaleString()}
          </Typography>
          <Typography>Место: {ticketInfo.seat_id}</Typography>
          <Typography>
            Статус:{" "}
            <strong style={{ color: ticketInfo.status ? "green" : "red" }}>
              {ticketInfo.status ? "Оплачен" : "Отменён"}
            </strong>
          </Typography>
          <Typography>
            Покупка: {new Date(ticketInfo.buy_time).toLocaleString()}
          </Typography>

          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="contained"
              color="success"
              onClick={() => logAccess(true)}
            >
              Разрешить доступ
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => logAccess(false)}
            >
              Отказать в доступе
            </Button>
          </Box>

          {logMessage && (
            <Alert
              severity={
                logMessage.includes("ошибк") ||
                logMessage.includes("Ошибка") ||
                logMessage.includes("не")
                  ? "error"
                  : "success"
              }
              sx={{ mt: 2 }}
            >
              {logMessage}
            </Alert>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default OperatorScanner;
