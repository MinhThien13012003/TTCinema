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

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
        Quản lý người dùng
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <TextField
            label="Tìm kiếm người dùng"
            variant="outlined"
            size="small"
            sx={{ width: { xs: "100%", sm: "300px" } }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Thêm người dùng
          </Button>
        </Stack>
      </Paper>

      <UserTable />

      <UserFormDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
      />
    </Box>
  );
};

export default UserManagement;
