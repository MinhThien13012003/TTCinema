// components/Booking/BookingSummary.jsx
import React from "react";
import { Box, Typography, Divider, Stack, Button } from "@mui/material";
import { Payment } from "@mui/icons-material";

const BookingSummary = ({
  movie,
  room,
  showtime,
  selectedSeats,
  currentSeats,
  total,
  handlePayment,
}) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (timeString) => timeString?.slice(0, 5);

  return (
    <Box
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
                const seat = currentSeats.find(
                  (s) => s.seatNumber === seatNumber
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

        <Box display="flex" justifyContent="space-between" alignItems="center">
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
    </Box>
  );
};

export default BookingSummary;
