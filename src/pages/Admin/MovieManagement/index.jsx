import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Snackbar,
  Tabs,
  Tab,
  Paper,
  InputAdornment,
  Autocomplete,
  Rating,
  Divider,
  Alert,
  CircularProgress,
  Backdrop,
  Skeleton,
  LinearProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  Movie as MovieIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import showtimesData from "../../../utils/movieData";
import axios from "../../../service/axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const doTuoiOptions = ["P", "T13", "T16", "T18", "C18"];

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);

  const [loading, setLoading] = useState(false);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [genresLoading, setGenresLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch (err) {
      return "";
    }
  };

  const [movieForm, setMovieForm] = useState({
    ten_phim: "",
    mo_ta: "",
    thoi_luong: "",
    the_loai: [],
    dien_vien: [],
    dao_dien: "",
    quoc_gia: "",
    nam_phat_hanh: new Date().getFullYear(),
    image: "",
    trailer: "",
    nhan_phim: "P",
    releaseDate: "",
    endDate: "",
    trang_thai: "sap_chieu",
    language: "",
  });

  const fetchShowtimes = async () => {
    try {
      const response = await axios.get("/api/showtimes");
      //console.log(response.data);
      setShowtimes(response.data);
    } catch (error) {
      //console.error("Lỗi khi lấy lịch chiếu:", error);
      setShowtimes(showtimesData);
    }
  };

  const fetchMovies = async (showLoading = true) => {
    if (showLoading) setMoviesLoading(true);
    try {
      const response = await axios.get("/api/movies");
      //console.log("API Response:", response.data);
      const today = new Date();

      const formatted = response.data.map((movie) => {
        const releaseDate = new Date(movie.releaseDate);
        const endDate = new Date(movie.endDate);
        let trang_thai = "sap_chieu";
        if (releaseDate <= today && endDate >= today) trang_thai = "dang_chieu";
        else if (endDate < today) trang_thai = "het_chieu";

        return {
          phim_id: movie.phim_id,
          ten_phim: movie.title,
          mo_ta: movie.description,
          thoi_luong: movie.duration,
          the_loai: movie.genre ? [movie.genre] : [],
          dien_vien: Array.isArray(movie.actors) ? movie.actors : [],
          dao_dien: movie.director || "",
          quoc_gia: movie.language === "Vietnamese" ? "Việt Nam" : "Mỹ",
          nam_phat_hanh: new Date(movie.releaseDate).getFullYear(),
          image: movie.poster,
          trailer: movie.trailer,
          nhan_phim: movie.label || "P",
          releaseDate: formatDateForInput(movie.releaseDate),
          endDate: formatDateForInput(movie.endDate),
          trang_thai,
          language: movie.language || "",
        };
      });

      setMovies(formatted);
      setFilteredMovies(formatted);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Không thể tải danh sách phim!",
        severity: "error",
      });
    } finally {
      if (showLoading) setMoviesLoading(false);
    }
  };

  const fetchGenres = async () => {
    setGenresLoading(true);
    try {
      const res = await axios.get("/api/genres");
      setGenres(res.data);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Không thể tải danh sách thể loại!",
        severity: "error",
      });
    } finally {
      setGenresLoading(false);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchGenres(), fetchMovies(), fetchShowtimes()]);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMovies(false);
      fetchShowtimes();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = [...movies];
    if (filterGenre)
      filtered = filtered.filter((m) => m.the_loai.includes(filterGenre));
    if (searchTerm)
      filtered = filtered.filter((m) =>
        m.ten_phim.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (tabValue === 1)
      filtered = filtered.filter((m) => m.trang_thai === "dang_chieu");
    else if (tabValue === 2)
      filtered = filtered.filter((m) => m.trang_thai === "sap_chieu");
    else if (tabValue === 3)
      filtered = filtered.filter((m) => m.trang_thai === "het_chieu");
    setFilteredMovies(filtered);
  }, [movies, searchTerm, filterGenre, tabValue]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchMovies(false), fetchShowtimes()]);
      setSnackbar({
        open: true,
        message: "Dữ liệu đã được cập nhật!",
        severity: "success",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = async (movie = null) => {
    try {
      if (genres.length === 0) {
        await fetchGenres();
      }

      setEditingMovie(movie);
      setMovieForm(
        movie
          ? {
              ...movie,
              the_loai: movie.the_loai,
              genreId: movie.genreId,
              releaseDate: formatDateForInput(movie.releaseDate),
              endDate: formatDateForInput(movie.endDate),
            }
          : {
              ten_phim: "",
              mo_ta: "",
              thoi_luong: "",
              the_loai: [],
              dien_vien: [],
              dao_dien: "",
              quoc_gia: "",
              nam_phat_hanh: new Date().getFullYear(),
              image: "",
              trailer: "",
              nhan_phim: "P",
              releaseDate: "",
              endDate: "",
              trang_thai: "sap_chieu",
              language: "",
            }
      );

      setOpenDialog(true);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Không thể tải danh sách thể loại!",
        severity: "error",
      });
    }
  };

  const handleSaveMovie = async () => {
    if (
      !movieForm.ten_phim ||
      !movieForm.dao_dien ||
      !movieForm.thoi_luong ||
      movieForm.the_loai.length === 0
    ) {
      return setSnackbar({
        open: true,
        message: "Vui lòng điền đầy đủ và chọn thể loại!",
        severity: "error",
      });
    }

    setSaveLoading(true);
    const movieToSend = {
      phim_id: editingMovie?.phim_id || Math.floor(Math.random() * 1000000),
      title: movieForm.ten_phim,
      description: movieForm.mo_ta,
      duration: movieForm.thoi_luong,
      genre: movieForm.the_loai.flat(),
      actors: movieForm.dien_vien,
      director: movieForm.dao_dien,
      language: movieForm.quoc_gia === "Việt Nam" ? "Vietnamese" : "English",
      releaseDate: movieForm.releaseDate
        ? new Date(movieForm.releaseDate).toISOString()
        : null,
      endDate: movieForm.endDate
        ? new Date(movieForm.endDate).toISOString()
        : null,
      poster: movieForm.image,
      trailer: movieForm.trailer,
      label: movieForm.nhan_phim,
    };

    try {
      if (editingMovie) {
        await axios.put(`/api/movies/${editingMovie.phim_id}`, movieToSend);
        setSnackbar({
          open: true,
          message: "Cập nhật phim thành công!",
          severity: "success",
        });
      } else {
        await axios.post("/api/movies", movieToSend);
        setSnackbar({
          open: true,
          message: "Thêm phim mới thành công!",
          severity: "success",
        });
      }

      setOpenDialog(false);
      await fetchMovies(false);
    } catch (error) {
      console.error("Lỗi khi lưu phim:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Có lỗi khi lưu phim!",
        severity: "error",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const checkMovieHasShowtimes = (movie) => {
    if (!movie || !movie.ten_phim) return false;

    return showtimes.some((showtime) => {
      const title = showtime?.movieId?.title;
      return (
        typeof title === "string" &&
        title.toLowerCase().trim() === movie.ten_phim.toLowerCase().trim()
      );
    });
  };
  const handleDeleteClick = (movie) => {
    //console.log("Movie object:", movie);
    const hasShowtime = checkMovieHasShowtimes(movie);
    // console.log(hasShowtime);
    // console.log("Movie ID:", movie.phim_id);
    // console.log(
    //   "Matched showtimes:",
    //   showtimes.filter((s) => s.movieId?._id === movie.phim_id)
    // );

    if (hasShowtime) {
      return setSnackbar({
        open: true,
        message:
          "Không thể xóa phim vì còn lịch chiếu hoặc đã có khách đặt vé!",
        severity: "warning",
      });
    }

    setMovieToDelete(movie);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteMovie = async () => {
    if (!movieToDelete) return;

    setDeleteLoading(true);
    try {
      await axios.delete(`/api/movies/${movieToDelete.phim_id}`);

      setSnackbar({
        open: true,
        message: `Xóa phim "${movieToDelete.ten_phim}" thành công!`,
        severity: "success",
      });

      setDeleteDialogOpen(false);
      setMovieToDelete(null);
      await fetchMovies(false);
    } catch (error) {
      console.error("Lỗi khi xóa phim:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Xóa phim thất bại!",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderMovieCard = (movie) => {
    const hasShowtimes = checkMovieHasShowtimes(movie.phim_id);

    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={movie.phim_id}>
        <Card
          sx={{
            width: 320,
            height: 420,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image={movie.image || "/placeholder-movie.jpg"}
            alt={movie.ten_phim}
          />
          <CardContent sx={{ flex: 1, minHeight: 0 }}>
            <Typography variant="h6" noWrap title={movie.ten_phim}>
              {movie.ten_phim}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              Đạo diễn: {movie.dao_dien}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              Diễn viên:{" "}
              {Array.isArray(movie.dien_vien)
                ? movie.dien_vien.join(", ")
                : movie.dien_vien}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              Thể loại:{" "}
              {Array.isArray(movie.the_loai)
                ? movie.the_loai.join(", ")
                : movie.the_loai}
            </Typography>
            <Typography variant="caption">
              {movie.thoi_luong} phút | {movie.nhan_phim} |{" "}
              {dayjs(movie.releaseDate)
                .tz("Asia/Ho_Chi_Minh")
                .format("DD/MM/YYYY")}{" "}
              -{" "}
              {dayjs(movie.endDate).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY")}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() => handleOpenDialog(movie)}
              startIcon={<EditIcon />}
              disabled={loading}
            >
              Sửa
            </Button>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteClick(movie)}
              disabled={loading}
              title={
                hasShowtimes ? "Không thể xóa - có lịch chiếu" : "Xóa phim"
              }
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  const renderSkeletonCards = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
        <Card sx={{ width: 320, height: 420 }}>
          <Skeleton variant="rectangular" height={200} />
          <CardContent>
            <Skeleton variant="text" height={32} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={16} />
          </CardContent>
          <CardActions>
            <Skeleton variant="rectangular" width={60} height={30} />
            <Skeleton variant="circular" width={30} height={30} />
          </CardActions>
        </Card>
      </Grid>
    ));
  };

  return (
    <Box p={3}>
      {/* Loading backdrop */}
      <Backdrop open={loading} sx={{ zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" fontWeight={700} color="primary">
          Quản lý phim
        </Typography>
        <Box display="flex" gap={1}>
          <IconButton
            onClick={handleRefresh}
            disabled={loading}
            title="Làm mới"
          >
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            disabled={loading}
          >
            Thêm phim
          </Button>
        </Box>
      </Box>

      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm phim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={moviesLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: "100px" }}>
            <FormControl fullWidth disabled={genresLoading || moviesLoading}>
              <InputLabel>Thể loại</InputLabel>
              <Select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                label="Thể loại"
              >
                <MenuItem value="">Tất cả</MenuItem>
                {genres.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
        <Tab label={`Tất cả (${movies.length})`} />
        <Tab
          label={`Đang chiếu (${
            movies.filter((m) => m.trang_thai === "dang_chieu").length
          })`}
        />
        <Tab
          label={`Sắp chiếu (${
            movies.filter((m) => m.trang_thai === "sap_chieu").length
          })`}
        />
        <Tab
          label={`Hết chiếu (${
            movies.filter((m) => m.trang_thai === "het_chieu").length
          })`}
        />
      </Tabs>

      {/* Movies Grid */}
      <Grid container spacing={3}>
        {moviesLoading ? (
          renderSkeletonCards()
        ) : filteredMovies.length > 0 ? (
          filteredMovies.map(renderMovieCard)
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <MovieIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
              <Typography variant="h6" color="grey.600">
                Không tìm thấy phim nào
              </Typography>
              <Typography variant="body2" color="grey.500">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Add/Edit Movie Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => !saveLoading && setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingMovie ? "Chỉnh sửa phim" : "Thêm phim mới"}
          <IconButton
            onClick={() => setOpenDialog(false)}
            disabled={saveLoading}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {saveLoading && <LinearProgress />}
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên phim *"
                fullWidth
                disabled={saveLoading}
                value={movieForm.ten_phim}
                onChange={(e) =>
                  setMovieForm({ ...movieForm, ten_phim: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Đạo diễn *"
                fullWidth
                disabled={saveLoading}
                value={movieForm.dao_dien}
                onChange={(e) =>
                  setMovieForm({ ...movieForm, dao_dien: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Diễn viên"
                fullWidth
                disabled={saveLoading}
                value={movieForm.dien_vien}
                onChange={(e) =>
                  setMovieForm({ ...movieForm, dien_vien: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngôn ngữ"
                fullWidth
                disabled={saveLoading}
                value={movieForm.language}
                onChange={(e) =>
                  setMovieForm({ ...movieForm, language: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Thời lượng (phút) *"
                fullWidth
                type="number"
                disabled={saveLoading}
                value={movieForm.thoi_luong}
                onChange={(e) =>
                  setMovieForm({
                    ...movieForm,
                    thoi_luong: parseInt(e.target.value) || "",
                  })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Năm phát hành"
                fullWidth
                type="number"
                disabled={saveLoading}
                value={movieForm.nam_phat_hanh}
                onChange={(e) =>
                  setMovieForm({
                    ...movieForm,
                    nam_phat_hanh: parseInt(e.target.value) || "",
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={genres}
                value={movieForm.the_loai}
                disabled={saveLoading || genresLoading}
                onChange={(e, v) => setMovieForm({ ...movieForm, the_loai: v })}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField {...params} label="Thể loại *" />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Poster URL"
                fullWidth
                disabled={saveLoading}
                value={movieForm.image}
                onChange={(e) =>
                  setMovieForm({ ...movieForm, image: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Trailer URL"
                fullWidth
                disabled={saveLoading}
                value={movieForm.trailer}
                onChange={(e) =>
                  setMovieForm({ ...movieForm, trailer: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Ngày công chiếu"
                type="date"
                fullWidth
                disabled={saveLoading}
                InputLabelProps={{ shrink: true }}
                value={movieForm.releaseDate}
                onChange={(e) =>
                  setMovieForm({
                    ...movieForm,
                    releaseDate: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Ngày kết thúc"
                type="date"
                fullWidth
                disabled={saveLoading}
                InputLabelProps={{ shrink: true }}
                value={movieForm.endDate}
                onChange={(e) =>
                  setMovieForm({ ...movieForm, endDate: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6} minWidth={"100px"}>
              <FormControl fullWidth disabled={saveLoading}>
                <InputLabel>Độ tuổi</InputLabel>
                <Select
                  value={movieForm.nhan_phim}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, nhan_phim: e.target.value })
                  }
                >
                  {doTuoiOptions.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mô tả"
                fullWidth
                multiline
                rows={4}
                disabled={saveLoading}
                value={movieForm.mo_ta}
                onChange={(e) =>
                  setMovieForm({ ...movieForm, mo_ta: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={saveLoading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveMovie}
            disabled={saveLoading}
            startIcon={saveLoading ? <CircularProgress size={16} /> : null}
          >
            {saveLoading ? "Đang lưu..." : editingMovie ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa phim</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc muốn xóa phim <strong>{movieToDelete?.ten_phim}</strong>{" "}
            không?
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
            Hành động này không thể hoàn tác!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLoading}
          >
            Hủy
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={16} /> : null}
            onClick={confirmDeleteMovie}
          >
            {deleteLoading ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MovieManagement;
