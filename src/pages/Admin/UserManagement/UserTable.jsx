// src/pages/UserManagement/UserTable.jsx
import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Skeleton,
} from "@mui/material";

const UserTable = () => {
  // Chưa có data nên hiển thị skeleton
  const isLoading = true;

  return (
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
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 4 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton height={30} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default UserTable;
