// src/pages/UserManagement/index.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UserTable from "./UserTable";
import UserFormDialog from "./UserFormDialog";

const UserManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEditUser = (user) => {
    setEditingUser(user);
    setOpenDialog(true);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
        Quản lý người dùng
      </Typography>

      <UserTable onEditUser={handleEditUser} refreshTrigger={refreshKey} />

      <UserFormDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        editingUser={editingUser}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
    </Box>
  );
};

export default UserManagement;
