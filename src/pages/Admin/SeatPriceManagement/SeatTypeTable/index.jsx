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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../../../service/axios";
import { Backdrop, CircularProgress } from "@mui/material";

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
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    id: null,
  });
  const handleDeleteClick = (id) => {
    setConfirmDelete({ open: true, id });
  };

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
    setOpen(false);
    setEditItem(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editItem) {
        await axios.put(`/api/seat-types/${editItem.loai_ghe_id}`, form);
      } else {
        try {
          console.log("data gửi đi", form);
          await axios.post("/api/seat-types", form);
        } catch (err) {
          console.log(err);
        }
      }
      setAlert({ open: true, type: "success", message: "Lưu thành công!" });
      handleClose();
      onRefresh();
    } catch (err) {
      setAlert({ open: true, type: "error", message: "Lỗi khi lưu dữ liệu" });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/seat-types/${confirmDelete.id}`);
      onRefresh();
      setAlert({ open: true, type: "success", message: "Xóa thành công!" });
    } catch (err) {
      setAlert({ open: true, type: "error", message: "Không thể xoá" });
    } finally {
      setLoading(false);
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

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editItem ? "Chỉnh sửa loại ghế" : "Thêm loại ghế"}
        </DialogTitle>

        <DialogContent dividers>
          {loading ? (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{ height: 150 }}
            >
              <CircularProgress />
            </Grid>
          ) : (
            <Grid container spacing={2} mt={0.5}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Tên loại ghế"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  sx={{ width: "150px" }}
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
                  variant="outlined"
                  InputProps={{ inputProps: { min: 0 } }}
                  sx={{ width: "150px" }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="color"
                  label="Màu sắc"
                  //type="color"
                  value={form.color}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: "150px" }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.type}>{alert.message}</Alert>
      </Snackbar>
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
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? "Đang xoá..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default SeatTypeTable;
