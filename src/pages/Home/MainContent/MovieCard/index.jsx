import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import {
  CalendarTodayOutlined,
  AccessTime,
  Language,
} from "@mui/icons-material";
import dayjs from "dayjs";

const MovieCard = ({ movie, isUpcoming = false }) => {
  return (
    <Card
      sx={{
        minWidth: "280px",
        maxWidth: "280px",
        height: "450px",
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(255,184,0,0.2)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        mr: 2,
        "&:hover .movie-overlay": {
          opacity: 1,
        },
        boxShadow: "0 8px 2px rgba(0,0,0,0.2)",
      }}
    >
      {/* Hình ảnh */}
      {movie.poster && (
        <Box sx={{ position: "relative", height: "320px" }}>
          <CardMedia
            component="img"
            image={movie.poster}
            alt={movie.ten_phim}
            sx={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />

          {/* Overlay chi tiết */}
          <Box
            className="movie-overlay"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.85)",
              opacity: 0,
              transition: "opacity 0.3s ease",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              px: 2,
              textAlign: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
            >
              <AccessTime sx={{ fontSize: 16 }} /> {movie.duration} phút
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Language sx={{ fontSize: 16 }} /> {movie.language}
            </Typography>
            <Typography variant="subtitle1">🎧 {movie.subtitle}</Typography>
          </Box>

          {/* Nhãn phân loại */}
          {movie.label && (
            <Chip
              label={movie.label}
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                fontWeight: "bold",
                fontSize: "0.75rem",
                borderRadius: 1,
                backgroundColor: "#DC2626",
                color: "#fff",
              }}
            />
          )}
        </Box>
      )}

      {/* Nội dung dưới ảnh */}
      <CardContent
        sx={{
          p: 2,
          bgcolor: "#1a1a2e",
          height: "130px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#94A3B8",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.3,
              fontSize: "0.85rem",
              paddingBottom: 1,
            }}
          >
            {movie.description}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#94A3B8",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.3,
              fontSize: "0.85rem",
            }}
          >
            {movie.genre}
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: "#94A3B8",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mt: 1,
          }}
        >
          <CalendarTodayOutlined sx={{ fontSize: 14 }} />
          {isUpcoming
            ? dayjs(movie.ngay_cong_chieu).format("DD.MM.YYYY")
            : `Đến ${dayjs(movie.ngay_ket_thuc).format("DD.MM.YYYY")}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
