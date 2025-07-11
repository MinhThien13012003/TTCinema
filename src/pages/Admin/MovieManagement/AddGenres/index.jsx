// src/components/AddGenre.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import axios from "../../../../service/axios";

const AddGenre = ({ onGenreAdded }) => {
  const [open, setOpen] = useState(false);
  const [genreName, setGenreName] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleAddGenre = async () => {
    if (!genreName.trim()) {
      setSnackbar({
        open: true,
        message: "Tên thể loại không được để trống",
        severity: "error",
      });
      return;
    }

    const newGenre = {
      name: genreName.trim(),
    };

    console.log("Genre gửi đi:", newGenre);

    try {
      await axios.post("/api/genres", newGenre);
      if (onGenreAdded) onGenreAdded(newGenre);
      setGenreName("");
      setOpen(false);
      setSnackbar({
        open: true,
        message: "Đã thêm thể loại thành công",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Lỗi khi thêm thể loại",
        severity: "error",
      });
      console.error("Genre POST error:", err);
    }
  };

  return (
    <>
      <Tooltip title="Thêm thể loại phim">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          onClick={() => setOpen(true)}
        >
          Them the loai phim
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Thêm thể loại phim mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Tên thể loại"
            value={genreName}
            onChange={(e) => setGenreName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleAddGenre}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddGenre;
