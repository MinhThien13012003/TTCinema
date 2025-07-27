import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Film,
  Ticket,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Star,
} from "lucide-react";
import dayjs, { Dayjs } from "dayjs";
import axios from "../../service/axios";

const StatBox = ({ title, value, icon: Icon, color = "primary" }) => (
  <Paper
    sx={{
      p: 3,
      textAlign: "center",
      bgcolor: "#fff",
      boxShadow: 3,
      borderRadius: 2,
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 1,
      }}
    >
      <Icon
        size={24}
        color={
          color === "primary"
            ? "#1976d2"
            : color === "success"
            ? "#2e7d32"
            : "#ed6c02"
        }
      />
    </Box>
    <Typography variant="h6" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="h4" color={color} sx={{ fontWeight: "bold" }}>
      {value}
    </Typography>
  </Paper>
);

const Dashboard = () => {
  // const weeklyRevenueData = [
  //   { day: 'T2', revenue: 12000000 },
  //   { day: 'T3', revenue: 8500000 },
  //   { day: 'T4', revenue: 15200000 },
  //   { day: 'T5', revenue: 18900000 },
  //   { day: 'T6', revenue: 25600000 },
  //   { day: 'T7', revenue: 32400000 },
  //   { day: 'CN', revenue: 35800000 }
  // ];
  const [revenueByMovie, setRevenueByMovie] = useState([]);
  const [revenueByRoom, setRevenueByRoom] = useState([]);
  //const [revenueByTime, setRevenueByTime] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const startDate = "2025-07-01";
  const endDate = dayjs().format("YYYY-MM-DD");
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [movieRes, roomRes, timeRes] = await Promise.all([
          axios.get(
            `/api/report/revenue-by-movie?startDate=${startDate}&endDate=${endDate}`
          ),
          axios.get(
            `/api/report/revenue-by-room?startDate=${startDate}&endDate=${endDate}`
          ),
          axios.get(
            `/api/report/revenue-by-time?startDate=${startDate}&endDate=${endDate}`
          ),
        ]);

        setRevenueByMovie(movieRes.data.revenue || []);
        setRevenueByRoom(roomRes.data.revenue || []);
        console.log("Phong:", roomRes);
        console.log("Movie:", movieRes);

        setTotalRevenue(timeRes.data.revenue || 0);
        setOrderCount(timeRes.data.orderCount || 0);
        console.log("Time:", timeRes);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sample data for movies ending soon
  // const moviesEndingSoon = [
  //   { title: "Avatar: The Way of Water", endDate: "2025-06-30", showsLeft: 3 },
  //   { title: "Top Gun: Maverick", endDate: "2025-07-02", showsLeft: 5 },
  //   {
  //     title: "Black Panther: Wakanda Forever",
  //     endDate: "2025-07-05",
  //     showsLeft: 2,
  //   },
  //   { title: "The Batman", endDate: "2025-07-08", showsLeft: 4 },
  // ];

  // // Sample data for top selling movies
  // const topSellingMovies = [
  //   { title: "Spider-Man: No Way Home", tickets: 2850, revenue: "142M VNĐ" },
  //   { title: "Avengers: Endgame", tickets: 2640, revenue: "132M VNĐ" },
  //   { title: "Fast X", tickets: 2280, revenue: "114M VNĐ" },
  //   { title: "John Wick 4", tickets: 1950, revenue: "97M VNĐ" },
  //   { title: "Guardians of the Galaxy 3", tickets: 1720, revenue: "86M VNĐ" },
  // ];

  const formatCurrency = (value) => {
    return `${(value / 1000000).toFixed(1)}M`;
  };

  // const revenueChartData = revenueByTime.map((item) => ({
  //   day: dayjs(item.date).format("DD/MM"),
  //   revenue: item.totalRevenue,
  // }));
  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
        color="primary"
        sx={{ mb: 4 }}
      >
        Dashboard Quản Lý Rạp Chiếu Phim
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatBox
                title="Tổng số đơn"
                value={orderCount}
                icon={Ticket}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatBox
                title="Tổng doanh thu"
                value={`${formatCurrency(totalRevenue)} VNĐ`}
                icon={DollarSign}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatBox
                title="Phòng đang có vé"
                value={revenueByRoom.length}
                icon={Film}
                color="primary"
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ mb: 4 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Star size={20} color="#ffc107" style={{ marginRight: 8 }} />
                  Top 5 phim bán chạy nhất
                </Typography>

                <Grid container spacing={2}>
                  {revenueByMovie.slice(0, 5).map((movie, index) => (
                    <Grid item xs={12} sm={6} md={2.4} key={movie._id}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          bgcolor: index === 0 ? "#fff3e0" : "#fff",
                          border:
                            index === 0
                              ? "2px solid #ffc107"
                              : "1px solid #ccc",
                          borderRadius: 2,
                        }}
                      >
                        {index === 0 && (
                          <Chip
                            label="🏆 #1"
                            color="warning"
                            size="small"
                            sx={{ mb: 1 }}
                          />
                        )}
                        <Typography variant="h6">#{index + 1}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {movie.movieTitle}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          {movie.ticketCount} vé
                        </Typography>
                        <Typography variant="caption" color="success.main">
                          {formatCurrency(movie.totalRevenue)} VNĐ
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} container spacing={3}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Doanh thu theo phòng chiếu
                </Typography>

                <List dense>
                  {revenueByRoom.map((room, index) => (
                    <React.Fragment key={room._id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography fontWeight={500} variant="div">
                              {room.roomName}
                            </Typography>
                          }
                          secondary={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Vé: {room.ticketCount}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="success.main"
                              >
                                {formatCurrency(room.totalRevenue)} VNĐ
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < revenueByRoom.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
