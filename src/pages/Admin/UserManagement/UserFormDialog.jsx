// src/pages/UserManagement/UserFormDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
} from "@mui/material";

const UserFormDialog = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm người dùng</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Họ tên" fullWidth />
          <TextField label="Email" fullWidth />
          <TextField label="Số điện thoại" fullWidth />
          <TextField label="Mật khẩu" type="password" fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button variant="contained" onClick={handleClose}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;
