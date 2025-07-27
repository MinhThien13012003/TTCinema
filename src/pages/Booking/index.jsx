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
  const [bookedSeats, setBookedSeats] = useState([]);
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
        // console.log("Raw seats data từ API:", res.data);
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
              _id: seat._id,
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
              color: seat.color || seatColors[seat.seatType]?.default || "#888",
            });
          }
        });
        // console.log("Danh sách ghế có thể dùng:", filteredSeats);
        // filteredSeats.forEach((seat) => {
        //   console.log({
        //     seatId: seat._id || seat.ghe_id, // nếu có cả 2 thì ưu tiên _id của MongoDB
        //     seatNumber: seat.seatNumber,
        //     roomId: seat.roomId,
        //     price: seat.price,
        //   });
        // });
        const uniqueSeatTypes = Array.from(seatTypeMap.values());
        setSeatTypes(uniqueSeatTypes);

        setShowtime(state.suatChieu);
        //console.log("Showtime hiện tại:", state.suatChieu);
        // //console.log(
        //   "Showtime ID dùng cho API:",
        //   state.suatChieu._id || state.suatChieu.suat_chieu_id
        // );
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
    const fetchTickets = async () => {
      try {
        const res = await axios.get("/api/tickets");
        const tickets = res.data;

        const booked = tickets
          .filter(
            (ticket) =>
              (ticket?.showtimeId?._id === showtime._id ||
                ticket?.showtimeId?.suat_chieu_id === showtime.suat_chieu_id) &&
              ticket?.status === "paid"
          )
          .map((ticket) => normalizeSeatNumber(ticket.seatId?.seatNumber));

        setBookedSeats(booked);
        console.log("Ghế đã thanh toán:", booked);
      } catch (err) {
        console.error("Lỗi khi tải vé:", err);
      }
    };

    fetchTickets();

    fetchSeats();
  }, [state, navigate]);
  const getSeatColor = (seat) => {
    const type = seat.seatType;
    const normalized = normalizeSeatNumber(seat.seatNumber);

    if (bookedSeats.includes(normalized)) {
      return "#9E9E9E"; // Màu xám cho ghế đã đặt
    }

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
    setSelectedSeats((prev) => {
      const updated = prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber];

      // Lấy ra thông tin của ghế vừa được chọn
      const seat = seats.find(
        (s) => s.seatNumber === normalizeSeatNumber(seatNumber)
      );

      if (seat && showtime) {
        const mockTicket = {
          ve_id: Math.floor(Math.random() * 1000000000), // hoặc tự điền số bất kỳ
          showtimeId: showtime._id || showtime.suat_chieu_id,
          seatId: seat?._id,
          price: seat.price,
        };
        console.log("Mẫu dữ liệu tạo vé:", mockTicket);
      }

      return updated;
    });
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
            getSeatStatus={(seatNumber) => {
              const normalized = normalizeSeatNumber(seatNumber);
              if (bookedSeats.includes(normalized)) return "booked";
              if (selectedSeats.includes(normalized)) return "selected";
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
