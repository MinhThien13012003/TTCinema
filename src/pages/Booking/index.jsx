// Booking.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Divider,
  Stack,
  Paper,
  Container,
  CircularProgress,
} from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import { Payment } from "@mui/icons-material";
import axios from "../../service/axios";

const seatColors = {
  Thuong: {
    default: "#2196F3",
    selected: "#4CAF50",
    booked: "#757575",
    hover: "#1976D2",
  },
  VIP: {
    default: "#FF9800",
    selected: "#4CAF50",
    booked: "#757575",
    hover: "#F57C00",
  },
  Sweetbox: {
    default: "#E91E63",
    selected: "#4CAF50",
    booked: "#757575",
    hover: "#C2185B",
  },
};

const normalizeSeatNumber = (s) =>
  s.length === 3 ? s : s[0] + s.slice(1).padStart(2, "0");

const groupSeatsByRow = (seats, rows, columns) => {
  const rowsObj = {};
  for (let i = 0; i < rows; i++) {
    const rowLabel = String.fromCharCode(65 + i);
    rowsObj[rowLabel] = Array.from({ length: columns }, (_, colIndex) => {
      const seatNumber = `${rowLabel}${String(colIndex + 1).padStart(2, "0")}`;
      const seat = seats.find((s) => s.seatNumber === seatNumber);
      return seat || null; // ❗ Nếu không có dữ liệu thật, không tạo ghế
    }).filter(Boolean); // ❗ Loại bỏ null
  }
  return rowsObj;
};

