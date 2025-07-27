import React from "react";
import { Container, Box } from "@mui/material";
import {
  LocalOfferOutlined,
  MovieOutlined,
  UpcomingOutlined,
} from "@mui/icons-material";
import dayjs from "dayjs";
import movieData from "../../utils/movieData";
import SliderSection from "../Home/MainContent/SliderSection";
import axios from "../../service/axios";
import { useEffect, useState, useMemo } from "react";
const now = dayjs();

function Booking() {
  const [movieApi, setMovieApi] = useState([]);
  const currentMovies = useMemo(() => {
    const filtered = movieApi.filter((movie) => {
      const start = dayjs(movie.releaseDate).tz("Asia/Ho_Chi_Minh");
      const end = dayjs(movie.endDate).tz("Asia/Ho_Chi_Minh");
      return (
        start.isValid() &&
        end.isValid() &&
        (start.isBefore(now, "day") || start.isSame(now, "day")) &&
        (end.isAfter(now, "day") || end.isSame(now, "day"))
      );
    });
    //console.log("Current movies:", filtered);
    return filtered;
  }, [movieApi, now]);

  // Lọc phim sắp chiếu
  const upcomingMovies = useMemo(() => {
    const filtered = movieApi.filter((movie) => {
      const start = dayjs(movie.releaseDate).tz("Asia/Ho_Chi_Minh");
      return start.isValid() && start.isAfter(now, "day");
    });
    return filtered;
  }, [movieApi, now]);
  const fetchMovies = async () => {
    try {
      const res = await axios.get("/api/movies");
      //console.log("Movies fetched successfully:", res.data);
      setMovieApi(res.data);
    } catch (err) {
      //console.error("Error fetching movies:", err);
    }
  };
  useEffect(() => {
    fetchMovies();
  }, []);
  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: "#16213e" }}>
      <Box
        sx={{
          width: "90%",
          maxWidth: "1200px",
          minHeight: "100%", // Đảm bảo chiều cao tối thiểu
        }}
      >
        <SliderSection
          title="Phim Đang Chiếu"
          icon={MovieOutlined}
          subtitle={`${currentMovies.length} bộ phim đang được chiếu tại rạp`}
          items={currentMovies}
          type="movie"
        />
        <SliderSection
          title="Phim Sắp Chiếu"
          icon={UpcomingOutlined}
          subtitle={`${upcomingMovies.length} bộ phim sắp ra mắt`}
          items={upcomingMovies}
          type="movie"
        />
      </Box>
    </Container>
  );
}

export default Booking;
