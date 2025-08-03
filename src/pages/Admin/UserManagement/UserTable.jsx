import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Skeleton,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../../service/axios";

const UserTable = ({ onEditUser, refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.phone?.toLowerCase().includes(q)
    );
  });

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    userId: null,
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/admin/users");
      console.log(res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng", err);
      setSnackbar({
        open: true,
        message: "Không thể tải danh sách người dùng",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteUser = (userId) => {
    setConfirmDialog({ open: true, userId });
  };

  const handleDelete = async () => {
    const { userId } = confirmDialog;
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setSnackbar({
        open: true,
        message: "Xóa người dùng thành công",
        severity: "success",
      });
      fetchUsers();
    } catch (err) {
      console.error("Lỗi xóa người dùng", err);
      setSnackbar({
        open: true,
        message: "Lỗi xóa người dùng",
        severity: "error",
      });
    } finally {
      setConfirmDialog({ open: false, userId: null });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  return (
    <>
      <TextField
        label="Tìm kiếm người dùng"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setPage(1); // quay về trang đầu khi tìm
        }}
        variant="outlined"
        size="small"
        sx={{ mb: 1 }}
      />

      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Họ tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {[...Array(4)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton height={30} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Không tìm thấy người dùng nào.
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => onEditUser(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => confirmDeleteUser(user._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* ✅ Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, userId: null })}
      >
        <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa người dùng này?</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, userId: null })}
          >
            Hủy
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      <Pagination
        count={Math.ceil(filteredUsers.length / rowsPerPage)}
        page={page}
        onChange={(e, value) => setPage(value)}
        color="primary"
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      />
    </>
  );
};

export default UserTable;
