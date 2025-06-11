import React, { useRef, useEffect, useState, useMemo } from "react";
import { Box } from "@mui/material";
import api from "../../api";

const outerRadiusX = 500;
const outerRadiusY = 230;
const fieldWidth = 120;
const fieldHeight = 60;
const seatRadius = 5;

const canvasWidth = 1200;
const canvasHeight = 700;

function drawFacility(ctx, facility, selectedSeat, setSelectedSeat) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.save();

  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // Фон
  const bg = ctx.createRadialGradient(
    centerX,
    centerY,
    50,
    centerX,
    centerY,
    outerRadiusX
  );
  bg.addColorStop(0, "#f5f5f5");
  bg.addColorStop(1, "#e0e0e0");
  ctx.fillStyle = bg;
  ctx.fillRect(
    centerX - outerRadiusX - 50,
    centerY - outerRadiusY - 50,
    outerRadiusX * 2 + 100,
    outerRadiusY * 2 + 100
  );

  // Название сооружения
  ctx.fillStyle = "#222";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.fillText(facility.name || `Facility #${facility.fac_id}`, centerX, 40);

  const sectors = facility.sectors || [];
  const sectorCount = sectors.length;
  const sectorAngle = sectorCount ? (2 * Math.PI) / sectorCount : 0;

  sectors.forEach((sec, i) => {
    const angleStart = i * sectorAngle;
    const angleEnd = angleStart + sectorAngle;

    // Сектор
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.ellipse(
      centerX,
      centerY,
      outerRadiusX,
      outerRadiusY,
      0,
      angleStart,
      angleEnd
    );
    ctx.closePath();

    const grad = ctx.createLinearGradient(
      centerX + outerRadiusX * Math.cos(angleStart),
      centerY + outerRadiusY * Math.sin(angleStart),
      centerX + outerRadiusX * Math.cos(angleEnd),
      centerY + outerRadiusY * Math.sin(angleEnd)
    );
    grad.addColorStop(0, "rgba(144,202,249,0.1)");
    grad.addColorStop(1, "rgba(144,202,249,0.3)");
    ctx.fillStyle = grad;
    ctx.fill();

    // Границы сектора
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + outerRadiusX * Math.cos(angleStart),
      centerY + outerRadiusY * Math.sin(angleStart)
    );
    ctx.strokeStyle = "#b0bec5";
    ctx.lineWidth = 2;
    ctx.stroke();

    const rows = sec.rows || [];

    rows.forEach((row, ri) => {
      const t = (ri + 1) / (rows.length + 1);
      const rx = outerRadiusX * (1 - t * 0.8);
      const ry = outerRadiusY * (1 - t * 0.8);
      const seats = row.seats || [];

      seats.forEach((seat, si) => {
        const sCount = seats.length;
        const seatAngle = angleStart + ((si + 1) * sectorAngle) / (sCount + 1);
        const sx = centerX + rx * Math.cos(seatAngle);
        const sy = centerY + ry * Math.sin(seatAngle);

        // Тень
        ctx.beginPath();
        ctx.arc(sx, sy, seatRadius + 1, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fill();

        const isSelected =
          selectedSeat &&
          selectedSeat.facilityId === facility.fac_id &&
          selectedSeat.sectorId === sec.sector_id &&
          selectedSeat.rowId === row.row_id &&
          selectedSeat.seatId === seat.seat_id;

        // Сиденье
        ctx.beginPath();
        ctx.arc(sx, sy, seatRadius, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? "#ff7043" : "#64b5f6";
        ctx.strokeStyle = isSelected ? "#e64a19" : "#1976d2";
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.fill();
        ctx.stroke();

        seat._pos = { x: sx, y: sy };
      });
    });

    // Подпись сектора
    const labAng = angleStart + sectorAngle / 2;
    const lx = centerX + (outerRadiusX + 40) * Math.cos(labAng);
    const ly = centerY + (outerRadiusY + 40) * Math.sin(labAng);
    ctx.fillStyle = "#37474f";
    ctx.font = "16px bold Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(sec.name, lx, ly);
  });

  // Поле
  ctx.beginPath();
  ctx.rect(
    centerX - fieldWidth / 2,
    centerY - fieldHeight / 2,
    fieldWidth,
    fieldHeight
  );
  const fg = ctx.createLinearGradient(
    centerX - fieldWidth / 2,
    centerY,
    centerX + fieldWidth / 2,
    centerY
  );
  fg.addColorStop(0, "#81c784");
  fg.addColorStop(1, "#4caf50");
  ctx.fillStyle = fg;
  ctx.fill();
  ctx.strokeStyle = "#2e7d32";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Центральная линия
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - fieldHeight / 2);
  ctx.lineTo(centerX, centerY + fieldHeight / 2);
  ctx.stroke();

  // Внешняя граница
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, outerRadiusX, outerRadiusY, 0, 0, 2 * Math.PI);
  ctx.strokeStyle = "#546e7a";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.restore();
}

