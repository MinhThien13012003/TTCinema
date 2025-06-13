import {
  LocalOfferOutlined,
  MovieOutlined,
  UpcomingOutlined
} from '@mui/icons-material';
import {
  Container
} from '@mui/material';
import dayjs from 'dayjs';
import movieData from '../../../utils/movieData';
import promotionData from '../../../utils/promotionData';
import SliderSection from './SliderSection';


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

const activePromotions = promotionData.filter(promo =>
  dayjs(promo.start_date).isBefore(now) &&
  dayjs(promo.end_date).isAfter(now)
);


const MainContent = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: '#16213e' }}>
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
      <SliderSection 
        title="Khuyến Mãi Đang Diễn Ra" 
        icon={LocalOfferOutlined}
        subtitle={`${activePromotions.length} ưu đ��i hấp dẫn dành cho bạn`}
        items={activePromotions} 
        type="promotion" 
      />
    </Container>
  );
};

export default MainContent;