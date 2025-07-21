import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../../../service/axios";

const SeatTypeTable = ({ seatTypes, onRefresh }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    loai_ghe_id: Math.floor(Math.random() * 1000),
    name: "",
    price: "",
    color: "",
  });
  const [editItem, setEditItem] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const handleOpen = (item = null) => {
    setEditItem(item);
    setForm(
      item || {
        loai_ghe_id: Math.floor(Math.random() * 1000),
        name: "",
        price: "",
        color: "",
      }
    );
    setOpen(true);
  };

  const handleClose = () => {
    if (loadingSubmit) return;
    setOpen(false);
    setEditItem(null);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    try {
      if (editItem) {
        await axios.put(`/api/seat-types/${editItem.loai_ghe_id}`, form);
      } else {
        await axios.post("/api/seat-types", form);
      }
      setAlert({ open: true, type: "success", message: "Lưu thành công!" });
      onRefresh();
      setOpen(false); // Chỉ đóng khi thành công
    } catch (err) {
      console.error(err);
      setAlert({ open: true, type: "error", message: "Lỗi khi lưu dữ liệu" });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    try {
      await axios.delete(`/api/seat-types/${confirmDelete.id}`);
      setAlert({ open: true, type: "success", message: "Xóa thành công!" });
      onRefresh();
    } catch (err) {
      setAlert({ open: true, type: "error", message: "Không thể xoá" });
    } finally {
      setLoadingDelete(false);
      setConfirmDelete({ open: false, id: null });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        startIcon={<AddIcon />}
      >
        Thêm loại ghế
      </Button>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Tên loại</TableCell>
            <TableCell>Màu sắc</TableCell>
            <TableCell>Giá</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {seatTypes.map((type) => (
            <TableRow key={type.loai_ghe_id}>
              <TableCell>{type.name}</TableCell>
              <TableCell>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: type.color || "#ccc",
                    borderRadius: 4,
                    border: "1px solid #999",
                  }}
                />
              </TableCell>
              <TableCell>
                {Number(type.price).toLocaleString("vi-VN")}₫
              </TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpen(type)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteClick(type.loai_ghe_id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Form Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editItem ? "Chỉnh sửa loại ghế" : "Thêm loại ghế"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Tên loại ghế"
                value={form.name}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="price"
                label="Giá vé"
                type="number"
                value={form.price}
                onChange={handleChange}
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="color"
                label="Màu sắc"
                value={form.color}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loadingSubmit}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
      >
        <DialogTitle>Xác nhận xoá</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xoá loại ghế này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, id: null })}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={loadingDelete}
          >
            {loadingDelete ? "Đang xoá..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          severity={alert.type}
          variant="filled"
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Global loading overlay (optional) */}
      <Backdrop
        open={loadingSubmit || loadingDelete}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default SeatTypeTable;
