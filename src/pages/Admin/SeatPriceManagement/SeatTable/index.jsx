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
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../../../service/axios";

const SeatTable = ({ seats, seatTypes, onRefresh }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    ten_ghe: "",
    row: "",
    column: "",
    loai_ghe_id: "",
  });
  const [editItem, setEditItem] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const handleOpen = (item = null) => {
    setEditItem(item);
    setForm(item || { ten_ghe: "", row: "", column: "", loai_ghe_id: "" });
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
        await axios.put(`/api/seats/${editItem.ghe_id}`, form);
      } else {
        await axios.post("/api/seats", form);
      }
      setAlert({ open: true, type: "success", message: "Lưu ghế thành công!" });
      handleClose();
      onRefresh();
    } catch (err) {
      setAlert({ open: true, type: "error", message: "Lỗi khi lưu ghế" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xoá ghế này?")) {
      try {
        await axios.delete(`/api/seats/${id}`);
        onRefresh();
      } catch (err) {
        setAlert({ open: true, type: "error", message: "Không thể xoá ghế" });
      }
    }
  };

  const getSeatType = (id) => seatTypes.find((st) => st.loai_ghe_id === id);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        startIcon={<AddIcon />}
      >
        Thêm ghế
      </Button>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Tên ghế</TableCell>
            <TableCell>Loại ghế</TableCell>
            <TableCell>Hàng</TableCell>
            <TableCell>Cột</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {seats.map((seat) => {
            const type = getSeatType(seat.loai_ghe_id);
            return (
              <TableRow key={seat.ghe_id}>
                <TableCell>{seat.ten_ghe}</TableCell>
                <TableCell>{type ? type.name : "Không rõ"}</TableCell>
                <TableCell>{seat.row}</TableCell>
                <TableCell>{seat.column}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(seat)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(seat.ghe_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editItem ? "Chỉnh sửa" : "Thêm"} ghế</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                name="ten_ghe"
                label="Tên ghế"
                value={form.ten_ghe}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="row"
                label="Hàng"
                type="number"
                value={form.row}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="column"
                label="Cột"
                type="number"
                value={form.column}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                name="loai_ghe_id"
                label="Loại ghế"
                value={form.loai_ghe_id}
                onChange={handleChange}
                fullWidth
              >
                {seatTypes.map((type) => (
                  <MenuItem key={type.loai_ghe_id} value={type.loai_ghe_id}>
                    {type.ten_loai}
                  </MenuItem>
                ))}
              </TextField>
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

export default SeatTable;
