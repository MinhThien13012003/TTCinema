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
import { useAuthStore } from "../../store/authStore";
import useBookingStore from "../../store/bookingStore";

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
  //const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seatTypes, setSeatTypes] = useState([]);
  const [disabledSeats, setDisabledSeats] = useState([]);

  const {
    selectedSeats,
    setSelectedSeats,
    setShowtimeId,
    orderId,
    setOrderId,
  } = useBookingStore();

  useEffect(() => {
    if (!state?.suatChieu || !state?.movie || !state?.room) {
      navigate("/");
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
            const seatType = seat.seatTypeId || {};
            return {
              _id: seat._id,
              ghe_id: seat.ghe_id,
              so_ghe: seat.seatNumber,
              hang: seat.row,
              row: seat.row,
              seatType: seatType.name || "Không rõ",
              price: seatType.price || 0,
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
              color: seat.color || "#888",
            });
          }
        });

        setSeatTypes(Array.from(seatTypeMap.values()));
        setSeats(filteredSeats);
      } catch (err) {
        console.error("❌ Không thể tải danh sách ghế:", err);
        setError("Không thể tải danh sách ghế.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [state]);
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const res = await axios.get(
          `/api/tickets/booked-seats/${showtime._id}`
        );

        if (res.data?.bookedSeatIds) {
          setDisabledSeats(res.data.bookedSeatIds);
        } else {
          console.warn(
            " Không tìm thấy bookedSeatIds trong response:",
            res.data
          );
        }
      } catch (err) {
        console.error(" Lỗi khi tải ghế đã đặt:", err);
      }
    };

    if (showtime?._id) {
      fetchBookedSeats();
    }
  }, [showtime]);

  const getSeatColor = (seat) => {
    const type = seat.seatType;
    const normalized = normalizeSeatNumber(seat.seatNumber);

    if (disabledSeats.includes(seat._id)) return "#999"; // xám hoặc bất kỳ màu nào cho 'booked'

    const selected = selectedSeats.includes(normalized);
    return selected
      ? seatColors[type]?.selected || "#4CAF50"
      : seat.color || seatColors[type]?.default || "#888";
  };
  // const handleSelectSeat = (seatNumber) => {
  //   setSelectedSeats((prev) =>
  //     prev.includes(seatNumber)
  //       ? prev.filter((s) => s !== seatNumber)
  //       : [...prev, seatNumber]
  //   );
  // };
  const handleSelectSeat = (seatNumber) => {
    const updated = selectedSeats.includes(seatNumber)
      ? selectedSeats.filter((s) => s !== seatNumber)
      : [...selectedSeats, seatNumber];
    setSelectedSeats(updated);
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

  const handlePayment = async () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return alert("Bạn cần đăng nhập để đặt vé.");
    if (selectedSeats.length === 0) return alert("Vui lòng chọn ghế.");

    try {
      const veId = Date.now();

      const selectedSeatObjects = selectedSeats
        .map((seatNumber) => seats.find((s) => s.seatNumber === seatNumber))
        .filter(Boolean);

      const seatIds = selectedSeatObjects.map((s) => s._id);
      const totalAmount = selectedSeatObjects.reduce(
        (sum, seat) => sum + (seat.price || 0),
        0
      );

      // Lưu tạm để sau thanh toán dùng
      setShowtimeId(showtime._id);

      // ✅ Bước 1: Tạo vé (BE sẽ tạo cả đơn hàng bên trong)
      const ticketRes = await axios.post("/api/tickets/book", {
        ve_id: veId,
        showtimeId: showtime._id,
        seatIds,
        price: totalAmount,
      });

      const { order } = ticketRes.data;
      const dhId = order?.dh_id;
      if (!dhId) throw new Error("Không có dh_id trong phản hồi tạo vé");

      setOrderId(dhId);

      const resVNPay = await axios.post("/api/vnpay/create_payment", {
        idOrder: dhId,
      });

      const vnpayUrl = resVNPay.data?.data?.vnpayUrl;
      if (!vnpayUrl) throw new Error("Không có link VNPay");

      window.location.href = vnpayUrl;
    } catch (err) {
      console.error(" Lỗi thanh toán:", err);
      alert("Thanh toán thất bại");
    }
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
            getSeatStatus={(seat) => {
              if (disabledSeats.includes(seat._id?.toString())) return "booked";
              if (selectedSeats.includes(seat.seatNumber)) return "selected";
              return "available";
            }}
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
