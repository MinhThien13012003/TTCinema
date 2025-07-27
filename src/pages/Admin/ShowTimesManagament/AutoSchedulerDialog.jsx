import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "../../../service/axios";
import { useEffect, useState } from "react";

const AutoScheduleDialog = ({
  open,
  onClose,
  movieList,
  roomList,
  onSuccess,
  setAlert,
}) => {
  const [form, setForm] = useState({
    movieId: "",
    roomId: "",
    startDate: "",
    endDate: "",
    slotsPerDay: 3,
  });
  const [generate, setGenerate] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [alert, setAlert] = useState({
  //   open: false,
  //   message: "",
  //   type: "success",
  // });
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };
  const calculateEndTime = (startTime, duration) => {
    const [h, m] = startTime.split(":").map(Number);
    const d = new Date(0, 0, 0, h, m);
    d.setMinutes(d.getMinutes() + duration);
    return d.toTimeString().substring(0, 5);
  };
  const checkScheduleConflict = (newSt, allShowtimes = []) => {
    const toMin = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    return allShowtimes.some((s) => {
      const sRoomId = typeof s.roomId === "object" ? s.roomId._id : s.roomId;
      const sDate = new Date(s.date).toISOString().split("T")[0];
      const newDate = newSt.date;

      if (sRoomId !== newSt.roomId || sDate !== newDate) return false;

      const existingStart = toMin(s.startTime);
      const existingEnd = toMin(s.endTime);
      const newStart = toMin(newSt.startTime);
      const newEnd = toMin(newSt.endTime);
      const buffer = 15;

      return !(
        newEnd + buffer <= existingStart || newStart >= existingEnd + buffer
      );
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    const { movieId, roomId, startDate, endDate, slotsPerDay } = form;
    console.log("DATA:", movieId, roomId, startDate, endDate, slotsPerDay);
    if (!movieId || !roomId || !startDate || !endDate || !slotsPerDay) return;

    const movie = movieList.find((m) => m._id === movieId);
    const duration = movie?.duration;
    const buffer = 15;

    const res = await axios.get("/api/showtimes");
    const allShowTimes = res.data;
    console.log("Lịch đã có:", allShowTimes);

    const results = [];
    let current = new Date(startDate);
    const end = new Date(endDate);
    while (current <= end) {
      const dateStr = current.toISOString().split("T")[0];
      let startHour = 9;
      for (let i = 0; i < slotsPerDay; i++) {
        const hour = startHour + i * ((duration + buffer) / 60);
        if (hour >= 24) break;
        const hh = String(Math.floor(hour)).padStart(2, "0");
        const mm = String(Math.round((hour % 1) * 60)).padStart(2, "0");
        const startTime = `${hh}:${mm}`;
        const endTime = calculateEndTime(startTime, duration);

        const newStr = { movieId, roomId, date: dateStr, startTime, endTime };

        if (!checkScheduleConflict(newStr, allShowTimes.concat(results))) {
          results.push(newStr);
        }
      }
      current.setDate(current.getDate() + 1);
    }

    //console.log("Generated results:", results);
    setGenerate(results);
    setLoading(false);
    if (results.length === 0) {
      setAlert({
        open: true,
        type: "warning",
        message: "Không thể sinh lịch chiếu vì trùng toàn bộ với lịch đã có!",
      });
      return;
    } else {
      setAlert({
        open: true,
        type: "success",
        message: `Đã sinh thành công ${results.length} suất chiếu.`,
      });
    }
  };
  const handleSave = async () => {
    setLoading(true);
    try {
      for (const st of generate) {
        console.log("Sending:", st);
        await axios.post("/api/showtimes", {
          ...st,
          suat_chieu_id: Math.floor(Math.random() * 1000000),
        });
      }
      setAlert({ open: true, message: "Đã lưu thành công", type: "success" });
      onSuccess();
    } catch (err) {
      console.log(err);
      console.error("Chi tiết:", err?.response?.data);
      setAlert({
        open: true,
        message: `Lỗi khi lưu, ${err.message}`,
        type: "error",
      });
    }
    setLoading(false);
  };
  const getMovieTitle = (id) => {
    return movieList.find((m) => m._id === id)?.title || `Phim ${id}`;
  };
  const getRoomName = (id) => {
    return roomList.find((m) => m._id === id)?.name || `Phong ${id}`;
  };
  useEffect(() => {
    if (!open) {
      setForm({
        movieId: "",
        roomId: "",
        startDate: "",
        endDate: "",
        slotsPerDay: 3,
      });
      setGenerate([]);
    }
  }, [open]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Lập lịch chiếu tự động</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={2}>
          <TextField
            select
            label="Phim"
            name="movieId"
            value={form.movieId}
            fullWidth
            onChange={(e) => setForm({ ...form, movieId: e.target.value })}
          >
            {movieList.map((m) => (
              <MenuItem key={m._id} value={m._id}>
                {m?.title || ""}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid container spacing={2} mt={2}>
          <TextField
            select
            label="Phòng"
            name="roomId"
            value={form.roomId}
            fullWidth
            onChange={(e) => setForm({ ...form, roomId: e.target.value })}
          >
            {roomList.map((r) => (
              <MenuItem key={r._id} value={r._id}>
                {r?.name || ""}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} spacing={2} mt={2}>
          <TextField
            type="date"
            label="Từ ngày"
            fullWidth
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} spacing={2} mt={2}>
          <TextField
            type="date"
            label="Đến ngày"
            fullWidth
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} spacing={2} mt={2}>
          <TextField
            type="number"
            label="Số suất chiếu/ngày"
            fullWidth
            value={form.slotsPerDay || ""}
            onChange={(e) =>
              setForm({
                ...form,
                slotsPerDay: parseInt(e.target.value) || 0, // fallback 0 nếu người dùng xóa hết
              })
            }
          />
        </Grid>
        {generate.length > 0 && (
          <Table size="small" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Phim</TableCell>
                <TableCell>Phòng</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Giờ bắt đầu</TableCell>
                <TableCell>Giờ kết thúc</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {generate.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{getMovieTitle(row.movieId)}</TableCell>
                  <TableCell>{getRoomName(row.roomId)}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.startTime}</TableCell>
                  <TableCell>{row.endTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}> Hủy</Button>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Sinh lịch"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={generate.length === 0 || loading}
        >
          {loading ? <CircularProgress size={20} /> : "Lưu tất cả"}
        </Button>
      </DialogActions>
      {/* <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          severity={alert.type}
          onClose={() => setAlert({ ...alert, open: false })}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar> */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.type}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AutoScheduleDialog;
