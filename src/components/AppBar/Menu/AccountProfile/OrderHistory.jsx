import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Event,
  AccessTime,
  Chair,
  QrCode,
  Cancel,
  MovieCreation,
} from "@mui/icons-material";
import axios from "../../../../service/axios";
import dayjs from "dayjs";

const OrderHistory = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success"); // success | error | warning
  const [movieMap, setMovieMap] = useState({});

  // Fetch tickets
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [ticketRes, movieRes] = await Promise.all([
          axios.get("/api/tickets"),
          axios.get("/api/movies"),
        ]);

        const movieList = movieRes.data || [];

        const movieMapObj = {};
        movieList.forEach((movie) => {
          movieMapObj[movie._id] = movie.title;
        });

        setMovieMap(movieMapObj);

        const mapped = ticketRes.data.map((ticket) => ({
          ticket: {
            ve_id: ticket.ve_id,
            movie: movieMapObj[ticket.showtimeId.movieId] || "Không rõ",
            showtime: {
              date: ticket.showtimeId.date,
              startTime: ticket.showtimeId.startTime,
              endTime: ticket.showtimeId.endTime,
            },
            seats:
              ticket.seatIds?.map((seat) => seat.seatNumber).join(", ") ||
              "Không rõ",
            rows: ticket.seatIds?.map((seat) => seat.row).join(", ") || "",
            price: ticket.price,
            status: ticket.status,
          },
          order: {
            dh_id: ticket.orderId.dh_id,
            qrCode: ticket.orderId.qrCode,
          },
        }));

        setTickets(mapped);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu vé hoặc phim:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get status color
  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "confirmed":
  //       return "success";
  //     case "pending":
  //       return "warning";
  //     case "cancelled":
  //       return "error";
  //     default:
  //       return "default";
  //   }
  // };

  // const getStatusText = (status) => {
  //   switch (status) {
  //     case "paid":
  //       return "Đã xác nhận";
  //     case "pending":
  //       return "Chờ xử lý";
  //     case "cancelled":
  //       return "Đã hủy";
  //     default:
  //       return status;
  //   }
  // };

  // Handle cancel ticket
  // Hủy vé theo API DELETE
  // const handleCancelTicket = async (ticketId) => {
  //   const ticket = tickets.find((item) => item.ticket.ve_id === ticketId);

  //   if (!ticket) return;

  //   const showDate = dayjs(
  //     ticket.ticket.showtime.date + " " + ticket.ticket.showtime.startTime
  //   );
  //   const now = dayjs();

  //   const diffInHours = showDate.diff(now, "hour");

  //   if (diffInHours < 4) {
  //     setToastSeverity("warning");
  //     setToastMessage("Không thể hủy vé vì còn dưới 4 tiếng trước giờ chiếu.");
  //     setToastOpen(true);
  //     return;
  //   }

  //   try {
  //     const response = await axios.delete(`/api/tickets/${ticketId}`);

  //     if (response.status === 200) {
  //       setTickets((prev) =>
  //         prev.filter((item) => item.ticket.ve_id !== ticketId)
  //       );
  //       setCancelDialogOpen(false);
  //       setSelectedTicket(null);

  //       setToastSeverity("success");
  //       setToastMessage("Đã hủy vé thành công.");
  //       setToastOpen(true);
  //     } else {
  //       setToastSeverity("error");
  //       setToastMessage("Hủy vé không thành công. Vui lòng thử lại sau.");
  //       setToastOpen(true);
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi hủy vé:", error);
  //     setToastSeverity("error");
  //     setToastMessage("Đã xảy ra lỗi khi hủy vé.");
  //     setToastOpen(true);
  //   }
  // };
  // Show QR Code dialog
  const showQrCode = (ticket) => {
    setSelectedTicket(ticket);
    setQrDialogOpen(true);
  };

  // Show cancel confirmation dialog
  const showCancelDialog = (ticket) => {
    setSelectedTicket(ticket);
    setCancelDialogOpen(true);
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0" }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
          Đang tải...
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0" }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 3, color: "#333" }}
        >
          LỊCH SỬ ĐƠN HÀNG
        </Typography>

        {tickets.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <MovieCreation sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Bạn chưa có vé nào
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {tickets.map((item, index) => (
              <Grid item xs={12} md={6} key={item.ticket?.ve_id}>
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Movie Title  */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          color: "#333",
                          flex: 1,
                          mr: 2,
                        }}
                      >
                        {item.ticket?.movie}
                      </Typography>
                      {/* <Chip
                        label={getStatusText(item.ticket?.status)}
                        color={getStatusColor(item.ticket?.status)}
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      /> */}
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Ticket Details */}
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Event sx={{ fontSize: 18, color: "#666", mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Ngày chiếu: {formatDate(item.ticket?.showtime?.date)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <AccessTime
                          sx={{ fontSize: 18, color: "#666", mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Giờ: {item.ticket?.showtime?.startTime} -{" "}
                          {item.ticket?.showtime?.endTime}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Chair sx={{ fontSize: 18, color: "#666", mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Ghế:{item.ticket?.seats}
                        </Typography>
                      </Box>

                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          color: "#4A5FD9",
                          mt: 1,
                        }}
                      >
                        {item.ticket?.price.toLocaleString("vi-VN")} VNĐ
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<QrCode />}
                        onClick={() => showQrCode(item)}
                        sx={{
                          borderColor: "#4A5FD9",
                          color: "#4A5FD9",
                          "&:hover": {
                            backgroundColor: "#4A5FD9",
                            color: "white",
                          },
                        }}
                      >
                        Xem QR
                      </Button>

                      {/* {item.ticket?.status !== "cancelled" && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Cancel />}
                          onClick={() => showCancelDialog(item)}
                          sx={{
                            borderColor: "#f44336",
                            color: "#f44336",
                            "&:hover": {
                              backgroundColor: "#f44336",
                              color: "white",
                            },
                          }}
                        >
                          Hủy vé
                        </Button>
                      )} */}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* QR Code Dialog */}
      <Dialog
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Mã QR Vé Xem Phim
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 3 }}>
          {selectedTicket && (
            <>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                {selectedTicket.ticket?.movie}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ghế:
                {selectedTicket.ticket.seats} |
                {formatDate(selectedTicket?.ticket?.showtime?.date)} |
                {selectedTicket.ticket?.showtime?.startTime}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <img
                  src={selectedTicket?.order?.qrCode}
                  alt="QR Code"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Vui lòng xuất trình mã QR này tại quầy để vào xem phim
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => setQrDialogOpen(false)}
            variant="contained"
            sx={{
              bgcolor: "#4A5FD9",
              "&:hover": { bgcolor: "#3A4FB7" },
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation Dialog
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#f44336" }}>
          Xác nhận hủy vé
        </DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Bạn có chắc chắn muốn hủy vé xem phim này không?
              </Typography>
              <Paper
                elevation={0}
                sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  {selectedTicket.ticket?.movie}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ghế: {selectedTicket.ticket?.rows}{" "}
                  {selectedTicket?.ticket?.seats}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ngày: {formatDate(selectedTicket.ticket?.showtime?.date)} -{" "}
                  {selectedTicket.ticket?.showtime?.startTime}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#4A5FD9" }}
                >
                  Giá: {selectedTicket.ticket?.price.toLocaleString("vi-VN")}{" "}
                  VNĐ
                </Typography>
              </Paper>
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 2, fontStyle: "italic" }}
              >
                Lưu ý: Hành động này không thể hoàn tác.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCancelDialogOpen(false)} variant="outlined">
            Không
          </Button>
          <Button
            onClick={() => handleCancelTicket(selectedTicket?.ticket.ve_id)}
            variant="contained"
            color="error"
            sx={{ ml: 2 }}
          >
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog> */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default OrderHistory;
