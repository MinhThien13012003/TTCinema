import React, { useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Snackbar, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import seatTypeData from '../../../utils/seatTypeData';

const SeatPriceManagement = () => {
  const [seatTypes, setSeatTypes] = useState(seatTypeData);
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ ten_loai: '', gia_ghe: '', mau_sac: '' });
  const [alert, setAlert] = useState({ open: false, type: 'success', message: '' });

  const handleOpenDialog = (item) => {
    setEditItem(item);
    setForm({ ...item });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditItem(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const updated = seatTypes.map(type =>
      type.loai_ghe_id === editItem.loai_ghe_id ? { ...type, ...form, gia_ghe: parseInt(form.gia_ghe) } : type
    );
    setSeatTypes(updated);
    setAlert({ open: true, type: 'success', message: 'Cập nhật thành công!' });
    handleCloseDialog();
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">Quản lý Giá Ghế</Typography>

      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell><b>Loại ghế</b></TableCell>
            <TableCell><b>Giá hiện tại</b></TableCell>  
            <TableCell><b>Hành động</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {seatTypes.map((type) => (
            <TableRow key={type.loai_ghe_id}>
              <TableCell>{type.ten_loai}</TableCell>
              <TableCell>{type.gia_ghe.toLocaleString('vi-VN')}₫</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpenDialog(type)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog chỉnh sửa */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Chỉnh sửa thông tin loại ghế</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                label="Tên loại ghế"
                name="ten_loai"
                fullWidth
                value={form.ten_loai}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Giá vé (VND)"
                name="gia_ghe"
                type="number"
                fullWidth
                value={form.gia_ghe}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>Lưu</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.type}>{alert.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SeatPriceManagement;
