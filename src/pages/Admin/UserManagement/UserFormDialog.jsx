import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "../../../service/axios";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
};

const UserFormDialog = ({ open, handleClose, editingUser, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    dob: "",
    isStudent: false,
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name || "",
        phone: editingUser.phone || "",
        dob: formatDate(editingUser.dob),
        isStudent: editingUser.isStudent === true,
        role: editingUser.role === "admin" ? "admin" : "user",
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "isStudent") {
      setForm((prev) => ({
        ...prev,
        isStudent: value === "true",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/admin/users/${editingUser._id}`, form);
      setSnackbar({
        open: true,
        message: "Cập nhật thành công",
        severity: "success",
      });
      onSuccess();
      handleClose();
    } catch (err) {
      console.error("Lỗi khi cập nhật người dùng", err);
      setSnackbar({
        open: true,
        message: "Lỗi khi cập nhật người dùng",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!editingUser) return null;

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Họ tên"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Số điện thoại"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Ngày sinh"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              select
              name="isStudent"
              label="Là sinh viên?"
              value={form.isStudent.toString()}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="true">Có</MenuItem>
              <MenuItem value="false">Không</MenuItem>
            </TextField>
            <TextField
              select
              name="role"
              label="Vai trò"
              value={form.role}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="user">Người dùng</MenuItem>
              <MenuItem value="admin">Quản trị viên</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserFormDialog;
