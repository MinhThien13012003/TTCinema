import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Box,
  Grid,
  Button,
  Divider,
  Alert,
} from "@mui/material";
import { CheckCircle, Error, Home } from "@mui/icons-material";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../../service/axios";
import { useAuthStore } from "../../store/authStore";
import useBookingStore from "../../store/bookingStore";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";

const BookingConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [orderInfo, setOrderInfo] = useState(null);
  const [seats, setSeats] = useState([]);
  const [ticketCreated, setTicketCreated] = useState(false);
  const [newlyCreatedTickets, setNewlyCreatedTickets] = useState([]);
  const showtimeId = useBookingStore((state) => state.showtimeId);
  const hasProcessedOrder = useRef(false);
  const isCreatingTickets = useRef(false);
  const currentUser = useAuthStore((state) => state.user);
  const idOrder = searchParams.get("idOrder");
  const responseCode = searchParams.get("vnp_ResponseCode");
  const [showtimes, setShowtimes] = useState([]);
  const normalizeSeatNumber = (s) =>
    s.length === 3 ? s : s[0] + s.slice(1).padStart(2, "0");

  const { setOrderId } = useBookingStore();

  useEffect(() => {
    if (idOrder) {
      setOrderId(idOrder);
    }
  }, [idOrder]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.get("/api/seats");
        const filteredSeats = res.data.map((seat) => ({
          _id: seat._id,
          seatNumber: normalizeSeatNumber(seat.seatNumber),
          price: seat.seatTypeId?.price || 0,
        }));
        setSeats(filteredSeats);
      } catch (error) {
        console.error("Lỗi khi tải ghế:", error);
      }
    };

    fetchSeats();
  }, []);

  useEffect(() => {
    const processPaymentResult = async () => {
      const idOrder = searchParams.get("idOrder");
      const responseCode = searchParams.get("vnp_ResponseCode");

      // Kiểm tra đã xử lý chưa
      if (hasProcessedOrder.current) {
        return;
      }

      // Kiểm tra response code từ VNPay
      if (responseCode !== "00") {
        setStatus("fail");
        return;
      }

      if (!idOrder) {
        setStatus("fail");
        return;
      }

      try {
        setStatus("loading");

        const orderRes = await axios.get("/api/orders");
        const foundOrder = orderRes.data.find(
          (o) => String(o.dh_id) === String(idOrder)
        );
        if (!foundOrder) {
          setStatus("fail");
          return;
        }

        // Gọi trực tiếp để lấy các vé của đơn
        const ticketRes = await axios.get(`/api/tickets`);
        const allTickets = ticketRes.data;

        // Lọc ticket chỉ thuộc về đơn hàng vừa thanh toán
        const matchedTickets = allTickets.filter(
          (ticket) =>
            ticket.orderId?._id === foundOrder._id ||
            ticket.orderId?.dh_id === foundOrder.dh_id
        );

        setNewlyCreatedTickets(matchedTickets);
        setOrderInfo(foundOrder);
        setStatus("success");
        hasProcessedOrder.current = true;
        const fetchShowtimes = async () => {
          try {
            const res = await axios.get("/api/showtimes");
            setShowtimes(res.data);
          } catch (err) {
            console.error(" Lỗi khi tải showtimes:", err);
          }
        };

        fetchShowtimes();
      } catch (err) {
        setStatus("fail");
        toast.error("Có lỗi xảy ra khi xử lý thanh toán");
      }
    };

    processPaymentResult();
  }, [searchParams]);

  const handleGoHome = () => {
    // Clear booking store khi về trang chủ
    useBookingStore.getState().setSelectedSeats([]);
    useBookingStore.getState().setOrderId(null);
    useBookingStore.getState().setShowtimeId(null);
    navigate("/");
  };

  const generateQRCode = (orderId, ticketId) => {
    return `ORDER:${orderId}_TICKET:${ticketId}_${Date.now()}`;
  };

  if (status === "loading") {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 8 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Đang xử lý kết quả thanh toán...
        </Typography>
      </Container>
    );
  }

  if (status === "fail") {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 8 }}>
        <Error sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
        <Typography variant="h4" color="error" gutterBottom>
          Thanh toán thất bại
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Không tìm thấy đơn hàng hoặc có lỗi xảy ra trong quá trình thanh toán.
          Mã phản hồi: {responseCode || "N/A"}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={handleGoHome}
          size="large"
        >
          Về trang chủ
        </Button>
      </Container>
    );
  }
  const totalSeats = newlyCreatedTickets.reduce((acc, ticket) => {
    if (Array.isArray(ticket.seatIds)) return acc + ticket.seatIds.length;
    return acc + 1;
  }, 0);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
        <Typography variant="h4" color="success.main" gutterBottom>
          Thanh toán thành công!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Cảm ơn bạn đã đặt vé. Thông tin chi tiết như sau:
        </Typography>
      </Box>

      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Thông tin đơn hàng
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Mã đơn hàng
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                #{orderInfo?.dh_id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Trạng thái
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                color={
                  orderInfo?.status === "paid" ? "success.main" : "warning.main"
                }
              >
                {orderInfo?.status === "paid"
                  ? "Đã thanh toán"
                  : "Chờ thanh toán"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Tổng tiền
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {orderInfo?.totalAmount?.toLocaleString()} VND
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Số lượng ghế
              </Typography>
              <Typography variant="body1">{totalSeats} ghế</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Ngày đặt
              </Typography>
              <Typography variant="body1">
                {orderInfo?.orderDate
                  ? new Date(orderInfo.orderDate).toLocaleDateString("vi-VN")
                  : "N/A"}
              </Typography>
            </Grid>
          </Grid>

          {/* Chi tiết vé */}
          {newlyCreatedTickets.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Chi tiết vé
              </Typography>

              <Grid container spacing={3}>
                {newlyCreatedTickets.map((ticket, index) => {
                  const matchedShowtime = showtimes.find(
                    (s) =>
                      s._id ===
                      (ticket.showtime?._id ||
                        ticket.showtimeId?._id ||
                        ticket.showtimeId)
                  );
                  // Generate QR code for each ticket
                  const qrCodeValue =
                    ticket.orderId?.qrCode ||
                    generateQRCode(
                      ticket.orderId?.dh_id ||
                        orderInfo?.dh_id ||
                        orderInfo?._id,
                      ticket._id || ticket.ve_id
                    );

                  return (
                    <Grid item xs={12} md={6} key={ticket._id || index}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          boxShadow: 2,
                          border: "1px solid #ddd",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <CardContent>
                          <Typography variant="body2" gutterBottom>
                            <strong>Trạng thái:</strong>{" "}
                            <span
                              style={{
                                color:
                                  ticket?.orderId?.status === "paid"
                                    ? "#4CAF50"
                                    : "#FF9800",
                                fontWeight: "bold",
                              }}
                            >
                              {ticket?.orderId?.status === "paid"
                                ? "Đã thanh toán"
                                : "Chờ thanh toán"}
                            </span>
                          </Typography>

                          <Typography variant="body2" gutterBottom>
                            <strong>Ghế:</strong>{" "}
                            {(() => {
                              // Xử lý hiển thị ghế từ nhiều trường khác nhau
                              if (ticket.seatId?.seatNumber) {
                                return ticket.seatId.seatNumber;
                              }
                              if (
                                ticket.seatIds &&
                                Array.isArray(ticket.seatIds)
                              ) {
                                return ticket.seatIds
                                  .map((seat) => seat.seatNumber || seat)
                                  .join(", ");
                              }
                              if (ticket.seats && Array.isArray(ticket.seats)) {
                                return ticket.seats.join(", ");
                              }
                              return "N/A";
                            })()}
                          </Typography>

                          <Typography variant="body2" gutterBottom>
                            <strong>Giờ chiếu:</strong>{" "}
                            {(() => {
                              const showtime =
                                ticket.showtime || ticket.showtimeId;
                              if (showtime?.startTime && showtime?.endTime) {
                                return `${showtime.startTime} - ${showtime.endTime}`;
                              }
                              return "N/A";
                            })()}
                          </Typography>

                          <Typography variant="body2" gutterBottom>
                            <strong>Phim:</strong>{" "}
                            {matchedShowtime?.movieId?.title || "N/A"}
                          </Typography>

                          <Typography variant="body2" gutterBottom>
                            <strong>Phòng:</strong>{" "}
                            {matchedShowtime?.roomId?.name || "N/A"}
                          </Typography>

                          <Typography variant="body2" gutterBottom>
                            <strong>Giá vé:</strong>{" "}
                            {ticket.price?.toLocaleString()} VND
                          </Typography>

                          {/* QR Code */}
                          <Box sx={{ mt: 2, textAlign: "center" }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Mã QR vé
                            </Typography>

                            {ticket.orderId?.qrCode &&
                            ticket.orderId.qrCode.startsWith("data:image") ? (
                              <Box>
                                <img
                                  src={ticket.orderId.qrCode}
                                  alt="QR Code"
                                  style={{
                                    width: 120,
                                    height: 120,
                                    border: "2px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "8px",
                                    backgroundColor: "white",
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  display="block"
                                  sx={{ mt: 1, color: "text.secondary" }}
                                >
                                  Mã đơn hàng: {ticket.orderId?.dh_id}
                                </Typography>
                              </Box>
                            ) : (
                              <Box>
                                <QRCodeCanvas
                                  value={qrCodeValue}
                                  size={120}
                                  level="H"
                                  includeMargin
                                  style={{
                                    border: "2px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "8px",
                                    backgroundColor: "white",
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  display="block"
                                  sx={{ mt: 1, color: "text.secondary" }}
                                >
                                  {qrCodeValue}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}

          {/* Hiển thị thông báo nếu không có vé */}
          {newlyCreatedTickets.length === 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Không tìm thấy thông tin vé. Vui lòng liên hệ hỗ trợ nếu bạn đã
              thanh toán thành công.
            </Alert>
          )}

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={handleGoHome}
              size="large"
              sx={{ minWidth: 200 }}
            >
              Về trang chủ
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BookingConfirm;
