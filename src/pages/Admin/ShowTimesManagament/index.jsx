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
  Backdrop,
  CircularProgress,
  LinearProgress,
  Skeleton,
  TablePagination,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "../../../service/axios";
import {
  Dialog as ConfirmDialog,
  DialogTitle as ConfirmTitle,
  DialogContent as ConfirmContent,
  DialogActions as ConfirmActions,
} from "@mui/material";
import AutoSchedulerDialog from "./AutoSchedulerDialog";

const ShowTimesManagement = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movie, setMovie] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAutoDialog, setOpenAutoDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editIndex, setEditIndex] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const renderSkeletonRows = () => {
    return [...Array(4)].map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        {[...Array(6)].map((_, j) => (
          <TableCell key={j}>
            <Skeleton variant="text" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

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
  });

  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  // Chỉ hiển thị các phim còn đang chiếu
  const today = new Date().toISOString().split("T")[0];
  const validMovies = useMemo(
    () => movie.filter((p) => today >= p.releaseDate),
    [today, movie]
  );
  const validateForm = () => {
    const errors = [];

    if (!form.movieId) errors.push("Vui lòng chọn phim");
    if (!form.roomId) errors.push("Vui lòng chọn phòng chiếu");
    if (!form.date) errors.push("Vui lòng chọn ngày chiếu");
    if (!form.startTime) errors.push("Vui lòng chọn giờ bắt đầu");

    return errors;
  };
  const validateDate = (selectedDate, movieId) => {
    const today = new Date().toISOString().split("T")[0];
    const movieReleaseDate = getMovieStartDate(movieId);

    if (selectedDate < today) {
      return "Ngày chiếu không thể là ngày quá khứ";
    }

    if (selectedDate < movieReleaseDate) {
      return "Ngày chiếu phải sau ngày công chiếu phim";
    }

    return null;
  };
  const validateTime = (startTime, endTime) => {
    const openTime = "06:00"; // Giờ mở cửa rạp
    const closeTime = "24:00"; // Giờ đóng cửa rạp

    if (startTime < openTime) {
      return "Giờ chiếu phải sau 6:00 sáng";
    }

    if (endTime > closeTime) {
      return "Suất chiếu phải kết thúc trước 24:00";
    }

    return null;
  };

  // Fetch API
  useEffect(() => {
    fetchShowtimes();
    fetchMovies();
    fetchRoomData();
  }, []);

  const fetchRoomData = async () => {
    setLoadingData(true);
    try {
      const res = await axios.get("/api/rooms");
      setRoomData(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
    setLoadingData(false);
  };

  const fetchMovies = async () => {
    setLoadingData(true);
    try {
      const res = await axios.get("/api/movies");
      setMovie(res.data);
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
    setLoadingData(false);
  };

  const fetchShowtimes = async () => {
    setLoadingData(true);
    try {
      const res = await axios.get("/api/showtimes");
      setShowtimes(res.data);
    } catch (err) {
      console.error("Error fetching showtimes:", err);
    }
    setLoadingData(false);
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
    const { name, value } = e.target;
    setForm({ ...form, [name]: value || "" });

    // Validation real-time cho một số trường
    if (name === "date" && value && form.movieId) {
      const dateError = validateDate(value, form.movieId);
      if (dateError) {
        setAlert({
          open: true,
          type: "warning",
          message: dateError,
        });
      }
    }
  };

  // Khi mở dialog sửa, đảm bảo giá trị không undefined
  const handleOpenDialog = (index = null) => {
    if (index !== null) {
      const suat = showtimes[index];

      // Kiểm tra và xử lý movieId an toàn hơn
      let movieIdRaw = "";
      if (suat.movieId) {
        if (typeof suat.movieId === "object") {
          movieIdRaw =
            suat.movieId._id ||
            suat.movieId.phim_id ||
            suat.movieId.movieId ||
            "";
        } else {
          movieIdRaw = suat.movieId || "";
        }
      }
      const validMovieId = movieIdMap[movieIdRaw] || movieIdRaw || "";

      // Kiểm tra và xử lý roomId an toàn hơn
      let roomIdRaw = "";
      if (suat.roomId) {
        if (typeof suat.roomId === "object") {
          roomIdRaw =
            suat.roomId._id || suat.roomId.roomId || suat.roomId.phong_id || "";
        } else {
          roomIdRaw = suat.roomId || "";
        }
      }
      const validRoomId = roomIdMap[roomIdRaw] || roomIdRaw || "";

      // Chuyển đổi định dạng date
      const date = suat.date
        ? new Date(suat.date).toISOString().split("T")[0]
        : "";

      setForm({
        movieId: validMovieId,
        roomId: validRoomId,
        date,
        startTime: suat.startTime || "",
      });
      setEditIndex(index);
    } else {
      setForm({
        movieId: "",
        roomId: "",
        date: "",
        startTime: "",
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
  const checkScheduleConflict = (newShowtime, excludeIndex = null) => {
    const conflicts = showtimes.filter((showtime, index) => {
      if (index === excludeIndex) return false;

      // Lấy roomId
      const existingRoomId =
        showtime.roomId && typeof showtime.roomId === "object"
          ? showtime.roomId._id ||
            showtime.roomId.roomId ||
            showtime.roomId.phong_id
          : showtime.roomId;

      if (String(existingRoomId) !== String(newShowtime.roomId)) return false;

      const isSameDate =
        new Date(showtime.date).toISOString().split("T")[0] ===
        newShowtime.date;
      if (!isSameDate) return false;

      const existingMovieId =
        showtime.movieId && typeof showtime.movieId === "object"
          ? showtime.movieId._id ||
            showtime.movieId.phim_id ||
            showtime.movieId.movieId
          : showtime.movieId;

      const existingDuration = getMovieDuration(existingMovieId);
      const existingEnd = calculateEndTime(
        showtime.startTime,
        existingDuration
      );

      // Chuyển sang phút để so sánh
      const toMinutes = (timeStr) => {
        const [h, m] = timeStr.split(":").map(Number);
        return h * 60 + m;
      };

      const buffer = 15;
      let newStartMin = toMinutes(newShowtime.startTime);
      let newEndMin = toMinutes(newShowtime.endTime);

      // Nếu giờ kết thúc nhỏ hơn giờ bắt đầu, tức là qua ngày hôm sau
      if (newEndMin <= newStartMin) {
        newEndMin += 24 * 60;
      }

      let existingStartMin = toMinutes(showtime.startTime);
      let existingEndMin = toMinutes(existingEnd);

      if (existingEndMin <= existingStartMin) {
        existingEndMin += 24 * 60;
      }

      // ✅ LOGIC ĐÚNG: Không trùng nếu:
      // - Suất mới kết thúc (+ buffer) trước khi suất cũ bắt đầu, HOẶC
      // - Suất mới bắt đầu sau khi suất cũ kết thúc (+ buffer)
      const hasConflict = !(
        newEndMin + buffer <= existingStartMin ||
        newStartMin >= existingEndMin + buffer
      );

      return hasConflict;
    });
    return conflicts;
  };

  const validateShowtime = (formData, excludeIndex = null) => {
    const errors = [];

    const formErrors = validateForm();
    if (formErrors.length > 0) return { isValid: false, errors: formErrors };

    const dateError = validateDate(formData.date, formData.movieId);
    if (dateError) errors.push(dateError);

    const timeError = validateTime(formData.startTime, formData.endTime);
    if (timeError) errors.push(timeError);

    const conflicts = checkScheduleConflict(formData, excludeIndex);

    if (conflicts.length > 0) {
      const conflict = conflicts[0];
      const conflictMovie = getMovieName(conflict.movieId);

      const conflictMovieId =
        conflict.movieId && typeof conflict.movieId === "object"
          ? conflict.movieId._id ||
            conflict.movieId.phim_id ||
            conflict.movieId.movieId
          : conflict.movieId;

      const conflictEndTime = calculateEndTime(
        conflict.startTime, // ← ĐÚNG: Dùng startTime
        getMovieDuration(conflictMovieId)
      );

      const time = `${conflict.startTime} - ${conflictEndTime}`;
      errors.push(
        `Trùng lịch với phim "${conflictMovie}" (${time}). Vui lòng cách nhau ít nhất 15 phút.`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      endTime: formData.endTime,
    };
  };

  // Thêm/sửa suất chiếu
  const handleSubmit = async () => {
    setLoadingSubmit(true);

    // Tìm phim & phòng
    const movieObj = movie.find(
      (p) =>
        p._id === form.movieId ||
        p.phim_id === form.movieId ||
        p.movieId === form.movieId
    );
    const roomObj = roomData.find(
      (r) =>
        r._id === form.roomId ||
        r.roomId === form.roomId ||
        r.phong_id === form.roomId
    );

    if (!movieObj || !roomObj) {
      setAlert({
        open: true,
        type: "error",
        message: "Không tìm thấy thông tin phim hoặc phòng chiếu",
      });
      setLoadingSubmit(false);
      return;
    }

    const duration = movieObj.duration || 0;
    const endTime = calculateEndTime(form.startTime, duration);

    //  Gọi validateShowtime sau khi có đầy đủ dữ liệu
    const validation = validateShowtime(
      {
        ...form,
        movieId: movieObj._id,
        roomId: roomObj._id,
        endTime,
      },
      editIndex
    );

    if (!validation.isValid) {
      setAlert({
        open: true,
        type: "error",
        message: validation.errors.join(". "),
      });
      setLoadingSubmit(false);
      return;
    }

    const newShowtime = {
      suat_chieu_id:
        editIndex !== null
          ? showtimes[editIndex].suat_chieu_id
          : Math.floor(Math.random() * 1000000),
      movieId: movieObj._id,
      roomId: roomObj._id,
      date: form.date,
      startTime: form.startTime,
      endTime,
    };

    try {
      if (editIndex !== null) {
        await axios.put(
          `/api/showtimes/${newShowtime.suat_chieu_id}`,
          newShowtime
        );
        setAlert({
          open: true,
          type: "success",
          message: "Cập nhật suất chiếu thành công",
        });
      } else {
        try {
          await axios.post("/api/showtimes", newShowtime);
          setAlert({
            open: true,
            type: "success",
            message: "Thêm suất chiếu thành công",
          });
        } catch (err) {
          console.log(err);
        }
      }

      fetchShowtimes();
      setOpenDialog(false);
    } catch (err) {
      setAlert({
        open: true,
        type: "error",
        message: "Lỗi khi lưu suất chiếu",
      });
    }

    setLoadingSubmit(false);
    setTimeout(() => setOpenDialog(false), 300);
  };

  // Xóa suất chiếu
  const handleDelete = async (index) => {
    setLoadingDelete(true);
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
    setLoadingDelete(false);
    setDeleteIndex(null);
  };

  // Lọc bảng
  const todayStr = new Date().toISOString().split("T")[0]; // ví dụ: '2025-07-24'

  const filteredShowtimes = useMemo(() => {
    return showtimes.filter((s) => {
      let movieIdRaw = "";
      if (s.movieId) {
        if (typeof s.movieId === "object") {
          movieIdRaw =
            s.movieId._id || s.movieId.phim_id || s.movieId.movieId || "";
        } else {
          movieIdRaw = s.movieId || "";
        }
      }
      const movieId = movieIdMap[movieIdRaw] || movieIdRaw;

      let roomIdRaw = "";
      if (s.roomId) {
        if (typeof s.roomId === "object") {
          roomIdRaw =
            s.roomId._id || s.roomId.roomId || s.roomId.phong_id || "";
        } else {
          roomIdRaw = s.roomId || "";
        }
      }
      const roomId = roomIdMap[roomIdRaw] || roomIdRaw;

      // ➕ Lọc ngày: chỉ hiện từ hôm nay trở đi
      const showDate = s.date
        ? new Date(s.date).toISOString().split("T")[0]
        : "";
      const isTodayOrFuture = showDate >= todayStr;

      return (
        isTodayOrFuture &&
        (!filters.movieId || movieId == filters.movieId) &&
        (!filters.roomId || roomId == filters.roomId) &&
        (!filters.date || showDate === filters.date)
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
  useEffect(() => {
    if (!openDialog) {
      setForm({ movieId: "", roomId: "", date: "", startTime: "" });
      setEditIndex(null);
    }
  }, [openDialog]);

  return (
    <Box p={4} sx={{ position: "relative" }}>
      <Backdrop open={loadingData} sx={{ zIndex: 1300 }}>
        <CircularProgress color="primary" />
      </Backdrop>
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
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
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
        variant="outlined"
        color="primary"
        sx={{ ml: 2, mr: 1 }}
        onClick={() => setOpenAutoDialog(true)}
      >
        Lập lịch tự động
      </Button>
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
          {loadingData
            ? renderSkeletonRows()
            : filteredShowtimes
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
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
                      <IconButton
                        color="error"
                        onClick={() => setDeleteIndex(index)}
                      >
                        <Delete />
                      </IconButton>
                      <ConfirmDialog
                        open={deleteIndex === index}
                        onClose={() => setDeleteIndex(null)}
                      >
                        <ConfirmTitle>Xác nhận xoá suất chiếu</ConfirmTitle>
                        <ConfirmContent>
                          <Typography>
                            Bạn có chắc chắn muốn xoá suất chiếu này không? Chỉ
                            cho phép xoá nếu chưa bán vé.
                          </Typography>
                        </ConfirmContent>
                        <ConfirmActions>
                          <Button onClick={() => setDeleteIndex(null)}>
                            Hủy
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(index)}
                            disabled={loadingDelete}
                            startIcon={
                              loadingDelete && <CircularProgress size={16} />
                            }
                          >
                            {loadingDelete ? "Đang xoá..." : "Xác nhận xoá"}
                          </Button>
                        </ConfirmActions>
                      </ConfirmDialog>
                    </TableCell>
                  </TableRow>
                ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={filteredShowtimes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />

      {/* FORM */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {loadingSubmit && <LinearProgress />}
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
                {movie.length === 0 && loading
                  ? [...Array(3)].map((_, i) => (
                      <MenuItem key={`skeleton-movie-${i}`} disabled>
                        <Skeleton width={100} />
                      </MenuItem>
                    ))
                  : movie.map((p) => (
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
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loadingSubmit}
            startIcon={loadingSubmit && <CircularProgress size={16} />}
          >
            {loadingSubmit ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={alert.type}
          variant="filled"
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <AutoSchedulerDialog
        open={openAutoDialog}
        onClose={() => setOpenAutoDialog(false)}
        movieList={movie}
        roomList={roomData}
        onSuccess={() => {
          fetchShowtimes();
          setAlert({
            open: true,
            type: "success",
            message: "Tự động sinh lịch thành công",
          });
          setTimeout(() => setOpenAutoDialog(false), 500);
        }}
        setAlert={setAlert}
      />
    </Box>
  );
};

export default ShowTimesManagement;
