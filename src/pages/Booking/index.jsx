import React, { useEffect, useState } from "react";
import {
  Container,
  CircularProgress,
  Grid,
  Typography,
  Box,
  colors,
} from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../../service/axios";

import SeatMap from "./SeatMap";
import SeatLegend from "./SeatLegend";
import BookingSummary from "./BookingSummary";

const seatColors = {
  Thuong: { default: "#2196F3", selected: "#4CAF50" },
  VIP: { default: "#FF9800", selected: "#4CAF50" },
  Sweetbox: { default: "#E91E63", selected: "#4CAF50" },
};

const normalizeSeatNumber = (s) =>
  s.length === 3 ? s : s[0] + s.slice(1).padStart(2, "0");

const groupSeatsByRow = (seats, rows, columns) => {
  const grouped = {};
  for (let i = 0; i < rows; i++) {
    const rowChar = String.fromCharCode(65 + i);
    grouped[rowChar] = Array.from({ length: columns }, (_, idx) => {
      const num = String(idx + 1).padStart(2, "0");
      const seatNum = `${rowChar}${num}`;
      return seats.find((s) => s.seatNumber === seatNum) || null;
    });
  }
  return grouped;
};

const Booking = () => {
  const { id } = useParams();
  const suatId = parseInt(id);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [showtime, setShowtime] = useState(state?.suatChieu || null);
  const [movie, setMovie] = useState(state?.movie || null);
  const [room, setRoom] = useState(state?.room || null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seatTypes, setSeatTypes] = useState([]);

  useEffect(() => {
    // Nếu user truy cập trực tiếp mà không có state
    if (!state?.suatChieu || !state?.movie || !state?.room) {
      navigate("/"); // hoặc navigate(-1);
      return;
    }

    const fetchSeats = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/seats");

        const filteredSeats = res.data
          .filter(
            (seat) =>
              seat.roomId &&
              (seat.roomId._id === state.room._id ||
                seat.roomId.phong_id === state.room.phong_id) &&
              seat.seatTypeId
          )
          .map((seat) => {
            const seatType =
              typeof seat.seatTypeId === "object"
                ? seat.seatTypeId
                : { name: "Không xác định", price: 0 };
            return {
              ghe_id: seat.ghe_id,
              so_ghe: seat.seatNumber,
              hang: seat.row,
              row: seat.row,
              loai: seatType.name,
              seatType: seatType.name,
              price: seatType.price,
              color: seatType.color,
              phong_id: seat.roomId?.phong_id || seat.roomId?._id,
              roomId: seat.roomId?._id,
              seatNumber: normalizeSeatNumber(seat.seatNumber),
            };
          });
        const seatTypeMap = new Map();
        filteredSeats.forEach((seat) => {
          const key = seat.seatType;
          if (!seatTypeMap.has(key)) {
            seatTypeMap.set(key, {
              label: seat.seatType,
              color: seat.color || seatColors[seat.seatType]?.default || "#888", // ✅ dùng color từ seat
            });
          }
        });
        const uniqueSeatTypes = Array.from(seatTypeMap.values());
        setSeatTypes(uniqueSeatTypes);

        setShowtime(state.suatChieu);
        setMovie(state.movie);
        setRoom(state.room);
        setSeats(filteredSeats);
      } catch (err) {
        setError("Không thể tải danh sách ghế.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [state, navigate]);
  const getSeatColor = (seat) => {
    const type = seat.seatType;
    const selected = selectedSeats.includes(seat.seatNumber);
    return selected
      ? seatColors[type]?.selected || "#4CAF50"
      : seat.color || seatColors[type]?.default || "#888";
  };
  const handleSelectSeat = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const total = selectedSeats.reduce((sum, seatNumber) => {
    const seat = seats.find(
      (s) => s.seatNumber === normalizeSeatNumber(seatNumber)
    );
    return seat ? sum + (seat.price || 0) : sum;
  }, 0);

  const groupedSeats =
    room?.rows && room?.columns
      ? groupSeatsByRow(seats, room.rows, room.columns)
      : {};

  const handlePayment = () => {
    navigate("/booking/confirm", {
      state: {
        movie,
        showtime,
        room,
        selectedSeats,
        currentSeats: seats, // để dùng cho tạo vé
        total,
      },
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress color="primary" />
      </Container>
    );
  }

  if (error || !room || !showtime || !movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error" textAlign="center">
          {error || "Không tìm thấy thông tin suất chiếu hoặc phòng chiếu."}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4} alignItems="flex-start">
        <Grid item xs={12} lg={8}>
          <Typography variant="h5" fontWeight="bold" mb={2} color="#F8FAFC">
            Chọn Ghế Ngồi
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: "30px",
              backgroundColor: "#FFB800",
              borderRadius: "15px 15px 0 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Typography fontWeight="bold">MÀN HÌNH CHIẾU</Typography>
          </Box>

          <SeatMap
            groupedSeats={groupedSeats}
            handleSelectSeat={handleSelectSeat}
            getSeatColor={(seat) => getSeatColor(seat, selectedSeats)}
            getSeatStatus={(seatNumber) =>
              selectedSeats.includes(seatNumber) ? "selected" : "available"
            }
          />

          <SeatLegend seatTypes={seatTypes} />
        </Grid>

        <Grid item xs={12} md={4}>
          <BookingSummary
            movie={movie}
            room={room}
            showtime={showtime}
            selectedSeats={selectedSeats}
            currentSeats={seats}
            total={total}
            handlePayment={handlePayment}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Booking;
