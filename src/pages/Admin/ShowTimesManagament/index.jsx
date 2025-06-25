import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
  MenuItem
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import showtimesData from '../../../utils/showtimesData';
import movieData from '../../../utils/movieData';

const ShowTimesManagement = () => {
  const [showtimes, setShowtimes] = useState(showtimesData);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ phim_id: '', phong_id: '', ngay_chieu: '', gio_bat_dau: '', gio_ket_thuc: '', gia_ve: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [alert, setAlert] = useState({ open: false, type: 'success', message: '' });

  const getMovieName = (phim_id) => {
    const movie = movieData.find(m => m.phim_id === phim_id);
    return movie ? movie.ten_phim : `Phim #${phim_id}`;
  };

  const handleOpenDialog = (index = null) => {
    if (index !== null) {
      setForm(showtimes[index]);
      setEditIndex(index);
    } else {
      setForm({ phim_id: '', phong_id: '', ngay_chieu: '', gio_bat_dau: '', gio_ket_thuc: '', gia_ve: '' });
      setEditIndex(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isConflict = (newSuat, index = null) => {
    return showtimes.some((suat, i) => {
      if (i === index) return false;
      return (
        suat.phong_id === parseInt(newSuat.phong_id) &&
        suat.ngay_chieu === newSuat.ngay_chieu &&
        suat.gio_ket_thuc > newSuat.gio_bat_dau &&
        suat.gio_bat_dau < newSuat.gio_ket_thuc
      );
    });
  };

  const handleSubmit = () => {
    const newSuat = { ...form, phim_id: parseInt(form.phim_id), phong_id: parseInt(form.phong_id) };
    if (isConflict(newSuat, editIndex)) {
      setAlert({ open: true, type: 'error', message: 'Trùng suất chiếu trong cùng phòng và thời gian.' });
      return;
    }
    if (editIndex !== null) {
      const updated = [...showtimes];
      updated[editIndex] = { ...updated[editIndex], ...form };
      setShowtimes(updated);
      setAlert({ open: true, type: 'success', message: 'Đã cập nhật suất chiếu.' });
    } else {
      const suat_id = showtimes.length ? Math.max(...showtimes.map(s => s.suat_id)) + 1 : 1;
      setShowtimes([...showtimes, { ...form, suat_id }]);
      setAlert({ open: true, type: 'success', message: 'Đã thêm suất chiếu.' });
    }
    setOpenDialog(false);
  };

  const handleDelete = (index) => {
    const confirm = window.confirm('Xác nhận xóa suất chiếu này? Chỉ xóa nếu chưa có người đặt vé.');
    if (confirm) {
      const updated = [...showtimes];
      updated.splice(index, 1);
      setShowtimes(updated);
      setAlert({ open: true, type: 'info', message: 'Đã xóa suất chiếu.' });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Quản lý lịch chiếu</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Thêm lịch chiếu mới
      </Button>

      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Phim</TableCell>
            <TableCell>Phòng</TableCell>
            <TableCell>Ngày</TableCell>
            <TableCell>Giờ bắt đầu</TableCell>
            <TableCell>Giờ kết thúc</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {showtimes.map((row, index) => (
            <TableRow key={row.suat_id}>
              <TableCell>{getMovieName(row.phim_id)}</TableCell>
              <TableCell>{row.phong_id}</TableCell>
              <TableCell>{row.ngay_chieu}</TableCell>
              <TableCell>{row.gio_bat_dau}</TableCell>
              <TableCell>{row.gio_ket_thuc}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpenDialog(index)}><Edit /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(index)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editIndex !== null ? 'Chỉnh sửa suất chiếu' : 'Thêm suất chiếu'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                name="phim_id"
                label="Phim"
                value={form.phim_id}
                onChange={handleChange}
              >
                {movieData.map((phim) => (
                  <MenuItem key={phim.phim_id} value={phim.phim_id}>{phim.ten_phim}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth name="phong_id" label="Phòng ID" value={form.phong_id} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth name="ngay_chieu" label="Ngày chiếu" type="date" InputLabelProps={{ shrink: true }} value={form.ngay_chieu} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth name="gia_ve" label="Giá vé" value={form.gia_ve} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth name="gio_bat_dau" label="Giờ bắt đầu" type="time" InputLabelProps={{ shrink: true }} value={form.gio_bat_dau} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth name="gio_ket_thuc" label="Giờ kết thúc" type="time" InputLabelProps={{ shrink: true }} value={form.gio_ket_thuc} onChange={handleChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>Lưu</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.type}>{alert.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ShowTimesManagement;
