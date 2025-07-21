import React from "react";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const BookingConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { movie, showtime, room, selectedSeats, total } = location.state || {};

  if (!movie || !showtime || !room || !selectedSeats) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">
          Không tìm thấy thông tin đặt vé.
        </Typography>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </Box>
    );
  }

  return (
    <Box p={4} maxWidth={600} mx="auto">
      <Typography variant="h4" gutterBottom>
        Xác Nhận Thanh Toán
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6"> Thông tin phim</Typography>
        <List>
          <ListItem>
            <ListItemText primary="Tên phim" secondary={movie.title} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Ngày chiếu" secondary={showtime.date} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Suất chiếu"
              secondary={`${showtime.startTime} - ${showtime.endTime}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Phòng" secondary={room.name} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Ghế đã chọn"
              secondary={selectedSeats.join(", ")}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Tổng tiền"
              secondary={total.toLocaleString("vi-VN")} // format tiền
            />
          </ListItem>
        </List>
      </Paper>

      <Box textAlign="center">
        <Button
          variant="movie"
          size="large"
          sx={{ px: 5 }}
          onClick={() => {
            alert("Chức năng thanh toán VNPay chưa được tích hợp!");
            // Sau này thay bằng gọi API tạo URL thanh toán
          }}
        >
          Thanh Toán VNPay
        </Button>
      </Box>
    </Box>
  );
};

export default BookingConfirm;
