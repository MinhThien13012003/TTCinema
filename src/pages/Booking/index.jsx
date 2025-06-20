// Booking.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Chip,
  Card,
  CardContent,
  Divider,
  Stack,
  Paper,
  Container
} from '@mui/material';
import { useParams } from 'react-router-dom';
import {
  EventSeat,
  Movie,
  Schedule,
  CalendarToday,
  Room,
  Payment
} from '@mui/icons-material';

import seatData from '../../utils/seatData';
import showtimesData from '../../utils/showtimesData';
import roomData from '../../utils/roomData';
import movieData from '../../utils/movieData';
import bookingData from '../../utils/bookingData';

const prices = {
  Thuong: 60000,
  VIP: 90000,
  Sweetbox: 120000
};

const seatColors = {
  Thuong: { 
    default: '#2196F3', 
    selected: '#4CAF50', 
    booked: '#757575',
    hover: '#1976D2'
  },
  VIP: { 
    default: '#FF9800', 
    selected: '#4CAF50', 
    booked: '#757575',
    hover: '#F57C00'
  },
  Sweetbox: { 
    default: '#E91E63', 
    selected: '#4CAF50', 
    booked: '#757575',
    hover: '#C2185B'
  }
};

const groupSeatsByRow = (seats) => {
  const rows = {};

  seats.forEach(seat => {
    const row = seat.hang;
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });

  // Sắp xếp ghế trong từng hàng theo số thứ tự
  Object.values(rows).forEach(seatList => {
    seatList.sort((a, b) => {
      const numA = parseInt(a.so_ghe.slice(1));
      const numB = parseInt(b.so_ghe.slice(1));
      return numA - numB;
    });
  });

  return rows;
};

