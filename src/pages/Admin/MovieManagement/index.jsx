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
} from "@mui/icons-material";
//import movieData from "../../../utils/movieData";
import showtimesData from "../../../utils/movieData";
import AddGenre from "./AddGenres";
import axios from "../../../service/axios";

// export const theLoaiOptions = [
//   "Hành động",
//   "Hài",
//   "Tình cảm",
//   "Kinh dị",
//   "Hoạt hình",
//   "Phiêu lưu",
// ];
export const doTuoiOptions = ["P", "T13", "T16", "T18", "C18"];

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);

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
    ngay_cong_chieu: "",
    ngay_ket_thuc: "",
    trang_thai: "sap_chieu",
    language: "",
  });

  const fetchMovies = async () => {
    try {
      const response = await axios.get("/api/movies");
      console.log("API Response:", response.data);
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
          ngay_cong_chieu: movie.releaseDate,
          ngay_ket_thuc: movie.endDate,
          trang_thai,
          language: movie.language || "",
        };
      });

      setMovies(formatted);
      setFilteredMovies(formatted);
    } catch (error) {
      console.error("Lỗi khi lấy phim:", error);
    }
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get("/api/genres");
        setGenres(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thể loại:", err);
      }
    };

    fetchGenres();
    fetchMovies();
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

  useEffect(() => {
    // Hiển thị hoặc thực hiện hành động sau khi snackbar đóng
    if (!snackbar.open && snackbar.message) {
      fetchMovies(); // Làm mới danh sách phim sau khi thông báo đóng
    }
  }, [snackbar.open, snackbar.message]);

  const handleOpenDialog = async (movie = null) => {
    try {
      if (genres.length === 0) {
        const genreRes = await axios.get("/api/genres");
        setGenres(genreRes.data);
      }

      setEditingMovie(movie);
      setMovieForm(
        movie
          ? {
              ...movie,
              the_loai: movie.the_loai,
              genreId: movie.genreId,
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
              ngay_cong_chieu: "",
              ngay_ket_thuc: "",
              trang_thai: "sap_chieu",
            }
      );

      setOpenDialog(true);
    } catch (err) {
      console.error("Lỗi khi tải thể loại:", err);
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

    const movieToSend = {
      phim_id: Math.floor(Math.random() * 1000000), // giả lập ID
      title: movieForm.ten_phim,
      description: movieForm.mo_ta,
      duration: movieForm.thoi_luong,
      genre: movieForm.the_loai.flat(), // Làm phẳng mảng để tránh lồng nhau
      actors: movieForm.dien_vien,
      director: movieForm.dao_dien,
      language: movieForm.quoc_gia === "Việt Nam" ? "Vietnamese" : "English",
      releaseDate: movieForm.ngay_cong_chieu,
      endDate: movieForm.ngay_ket_thuc,
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
        console.log("Phim gửi đi:", movieToSend);
        await axios.post("/api/movies", movieToSend);
        setSnackbar({
          open: true,
          message: "Thêm phim mới thành công!",
          severity: "success",
        });
      }

      const refreshed = await axios.get("/api/movies");
      const today = new Date();
      const formatted = refreshed.data.map((movie) => {
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
          the_loai: movie.genresId || [],
          dien_vien: Array.isArray(movie.actors) ? movie.actors : [],
          dao_dien: movie.director || "",
          quoc_gia: movie.language === "Vietnamese" ? "Việt Nam" : "Mỹ",
          nam_phat_hanh: new Date(movie.releaseDate).getFullYear(),
          image: movie.poster,
          trailer: movie.trailer,
          nhan_phim: movie.label || "P",
          ngay_cong_chieu: movie.releaseDate,
          ngay_ket_thuc: movie.endDate,
          trang_thai,
        };
      });

      setMovies(formatted);
      setOpenDialog(false);
    } catch (error) {
      console.error("Lỗi khi lưu phim:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi khi lưu phim!",
        severity: "error",
      });
    }
  };

  const handleDeleteClick = (movie) => {
    console.log("Movie object:", movie);
    const hasShowtime = showtimesData.some((s) => s.phim_id === movie.phim_id);
    if (hasShowtime) {
      return setSnackbar({
        open: true,
        message: "Không thể xóa phim vì còn lịch chiếu!",
        severity: "error",
      });
    }
    setMovieToDelete(movie);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteMovie = async (movie) => {
    try {
      console.log("Phim ID cần xóa:", movie.phim_id, typeof movie.phim_id);
      await axios.delete(`/api/movies/${movie.phim_id}`);
      setSnackbar({
        open: true,
        message: "Xóa phim thành công!",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      setMovieToDelete(null);
      fetchMovies();
    } catch (error) {
      console.error("Lỗi khi xóa phim:", error);
      setSnackbar({
        open: true,
        message: "Xóa phim thất bại!",
        severity: "error",
      });
    }
  };

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" fontWeight={700}>
          <MovieIcon /> Quản lý phim
        </Typography>
        <Box display="flex" gap={1}>
          <AddGenre onGenreAdded={(genre) => console.log("Thêm:", genre)} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Thêm phim
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment nment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid>
            <FormControl sx={{ minWidth: 200, width: "100%", maxWidth: 300 }}>
              <InputLabel size="medium">Thể loại</InputLabel>
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

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
        <Tab label="Tất cả" />
        <Tab label="Đang chiếu" />
        <Tab label="Sắp chiếu" />
        <Tab label="Hết chiếu" />
      </Tabs>

      <Grid container spacing={3}>
        {filteredMovies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.phim_id}>
            <Card
              sx={{
                width: 320,
                height: 420,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={movie.image}
                alt={movie.ten_phim}
              />
              <CardContent sx={{ flex: 1, minHeight: 0 }}>
                <Typography variant="h6" noWrap>
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
                  {movie.nam_phat_hanh}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleOpenDialog(movie)}
                  startIcon={<EditIcon />}
                >
                  Sửa
                </Button>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteClick(movie)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingMovie ? "Chỉnh sửa phim" : "Thêm phim mới"}
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên phim"
                fullWidth
                value={movieForm.ten_phim}
                onChange={(e) =>
                  setMovieForm({ ...movieForm, ten_phim: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Đạo diễn"
                fullWidth
                value={movieForm.dao_dien}
                onChange={(e) =>
                  setMovieForm({ ...movieForm, dao_dien: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Diễn viên "
                fullWidth
                value={movieForm.dien_vien}
                onChange={(e) =>
                  setMovieForm({ ...movieForm, dien_vien: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngôn ngu "
                fullWidth
                value={movieForm.language}
                onChange={(e) =>
                  setMovieForm({ ...movieForm, language: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Thời lượng (phút)"
                fullWidth
                type="number"
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
                onChange={(e, v) => setMovieForm({ ...movieForm, the_loai: v })}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField {...params} label="Thể loại" />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Poster URL"
                fullWidth
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
                InputLabelProps={{ shrink: true }}
                value={movieForm.ngay_cong_chieu}
                onChange={(e) =>
                  setMovieForm({
                    ...movieForm,
                    ngay_cong_chieu: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Ngày kết thúc"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={movieForm.ngay_ket_thuc}
                onChange={(e) =>
                  setMovieForm({ ...movieForm, ngay_ket_thuc: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <FormControl sx={{ minWidth: 100, width: "100%", maxWidth: 150 }}>
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
                sx={{ "& .MuiInputBase-input": { padding: "16px" } }}
                label="Mô tả"
                fullWidth
                multiline
                rows={4}
                value={movieForm.mo_ta}
                onChange={(e) =>
                  setMovieForm({ ...movieForm, mo_ta: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveMovie}>
            {editingMovie ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa phim</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc muốn xóa phim <strong>{movieToDelete?.ten_phim}</strong>{" "}
            không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => confirmDeleteMovie(movieToDelete)}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MovieManagement;
