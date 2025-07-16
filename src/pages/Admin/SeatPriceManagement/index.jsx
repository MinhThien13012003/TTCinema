// src/components/SeatManager.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import SeatTypeTable from "./SeatTypeTable";
import SeatTable from "./SeatTable";
import axios from "../../../service/axios";
import RoomManagement from "../RoomManagement";
const SeatManager = () => {
  const [seatTypes, setSeatTypes] = useState([]);
  const [seats, setSeats] = useState([]);

  const fetchSeatTypes = async () => {
    const res = await axios.get("/api/seat-types");
    console.log("Seat Types:", res.data);
    setSeatTypes(res.data);
  };

  const fetchSeats = async () => {
    const res = await axios.get("/api/seats");
    console.log("ghế:", res.data);
    setSeats(res.data);
  };

  useEffect(() => {
    fetchSeatTypes();
    fetchSeats();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Quản lý Ghế và Loại Ghế
      </Typography>

      <SeatTypeTable seatTypes={seatTypes} onRefresh={fetchSeatTypes} />

      <Divider sx={{ my: 4 }} />

      <RoomManagement seatTypes={seatTypes} />
    </Box>
  );
};

export default SeatManager;
