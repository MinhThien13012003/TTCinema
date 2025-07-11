import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../../service/axios"; // Thêm dòng này
import roomData from "../../utils/roomData";

const formatDateDisplay = (dateStr) => {
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
};

const ShowTime = ({ movieId }) => {
  const navigate = useNavigate();
  const [showTimesData, setShowTimesData] = useState([]);

  useEffect(() => {
    const fetchShowTimes = async () => {
      try {
        const res = await axios.get("/api/showtimes");
        setShowTimesData(res.data);
        console.log("Suất chiếu đã được lấy thành công:", res.data);
      } catch (err) {
        setShowTimesData([]);
        console.error("Lỗi khi lấy suất chiếu:", err);
      }
    };
    fetchShowTimes();
  }, []);

  // Lọc suất chiếu theo movieId
  const filteredSuatChieu = showTimesData.filter(
    (suat) => suat.movieId === movieId
  );

  // Hàm lấy tên phòng dựa trên roomId
  const getTenPhong = (roomId) => {
    const phong = roomData.find((room) => room.pc_id === roomId);
    return phong ? phong.ten_phong : `Phòng ${roomId}`;
  };

  // Nhóm suất chiếu theo ngày, sau đó theo phòng
  const suatChieuTheoNgayVaPhong = filteredSuatChieu.reduce((acc, suat) => {
    const ngay = suat.date;
    const roomId = suat.roomId;

    if (!acc[ngay]) {
      acc[ngay] = {};
    }
    if (!acc[ngay][roomId]) {
      acc[ngay][roomId] = [];
    }
    acc[ngay][roomId].push(suat);
    return acc;
  }, {});

  const handleBooking = (suatChieu) => {
    navigate(`/booking/${suatChieu.suat_chieu_id}`, {
      state: {
        movieId: movieId,
        suatChieu: suatChieu,
      },
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
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
            Không có suất chiếu nào cho phim này
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ShowTime;
