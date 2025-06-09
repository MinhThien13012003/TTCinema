import React from 'react';
import { Box, Button, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import { CalendarTodayOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';

const MovieCard = ({ movie, isUpcoming = false }) => {
  return (
    <Card 
      sx={{ 
        minWidth: '280px',
        maxWidth: '280px',
        height: '450px',
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(255,184,0,0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        mr: 2,
        '&:hover': {
          transform: 'translateY(-4px) scale(1.0)',
           boxShadow: '0 20px 40px rgba(74, 95, 217, 0.3)',
          border: '1px solid rgba(74, 95, 217, 1)',
          '& .movie-overlay': {
            opacity: 1,
          }
        },
        boxShadow: '0 8px 2px rgba(0,0,0,0.2)',
      }}
    >
      {movie.image && (
        <Box sx={{ position: 'relative', overflow: 'hidden', height: '320px' }}>
          <CardMedia
            component="img"
            height="320"
            image={movie.image}
            alt={movie.ten_phim}
            sx={{ 
              transition: 'transform 0.3s ease',
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }}
          />
          <Box
            className="movie-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              display: 'flex',
              alignItems: 'flex-end',
              p: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#FFB800',
                color: '#F8FAFC',
                fontWeight: 'bold',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  backgroundColor: '#E6A600',
                }
              }}
            >
              MUA VÉ
            </Button>
          </Box>
          <Chip
            label={isUpcoming ? 'Sắp chiếu' : 'Đang chiếu'}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontWeight: 600,
              borderRadius: 2,
              backgroundColor: isUpcoming ? '#F59E0B' : '#10B981',
              color: '#FFFFFF'
            }}
          />
        </Box>
      )}
      <CardContent sx={{ 
        p: 2, 
        bgcolor:'#1a1a2e', 
        height: '130px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        flex: 1
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            sx={{ 
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: '#F8FAFC',
              fontSize: '1rem'
            }}
          >
            {movie.ten_phim}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#94A3B8',
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
              fontSize: '0.85rem'
            }}
          >
            {movie.mo_ta}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
          <CalendarTodayOutlined sx={{ fontSize: 14, color: '#94A3B8' }} />
          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
            {isUpcoming 
              ? `${dayjs(movie.ngay_cong_chieu).format('DD.MM.YYYY')}`
              : `Đến ${dayjs(movie.ngay_ket_thuc).format('DD.MM.YYYY')}`
            }
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
