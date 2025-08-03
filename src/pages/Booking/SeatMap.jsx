// components/Booking/SeatMap.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

const SeatMap = ({
  groupedSeats,
  handleSelectSeat,
  getSeatColor,
  getSeatStatus,
}) => {
  return (
    <Box sx={{ maxHeight: "600px", overflowY: "auto" }}>
      {Object.entries(groupedSeats)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([row, seats]) => (
          <Box key={row} sx={{ display: "flex", mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                minWidth: 30,
                textAlign: "center",
                mr: 2,
                color: "#FFB800",
              }}
            >
              {row}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {seats.map((seat, index) =>
                seat ? (
                  <Box
                    key={seat.seatNumber}
                    onClick={() => {
                      if (getSeatStatus(seat) !== "booked") {
                        handleSelectSeat(seat.seatNumber);
                      }
                    }}
                    sx={{
                      width: 35,
                      height: 35,
                      backgroundColor: getSeatColor(seat),
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor:
                        getSeatStatus(seat) === "booked"
                          ? "not-allowed"
                          : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#fff",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform:
                          getSeatStatus(seat.seatNumber) !== "booked"
                            ? "scale(1.1)"
                            : "none",
                        opacity:
                          getSeatStatus(seat.seatNumber) !== "booked" ? 0.8 : 1,
                      },
                    }}
                  >
                    {seat.seatNumber.slice(1)}
                  </Box>
                ) : (
                  <Box
                    key={`empty-${index}`}
                    sx={{
                      width: 35,
                      height: 35,
                      backgroundColor: "transparent",
                      border: "1px dashed #ccc",
                      borderRadius: "4px",
                      opacity: 0.3,
                    }}
                  />
                )
              )}
            </Box>
          </Box>
        ))}
    </Box>
  );
};

export default SeatMap;
