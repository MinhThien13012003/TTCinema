import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Typography,
  Box,
  Container,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../../service/axios";

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// Ẩn suất quá khứ
const isPastShowtime = (date, startTime) => {
  const now = new Date();
  const showtimeDate = new Date(date);

  // Tách giờ và phút từ startTime
  const [hours, minutes] = startTime.split(":").map(Number);
  showtimeDate.setHours(hours, minutes, 0, 0);

  // Trừ đi 5 phút (5 * 60 * 1000 = 300000 milliseconds)
  const showtimeWith5MinBuffer = new Date(
    showtimeDate.getTime() - 5 * 60 * 1000
  );

  return showtimeWith5MinBuffer < now;
};

const ShowTime = ({ movieId }) => {
  const navigate = useNavigate();
  const [showTimesData, setShowTimesData] = useState([]);
  const [roomsData, setRoomsData] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShowTimes = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/showtimes");
        setShowTimesData(res.data);
      } catch (err) {
        setShowTimesData([]);
      }
      setLoading(false);
    };
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/rooms");
        setRoomsData(res.data);
      } catch (err) {
        setRoomsData([]);
      }
      setLoading(false);
    };
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/movies");
        setMoviesData(res.data);
      } catch (err) {
        setMoviesData([]);
      }
      setLoading(false);
    };
    fetchShowTimes();
    fetchRooms();
    fetchMovies();
  }, []);

  const movieIdMap = useMemo(() => {
    return Object.fromEntries(
      moviesData.map((p) => [p._id, p.phim_id || p.movieId || p._id])
    );
  }, [moviesData]);

  // Tạo ánh xạ từ _id sang roomId
  const roomIdMap = useMemo(() => {
    return Object.fromEntries(
      roomsData.map((r) => [r._id, r.roomId || r.phong_id || r._id])
    );
  }, [roomsData]);

  // Hàm lấy tên phòng
  const getTenPhong = (roomId) => {
    const roomIdRaw =
      typeof roomId === "object"
        ? roomId._id || roomId.roomId || roomId.phong_id || ""
        : roomId || "";

    const validRoomId = String(roomIdMap?.[roomIdRaw] || roomIdRaw);

    const phong = roomsData.find((room) =>
      [room._id, room.roomId, room.phong_id].some(
        (id) => String(id) === validRoomId
      )
    );

    return phong?.name || phong?.ten_phong || `Phòng ${validRoomId}`;
  };

  // Lọc suất chiếu theo phim và loại bỏ các suất đã qua
  const filteredSuatChieu = useMemo(() => {
    return showTimesData.filter((suat) => {
      const movieIdRaw =
        typeof suat.movieId === "object"
          ? suat.movieId._id ||
            suat.movieId.phim_id ||
            suat.movieId.movieId ||
            ""
          : suat.movieId || "";
      const validMovieId = movieIdMap[movieIdRaw] || movieIdRaw;

      // Kiểm tra movieId và thời gian chiếu
      const isCorrectMovie = String(validMovieId) === String(movieId);
      const isNotPast = !isPastShowtime(suat.date, suat.startTime);

      return isCorrectMovie && isNotPast;
    });
  }, [showTimesData, movieId, movieIdMap]);

  const suatChieuTheoNgayVaPhong = useMemo(() => {
    const grouped = filteredSuatChieu.reduce((acc, suat) => {
      const ngay = suat.date;
      const roomIdRaw =
        typeof suat.roomId === "object"
          ? suat.roomId._id || suat.roomId.roomId || suat.roomId.phong_id || ""
          : suat.roomId || "";
      const validRoomId = roomIdMap[roomIdRaw] || roomIdRaw;

      if (!acc[ngay]) {
        acc[ngay] = {};
      }
      if (!acc[ngay][validRoomId]) {
        acc[ngay][validRoomId] = [];
      }
      acc[ngay][validRoomId].push(suat);
      return acc;
    }, {});

    // Loại bỏ các ngày không có suất chiếu nào (sau khi filter)
    const filteredGrouped = {};
    Object.entries(grouped).forEach(([ngay, phongData]) => {
      const hasValidShowtimes = Object.values(phongData).some(
        (suatChieus) => suatChieus.length > 0
      );
      if (hasValidShowtimes) {
        // Chỉ giữ lại các phòng có suất chiếu
        const validPhongData = {};
        Object.entries(phongData).forEach(([roomId, suatChieus]) => {
          if (suatChieus.length > 0) {
            validPhongData[roomId] = suatChieus;
          }
        });
        filteredGrouped[ngay] = validPhongData;
      }
    });

    return filteredGrouped;
  }, [filteredSuatChieu, roomIdMap]);

  const handleBooking = (suatChieu) => {
    // Kiểm tra lại xem suất chiếu có còn hiệu lực không trước khi booking (trước 5 phút)
    if (isPastShowtime(suatChieu.date, suatChieu.startTime)) {
      alert(
        "Suất chiếu này sắp bắt đầu hoặc đã bắt đầu. Vui lòng chọn suất chiếu khác."
      );
      return;
    }

    const movie = moviesData.find((m) => {
      const movieIdRaw =
        typeof suatChieu.movieId === "object"
          ? suatChieu.movieId._id ||
            suatChieu.movieId.phim_id ||
            suatChieu.movieId.movieId ||
            ""
          : suatChieu.movieId || "";
      const validMovieId = movieIdMap[movieIdRaw] || movieIdRaw;
      return String(validMovieId) === String(movieId);
    });

    const room = roomsData.find((r) => {
      const roomIdRaw =
        typeof suatChieu.roomId === "object"
          ? suatChieu.roomId._id ||
            suatChieu.roomId.roomId ||
            suatChieu.roomId.phong_id ||
            ""
          : suatChieu.roomId || "";
      const validRoomId = roomIdMap[roomIdRaw] || roomIdRaw;
      return (
        r._id === validRoomId ||
        r.roomId === validRoomId ||
        r.phong_id === validRoomId
      );
    });

    navigate(`/booking/${suatChieu.suat_chieu_id}`, {
      state: {
        movieId: movieId,
        suatChieu: suatChieu,
        movie: movie || {},
        room: room || {},
      },
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2, position: "relative" }}>
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
      {Object.entries(suatChieuTheoNgayVaPhong).map(([ngay, phongData]) => (
        <Box key={ngay} sx={{ mb: 3 }}>
          {/* Header ngày chiếu */}
          <Box
            sx={{
              bgcolor: "#4A5FD9",
              color: "white",
              px: 1,
              py: 0.5,
              borderRadius: 0.5,
              mb: 1.5,
              textAlign: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, fontSize: "14px" }}
            >
              {formatDateDisplay(ngay)}
            </Typography>
          </Box>

          {/* Danh sách phòng cho ngày này */}
          {Object.entries(phongData).map(([roomId, suatChieus]) => (
            <Box key={roomId} sx={{ mb: 2 }}>
              {/* Tên phòng */}
              <Box
                sx={{
                  bgcolor: "#f5f5f5",
                  px: 2,
                  py: 0.75,
                  borderRadius: 0.5,
                  mb: 1,
                  borderLeft: "3px solid #4A5FD9",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: "13px",
                    color: "#333",
                  }}
                >
                  {getTenPhong(roomId)}
                </Typography>
              </Box>

              {/* Buttons giờ chiếu cho phòng này */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", pl: 1 }}>
                {suatChieus
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((suatChieu) => (
                    <Button
                      key={suatChieu.suat_chieu_id}
                      onClick={() => handleBooking(suatChieu)}
                      sx={{
                        bgcolor: "#ffa726",
                        color: "white",
                        px: 2,
                        py: 0.75,
                        borderRadius: 0.5,
                        fontWeight: 600,
                        fontSize: "13px",
                        minWidth: "60px",
                        height: "32px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "#ff9800",
                          transform: "scale(1.03)",
                        },
                      }}
                    >
                      {suatChieu.startTime} - {suatChieu.endTime}
                    </Button>
                  ))}
              </Box>
            </Box>
          ))}
        </Box>
      ))}

      {/* Empty state */}
      {Object.keys(suatChieuTheoNgayVaPhong).length === 0 && (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "14px" }}
          >
            Không có suất chiếu nào khả dụng cho phim này
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ShowTime;
