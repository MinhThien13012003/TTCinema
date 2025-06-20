// components/ButtonGroupTrailerBooking.jsx
import React, { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const ButtonGroupTrailerBooking = ({ onWatchTrailer, onBookTicket, hideBookButton, isUpcoming }) => {
  useEffect(() => {
    if (isUpcoming && typeof hideBookButton === 'function') {
      hideBookButton();
    }
  }, [isUpcoming, hideBookButton]);

  const shouldHide = typeof hideBookButton === 'function' ? hideBookButton() : false;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
      {/* Xem Trailer */}
      <Box
        onClick={onWatchTrailer}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          color: '#FFFFFF',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        <PlayCircleIcon sx={{ fontSize: 20, color: '#F43F5E' }} />
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
          Xem Trailer
        </Typography>
      </Box>

      {/* Nút Đặt Vé (nếu không phải phim sắp chiếu và không bị ẩn) */}
      {!isUpcoming && !shouldHide && (
        <Button
          onClick={onBookTicket}
          variant="movie"
          sx={{
            fontWeight: 'bold',
            fontSize: '0.9rem',
            px: 3,
            py: 1,
            borderRadius: 1,
            boxShadow: 'none',
          }}
        >
          ĐẶT VÉ
        </Button>
      )}

      {/* Nút Tìm Hiểu Thêm (nếu là phim sắp chiếu) */}
      {isUpcoming && !shouldHide && (
        <Button
          onClick={onBookTicket} // dùng chung callback đi tới trang mô tả
          variant="movie"
          sx={{
            fontWeight: 'bold',
            fontSize: '0.9rem',
            px: 3,
            py: 1,
            borderRadius: 1,
          }}
        >
          TÌM HIỂU THÊM
        </Button>
      )}
    </Box>
  );
};

export default ButtonGroupTrailerBooking;
