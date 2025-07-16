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
const SeatTypeTable = ({ seatTypes, onRefresh }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    loai_ghe_id: Math.floor(Math.random() * 1000),
    name: "",
    price: "",
  });
  const [editItem, setEditItem] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const handleOpen = (item = null) => {
    setEditItem(item);
    setForm(
      item || {
        loai_ghe_id: Math.floor(Math.random() * 1000),
        name: "",
        price: "",
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
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xoá loại ghế này?")) {
      try {
        await axios.delete(`/api/seat-types/${id}`);
        onRefresh();
      } catch (err) {
        setAlert({ open: true, type: "error", message: "Không thể xoá" });
      }
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
            <TableCell>Giá</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {seatTypes.map((type) => (
            <TableRow key={type.loai_ghe_id}>
              <TableCell>{type.name}</TableCell>
              <TableCell>
                {Number(type.price).toLocaleString("vi-VN")}₫
              </TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpen(type)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(type.loai_ghe_id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editItem ? "Chỉnh sửa" : "Thêm"} loại ghế</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Tên loại"
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
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            Lưu
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
    </>
  );
};

export default SeatTypeTable;
