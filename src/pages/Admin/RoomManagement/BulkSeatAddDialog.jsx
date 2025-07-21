import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import axios from "../../../service/axios";

const BulkSeatAddDialog = ({
  open,
  onClose,
  seatTypes,
  selectedRoom,
  onSuccess,
  seats,
}) => {
  const [multiRow, setMultiRow] = useState("");
  const [multiCount, setMultiCount] = useState(10);
  const [multiSeatType, setMultiSeatType] = useState("");
  const [multiStart, setMultiStart] = useState(1);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const existingSeatNumbers = new Set(
    seats.map((s) => s.seatNumber.toUpperCase())
  );

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async () => {
    if (
      !multiRow ||
      !multiCount ||
      !multiSeatType ||
      multiCount < 1 ||
      multiStart < 1
    ) {
      showSnackbar("Vui lòng nhập đầy đủ và hợp lệ thông tin.", "warning");
      return;
    }

    const payloads = [];

    for (let i = 0; i < multiCount; i++) {
      const seatNumber = `${multiRow}${multiStart + i}`;
      if (!existingSeatNumbers.has(seatNumber)) {
        payloads.push({
          ghe_id: Math.floor(Math.random() * 100000),
          seatNumber,
          row: multiRow,
          phong_id: selectedRoom.phong_id,
          loai_ghe_id: parseInt(multiSeatType),
        });
      }
    }

    if (payloads.length === 0) {
      showSnackbar("Tất cả ghế đã tồn tại. Không có ghế mới để thêm.", "info");
      return;
    }

    setLoadingSubmit(true);
    try {
      await Promise.all(payloads.map((item) => axios.post("/api/seats", item)));
      showSnackbar(
        `Đã thêm ${payloads.length} ghế hàng ${multiRow} thành công!`
      );
      onSuccess();
      onClose(); // ✅ Chỉ đóng sau khi thành công
    } catch (err) {
      console.error(err);
      showSnackbar("Có lỗi xảy ra khi thêm nhiều ghế", "error");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={loadingSubmit ? undefined : onClose}>
        <DialogTitle>Thêm nhiều ghế cùng lúc</DialogTitle>
        <DialogContent>
          <TextField
            label="Hàng (VD: A, B, C)"
            value={multiRow}
            onChange={(e) => setMultiRow(e.target.value.toUpperCase())}
            fullWidth
            margin="dense"
            disabled={loadingSubmit}
          />
          <TextField
            label="Số bắt đầu"
            type="number"
            value={multiStart}
            onChange={(e) => setMultiStart(parseInt(e.target.value) || 1)}
            fullWidth
            margin="dense"
            disabled={loadingSubmit}
          />
          <TextField
            label="Số lượng ghế"
            type="number"
            value={multiCount}
            onChange={(e) => setMultiCount(parseInt(e.target.value) || 1)}
            fullWidth
            margin="dense"
            disabled={loadingSubmit}
          />
          <TextField
            select
            label="Loại ghế"
            value={multiSeatType}
            onChange={(e) => setMultiSeatType(e.target.value)}
            fullWidth
            margin="dense"
            disabled={loadingSubmit}
          >
            {seatTypes.map((type) => (
              <MenuItem key={type._id} value={type.loai_ghe_id}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loadingSubmit}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loadingSubmit}
          >
            {loadingSubmit ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Tạo ghế"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Backdrop open={loadingSubmit} sx={{ zIndex: 1301 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default BulkSeatAddDialog;
