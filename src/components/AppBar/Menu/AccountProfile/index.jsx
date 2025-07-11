import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Container,
  Divider,
} from "@mui/material";
import {
  Person,
  Stars,
  History,
  Logout,
  AccountCircle,
} from "@mui/icons-material";

const AccountProfile = () => {
  const [activeTab, setActiveTab] = useState("info");
  const sidebarWidth = 240;

  const menuItems = [
    { id: "info", label: "Thông tin khách hàng", icon: <Person /> },
    { id: "history", label: "Lịch sử mua hàng", icon: <History /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 3, color: "#333" }}
            >
              THÔNG TIN KHÁCH HÀNG
            </Typography>

            <Paper
              elevation={0}
              sx={{ p: 3, mb: 3, borderRadius: 2, border: "1px solid #e0e0e0" }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 2.5, color: "#333" }}
              >
                Thông tin cá nhân
              </Typography>
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {[
                  { label: "Họ và tên", defaultValue: "Võ Minh Thiện" },
                  {
                    label: "Ngày sinh",
                    type: "date",
                    defaultValue: "2003-01-13",
                  },
                  { label: "Số điện thoại", defaultValue: "0936385810" },
                  { label: "Email", defaultValue: "vominhthien131@gmail.com" },
                ].map((field, idx) => (
                  <Grid item xs={12} md={6} key={idx}>
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, color: "#666", fontWeight: 500 }}
                    >
                      {field.label}
                    </Typography>
                    <TextField
                      fullWidth
                      type={field.type || "text"}
                      defaultValue={field.defaultValue}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": { borderColor: "#7c3aed" },
                          "&.Mui-focused fieldset": { borderColor: "#7c3aed" },
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Button
                variant="contained"
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#333",
                  color: "white",
                  px: 3,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "#000" },
                }}
              >
                LƯU THÔNG TIN
              </Button>
            </Paper>

            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0" }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 2.5, color: "#333" }}
              >
                Đổi mật khẩu
              </Typography>
              <Grid container spacing={2.5}>
                {["Mật khẩu cũ", "Mật khẩu mới", "Xác thực mật khẩu"].map(
                  (label, idx) => (
                    <Grid item xs={12} md={4} key={idx}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, color: "#666", fontWeight: 500 }}
                      >
                        {label} <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        type="password"
                        required
                        variant="outlined"
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": { borderColor: "#7c3aed" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#7c3aed",
                            },
                          },
                        }}
                      />
                    </Grid>
                  )
                )}
              </Grid>
              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  fontWeight: "bold",
                  bgcolor: "#7c3aed",
                  color: "white",
                  px: 3,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "#5b21b6" },
                }}
              >
                ĐỔI MẬT KHẨU
              </Button>
            </Paper>
          </>
        );
      case "history":
        return (
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0" }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#333", mb: 2 }}
            >
              Lịch sử mua hàng
            </Typography>
            {[1, 2, 3].map((item) => (
              <Box
                key={item}
                sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Vé xem phim Interstellar
                </Typography>
                <Typography variant="body2">
                  Ngày chiếu: 10/07/2025 - 20:00
                </Typography>
                <Typography variant="body2">Ghế: B5, B6</Typography>
              </Box>
            ))}
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", mt: 8 }}>
        <Box
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            mr: 3,
            background: "linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%)",
            color: "white",
            minHeight: "calc(100vh - 64px)",
            overflowY: "auto",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                width: 36,
                height: 36,
              }}
            >
              <AccountCircle sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", fontSize: "0.85rem" }}
              >
                Võ Minh Thiện
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.7rem" }}
              >
                Thay đổi ảnh đại diện
              </Typography>
            </Box>
          </Box>

          <List sx={{ p: 0 }}>
            {menuItems.map((item) => (
              <ListItem
                key={item.id}
                button
                onClick={() => setActiveTab(item.id)}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  py: 1,
                  bgcolor: activeTab === item.id ? "#fbbf24" : "transparent",
                  color: activeTab === item.id ? "black" : "white",
                  "&:hover": {
                    bgcolor:
                      activeTab === item.id
                        ? "#fbbf24"
                        : "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: activeTab === item.id ? "black" : "white",
                    minWidth: 32,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.8rem",
                    fontWeight: activeTab === item.id ? "bold" : "normal",
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: "auto" }}>
            <ListItem
              button
              sx={{
                borderRadius: 1.5,
                py: 1,
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 32 }}>
                <Logout />
              </ListItemIcon>
              <ListItemText
                primary="Đăng xuất"
                primaryTypographyProps={{ fontSize: "0.8rem" }}
              />
            </ListItem>
          </Box>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#f5f5f5",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Container maxWidth="lg" sx={{ py: 3 }}>
            {renderTabContent()}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountProfile;
