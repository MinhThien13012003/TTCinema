import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardMedia, CardContent, CardActions,
  Button, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Snackbar,
  Tabs, Tab, Paper, InputAdornment, Autocomplete, Rating, Divider, Alert
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon,
  FilterList as FilterIcon, Close as CloseIcon, Movie as MovieIcon,
  CalendarToday as CalendarIcon, AccessTime as TimeIcon, Person as PersonIcon
} from '@mui/icons-material';
import movieData from '../../../utils/movieData';
import showtimesData from '../../../utils/movieData';

export const theLoaiOptions = ['Hành động', 'Hài', 'Tình cảm', 'Kinh dị', 'Hoạt hình', 'Phiêu lưu'];
export const doTuoiOptions = ['P', 'T13', 'T16', 'T18', 'C18'];
export const quocGiaOptions = ['Việt Nam', 'Mỹ', 'Hàn Quốc', 'Nhật Bản', 'Trung Quốc', 'Anh'];

const MovieManagement = () => {
  const [movies, setMovies] = useState(movieData);
  const [filteredMovies, setFilteredMovies] = useState(movieData);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [movieForm, setMovieForm] = useState({
    ten_phim: '', mo_ta: '', thoi_luong: '', the_loai: [], dien_vien: [],
    dao_dien: '', quoc_gia: '', nam_phat_hanh: new Date().getFullYear(),
    image: '', trailer: '', nhan_phim: 'P', ngay_cong_chieu: '', ngay_ket_thuc: '', trang_thai: 'sap_chieu'
  });

  useEffect(() => {
    let filtered = movies;
    if (tabValue === 1) filtered = filtered.filter(m => m.trang_thai === 'dang_chieu');
    if (tabValue === 2) filtered = filtered.filter(m => m.trang_thai === 'sap_chieu');
    if (tabValue === 3) filtered = filtered.filter(m => m.trang_thai === 'het_chieu');
    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.ten_phim.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.dao_dien.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(m.dien_vien) && m.dien_vien.some(actor => actor.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    if (filterGenre) {
      filtered = filtered.filter(m => m.the_loai.includes(filterGenre));
    }
    setFilteredMovies(filtered);
  }, [movies, tabValue, searchTerm, filterGenre]);

  const handleOpenDialog = (movie = null) => {
    setEditingMovie(movie);
    setMovieForm(movie ? {
      ...movie,
      dien_vien: Array.isArray(movie.dien_vien) ? movie?.dien_vien : [movie?.dien_vien || '']
    } : {
      ten_phim: '', mo_ta: '', thoi_luong: '', the_loai: [], dien_vien: [],
      dao_dien: '', quoc_gia: '', nam_phat_hanh: new Date().getFullYear(),
      image: '', trailer: '', nhan_phim: 'P', ngay_cong_chieu: '', ngay_ket_thuc: '', trang_thai: 'sap_chieu'
    });
    setOpenDialog(true);
  };

  const handleSaveMovie = () => {
    if (!movieForm.ten_phim || !movieForm.dao_dien || !movieForm.thoi_luong) {
      return setSnackbar({ open: true, message: 'Vui lòng điền đầy đủ!', severity: 'error' });
    }
    if (editingMovie) {
      setMovies(movies.map(m => m.phim_id === editingMovie.phim_id ? { ...movieForm, phim_id: editingMovie.phim_id } : m));
      setSnackbar({ open: true, message: 'Cập nhật phim thành công!', severity: 'success' });
    } else {
      const newId = Math.max(...movies.map(m => m.phim_id)) + 1;
      setMovies([...movies, { ...movieForm, phim_id: newId }]);
      setSnackbar({ open: true, message: 'Thêm phim mới thành công!', severity: 'success' });
    }
    setOpenDialog(false);
  };

  const handleDeleteMovie = (id) => {
    const hasShowtime = showtimesData.some(showtime => showtime.phim_id === id);
    if (hasShowtime) {
      return setSnackbar({ open: true, message: 'Không thể xóa phim vì còn lịch chiếu!', severity: 'error' });
    }
    if (window.confirm('Bạn có chắc muốn xóa phim này?')) {
      setMovies(movies.filter(m => m.phim_id !== id));
      setSnackbar({ open: true, message: 'Xóa phim thành công!', severity: 'success' });
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight={700}><MovieIcon /> Quản lý phim</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Thêm phim</Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth placeholder="Tìm kiếm..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: (<InputAdornment nment position="start"><SearchIcon /></InputAdornment>) }} />
          </Grid>
          <Grid >
            <FormControl sx={{ minWidth: 200, width: '100%', maxWidth: 300 }}>
              <InputLabel size='medium'>Thể loại</InputLabel>
              <Select value={filterGenre} onChange={e => setFilterGenre(e.target.value)} label="Thể loại">
                <MenuItem value="">Tất cả</MenuItem>
                {theLoaiOptions.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
        <Tab label="Tất cả" />
        <Tab label="Đang chiếu" />
        <Tab label="Sắp chiếu" />
        <Tab label="Hết chiếu" />
      </Tabs>

      <Grid container spacing={3}>
        {filteredMovies.map(movie => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.phim_id}>
            <Card sx={{ width: 320, height: 420, display: 'flex', flexDirection: 'column' }}>
  <CardMedia component="img" height="200" image={movie.image} alt={movie.ten_phim} />
  <CardContent sx={{ flex: 1, minHeight: 0 }}>
    <Typography variant="h6" noWrap>{movie.ten_phim}</Typography>
    <Typography variant="body2" color="text.secondary" noWrap>Đạo diễn: {movie.dao_dien}</Typography>
    <Typography variant="body2" color="text.secondary" noWrap>
      Diễn viên: {Array.isArray(movie.dien_vien) ? movie.dien_vien.join(', ') : movie.dien_vien}
    </Typography>
    <Typography variant="body2" color="text.secondary" noWrap>
      Thể loại: {Array.isArray(movie.the_loai) ? movie.the_loai.join(', ') : movie.the_loai}
    </Typography>
    <Typography variant="caption">
      {movie.thoi_luong} phút | {movie.nhan_phim} | {movie.nam_phat_hanh}
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small" onClick={() => handleOpenDialog(movie)} startIcon={<EditIcon />}>Sửa</Button>
    <IconButton size="small" color="error" onClick={() => handleDeleteMovie(movie.phim_id)}><DeleteIcon /></IconButton>
  </CardActions>
</Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingMovie ? 'Chỉnh sửa phim' : 'Thêm phim mới'}
          <IconButton onClick={() => setOpenDialog(false)} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField label="Tên phim" fullWidth value={movieForm.ten_phim} onChange={e => setMovieForm({ ...movieForm, ten_phim: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Đạo diễn" fullWidth value={movieForm.dao_dien} onChange={e => setMovieForm({ ...movieForm, dao_dien: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField sx={{'& .MuiInputBase-input':{padding: '16px'}}} label="Mô tả" fullWidth multiline rows={4} value={movieForm.mo_ta} onChange={e => setMovieForm({ ...movieForm, mo_ta: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField label="Thời lượng (phút)" fullWidth type="number" value={movieForm.thoi_luong} onChange={e => setMovieForm({ ...movieForm, thoi_luong: parseInt(e.target.value) || '' })} /></Grid>
            <Grid item xs={6}><TextField label="Năm phát hành" fullWidth type="number" value={movieForm.nam_phat_hanh} onChange={e => setMovieForm({ ...movieForm, nam_phat_hanh: parseInt(e.target.value) || '' })} /></Grid>
            <Grid item xs={12}><Autocomplete multiple options={theLoaiOptions} value={movieForm.the_loai} onChange={(e, v) => setMovieForm({ ...movieForm, the_loai: v })} renderInput={params => <TextField {...params} label="Thể loại" />} /></Grid>
            <Grid item xs={12}><Autocomplete multiple freeSolo options={[]} value={movieForm.dien_vien} onChange={(e, v) => setMovieForm({ ...movieForm, dien_vien: v })} renderInput={params => <TextField {...params} label="Diễn viên" />} /></Grid>
            <Grid item xs={6}><TextField label="Poster URL" fullWidth value={movieForm.image} onChange={e => setMovieForm({ ...movieForm, image: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField label="Trailer URL" fullWidth value={movieForm.trailer} onChange={e => setMovieForm({ ...movieForm, trailer: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField label="Ngày công chiếu" type="date" fullWidth InputLabelProps={{ shrink: true }} value={movieForm.ngay_cong_chieu} onChange={e => setMovieForm({ ...movieForm, ngay_cong_chieu: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField label="Ngày kết thúc" type="date" fullWidth InputLabelProps={{ shrink: true }} value={movieForm.ngay_ket_thuc} onChange={e => setMovieForm({ ...movieForm, ngay_ket_thuc: e.target.value })} /></Grid>
            <Grid item xs={6}><FormControl sx={{ minWidth: 100, width: '100%', maxWidth: 150 }}><InputLabel>Quốc gia</InputLabel><Select value={movieForm.quoc_gia} onChange={e => setMovieForm({ ...movieForm, quoc_gia: e.target.value })}>{quocGiaOptions.map(q => <MenuItem key={q} value={q}>{q}</MenuItem>)}</Select></FormControl></Grid>
            <Grid item xs={6}><FormControl sx={{ minWidth: 100, width: '100%', maxWidth: 150 }} ><InputLabel>Độ tuổi</InputLabel><Select value={movieForm.nhan_phim} onChange={e => setMovieForm({ ...movieForm, nhan_phim: e.target.value })}>{doTuoiOptions.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}</Select></FormControl></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveMovie}>{editingMovie ? 'Cập nhật' : 'Thêm'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default MovieManagement;
