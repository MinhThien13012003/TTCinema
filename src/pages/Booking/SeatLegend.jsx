// components/Booking/SeatLegend.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

const SeatLegend = ({ seatTypes = [] }) => {
  const legends = [...seatTypes, { label: "Đang chọn", color: "#4CAF50" }];

  return (
    <Box
      sx={{
        mt: 3,
        display: "flex",
        gap: 3,
        flexWrap: "wrap",
        color: "#F8FAFC",
      }}
    >
      {legends.map((legend) => (
        <Box
          key={legend.label}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: legend.color,
              borderRadius: 1,
            }}
          />
          <Typography variant="body2">{legend.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default SeatLegend;
