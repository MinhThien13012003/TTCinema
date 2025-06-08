import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip,
  Container,
  Paper,
  Fade,
  alpha
} from '@mui/material';
import { 
  MovieOutlined, 
  UpcomingOutlined, 
  LocalOfferOutlined,
  CalendarTodayOutlined,
  StarOutlined
} from '@mui/icons-material';
import movieData from '../../../utils/movieData';
import promotionData from '../../../utils/promotionData';
import dayjs from 'dayjs';

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

const MovieCard = ({ movie, isUpcoming = false }) => {
  return (
    <Fade in timeout={600}>
      <Card 
        sx={{ 
          height: '100%',
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: 12,
            '& .movie-overlay': {
              opacity: 1,
            }
          },
          boxShadow: 4,
        }}
      >
        {movie.image && (
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="300"
              image={movie.image}
              alt={movie.ten_phim}
              sx={{ 
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
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
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                alignItems: 'flex-end',
                p: 2,
              }}
            >
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
        <CardContent sx={{ p: 2.5 ,
              bgcolor:'#1a1a2e' }}>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            sx={{ 
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: '#F8FAFC'
            }}
          >
            {movie.ten_phim}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#94A3B8',
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4
            }}
          >
            {movie.mo_ta}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayOutlined sx={{ fontSize: 16, color: '#94A3B8' }} />
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              {isUpcoming 
                ? `Khởi chiếu: ${dayjs(movie.ngay_cong_chieu).format('DD/MM/YYYY')}`
                : `Đến: ${dayjs(movie.ngay_ket_thuc).format('DD/MM/YYYY')}`
              }
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

const PromotionCard = ({ promotion }) => {
  return (
    <Fade in timeout={800}>
      <Card 
        sx={{ 
          height: '100%',
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(255,184,0,0.1) 0%, rgba(74,95,217,0.1) 100%)',
          border: '1px solid rgba(255,184,0,0.2)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          bgcolor: '#1a1a2e',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 8,
            border: '1px solid rgba(74, 95, 217, 1)',
          },
        }}
      >
        {promotion.image && (
          <CardMedia
            component="img"
            height="160"
            image={promotion.image}
            alt={promotion.promo_name}
            sx={{ borderRadius: '12px 12px 0 0' }}
          />
        )}
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LocalOfferOutlined sx={{ fontSize: 20, color: '#FFB800' }} />
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#FFB800' }}>
              {promotion.promo_name}
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ color: '#94A3B8', mb: 2, lineHeight: 1.5 }}
          >
            {promotion.description}
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              backgroundColor: 'rgba(239,68,68,0.1)',
              borderRadius: 2,
              border: '1px dashed #EF4444',
            }}
          >
            <Typography 
              variant="body2" 
              fontWeight="bold"
              sx={{ 
                color: '#EF4444',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              🎟️ Mã: {promotion.promo_code}
            </Typography>
            <Typography 
              variant="h6" 
              fontWeight="bold"
              sx={{ 
                color: '#EF4444',
                textAlign: 'center',
                mt: 0.5
              }}
            >
              Giảm {promotion.discount_percentage}%
            </Typography>
          </Paper>
        </CardContent>
      </Card>
    </Fade>
  );
};

const SectionHeader = ({ title, icon: Icon, subtitle }) => {
  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
        <Icon sx={{ fontSize: 32, color: '#FFB800' }} />
        <Typography 
          variant="h4" 
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(45deg, #FFB800, #4A5FD9)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </Typography>
      </Box>
      {subtitle && (
        <Typography variant="body1" sx={{ color: '#94A3B8' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

const Section = ({ title, icon, subtitle, items, type }) => (
  <Box sx={{ mb: 8 }}>
    <SectionHeader title={title} icon={icon} subtitle={subtitle} />
    <Grid container spacing={3}>
      {items.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          {type === 'movie' ? (
            <MovieCard movie={item} isUpcoming={title.includes('Sắp Chiếu')} />
          ) : (
            <PromotionCard promotion={item} />
          )}
        </Grid>
      ))}
    </Grid>
    {items.length === 0 && (
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          textAlign: 'center',
          backgroundColor: '#16213e',
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" sx={{ color: '#94A3B8' }}>
          {type === 'promotion' ? 'Hiện tại chưa có khuyến mãi nào' : 'Chưa có phim nào'}
        </Typography>
      </Paper>
    )}
  </Box>
);

const MainContent = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: '#16213e' }}>
      <Section 
        title="Phim Đang Chiếu" 
        icon={MovieOutlined}
        subtitle={`${currentMovies.length} bộ phim đang được chiếu tại rạp`}
        items={currentMovies} 
        type="movie" 
      />
      <Section 
        title="Phim Sắp Chiếu" 
        icon={UpcomingOutlined}
        subtitle={`${upcomingMovies.length} bộ phim sắp ra mắt`}
        items={upcomingMovies} 
        type="movie" 
      />
      <Section 
        title="Khuyến Mãi Đang Diễn Ra" 
        icon={LocalOfferOutlined}
        subtitle={`${activePromotions.length} ưu đãi hấp dẫn dành cho bạn`}
        items={activePromotions} 
        type="promotion" 
      />
    </Container>
  );
};

export default MainContent;
