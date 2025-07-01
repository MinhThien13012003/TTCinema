import React, { useState, useMemo } from "react";
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
  MenuItem,
  Select,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import showtimesData from "../../../utils/showtimesData";
import movieData from "../../../utils/movieData";
import roomData from "../../../utils/roomData";
import {
  Dialog as ConfirmDialog,
  DialogTitle as ConfirmTitle,
  DialogContent as ConfirmContent,
  DialogActions as ConfirmActions,
} from "@mui/material";

const ShowTimesManagement = () => {
  const [showtimes, setShowtimes] = useState(showtimesData);
  const [form, setForm] = useState({
    phim_id: "",
    phong_id: "",
    ngay_chieu: "",
    gio_bat_dau: "",
    gia_ve: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const [filters, setFilters] = useState({
    phim_id: "",
    phong_id: "",
    ngay_chieu: "",
  });
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Chỉ hiển thị các phim còn đang chiếu
  const today = new Date().toISOString().split("T")[0];
  const validMovies = useMemo(
    () => movieData.filter((p) => today >= p.ngay_cong_chieu),
    [today]
  );

  const getMovie = (id) => movieData.find((p) => p.phim_id === id);
  const getMovieName = (id) => getMovie(id)?.ten_phim || `Phim #${id}`;
  const getMovieDuration = (id) => getMovie(id)?.thoi_luong || 0;
  const getMovieStartDate = (id) =>
    getMovie(id)?.ngay_cong_chieu || "1900-01-01";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenDialog = (index = null) => {
    if (index !== null) {
      setForm(showtimes[index]);
      setEditIndex(index);
    } else {
      setForm({
        phim_id: "",
        phong_id: "",
        ngay_chieu: "",
        gio_bat_dau: "",
        gia_ve: "",
      });
      setEditIndex(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const isConflict = (newSuat, index = null) => {
    return showtimes.some((s, i) => {
      if (i === index) return false;
      return (
        s.phong_id === parseInt(newSuat.phong_id) &&
        s.ngay_chieu === newSuat.ngay_chieu &&
        s.gio_ket_thuc > newSuat.gio_bat_dau &&
        s.gio_bat_dau < newSuat.gio_ket_thuc
      );
    });
  };

  const handleSubmit = () => {
    const duration = getMovieDuration(parseInt(form.phim_id));
    const gio_ket_thuc = calculateEndTime(form.gio_bat_dau, duration);

    const ngay_chieu = form.ngay_chieu;
    const now = new Date().toISOString().split("T")[0];
    if (ngay_chieu < getMovieStartDate(parseInt(form.phim_id))) {
      return setAlert({
        open: true,
        type: "error",
        message: "Ngày chiếu phải sau ngày công chiếu phim.",
      });
    }
    // if (ngay_chieu < now) {
    //   return setAlert({ open: true, type: 'error', message: 'Không được tạo suất chiếu trong quá khứ.' });
    // }

    const newSuat = {
      ...form,
      phim_id: parseInt(form.phim_id),
      phong_id: parseInt(form.phong_id),
      gio_ket_thuc,
    };

    if (isConflict(newSuat, editIndex)) {
      return setAlert({
        open: true,
        type: "error",
        message: "Trùng suất chiếu trong cùng phòng và thời gian.",
      });
    }

    if (editIndex !== null) {
      const updated = [...showtimes];
      updated[editIndex] = { ...updated[editIndex], ...newSuat };
      setShowtimes(updated);
      setAlert({
        open: true,
        type: "success",
        message: "Cập nhật thành công.",
      });
    } else {
      const suat_id = showtimes.length
        ? Math.max(...showtimes.map((s) => s.suat_id)) + 1
        : 1;
      setShowtimes([...showtimes, { ...newSuat, suat_id }]);
      setAlert({
        open: true,
        type: "success",
        message: "Thêm mới thành công.",
      });
    }
    setOpenDialog(false);
  };

  const calculateEndTime = (start, durationMinutes) => {
    const [h, m] = start.split(":").map(Number);
    const startDate = new Date(0, 0, 0, h, m);
    startDate.setMinutes(startDate.getMinutes() + durationMinutes);
    return startDate.toTimeString().split(" ")[0].substring(0, 5);
  };

  const handleDelete = (index) => {
    const confirm = window.confirm(
      "Xác nhận xóa suất chiếu? Chỉ xóa nếu chưa bán vé."
    );
    if (confirm) {
      const updated = [...showtimes];
      updated.splice(index, 1);
      setShowtimes(updated);
      setAlert({ open: true, type: "info", message: "Đã xóa suất chiếu." });
    }
  };

  const filteredShowtimes = useMemo(() => {
    return showtimes.filter((s) => {
      return (
        (!filters.phim_id || s.phim_id == filters.phim_id) &&
        (!filters.phong_id || s.phong_id == filters.phong_id) &&
        (!filters.ngay_chieu || s.ngay_chieu === filters.ngay_chieu)
      );
    });
  }, [showtimes, filters]);

  const getRoomName = (phong_id) => {
    const room = roomData.find((r) => r.phong_id === phong_id);
    return room ? room.ten_phong : `Phòng #${phong_id}`;
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Quản lý lịch chiếu
      </Typography>

      {/* BỘ LỌC */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={4}>
          <TextField
            select
            sx={{ minWidth: 100, width: "100%", maxWidth: 150 }}
            label="Lọc theo phim"
            value={filters.phim_id}
            onChange={(e) =>
              setFilters({ ...filters, phim_id: e.target.value })
            }
          >
            <MenuItem value="">Tất cả</MenuItem>
            {movieData.map((p) => (
              <MenuItem key={p.phim_id} value={p.phim_id}>
                {p.ten_phim}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Lọc theo phòng"
            fullWidth
            value={filters.phong_id}
            onChange={(e) =>
              setFilters({ ...filters, phong_id: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Lọc theo ngày"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.ngay_chieu}
            onChange={(e) =>
              setFilters({ ...filters, ngay_chieu: e.target.value })
            }
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
      >
        Thêm lịch chiếu
      </Button>

      {/* BẢNG */}
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Phim</TableCell>
            <TableCell>Phòng</TableCell>
            <TableCell>Ngày</TableCell>
            <TableCell>Bắt đầu</TableCell>
            <TableCell>Kết thúc</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredShowtimes.map((row, index) => (
            <TableRow key={row.suat_id}>
              <TableCell>{getMovieName(row.phim_id)}</TableCell>
              <TableCell>{getRoomName(row.phong_id)}</TableCell>
              <TableCell>{row.ngay_chieu}</TableCell>
              <TableCell>{row.gio_bat_dau}</TableCell>
              <TableCell>{row.gio_ket_thuc}</TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => handleOpenDialog(index)}
                >
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => setDeleteIndex(index)}>
                  <Delete />
                </IconButton>
                <ConfirmDialog
                  open={deleteIndex !== null}
                  onClose={() => setDeleteIndex(null)}
                >
                  <ConfirmTitle>Xác nhận xoá suất chiếu</ConfirmTitle>
                  <ConfirmContent>
                    <Typography>
                      Bạn có chắc chắn muốn xoá suất chiếu này không? Chỉ cho
                      phép xoá nếu chưa bán vé.
                    </Typography>
                  </ConfirmContent>
                  <ConfirmActions>
                    <Button onClick={() => setDeleteIndex(null)}>Hủy</Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        const updated = [...showtimes];
                        updated.splice(deleteIndex, 1);
                        setShowtimes(updated);
                        setAlert({
                          open: true,
                          type: "info",
                          message: "Đã xoá suất chiếu.",
                        });
                        setDeleteIndex(null);
                      }}
                    >
                      Xác nhận xoá
                    </Button>
                  </ConfirmActions>
                </ConfirmDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* FORM */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editIndex !== null ? "Chỉnh sửa suất chiếu" : "Thêm suất chiếu"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <TextField
                select
                sx={{ minWidth: 100, width: "100%", maxWidth: 150 }}
                name="phim_id"
                label="Phim"
                value={form.phim_id}
                onChange={handleChange}
              >
                {validMovies.map((p) => (
                  <MenuItem key={p.phim_id} value={p.phim_id}>
                    {p.ten_phim}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="phong_id"
                label="Phòng chiếu"
                value={form.phong_id}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="ngay_chieu"
                label="Ngày chiếu"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.ngay_chieu}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="gio_bat_dau"
                label="Giờ bắt đầu"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={form.gio_bat_dau}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.type}>{alert.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ShowTimesManagement;
