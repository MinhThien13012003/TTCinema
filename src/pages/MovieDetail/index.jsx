import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  CardMedia,
  CircularProgress,
  Modal
} from '@mui/material';
import {
  PlayArrow,
  AccessTime,
  Language,
  Subtitles,
  CalendarToday
} from '@mui/icons-material';
import movieData from '../../utils/movieData'
import ButtonGroupTrailerBooking from '../../components/ButtonGroupTrailerBooking';
import ShowTime from '../ShowTime'

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openTrailer, setOpenTrailer] = useState(null);
  const backgroundColor = '#16213e';
  useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll lên đầu
}, []);

  useEffect(() => {
    setTimeout(() => {
      const foundMovie = movieData.find((m) => m.phim_id === parseInt(id));
      setMovie(foundMovie);
      setLoading(false);
    }, 500);
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };



  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Không tìm thấy phim.
        </Typography>
      </Container>
    );
  }

  return (
    <>
    <Box sx={{ bgcolor: {backgroundColor}, color: 'white', py: 6, minHeight: '100vh', margin: '0 auto' , padding: 0,width: '95%'}}>
      <Container maxWidth="lg">
        <Grid container spacing={4} direction={{ xs: 'column', sm: 'row' }} alignItems="flex-start">
          {/* Poster */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                position: 'relative',
                width: { xs: 200, md: 300 },
                aspectRatio: '2 / 3', // đảm bảo khung cố định theo tỷ lệ 2:3
                borderRadius: 2,
                overflow: 'hidden',
                margin: '0 auto',
              }}
            >
            <CardMedia
              component="img"
              image={movie.image}
              alt={movie.ten_phim}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover', // hoặc 'contain' nếu muốn thấy toàn ảnh
              }}
            />
            </Box>
          </Grid>

          {/* Nội dung */}
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {movie.ten_phim} ({movie.nhan_phim})
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <AccessTime fontSize="small" />
                <Typography variant="body1">{movie.thoi_luong}'</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Language fontSize="small" />
                <Typography variant="body1">{movie.ngon_ngu}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Subtitles fontSize="small" />
                <Typography variant="body1">{movie.phien_dich}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarToday fontSize="small" />
                <Typography variant="body1">Khởi chiếu: {formatDate(movie.ngay_cong_chieu)}</Typography>
              </Box>
            </Box>

            <Chip
              label={`T${movie.nhan_phim.replace(/\D/g, '')}: Phim từ ${movie.nhan_phim.replace(/\D/g, '')}+`}
              
              sx={{ mb: 3, background:"linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)" }}
            />

            <Typography variant="h6" gutterBottom>
              Nội dung phim
            </Typography>
            <Typography variant="body1" paragraph>
              {movie.mo_ta}
            </Typography>

            {/* Component ButtonGroup */}
            <ButtonGroupTrailerBooking
              onWatchTrailer ={() => setOpenTrailer(movie.trailer)}
              hideBookButton={() => true}
            />
            <ShowTime movieId={movie.phim_id} />
            <Modal open={Boolean(openTrailer)} onClose={() => setOpenTrailer(null)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 800,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 2,
            outline: 'none',
          }}
        >
          <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
            <iframe
              src={openTrailer?.replace('watch?v=', 'embed/')}
              title="Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            />
          </Box>
        </Box>
      </Modal>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </>
  );
};

export default MovieDetail;
