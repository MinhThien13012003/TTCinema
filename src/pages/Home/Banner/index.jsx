import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Fade,
  LinearProgress,
  Chip,
  Stack
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  PlayArrow,
  ShoppingCart,
  FiberManualRecord
} from '@mui/icons-material';

const movieList = [
  {
    id: 1,
    title: 'Mượn Hồn Đoạt Xác',
    image: 'https://ddcinema.vn/Areas/Admin/Content/Fileuploads/images/slider/bringherback.jpg',
    description: 'Bộ phim kinh dị đầy kịch tính với cốt truyện hấp dẫn',
    genre: 'Kinh dị',
    rating: '18+',
    duration: '120 phút'
  },
  {
    id: 2,
    title: 'Tom Cruise: Mission Impossible 8',
    image: 'https://ddcinema.vn/Areas/Admin/Content/Fileuploads/images/slider/mi8_rolling_banner.jpg',
    description: 'Nhiệm vụ bất khả thi tiếp tục với những pha hành động mãn nhãn',
    genre: 'Hành động',
    rating: '16+',
    duration: '150 phút'
  },
  {
    id: 3,
    title: 'Inside Out 2',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe-Iq3dF2zE2TBPRCqaU6kNviE-xzcoT9-6Q&s',
    description: 'Cuộc phiêu lưu cảm xúc mới trong thế giới nội tâm',
    genre: 'Hoạt hình',
    rating: 'P',
    duration: '95 phút'
  },
];

function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setProgress(0);
    setCurrentIndex((prev) => (prev === 0 ? movieList.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setProgress(0);
    setCurrentIndex((prev) => (prev === movieList.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setProgress(0);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (!isTransitioning) {
            handleNext();
          }
          return 0;
        }
        return prev + 1.5; // Tăng chậm hơn để có thời gian xem
      });
    }, 75);

    return () => clearInterval(progressInterval);
  }, [isTransitioning]);

  const movie = movieList[currentIndex];

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        backgroundColor: '#000',
      }}
    >
      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 5,
          height: 3,
          backgroundColor: 'rgba(255,255,255,0.2)',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #FFB800 0%, #FF8C00 50%, #FFB800 100%)',
            borderRadius: '0 3px 3px 0',
          },
        }}
      />

      {/* Background Image với Animation */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${movie.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isTransitioning ? 'scale(1.05)' : 'scale(1)',
          filter: isTransitioning ? 'brightness(0.7)' : 'brightness(1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)',
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)',
            zIndex: 2,
          },
        }}
      />

      {/* Main Content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 30,
          right: 0,
          p: { xs: 3, sm: 4, md: 6 },
          zIndex: 3,
        }}
      >
        <Fade in={!isTransitioning} timeout={800}>
          <Box>
            {/* Movie Info Chips */}
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}
            >
              <Chip
                label={movie.genre}
                size="small"
                sx={{
                  backgroundColor: '#FFB800',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                }}
              />
              <Chip
                label={movie.rating}
                size="small"
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.75rem',
                }}
              />
              <Chip
                label={movie.duration}
                size="small"
                variant="outlined"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '0.75rem',
                }}
              />
            </Stack>

            {/* Movie Title */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {movie.title}
            </Typography>

            {/* Movie Description */}
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 4,
                fontSize: { xs: '1rem', md: '1.2rem' },
                maxWidth: { xs: '100%', md: '65%' },
                textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                lineHeight: 1.6,
              }}
            >
              {movie.description}
            </Typography>

            {/* Action Buttons */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
              sx={{ maxWidth: 400 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                sx={{
                  background: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)',
                  boxShadow: '0 8px 25px rgba(255, 184, 0, 0.4)',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.8,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FF8C00 0%, #FFB800 100%)',
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: '0 12px 30px rgba(255, 184, 0, 0.6)',
                  },
                }}
              >
                Mua vé ngay
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<PlayArrow />}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.8,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  borderWidth: 2,
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'white',
                    borderWidth: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                Xem trailer
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Box>

      {/* Navigation Arrows */}
      <IconButton
        onClick={handlePrev}
        disabled={isTransitioning}
        sx={{
          position: 'absolute',
          left: { xs: 12, md: 20 },
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          zIndex: 4,
          width: { xs: 45, md: 55 },
          height: { xs: 45, md: 55 },
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            transform: 'translateY(-50%) scale(1.1)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
          },
          '&:disabled': {
            opacity: 0.4,
          },
        }}
      >
        <ArrowBackIos sx={{ fontSize: { xs: 20, md: 24 } }} />
      </IconButton>

      <IconButton
        onClick={handleNext}
        disabled={isTransitioning}
        sx={{
          position: 'absolute',
          right: { xs: 12, md: 20 },
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          zIndex: 4,
          width: { xs: 45, md: 55 },
          height: { xs: 45, md: 55 },
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            transform: 'translateY(-50%) scale(1.1)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
          },
          '&:disabled': {
            opacity: 0.4,
          },
        }}
      >
        <ArrowForwardIos sx={{ fontSize: { xs: 20, md: 24 } }} />
      </IconButton>

      {/* Dots Indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1.5,
          zIndex: 4,
        }}
      >
        {movieList.map((_, index) => (
          <IconButton
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            sx={{
              width: 14,
              height: 14,
              minWidth: 'unset',
              p: 0,
              color: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: index === currentIndex ? 'scale(1.4)' : 'scale(1)',
              '&:hover': {
                color: 'white',
                transform: 'scale(1.3)',
              },
              '&:disabled': {
                opacity: 0.7,
              },
            }}
          >
            <FiberManualRecord sx={{ fontSize: 14 }} />
          </IconButton>
        ))}
      </Box>
    </Box>
  );
}

export default Banner;