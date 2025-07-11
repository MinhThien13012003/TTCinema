import React, { useState, useMemo, useEffect } from "react";
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
import axios from "../../../service/axios";
import {
  Dialog as ConfirmDialog,
  DialogTitle as ConfirmTitle,
  DialogContent as ConfirmContent,
  DialogActions as ConfirmActions,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const ShowTimesManagement = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movie, setMovie] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const [filters, setFilters] = useState({
    movieId: "",
    roomId: "",
    date: "",
  });

  const [form, setForm] = useState({
    movieId: "",
    roomId: "",
    date: "",
    startTime: "",
    price: "",
  });

  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  // Chỉ hiển thị các phim còn đang chiếu
  const today = new Date().toISOString().split("T")[0];
  const validMovies = useMemo(
    () => movie.filter((p) => today >= p.releaseDate),
    [today, movie]
  );

  // Fetch API
  useEffect(() => {
    fetchShowtimes();
    fetchMovies();
    fetchRoomData();
  }, []);

  const fetchRoomData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/rooms");
      console.log("Fetched rooms:", res.data);
      setRoomData(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
    setLoading(false);
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/movies");
      console.log("Fetched movies:", res.data);
      setMovie(res.data);
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
    setLoading(false);
  };

  const fetchShowtimes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/showtimes");
      console.log("Fetched showtimes:", res.data);
      setShowtimes(res.data);
    } catch (err) {
      console.error("Error fetching showtimes:", err);
    }
    setLoading(false);
  };

  // Hàm lấy thông tin phim/phòng
  const getMovie = (id) =>
    movie.find((p) => p.phim_id === id || p.movieId === id || p._id === id);
  const getMovieName = (movieObjOrId) => {
    if (!movieObjOrId) return "";
    if (typeof movieObjOrId === "object" && movieObjOrId.title) {
      return movieObjOrId.title;
    }
    const found = movie.find(
      (p) =>
        p._id === movieObjOrId ||
        p.phim_id === movieObjOrId ||
        p.movieId === movieObjOrId
    );
    return found?.title || found?.ten_phim || `Phim #${movieObjOrId}`;
  };
  const getMovieDuration = (id) => getMovie(id)?.duration || 0;
  const getMovieStartDate = (id) => getMovie(id)?.releaseDate || "1900-01-01";

  const getRoomName = (roomObjOrId) => {
    if (!roomObjOrId) return "";
    if (typeof roomObjOrId === "object" && roomObjOrId.name) {
      return roomObjOrId.name;
    }
    const found = roomData.find(
      (r) =>
        r._id === roomObjOrId ||
        r.roomId === roomObjOrId ||
        r.phong_id === roomObjOrId
    );
    return found?.name || found?.ten_phong || `Phòng #${roomObjOrId}`;
  };

  const getRoomOptions = () => {
    return roomData.map((p) => (
      <MenuItem
        key={p.roomId || p.phong_id || p._id}
        value={p.roomId || p.phong_id || p._id}
      >
        {p.name || p.ten_phong}
      </MenuItem>
    ));
  };

  // Tạo ánh xạ từ _id sang phim_id
  const movieIdMap = useMemo(() => {
    return Object.fromEntries(
      movie.map((p) => [p._id, p.phim_id || p.movieId || p._id])
    );
  }, [movie]);

  // Tạo ánh xạ từ _id sang roomId (giả định roomData có roomId)
  const roomIdMap = useMemo(() => {
    return Object.fromEntries(
      roomData.map((r) => [r._id, r.roomId || r.phong_id || r._id])
    );
  }, [roomData]);

  // Khi setForm hoặc setFilters, luôn truyền giá trị mặc định là "" nếu không có
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value ?? "" });
  };

  // Khi mở dialog sửa, đảm bảo giá trị không undefined
  const handleOpenDialog = (index = null) => {
    if (index !== null) {
      const suat = showtimes[index];
      // Xử lý movieId: ánh xạ từ _id sang phim_id
      const movieIdRaw =
        typeof suat.movieId === "object"
          ? suat.movieId._id ||
            suat.movieId.phim_id ||
            suat.movieId.movieId ||
            ""
          : suat.movieId || "";
      const validMovieId = movieIdMap[movieIdRaw] || "";
      // Xử lý roomId
      const roomIdRaw =
        typeof suat.roomId === "object"
          ? suat.roomId._id || suat.roomId.roomId || suat.roomId.phong_id || ""
          : suat.roomId || "";
      const validRoomId = roomIdMap[roomIdRaw] || "";
      // Chuyển đổi định dạng date
      const date = suat.date
        ? new Date(suat.date).toISOString().split("T")[0]
        : "";

      setForm({
        movieId: validMovieId,
        roomId: validRoomId,
        date,
        startTime: suat.startTime || "",
        price: suat.price || "",
      });
      setEditIndex(index);
    } else {
      setForm({
        movieId: "",
        roomId: "",
        date: "",
        startTime: "",
        price: "",
      });
      setEditIndex(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  // Tính giờ kết thúc
  const calculateEndTime = (start, durationMinutes) => {
    const [h, m] = start.split(":").map(Number);
    const startDate = new Date(0, 0, 0, h, m);
    startDate.setMinutes(startDate.getMinutes() + durationMinutes);
    return startDate.toTimeString().split(" ")[0].substring(0, 5);
  };

  // Kiểm tra trùng suất chiếu
  const isConflict = (newSuat, index = null) => {
    return showtimes.some((s, i) => {
      if (i === index) return false;
      const sRoomId =
        typeof s.roomId === "object"
          ? s.roomId._id || s.roomId.roomId || s.roomId.phong_id
          : s.roomId;
      return (
        sRoomId === newSuat.roomId &&
        (s.date || s.ngay_chieu) === newSuat.date &&
        (s.endTime || s.gio_ket_thuc) > newSuat.startTime &&
        (s.startTime || s.gio_bat_dau) < newSuat.endTime
      );
    });
  };

  // Thêm/sửa suất chiếu
  const handleSubmit = async () => {
    setLoading(true);
    const duration = getMovieDuration(form.movieId);
    const endTime = calculateEndTime(form.startTime, duration);

    if (form.date < getMovieStartDate(form.movieId)) {
      return setAlert({
        open: true,
        type: "error",
        message: "Ngày chiếu phải sau ngày công chiếu phim.",
      });
    }

    const movieObj =
      movie.find(
        (p) =>
          p.phim_id === form.movieId ||
          p.movieId === form.movieId ||
          p._id === form.movieId
      ) || {};

    const roomObj =
      roomData.find(
        (r) =>
          r._id === form.roomId ||
          r.roomId === form.roomId ||
          r.phong_id === form.roomId
      ) || {};

    const newSuat = {
      suat_chieu_id: Math.floor(Math.random() * 1000000),
      movieId: movieObj._id || movieObj.phim_id || movieObj.movieId,
      roomId: roomObj._id || roomObj.roomId || roomObj.phong_id,
      date: form.date,
      startTime: form.startTime,
      endTime,
    };

    try {
      if (editIndex !== null) {
        const suatId = showtimes[editIndex].suat_chieu_id;
        await axios.put(`/api/showtimes/${suatId}`, newSuat);
        setAlert({
          open: true,
          type: "success",
          message: "Cập nhật thành công.",
        });
        fetchShowtimes();
      } else {
        console.log("Adding new showtime:", newSuat);
        await axios.post("/api/showtimes", newSuat);
        setAlert({
          open: true,
          type: "success",
          message: "Thêm mới thành công.",
        });
        fetchShowtimes();
      }
    } catch (err) {
      console.error("Error saving showtime:", err?.response?.data || err);
      setAlert({
        open: true,
        type: "error",
        message: "Lỗi khi lưu suất chiếu!",
      });
    }

    setLoading(false);
    setOpenDialog(false);
  };

  // Xóa suất chiếu
  const handleDelete = async (index) => {
    setLoading(true);
    const suatId = showtimes[index].suat_chieu_id;
    try {
      await axios.delete(`/api/showtimes/${suatId}`);
      setAlert({
        open: true,
        type: "success",
        message: "Xóa suất chiếu thành công.",
      });
      fetchShowtimes();
    } catch (err) {
      setAlert({
        open: true,
        type: "error",
        message: "Lỗi khi xóa suất chiếu.",
      });
    }
    setLoading(false);
    setDeleteIndex(null);
  };

  // Lọc bảng
  const filteredShowtimes = useMemo(() => {
    return showtimes.filter((s) => {
      const movieIdRaw =
        s.movieId && typeof s.movieId === "object"
          ? s.movieId._id || s.movieId.phim_id || s.movieId.movieId
          : s.movieId;
      const movieId = movieIdMap[movieIdRaw] || movieIdRaw;
      const roomIdRaw =
        s.roomId && typeof s.roomId === "object"
          ? s.roomId._id || s.roomId.roomId || s.roomId.phong_id
          : s.roomId;
      const roomId = roomIdMap[roomIdRaw] || roomIdRaw;
      return (
        (!filters.movieId || movieId == filters.movieId) &&
        (!filters.roomId || roomId == filters.roomId) &&
        (!filters.date ||
          (s.date &&
            new Date(s.date).toISOString().split("T")[0] === filters.date))
      );
    });
  }, [showtimes, filters, movieIdMap, roomIdMap]);

  const formatDateVN = (isoString, showTime = false) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    if (showTime) {
      const hh = String(date.getHours()).padStart(2, "0");
      const min = String(date.getMinutes()).padStart(2, "0");
      return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    }
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <Box p={4} sx={{ position: "relative" }}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(255,255,255,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}
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
            value={filters.movieId}
            onChange={(e) =>
              setFilters({ ...filters, movieId: e.target.value })
            }
          >
            <MenuItem value="">Tất cả</MenuItem>
            {movie.map((p) => (
              <MenuItem
                key={p.phim_id || p.movieId || p._id}
                value={p.phim_id || p.movieId || p._id}
              >
                {p.title || p.ten_phim}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            select
            label="Lọc theo phòng"
            value={filters.roomId}
            onChange={(e) => setFilters({ ...filters, roomId: e.target.value })}
            sx={{ minWidth: 100, width: "100%", maxWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {getRoomOptions()}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Lọc theo ngày"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
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
            <TableRow key={row.suat_chieu_id || index}>
              <TableCell>{getMovieName(row.movieId)}</TableCell>
              <TableCell>{getRoomName(row.roomId)}</TableCell>
              <TableCell>{formatDateVN(row.date)}</TableCell>
              <TableCell>{row.startTime}</TableCell>
              <TableCell>{row.endTime}</TableCell>
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
                  open={deleteIndex === index}
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
                      onClick={() => handleDelete(index)}
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
                name="movieId"
                label="Phim"
                value={form.movieId}
                onChange={handleChange}
                sx={{ minWidth: 100, width: "100%", maxWidth: 150 }}
              >
                {movie.map((p) => (
                  <MenuItem
                    key={p.phim_id || p.movieId || p._id}
                    value={p.phim_id || p.movieId || p._id}
                  >
                    {p.title || p.ten_phim}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                name="roomId"
                label="Phòng chiếu"
                value={form.roomId}
                onChange={handleChange}
                sx={{ minWidth: 100, width: "100%", maxWidth: 150 }}
              >
                {getRoomOptions()}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="date"
                label="Ngày chiếu"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.date}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="startTime"
                label="Giờ bắt đầu"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={form.startTime}
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
