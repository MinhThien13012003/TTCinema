// components/ButtonGroupTrailerBooking.jsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const ButtonGroupTrailerBooking = ({ onWatchTrailer, onBookTicket,hideBookButton  }) => {
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
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, fontSize: '0.9rem' }}
        >
          Xem Trailer
        </Typography>
      </Box>

      {/* Đặt Vé */}
      {!hideBookButton && (
  <Button
    onClick={onBookTicket}
    variant="contained"
    sx={{
      backgroundColor: '#FACC15',
      color: '#000',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      px: 3,
      py: 1,
      borderRadius: 1,
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: '#eab308',
        boxShadow: 'none',
      },
    }}
  >
    ĐẶT VÉ
  </Button>
)}
    </Box>
  );
};

export default ButtonGroupTrailerBooking;