export default function MapPageAllFacilities() {
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const canvasRefs = useRef({}); // Объект refs по facilityId

  useEffect(() => {
    async function fetchAllData() {
      try {
        const resFacilities = await api.get("/facilities");
        const facilities = resFacilities.data;

        const facilitiesWithDetails = await Promise.all(
          facilities.map(async (facility) => {
            const resSectors = await api.get(
              `/facilities/${facility.fac_id}/sectors`
            );
            const sectors = resSectors.data;

            const sectorsWithRows = await Promise.all(
              sectors.map(async (sector) => {
                const resRows = await api.get(
                  `/sectors/${sector.sector_id}/rows`
                );
                const rows = resRows.data;

                const rowsWithSeats = await Promise.all(
                  rows.map(async (row) => {
                    const resSeats = await api.get(`/rows/${row.row_id}/seats`);
                    const seats = resSeats.data;
                    return { ...row, seats };
                  })
                );

                return { ...sector, rows: rowsWithSeats };
              })
            );

            return { ...facility, sectors: sectorsWithRows };
          })
        );

        setFacilitiesData(facilitiesWithDetails);
      } catch (err) {
        console.error("Ошибка загрузки данных сооружений:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  // Меморизация отрисовки для каждого сооружения
  useEffect(() => {
    facilitiesData.forEach((facility) => {
      const canvas = canvasRefs.current[facility.fac_id];
      if (!canvas) return;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      drawFacility(ctx, facility, selectedSeat, setSelectedSeat);
    });
  }, [facilitiesData, selectedSeat]);

  const handleClick = (facility, e) => {
    const canvas = canvasRefs.current[facility.fac_id];
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    outer: for (const sector of facility.sectors || []) {
      for (const row of sector.rows || []) {
        for (const seat of row.seats || []) {
          const p = seat._pos;
          if (p && Math.hypot(p.x - x, p.y - y) < seatRadius + 2) {
            setSelectedSeat({
              facilityId: facility.fac_id,
              sectorId: sector.sector_id,
              sectorName: sector.name,
              rowId: row.row_id,
              rowNumber: row.number,
              seatId: seat.seat_id,
              seatNumber: seat.number,
            });
            break outer;
          }
        }
      }
    }
  };

  if (loading) return <Box p={3}>Загрузка данных сооружений...</Box>;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={3}>
      {facilitiesData.map((facility) => (
        <Box key={facility.fac_id} mb={6} width={canvasWidth}>
          <canvas
            ref={(el) => (canvasRefs.current[facility.fac_id] = el)}
            style={{
              border: "2px solid #b0bec5",
              marginTop: 20,
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              cursor: "pointer",
              width: "100%",
              height: "auto",
            }}
            onClick={(e) => handleClick(facility, e)}
          />
          {selectedSeat && selectedSeat.facilityId === facility.fac_id && (
            <Box
              mt={2}
              p={2}
              fontSize={18}
              color="#37474f"
              bgcolor="#eceff1"
              borderRadius={4}
              boxShadow={1}
            >
              Вы выбрали: <strong>{selectedSeat.sectorName}</strong> (сооружение{" "}
              <strong>{selectedSeat.facilityId}</strong>), ряд{" "}
              <strong>{selectedSeat.rowNumber}</strong>, место{" "}
              <strong>{selectedSeat.seatNumber}</strong>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}