const Booking = () => {
  const { id } = useParams();
  const suatId = parseInt(id);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentSeats, setCurrentSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  const showtime = showtimesData.find(s => s.suat_id === suatId);
  const room = roomData.find(r => r.phong_id === showtime?.phong_id);
  const movie = movieData.find(m => m.phim_id === showtime?.phim_id);
  
  useEffect(() => {
    if (room) {
      const filtered = seatData.filter(seat => seat.phong_id === room.phong_id);
      setCurrentSeats(filtered);
      
      // Lấy ghế đã được đặt cho suất chiếu này
      const booked = bookingData
        .filter(booking => booking.suat_id === suatId && booking.trang_thai === 'confirmed')
        .map(booking => {
          const seat = filtered.find(s => s.ghe_id === booking.ghe_id);
          return seat?.so_ghe;
        })
        .filter(Boolean);
      
      setBookedSeats(booked);
    }
  }, [room, suatId]);

  const handleSelectSeat = (so_ghe) => {
    if (bookedSeats.includes(so_ghe)) return; // Không cho chọn ghế đã đặt
    
    setSelectedSeats(prev =>
      prev.includes(so_ghe)
        ? prev.filter(g => g !== so_ghe)
        : [...prev, so_ghe]
    );
  };

  const getSeatStatus = (so_ghe) => {
    if (bookedSeats.includes(so_ghe)) return 'booked';
    if (selectedSeats.includes(so_ghe)) return 'selected';
    return 'available';
  };

  const getSeatColor = (seat) => {
    const status = getSeatStatus(seat.so_ghe);
    return seatColors[seat.loai][status] || seatColors[seat.loai].default;
  };

  const total = selectedSeats.reduce((sum, gheSo) => {
    const seat = currentSeats.find(s => s.so_ghe === gheSo);
    return seat ? sum + prices[seat.loai] : sum;
  }, 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString.slice(0, 5); // Lấy HH:MM
  };

  console.log('movie: ', movie)
  console.log('room',room)
  console.log('showtime', showtime)
  if (!room || !showtime || !movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error" textAlign="center">
          Không tìm thấy thông tin suất chiếu hoặc phòng chiếu.
        </Typography>
      </Container>
    );
  }

  const groupedSeats = groupSeatsByRow(currentSeats);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>


      <Grid container spacing={4}>
        {/* Khu vực chọn ghế */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, bgcolor: '#16213e', color: '#F8FAFC' }}>
            <Box mb={3}>
              <Typography variant="h5" gutterBottom fontWeight="bold" color="#F8FAFC">
                Chọn Ghế Ngồi
              </Typography>
              
              {/* Chú thích loại ghế */}
              <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box 
                    width={24} 
                    height={24} 
                    bgcolor={seatColors.Thuong.default} 
                    borderRadius="4px"
                  />
                  <Typography variant="body2">Ghế Thường ({prices.Thuong.toLocaleString()}đ)</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1}>
                  <Box 
                    width={24} 
                    height={24} 
                    bgcolor={seatColors.VIP.default} 
                    borderRadius="4px"
                  />
                  <Typography variant="body2">Ghế VIP ({prices.VIP.toLocaleString()}đ)</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1}>
                  <Box 
                    width={24} 
                    height={24} 
                    bgcolor={seatColors.Sweetbox.default} 
                    borderRadius="4px"
                  />
                  <Typography variant="body2">Ghế Đôi ({prices.Sweetbox.toLocaleString()}đ)</Typography>
                </Box>
              </Stack>

              {/* Chú thích trạng thái ghế */}
              <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box 
                    width={24} 
                    height={24} 
                    bgcolor="#4CAF50" 
                    borderRadius="4px"
                  />
                  <Typography variant="body2">Ghế đang chọn</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1}>
                  <Box 
                    width={24} 
                    height={24} 
                    bgcolor="#757575" 
                    borderRadius="4px"
                  />
                  <Typography variant="body2">Ghế đã bán</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1}>
                  <EventSeat sx={{ color: '#2196F3', fontSize: 24 }} />
                  <Typography variant="body2">Ghế trống</Typography>
                </Box>
              </Stack>
            </Box>

            {/* Màn hình chiếu */}
            <Box display="flex" justifyContent="center" mb={4}>
              <Paper 
                elevation={3}
                sx={{ 
                  width: "80%", 
                  background: 'linear-gradient(45deg, #333 0%, #666 100%)',
                  textAlign: "center", 
                  py: 2, 
                  borderRadius: 2,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: '10%',
                    right: '10%',
                    height: 10,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)',
                    borderRadius: '0 0 50% 50%'
                  }
                }}
              >
                <Typography variant="h6" color="white" fontWeight="bold">
                  MÀN HÌNH CHIẾU
                </Typography>
              </Paper>
            </Box>

            {/* Hiển thị ghế theo từng hàng */}
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              {Object.entries(groupedSeats)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([row, seats]) => (
                <Box key={row} display="flex" gap={1} alignItems="center">
                  <Typography 
                    variant="body1" 
                    fontWeight="bold" 
                    sx={{ minWidth: 30, textAlign: 'center' }}
                  >
                    {row}
                  </Typography>
                  
                  {seats.map(seat => {
                    const status = getSeatStatus(seat.so_ghe);
                    const isBooked = status === 'booked';
                    const isSelected = status === 'selected';
                    
                    return (
                      <Chip
                        key={seat.ghe_id}
                        label={seat.so_ghe.slice(1)} // Chỉ hiển thị số
                        onClick={() => handleSelectSeat(seat.so_ghe)}
                        disabled={isBooked}
                        sx={{
                          minWidth: 48,
                          height: 48,
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          bgcolor: getSeatColor(seat),
                          color: 'white',
                          cursor: isBooked ? 'not-allowed' : 'pointer',
                          '&:hover': {
                            bgcolor: isBooked ? getSeatColor(seat) : seatColors[seat.loai].hover,
                            transform: isBooked ? 'none' : 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease',
                          '&.Mui-disabled': {
                            bgcolor: getSeatColor(seat),
                            color: 'white',
                            opacity: 0.7
                          }
                        }}
                      />
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Thông tin đặt vé */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, bgcolor: '#16213e', position: 'sticky', top: 20, color: '#F8FAFC' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="#FFB800">
              Thông Tin Đặt Vé
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" >Phim</Typography>
                <Typography variant="body1" fontWeight="bold">{movie.ten_phim}</Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" >Rạp</Typography>
                <Typography variant="body1">{room.ten_phong}</Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" >Suất chiếu</Typography>
                <Typography variant="body1">
                  {formatTime(showtime.gio_bat_dau)} - {formatDate(showtime.ngay_chieu)}
                </Typography>
              </Box>
              
              <Divider />
              
              <Box>
                <Typography variant="body2"  gutterBottom>
                  Ghế đã chọn ({selectedSeats.length})
                </Typography>
                {selectedSeats.length > 0 ? (
                  <Stack spacing={1}>
                    {selectedSeats.map(seatCode => {
                      const seat = currentSeats.find(s => s.so_ghe === seatCode);
                      return (
                        <Box key={seatCode} display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body1">
                            {seatCode} ({seat?.loai})
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {prices[seat?.loai]?.toLocaleString()}đ
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                ) : (
                  <Typography variant="body2"  fontStyle="italic">
                    Chưa chọn ghế nào
                  </Typography>
                )}
              </Box>
              
              <Divider />
              
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" color="#FFB800">Tổng tiền:</Typography>
                  <Typography variant="h5" fontWeight="bold" color="#FFB800">
                    {total.toLocaleString('vi-VN')}đ
                  </Typography>
                </Box>
              </Box>
              
              <Button
                variant="movie"
                size="large"
                fullWidth
                disabled={selectedSeats.length === 0}
                startIcon={<Payment />}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: selectedSeats.length > 0 
                    ? 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)'
                    : undefined,
                  '&:hover': {
                    background: selectedSeats.length > 0 
                      ? 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)'
                      : undefined,
                  }
                }}
              >
                {selectedSeats.length > 0 ? 'Tiếp tục thanh toán' : 'Vui lòng chọn ghế'}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Booking;