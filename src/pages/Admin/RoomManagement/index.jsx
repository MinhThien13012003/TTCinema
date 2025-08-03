import { useEffect, useState } from "react";
import axios from "../../../service/axios";
import {
  Typography,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Menu,
  MenuItem,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import SeatTable from "../SeatPriceManagement/SeatTable";
import SeatGrid from "../SeatPriceManagement/SeatGrid";
import BulkSeatAddDialog from "./BulkSeatAddDialog";
import RoomTable from "./RoomTable";

const RoomManagement = ({ seatTypes }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [seats, setSeat] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSeat, setEditingSeat] = useState([null]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openBulk, setOpenBulk] = useState(false);
  const [snackbar, setSnackBar] = useState({
    open: false,
    message: "",
    severrity: "success",
  });
  const [loading, setLoading] = useState(false);

  const [roomForm, setRoomForm] = useState({
    //phong_id: null,
    name: "",
    type: "",
    capacity: "",
    rows: "",
    columns: "",
  });
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);

  const [editingRoom, setEditingRoom] = useState(null);
  const openAddRoomDialog = () => {
    setRoomForm({
      phong_id: Math.floor(Math.random() * 1000),
      name: "",
      type: "",
      capacity: "",
      rows: "",
      columns: "",
    });
    setEditingRoom(null);
    setRoomDialogOpen(true);
  };
  const [deleteRoomDialogOpen, setDeleteRoomDialogOpen] = useState(false);
  const handleOpenDeleteDialog = () => {
    if (editingRoom) {
      setRoomToDelete(editingRoom);
      setDeleteRoomDialogOpen(true);
    }
  };

  const openEditRoomDialog = (room) => {
    if (!room) return;
    setRoomForm({
      //phong_id: room.phong_id,
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      rows: room.rows !== undefined ? room.rows : "",
      columns: room.columns !== undefined ? room.columns : "",
    });
    setEditingRoom(room);
    setRoomDialogOpen(true);
  };
  const handleConfirmDelete = () => {
    setConfirmOpen(true);
  };
  const showSnackBar = (message, severrity = "success") => {
    setSnackBar({ open: true, message, severrity });
  };
  const [form, setForm] = useState({
    seatNumber: "",
    row: "",
    column: "",
    loai_ghe_id: "",
  });
  const openAddDialog = ({ row, column }) => {
    const seatNumber = `${row}${column}`;
    setForm({ seatNumber, row, column, loai_ghe_id: "" });
    setEditingSeat(null);
    setDialogOpen(true);
  };
  const openEditDialog = (seat) => {
    //console.log("Mo dialog", form.loai_ghe_id);
    const column = seat.seatNumber.match(/[A-Z](\d+)/i)?.[1];
    setForm({
      seatNumber: seat.seatNumber,
      row: seat.row,
      column: column,
      loai_ghe_id: seat.loai_ghe_id || seat.seatTypeId?.loai_ghe_id || "",
    });
    setEditingSeat(seat);
    setDialogOpen(true);
  };
  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const res = await axios.get("/api/rooms");
      //console.log("Ds rooms:", res.data);
      setRooms(res.data);
    } catch (err) {
      //console.log("Lỗi khi lấy danh sách phòng:", err);
    } finally {
      setLoadingRooms(false);
    }
  };
  const fetchSeatsByRoomId = async (roomId) => {
    setLoadingRooms(true);
    try {
      const res = await axios.get("/api/seats");
      const allSeats = res.data;

      const filteredSeats = allSeats.filter(
        (seat) => seat.roomId?._id === roomId
      );
      //.log("Ghế trong phòng:", filteredSeats);
      setSeat(filteredSeats);
    } catch (err) {
      //console.log("Loi lay ds ghe", err);
    } finally {
      setLoadingRooms(false);
    }
  };
  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    fetchSeatsByRoomId(room._id);
  };
  const handleSubmit = async () => {
    setLoading(true);
    if (!form.loai_ghe_id) {
      showSnackBar("Vui lòng chọn loại ghế!", "warning");
      setLoading(false);
      return;
    }
    try {
      if (!form.loai_ghe_id) {
        alert("Vui lòng chọn loại ghế!");
        return;
      }
      const totalSeats = Number(form.rows) * Number(form.columns);
      const capacity = Number(form.capacity);
      if (totalSeats > capacity) {
        showSnackBar(
          `Tổng số ghế (${totalSeats}) vượt quá sức chứa (${capacity})!`,
          "error"
        );
        return;
      }

      const payload = {
        ghe_id: Math.floor(Math.random() * 1000),
        seatNumber: form.seatNumber,
        row: form.row,
        phong_id: selectedRoom.phong_id, // ❗ Đúng ID phòng
        loai_ghe_id: parseInt(form.loai_ghe_id), // ❗ Đúng ID loại ghế
      };

      if (editingSeat && editingSeat._id) {
        try {
          const updatePayload = {
            loai_ghe_id: parseInt(form.loai_ghe_id),
          };
          await axios.put(`/api/seats/${editingSeat.ghe_id}`, updatePayload);
          showSnackBar("Cập nhật thành công!");
          fetchSeatsByRoomId(selectedRoom._id);
          //console.log("thanh cong");
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          // console.log("Them ghe:", payload);
          await axios.post("/api/seats", payload);
          showSnackBar("Thêm ghế mới thành công");
        } catch (err) {
          //console.log("Loi:", err);
        }
      }

      setDialogOpen(false);
      fetchSeatsByRoomId(selectedRoom._id);
    } catch (error) {
      //console.error(error);
      showSnackBar(`Có lỗi khi lưu ghê, ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!editingSeat || !editingSeat._id) return;
    setLoading(true);
    try {
      await axios.delete(`/api/seats/${editingSeat.ghe_id}`);
      showSnackBar("Xóa thành công!");
      fetchSeatsByRoomId(selectedRoom._id);
      setDialogOpen(false);
    } catch (err) {
      showSnackBar(`Có lỗi khi xóa ghế, ${err.message}`, "error");
      // console.log("loi xoa ", err);
    } finally {
      setConfirmOpen(false);
      setLoading(false);
    }
  };
  const handleOpenDeleteDialogFromTable = (room) => {
    setRoomToDelete(room);
    setDeleteRoomDialogOpen(true);
  };
  const handleSubmitRoom = async () => {
    const { name, type, capacity, rows, columns } = roomForm;
    const totalSeats = Number(rows) * Number(columns);
    const cap = Number(capacity);

    if (!name || !type || !capacity || !rows || !columns) {
      showSnackBar("Vui lòng nhập đầy đủ thông tin", "warning");
      return;
    }

    if (totalSeats > cap) {
      showSnackBar(
        `Tổng số ghế (${totalSeats}) vượt quá sức chứa (${cap})!`,
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      if (editingRoom) {
        await axios.put(`/api/rooms/${editingRoom.phong_id}`, roomForm);
        showSnackBar("Sửa thành công");
      } else {
        await axios.post("/api/rooms", roomForm);
        showSnackBar("Thêm thành công");
      }
      setRoomDialogOpen(false);
      fetchRooms();
    } catch (err) {
      showSnackBar(`Có lỗi khi lưu phòng: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (room) => {
    setLoading(true);
    try {
      await axios.delete(`/api/rooms/${room.phong_id}`);
      fetchRooms();
      showSnackBar("Xóa thành công!");
    } catch (err) {
      //console.error("Lỗi khi xoá", err);
      showSnackBar("Xóa thất bại", "error");
    } finally {
      setDeleteRoomDialogOpen(false);
      setRoomDialogOpen(false);
      setRoomToDelete(null);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRooms();
  }, []);
  return (
    <Box display={"flex"} gap={4}>
      {/* <Box width={"300px"}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Danh sách các phòng</Typography>
        </Box>
        <List>
          {rooms.map((room) => (
            <ListItemButton
              key={room._id}
              selected={selectedRoom?._id === room._id}
              onClick={() => handleSelectRoom(room)}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <ListItemText primary={room.name} />
              <Box>
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditRoomDialog(room);
                  }}
                >
                  Sửa
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRoom(room);
                  }}
                >
                  Xoá
                </Button>
              </Box>
            </ListItemButton>
          ))}
        </List>
      </Box> */}

      <Box flex={1}>
        <RoomTable
          rooms={rooms}
          onAdd={openAddRoomDialog}
          onEdit={openEditRoomDialog}
          onDelete={handleOpenDeleteDialogFromTable}
          selectedRoom={selectedRoom}
          onSelect={handleSelectRoom}
          loading={loadingRooms}
        />
        {selectedRoom ? (
          <Box mt={2} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="h4"
              fontWeight={700}
              gutterBottom
              color="primary"
            >
              Danh sách ghế phòng {selectedRoom.name}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setOpenBulk(true)}
              sx={{
                width: "150px",
              }}
              disabled={loading}
            >
              Thêm nhiều ghế
            </Button>
            <SeatGrid
              room={selectedRoom}
              seats={seats}
              seatTypes={seatTypes}
              onSelectSeat={openEditDialog}
              onAddSeat={openAddDialog}
              loading={loadingSeats}
            />
          </Box>
        ) : (
          <Box></Box>
        )}
        <Dialog open={roomDialogOpen} onClose={() => setRoomDialogOpen(false)}>
          <DialogTitle>
            {editingRoom ? "Chỉnh sửa phòng" : "Thêm phòng"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Tên phòng"
              value={roomForm.name}
              fullWidth
              margin="dense"
              onChange={(e) =>
                setRoomForm({ ...roomForm, name: e.target.value })
              }
            />
            <TextField
              label="Loại"
              value={roomForm.type}
              fullWidth
              margin="dense"
              onChange={(e) =>
                setRoomForm({ ...roomForm, type: e.target.value })
              }
            />
            <TextField
              label="Sức chứa"
              type="number"
              value={roomForm.capacity}
              fullWidth
              margin="dense"
              error={roomForm.rows * roomForm.columns > roomForm.capacity}
              helperText={
                roomForm.rows * roomForm.columns > roomForm.capacity
                  ? `Tổng số ghế (${
                      roomForm.rows * roomForm.columns
                    }) > sức chứa (${roomForm.capacity})`
                  : ""
              }
              onChange={(e) =>
                setRoomForm({ ...roomForm, capacity: e.target.value })
              }
            />
            <TextField
              label="Số hàng (rows)"
              type="number"
              value={roomForm.rows}
              fullWidth
              margin="dense"
              onChange={(e) => {
                const val = e.target.value;
                setRoomForm({
                  ...roomForm,
                  rows: val === "" ? "" : parseInt(val),
                });
              }}
            />

            <TextField
              label="Số cột (columns)"
              type="number"
              value={roomForm.columns}
              fullWidth
              margin="dense"
              onChange={(e) => {
                const val = e.target.value;
                setRoomForm({
                  ...roomForm,
                  columns: val === "" ? "" : parseInt(val),
                });
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmitRoom} disabled={loading}>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editingSeat ? "Chỉnh sửa ghế" : "Thêm ghế"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên ghế"
            value={form.seatNumber}
            fullWidth
            margin="dense"
            disabled
          />
          <TextField
            select
            label="Loại ghế"
            value={form.loai_ghe_id}
            fullWidth
            margin="dense"
            onChange={(e) =>
              setForm({ ...form, loai_ghe_id: Number(e.target.value) })
            }
          >
            {seatTypes.map((type) => (
              <MenuItem key={type._id} value={type.loai_ghe_id}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          {editingSeat && (
            <Button
              color="error"
              onClick={handleConfirmDelete}
              disabled={loading}
            >
              Xóa
            </Button>
          )}
          <Button onClick={() => setDialogOpen(false)} disabled={loading}>
            {" "}
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Luu
          </Button>
        </DialogActions>
      </Dialog>
      <BulkSeatAddDialog
        open={openBulk}
        onClose={() => setOpenBulk(false)}
        seatTypes={seatTypes}
        selectedRoom={selectedRoom}
        seats={seats}
        onSuccess={() => fetchSeatsByRoomId(selectedRoom._id)}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackBar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackBar({ ...snackbar, open: false })}
          severity={snackbar.severrity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Xác nhận xoá ghế</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xoá ghế này không?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={() => handleDelete(editingSeat.ghe_id)}
            disabled={loading}
          >
            {" "}
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteRoomDialogOpen}
        onClose={() => setDeleteRoomDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xoá phòng</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xoá phòng <strong>{roomToDelete?.name}</strong>{" "}
          không?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteRoomDialogOpen(false)}
            disabled={loading}
          >
            Huỷ
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              await handleDeleteRoom(roomToDelete);
              setDeleteRoomDialogOpen(false);
              setRoomDialogOpen(false);
            }}
            disabled={loading}
          >
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        open={loading}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1, color: "#fff" }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default RoomManagement;
