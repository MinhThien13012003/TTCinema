import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Toolbar,
  InputAdornment,
  Tooltip,
  Divider,
  Alert
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocalMovies as MovieIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  Print as PrintIcon,
  Email as EmailIcon
} from '@mui/icons-material';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Mock data theo cấu trúc bảng DON_HANG
  useEffect(() => {
    const mockOrders = [
      {
        dh_id: 1,
        kh_id: 101,
        ngay_dat: '2024-01-15T10:30:00',
        tong_tien: 240000,
        trang_thai_thanh_toan: 'da_thanh_toan',
        // Thông tin khách hàng (join từ bảng KHACH_HANG)
        ten_khach_hang: 'Nguyễn Văn An',
        email: 'nguyenvanan@email.com',
        so_dien_thoai: '0123456789',
        // Thông tin chi tiết vé (từ bảng CHI_TIET_DON_HANG)
        chi_tiet: [
          {
            phim: 'Avatar: The Way of Water',
            rap: 'CGV Vincom Center',
            ngay_chieu: '2024-01-20',
            gio_chieu: '19:30',
            ghe: 'A1, A2',
            so_luong: 2,
            gia_ve: 120000
          }
        ]
      },
      {
        dh_id: 2,
        kh_id: 102,
        ngay_dat: '2024-01-16T14:15:00',
        tong_tien: 360000,
        trang_thai_thanh_toan: 'cho_thanh_toan',
        ten_khach_hang: 'Trần Thị Bình',
        email: 'tranthibinh@email.com',
        so_dien_thoai: '0987654321',
        chi_tiet: [
          {
            phim: 'Spider-Man: No Way Home',
            rap: 'Lotte Cinema Diamond',
            ngay_chieu: '2024-01-21',
            gio_chieu: '21:00',
            ghe: 'B3, B4, B5',
            so_luong: 3,
            gia_ve: 120000
          }
        ]
      },
      {
        dh_id: 3,
        kh_id: 103,
        ngay_dat: '2024-01-17T09:45:00',
        tong_tien: 200000,
        trang_thai_thanh_toan: 'da_huy',
        ten_khach_hang: 'Lê Văn Cường',
        email: 'levanc@email.com',
        so_dien_thoai: '0369852147',
        chi_tiet: [
          {
            phim: 'Top Gun: Maverick',
            rap: 'Galaxy Cinema Nguyễn Du',
            ngay_chieu: '2024-01-22',
            gio_chieu: '15:00',
            ghe: 'C1, C2',
            so_luong: 2,
            gia_ve: 100000
          }
        ]
      },
      {
        dh_id: 4,
        kh_id: 104,
        ngay_dat: '2024-01-18T16:20:00',
        tong_tien: 480000,
        trang_thai_thanh_toan: 'da_thanh_toan',
        ten_khach_hang: 'Phạm Thị Dung',
        email: 'phamthidung@email.com',
        so_dien_thoai: '0741852963',
        chi_tiet: [
          {
            phim: 'The Batman',
            rap: 'CGV Landmark 81',
            ngay_chieu: '2024-01-23',
            gio_chieu: '20:15',
            ghe: 'D5, D6, D7, D8',
            so_luong: 4,
            gia_ve: 120000
          }
        ]
      },
      {
        dh_id: 5,
        kh_id: 105,
        ngay_dat: '2024-01-19T11:30:00',
        tong_tien: 150000,
        trang_thai_thanh_toan: 'da_thanh_toan',
        ten_khach_hang: 'Hoàng Văn Em',
        email: 'hoangvanem@email.com',
        so_dien_thoai: '0258147963',
        chi_tiet: [
          {
            phim: 'Doctor Strange 2',
            rap: 'BHD Star Bitexco',
            ngay_chieu: '2024-01-24',
            gio_chieu: '18:45',
            ghe: 'E10',
            so_luong: 1,
            gia_ve: 150000
          }
        ]
      },
      {
        dh_id: 6,
        kh_id: 106,
        ngay_dat: '2024-01-20T13:45:00',
        tong_tien: 300000,
        trang_thai_thanh_toan: 'cho_thanh_toan',
        ten_khach_hang: 'Vũ Thị Phương',
        email: 'vuthiphuong@email.com',
        so_dien_thoai: '0912345678',
        chi_tiet: [
          {
            phim: 'Minions: The Rise of Gru',
            rap: 'CGV Aeon Mall',
            ngay_chieu: '2024-01-25',
            gio_chieu: '16:30',
            ghe: 'F1, F2, F3',
            so_luong: 3,
            gia_ve: 100000
          }
        ]
      }
    ];
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Filter và search
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.ten_khach_hang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.dh_id.toString().includes(searchTerm.toLowerCase()) ||
        order.chi_tiet[0]?.phim.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.trang_thai_thanh_toan === statusFilter);
    }

    setFilteredOrders(filtered);
    setPage(0);
  }, [searchTerm, statusFilter, orders]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'da_thanh_toan':
        return 'success';
      case 'cho_thanh_toan':
        return 'warning';
      case 'da_huy':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'da_thanh_toan':
        return 'Đã thanh toán';
      case 'cho_thanh_toan':
        return 'Chờ thanh toán';
      case 'da_huy':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.dh_id === orderId ? { ...order, trang_thai_thanh_toan: newStatus } : order
        )
      );
      setOpenDialog(false);
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(prevOrders => prevOrders.filter(order => order.dh_id !== orderId));
      } catch (error) {
        console.error('Lỗi xóa đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.trang_thai_thanh_toan === 'da_thanh_toan')
      .reduce((sum, order) => sum + order.tong_tien, 0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        <MovieIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Quản lý Đơn hàng
      </Typography>

      {/* Toolbar */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap', py: 2 }}>
          <TextField
            placeholder="Tìm kiếm theo tên, mã đơn, phim, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 350 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Trạng thái thanh toán"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">Tất cả trạng thái</MenuItem>
            <MenuItem value="cho_thanh_toan">Chờ thanh toán</MenuItem>
            <MenuItem value="da_thanh_toan">Đã thanh toán</MenuItem>
            <MenuItem value="da_huy">Đã hủy</MenuItem>
          </TextField>
        </Toolbar>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderLeft: 4, borderColor: 'primary.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2" fontWeight="medium">
                    Tổng đơn hàng
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {orders.length}
                  </Typography>
                </Box>
                <EventIcon color="primary" sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderLeft: 4, borderColor: 'warning.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2" fontWeight="medium">
                    Chờ thanh toán
                  </Typography>
                  <Typography variant="h4" component="div" color="warning.main" fontWeight="bold">
                    {orders.filter(o => o.trang_thai_thanh_toan === 'cho_thanh_toan').length}
                  </Typography>
                </Box>
                <PersonIcon color="warning" sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderLeft: 4, borderColor: 'success.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2" fontWeight="medium">
                    Đã thanh toán
                  </Typography>
                  <Typography variant="h4" component="div" color="success.main" fontWeight="bold">
                    {orders.filter(o => o.trang_thai_thanh_toan === 'da_thanh_toan').length}
                  </Typography>
                </Box>
                <PaymentIcon color="success" sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Orders Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
                Mã đơn hàng
              </TableCell>
              <TableCell sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
                Khách hàng
              </TableCell>
              <TableCell sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
                Phim & Rạp
              </TableCell>
              <TableCell sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
                Lịch chiếu
              </TableCell>
              <TableCell sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
                Ghế & Số lượng
              </TableCell>
              <TableCell sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
                Tổng tiền
              </TableCell>
              <TableCell sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
                Ngày đặt
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.dh_id} hover sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold" color="primary.main">
                      DH{order.dh_id.toString().padStart(3, '0')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {order.ten_khach_hang}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {order.so_dien_thoai}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="textSecondary">
                        {order.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {order.chi_tiet[0]?.phim}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {order.chi_tiet[0]?.rap}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {formatDate(order.chi_tiet[0]?.ngay_chieu)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {order.chi_tiet[0]?.gio_chieu}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {order.chi_tiet[0]?.ghe}
                      </Typography>
                      <Typography variant="caption" color="primary.main">
                        ({order.chi_tiet[0]?.so_luong} vé)
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold" color="success.main">
                      {formatCurrency(order.tong_tien)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(order.trang_thai_thanh_toan)}
                      color={getStatusColor(order.trang_thai_thanh_toan)}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDateTime(order.ngay_dat)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          onClick={() => handleViewOrder(order)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {/* <Tooltip title="In vé">
                        <IconButton size="small" color="info">
                          <PrintIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Gửi email">
                        <IconButton size="small" color="success">
                          <EmailIcon />
                        </IconButton>
                      </Tooltip> */}
                      <Tooltip title="Xóa">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteOrder(order.dh_id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <Typography variant="h6" color="textSecondary">
                    Không tìm thấy đơn hàng nào
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredOrders.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Hiển thị mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} trong tổng số ${count !== -1 ? count : `hơn ${to}`} đơn hàng`
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {/* Order Detail Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          elevation: 8
        }}
      >
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
          <Typography variant="h5" component="div" fontWeight="bold">
            Chi tiết đơn hàng DH{selectedOrder?.dh_id?.toString().padStart(3, '0')}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedOrder && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1 }} />
                      Thông tin khách hàng
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" fontWeight="medium">Mã khách hàng:</Typography>
                      <Typography variant="body1" fontWeight="bold">KH{selectedOrder.kh_id.toString().padStart(3, '0')}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" fontWeight="medium">Họ tên:</Typography>
                      <Typography variant="body1" fontWeight="medium">{selectedOrder.ten_khach_hang}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" fontWeight="medium">Email:</Typography>
                      <Typography variant="body1">{selectedOrder.email}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" fontWeight="medium">Số điện thoại:</Typography>
                      <Typography variant="body1">{selectedOrder.so_dien_thoai}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <MovieIcon sx={{ mr: 1 }} />
                      Thông tin vé phim
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" fontWeight="medium">Phim:</Typography>
                      <Typography variant="body1" fontWeight="bold">{selectedOrder.chi_tiet[0]?.phim}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" fontWeight="medium">Rạp chiếu:</Typography>
                      <Typography variant="body1">{selectedOrder.chi_tiet[0]?.rap}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" fontWeight="medium">Ngày chiếu:</Typography>
                      <Typography variant="body1">{formatDate(selectedOrder.chi_tiet[0]?.ngay_chieu)}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" fontWeight="medium">Giờ chiếu:</Typography>
                      <Typography variant="body1" color="primary.main" fontWeight="medium">{selectedOrder.chi_tiet[0]?.gio_chieu}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" fontWeight="medium">Ghế:</Typography>
                      <Typography variant="body1" fontWeight="bold">{selectedOrder.chi_tiet[0]?.ghe}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined" elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <PaymentIcon sx={{ mr: 1 }} />
                      Thông tin thanh toán
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="textSecondary" fontWeight="medium">Số lượng vé:</Typography>
                        <Typography variant="h6" color="primary.main" fontWeight="bold">
                          {selectedOrder.chi_tiet[0]?.so_luong}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="textSecondary" fontWeight="medium">Giá mỗi vé:</Typography>
                        <Typography variant="h6" fontWeight="medium">
                          {formatCurrency(selectedOrder.chi_tiet[0]?.gia_ve)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="textSecondary" fontWeight="medium">Tổng tiền:</Typography>
                        <Typography variant="h5" fontWeight="bold" color="success.main">
                          {formatCurrency(selectedOrder.tong_tien)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="textSecondary" fontWeight="medium">Trạng thái:</Typography>
                        <Chip
                          label={getStatusText(selectedOrder.trang_thai_thanh_toan)}
                          color={getStatusColor(selectedOrder.trang_thai_thanh_toan)}
                          size="medium"
                          variant="filled"
                        />
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="body2" color="textSecondary" fontWeight="medium">
                      Ngày đặt: <Typography component="span" color="text.primary">{formatDateTime(selectedOrder.ngay_dat)}</Typography>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {selectedOrder.trang_thai_thanh_toan !== 'da_huy' && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ backgroundColor: 'grey.50' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Cập nhật trạng thái thanh toán
                      </Typography>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        Chọn trạng thái mới để cập nhật đơn hàng
                      </Alert>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                          variant={selectedOrder.trang_thai_thanh_toan === 'cho_thanh_toan' ? 'contained' : 'outlined'}
                          color="warning"
                          onClick={() => handleUpdateStatus(selectedOrder.dh_id, 'cho_thanh_toan')}
                          disabled={loading || selectedOrder.trang_thai_thanh_toan === 'cho_thanh_toan'}
                          startIcon={<EventIcon />}
                        >
                          Chờ thanh toán
                        </Button>
                        <Button
                          variant={selectedOrder.trang_thai_thanh_toan === 'da_thanh_toan' ? 'contained' : 'outlined'}
                          color="success"
                          onClick={() => handleUpdateStatus(selectedOrder.dh_id, 'da_thanh_toan')}
                          disabled={loading || selectedOrder.trang_thai_thanh_toan === 'da_thanh_toan'}
                          startIcon={<PaymentIcon />}
                        >
                          Đã thanh toán
                        </Button>
                        <Button
                          variant={selectedOrder.trang_thai_thanh_toan === 'da_huy' ? 'contained' : 'outlined'}
                          color="error"
                          onClick={() => handleUpdateStatus(selectedOrder.dh_id, 'da_huy')}
                          disabled={loading}
                          startIcon={<DeleteIcon />}
                        >
                          Hủy đơn hàng
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {selectedOrder.trang_thai_thanh_toan === 'da_huy' && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    <Typography variant="body1" fontWeight="medium">
                      Đơn hàng này đã bị hủy và không thể thay đổi trạng thái.
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: 'grey.50' }}>
          <Button 
            onClick={() => setOpenDialog(false)} 
            variant="outlined"
            size="large"
          >
            Đóng
          </Button>
          {selectedOrder?.trang_thai_thanh_toan === 'da_thanh_toan' && (
            <>
              <Button 
                variant="contained" 
                color="info"
                startIcon={<PrintIcon />}
                size="large"
              >
                In vé
              </Button>
              <Button 
                variant="contained" 
                color="success"
                startIcon={<EmailIcon />}
                size="large"
              >
                Gửi email
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersManagement;