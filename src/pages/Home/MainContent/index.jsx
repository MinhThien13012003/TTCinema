import {
  LocalOfferOutlined,
  MovieOutlined,
  UpcomingOutlined,
} from "@mui/icons-material";
import { Container } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import promotionData from "../../../utils/promotionData";
import SliderSection from "./SliderSection";
import axios from "../../../service/axios";
import { useEffect, useState, useMemo } from "react";
import { useSearch } from "../../../contexts/SearchContext";

// Cấu hình múi giờ
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

const MainContent = () => {
  const [movieApi, setMovieApi] = useState([]);
  const { keyword } = useSearch();
  const fetchMovies = async () => {
    try {
      const res = await axios.get("/api/movies");
      //console.log("Movies fetched successfully:", res.data);
      // s
      setMovieApi(res.data);
    } catch (err) {
      // console.error("Error fetching movies:", err);
      alert("Không thể tải danh sách phim. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Lấy thời gian hiện tại động
  const now = dayjs().tz("Asia/Ho_Chi_Minh");

  // Lọc phim đang chiếu
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

  // Lọc khuyến mãi
  const activePromotions = useMemo(() => {
    return promotionData.filter(
      (promo) =>
        dayjs(promo.start_date).isBefore(now) &&
        dayjs(promo.end_date).isAfter(now)
    );
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: "#16213e" }}>
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
      {/* <SliderSection
        title="Khuyến Mãi Đang Diễn Ra"
        icon={LocalOfferOutlined}
        subtitle={`${activePromotions.length} ưu đãi hấp dẫn dành cho bạn`}
        items={activePromotions}
        type="promotion"
      /> */}
    </Container>
  );
};

export default MainContent;
