// src/components/SeatManager.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import SeatTypeTable from "./SeatTypeTable";
import SeatTable from "./SeatTable";
import axios from "../../../service/axios";
import RoomManagement from "../RoomManagement";
const SeatManager = () => {
  const [seatTypes, setSeatTypes] = useState([]);
  const [seats, setSeats] = useState([]);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const fetchSeatTypes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/seat-types");
      setSeatTypes(res.data);
    } catch (err) {
      console.error("Lỗi lấy loại ghế:", err);
      setAlert({
        open: true,
        type: "error",
        message: "Lỗi khi tải loại ghế",
      });
    }
    setLoading(false);
  };

  const fetchSeats = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/seats");
      setSeats(res.data);
    } catch (err) {
      console.error("Lỗi lấy ghế:", err);
      setAlert({
        open: true,
        type: "error",
        message: "Lỗi khi tải ghế",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSeatTypes();
    fetchSeats();
  }, []);

  return (
    <Box p={4} sx={{ position: "relative" }}>
      <Backdrop open={loading} sx={{ zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
        Quản lý Ghế và Loại Ghế
      </Typography>
      {loading && (
        <Box mt={2}>
          <Skeleton variant="rectangular" width="100%" height={40} />
          <Skeleton variant="text" width="60%" />
        </Box>
      )}

      <SeatTypeTable
        seatTypes={seatTypes}
        onRefresh={fetchSeatTypes}
        loading={loading}
      />

      <Divider sx={{ my: 4 }} />

      <RoomManagement seatTypes={seatTypes} loading={loading} />

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={alert.type}
          variant="filled"
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SeatManager;