const Booking = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const suatId = parseInt(id);

  const [showtime, setShowtime] = useState(state?.suatChieu || null);
  const [movie, setMovie] = useState(state?.movie || null);
  const [room, setRoom] = useState(state?.room || null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentSeats, setCurrentSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!showtime || !movie || !room) {
      const fetchShowtimeData = async () => {
        setLoading(true);
        try {
          const showtimeRes = await axios.get(`/api/showtimes`);
          const showtimeData = showtimeRes.data;
          setShowtime(showtimeData);

          const movieId = showtimeData.movieId?._id || showtimeData.movieId;
          if (movieId) {
            const movieRes = await axios.get(`/api/movies/${movieId}`);
            setMovie(movieRes.data);
          }

          const roomId = showtimeData.roomId?._id || showtimeData.roomId;
          if (roomId) {
            const roomRes = await axios.get(`/api/rooms/${roomId}`);
            setRoom(roomRes.data);
          }
        } catch (err) {
          setError(
            "Không tìm thấy thông tin suất chiếu, phim hoặc phòng chiếu."
          );
        } finally {
          setLoading(false);
        }
      };
      fetchShowtimeData();
    } else {
      console.log("Thông tin suất chiếu, phim và phòng đã được cung cấp.", {
        showtime,
        movie,
        room,
      });
      setLoading(false);
    }
  }, [showtime, movie, room, suatId]);

  useEffect(() => {
    if (room) {
      const fetchSeatsData = async () => {
        try {
          const seatsRes = await axios.get(`/api/seats`);
          const seatsData = seatsRes.data;

          const formattedSeats = seatsData
            .filter(
              (seat) =>
                seat.roomId &&
                (seat.roomId._id === room._id ||
                  seat.roomId.phong_id === room.phong_id) &&
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
                phong_id: seat.roomId?.phong_id || seat.roomId?._id,
                roomId: seat.roomId?._id,
                seatNumber: normalizeSeatNumber(seat.seatNumber),
              };
            });

          setCurrentSeats(formattedSeats);
          console.table(
            formattedSeats.map((s) => ({
              seatNumber: s.seatNumber,
              loai: s.loai,
              price: s.price,
            }))
          );
        } catch (err) {
          setError("Không thể tải dữ liệu ghế ngồi hoặc thông tin đặt vé.");
        }
      };

      fetchSeatsData();
    }
  }, [room, suatId]);

  const handleSelectSeat = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const getSeatStatus = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return "booked";
    if (selectedSeats.includes(seatNumber)) return "selected";
    return "available";
  };

  const getSeatColor = (seat) => {
    const seatType = seat.loai || "Thường";
    const status = getSeatStatus(seat.seatNumber);

    // Ưu tiên theo trạng thái
    if (status === "booked") return "#757575";
    if (status === "selected") return "#4CAF50";

    // Nếu chưa chọn hay đặt thì lấy theo loại ghế
    return seatColors[seatType]?.default || "#2196F3";
  };

  const total = selectedSeats.reduce((sum, seatNumber) => {
    const normalized = normalizeSeatNumber(seatNumber);
    const seat = currentSeats.find((s) => s.seatNumber === normalized);
    return seat ? sum + (seat.price || 0) : sum;
  }, 0);

  const groupedSeats = groupSeatsByRow(currentSeats, room.rows, room.columns);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (timeString) => timeString.slice(0, 5);

  const handlePayment = async () => {
    if (selectedSeats.length === 0) return;
    try {
      const bookingData = {
        suatChieuId: suatId,
        seats: selectedSeats.map((seatNumber) => {
          const normalized = normalizeSeatNumber(seatNumber);
          const seat = currentSeats.find((s) => s.seatNumber === normalized);
          return {
            ghe_id: seat.ghe_id,
            seatNumber,
            price: seat.price,
          };
        }),
        totalAmount: total,
      };
      const response = await axios.post("/api/bookings", bookingData);
      if (response.data) {
        console.log("Booking created successfully:", response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tạo booking:", error);
      setError("Có lỗi xảy ra khi đặt vé. Vui lòng thử lại.");
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
        {/* Khu vực chọn ghế */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, bgcolor: "#16213e", color: "#F8FAFC" }}>
            <Box mb={3}>
              <Typography variant="h5" fontWeight="bold">
                Chọn Ghế Ngồi
              </Typography>

              {/* Màn hình chiếu */}
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
                  mt: 2,
                }}
              >
                <Typography fontWeight="bold">MÀN HÌNH CHIẾU</Typography>
              </Box>

              {/* Danh sách ghế */}
              <Box
                sx={{
                  maxHeight: { xs: "unset", md: "600px" },
                  overflowY: "auto",
                }}
              >
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
                        {seats.filter(Boolean).map((seat) => (
                          <Box
                            key={seat.seatNumber}
                            onClick={() => handleSelectSeat(seat.seatNumber)}
                            sx={{
                              width: 35,
                              height: 35,
                              backgroundColor: getSeatColor(seat),
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              cursor:
                                getSeatStatus(seat.seatNumber) === "booked"
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
                                  getSeatStatus(seat.seatNumber) !== "booked"
                                    ? 0.8
                                    : 1,
                              },
                            }}
                          >
                            {seat.seatNumber.slice(1)}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
              </Box>

              {/* Chú thích */}
              <Box sx={{ mt: 3, display: "flex", gap: 3, flexWrap: "wrap" }}>
                {["Thường", "VIP", "Sweetbox", "Đang chọn"].map(
                  (label, idx) => (
                    <Box
                      key={label}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor:
                            Object.values(seatColors)[idx]?.default ||
                            "#4CAF50",
                          borderRadius: 1,
                        }}
                      />
                      <Typography variant="body2">{label}</Typography>
                    </Box>
                  )
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Thông tin đặt vé */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              bgcolor: "#16213e",
              color: "#F8FAFC",
              position: { md: "sticky" },
              top: { md: 20 },
              minHeight: "400px",
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="#FFB800">
              Thông Tin Đặt Vé
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              <Box>
                <Typography variant="body2">Phim</Typography>
                <Typography fontWeight="bold">{movie.title}</Typography>
              </Box>

              <Box>
                <Typography variant="body2">Rạp</Typography>
                <Typography>{room.name}</Typography>
              </Box>

              <Box>
                <Typography variant="body2">Suất chiếu</Typography>
                <Typography>
                  {formatTime(showtime.startTime)} - {formatDate(showtime.date)}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="body2" gutterBottom>
                  Ghế đã chọn ({selectedSeats.length})
                </Typography>
                {selectedSeats.length > 0 ? (
                  <Stack spacing={1}>
                    {selectedSeats.map((seatNumber) => {
                      const normalized = normalizeSeatNumber(seatNumber);
                      const seat = currentSeats.find(
                        (s) => s.seatNumber === normalized
                      );
                      return (
                        <Box
                          key={seatNumber}
                          display="flex"
                          justifyContent="space-between"
                        >
                          <Typography>
                            {seatNumber} ({seat?.loai})
                          </Typography>
                          <Typography fontWeight="bold">
                            {seat?.price?.toLocaleString()}đ
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                ) : (
                  <Typography fontStyle="italic">Chưa chọn ghế nào</Typography>
                )}
              </Box>

              <Divider />

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" color="#FFB800">
                  Tổng tiền:
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="#FFB800">
                  {total.toLocaleString("vi-VN")}đ
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                disabled={selectedSeats.length === 0}
                startIcon={<Payment />}
                onClick={handlePayment}
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  background:
                    selectedSeats.length > 0
                      ? "linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)"
                      : undefined,
                  "&:hover": {
                    background:
                      selectedSeats.length > 0
                        ? "linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)"
                        : undefined,
                  },
                }}
              >
                {selectedSeats.length > 0
                  ? "Tiếp tục thanh toán"
                  : "Vui lòng chọn ghế"}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Booking;
