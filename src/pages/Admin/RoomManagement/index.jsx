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
} from "@mui/material";
import SeatTable from "../SeatPriceManagement/SeatTable";
import SeatGrid from "../SeatPriceManagement/SeatGrid";

const RoomManagement = ({ seatTypes }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [seats, setSeat] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSeat, setEditingSeat] = useState([null]);
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
    console.log("Mo dialog", form.loai_ghe_id);
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
    try {
      const res = await axios.get("/api/rooms");
      console.log("Ds rooms:", res.data);
      setRooms(res.data);
    } catch (err) {
      console.log("Lỗi khi lấy danh sách phòng:", err);
    }
  };
  const fetchSeatsByRoomId = async (roomId) => {
    try {
      const res = await axios.get("/api/seats");
      const allSeats = res.data;

      const filteredSeats = allSeats.filter(
        (seat) => seat.roomId?._id === roomId
      );
      console.log("Ghế trong phòng:", filteredSeats);
      setSeat(filteredSeats);
    } catch (err) {
      console.log("Loi lay ds ghe", err);
    }
  };
  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    fetchSeatsByRoomId(room._id);
  };
  const handleSubmit = async () => {
    try {
      if (!form.loai_ghe_id) {
        alert("Vui lòng chọn loại ghế!");
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
        await axios.put(`/api/seats/${editingSeat._id}`, payload);
        console.log("sua ghe:", payload);
      } else {
        try {
          console.log("Them ghe:", payload);
          await axios.post("/api/seats", payload);
        } catch (err) {
          console.log("Loi:", err);
        }
      }

      setDialogOpen(false);
      fetchSeatsByRoomId(selectedRoom._id);
    } catch (error) {
      console.error(error);
      alert("Lưu thất bại!");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);
  return (
    <Box display={"flex"} gap={4}>
      <Box width={"300px"}>
        <Typography variant="h6">Danh sách các phòng</Typography>
        <List>
          {rooms.map((room) => (
            <ListItemButton
              key={room._id}
              selected={selectedRoom?._id === room._id}
              onClick={() => handleSelectRoom(room)}
            >
              <ListItemText primary={room.name} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box flex={1}>
        {selectedRoom ? (
          <>
            <SeatGrid
              room={selectedRoom}
              seats={seats}
              seatTypes={seatTypes}
              onSelectSeat={openEditDialog}
              onAddSeat={openAddDialog}
            />
          </>
        ) : (
          <Typography>Chọn 1 phòng để xem</Typography>
        )}
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
          <Button onClick={() => setDialogOpen(false)}> Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            Luu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomManagement;
