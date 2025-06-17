import React from 'react'
import {
  Container,
  Box
} from '@mui/material';
import {
  LocalOfferOutlined,
  MovieOutlined,
  UpcomingOutlined
} from '@mui/icons-material';
import dayjs from 'dayjs';
import movieData from '../../utils/movieData';
import SliderSection from '../Home/MainContent/SliderSection';
const now = dayjs();

const currentMovies = movieData.filter(movie => {
  const start = dayjs(movie.ngay_cong_chieu, 'YYYY-MM-DD');
  const end = dayjs(movie.ngay_ket_thuc, 'YYYY-MM-DD');
  return start.isValid() && end.isValid() && start.isBefore(now) && end.isAfter(now);
});

const upcomingMovies = movieData.filter(movie => {
  const start = dayjs(movie.ngay_cong_chieu, 'YYYY-MM-DD');
  return start.isValid() && start.isAfter(now);
});

function Booking() {
  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: '#16213e' }}>
    <Box sx={{ 
          width: '90%', 
          maxWidth: '1200px',
          minHeight: '100%', // Đảm bảo chiều cao tối thiểu
        }}>
      <SliderSection 
        title="Phim Đang Chiếu" 
        icon={MovieOutlined}
        subtitle={`${currentMovies.length} bộ phim đang được chiếu tại rạp`}
        items={currentMovies} 
        type="movie" 
      />
      <SliderSection 
        title="Phim Sắp Chiếu" 
        icon={UpcomingOutlined}
        subtitle={`${upcomingMovies.length} bộ phim sắp ra mắt`}
        items={upcomingMovies} 
        type="movie" 
      />
      </Box>
      </Container>
  )
}

export default Booking