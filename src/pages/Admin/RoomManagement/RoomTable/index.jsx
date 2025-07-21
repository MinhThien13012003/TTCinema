import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
} from "@mui/material";

const RoomTable = ({
  rooms,
  onAdd,
  onEdit,
  onDelete,
  onSelect,
  selectedRoom,
  loading,
}) => (
  <Box>
    <Box display="flex" justifyContent="space-between" mb={2}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Danh sách phòng
      </Typography>
    </Box>
    <Button variant="contained" onClick={onAdd} disabled={loading}>
      Thêm phòng
    </Button>

    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Tên phòng</TableCell>
          <TableCell>Loại</TableCell>
          <TableCell>Sức chứa</TableCell>
          <TableCell>Hành động</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading
          ? [...Array(4)].map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                {[...Array(4)].map((__, j) => (
                  <TableCell key={j}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : rooms.map((room) => (
              <TableRow
                key={room._id}
                hover
                selected={selectedRoom?._id === room._id}
                onClick={() => onSelect(room)}
              >
                <TableCell>{room.name}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>{room.capacity}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(room);
                    }}
                    disabled={loading}
                  >
                    Sửa
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(room);
                    }}
                    disabled={loading}
                  >
                    Xoá
                  </Button>
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  </Box>
);

export default RoomTable;
