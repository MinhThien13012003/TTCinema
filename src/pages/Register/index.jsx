import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Avatar,
  CircularProgress,
  Divider,
  Link,
  Container,
  Dialog,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  LockOutlined,
  Shield,
  PersonAdd,
  Google,
  Facebook,
  GitHub,
} from "@mui/icons-material";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    //kh_id: "",
    name: "",
    email: "",
    password: "",
    //confirmPassword: "",
    phone: "",
    dob: "",
    role: "user",
    isStudent: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  // const [isSubmitting, setIsSubmitting] = useState(false)
  // const [showLogin, setShowLogin] = useState(false)
  // const [showRegister, setShowRegister] = useState(false)
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  // const handleLoginSuccess = () => {
  //   setIsLoggedIn(true)
  //   setShowLogin(false)
  //   setShowRegister(false)
  // }
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, login, isSubmitting, error } = useAuthStore();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Họ tên không được để trống";
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await register(formData);
      // Đăng nhập tự động sau khi đăng ký thành công
      await login(formData.email, formData.password);
      if (onSuccess) {
        onSuccess({ role: "user", user: formData });
        //console.log("Đăng ký & đăng nhập thành công:", formData);
      }
      navigate("/");
    } catch (error) {
      let message = error.message || "Đăng ký thất bại";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      }
      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
      setErrors((prev) => ({
        ...prev,
        form: message,
      }));
      //console.error("Đăng ký thất bại:", error);
      if (error.response) {
        //console.error("Lỗi chi tiết từ server:", error.response?.data);
      }
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const autofillFix = {
    input: {
      "&:-webkit-autofill": {
        boxShadow: "0 0 0 1000px white inset",
        WebkitTextFillColor: "#000",
      },
    },
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
            }}
          >
            <PersonAdd fontSize="large" />
          </Avatar>
          <Typography variant="h4" gutterBottom>
            Tạo tài khoản
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Điền thông tin để bắt đầu hành trình của bạn
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <TextField
            fullWidth
            label="Họ và tên"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2, ...autofillFix }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2, ...autofillFix }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            sx={{ mb: 2, ...autofillFix }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Xác nhận mật khẩu"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword} // Sửa lại ở đây
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            sx={{ mb: 3, ...autofillFix }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Shield color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Số điện thoại"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Ngày sinh"
            type="date"
            value={formData.dob}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => handleInputChange("dob", e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="movie"
            size="large"
            disabled={isSubmitting}
            sx={{ mb: 2, py: 1.5 }}
          >
            {isSubmitting ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* {console.log("Dữ liệu gửi đi:", formData)} */}
                <CircularProgress size={20} color="inherit" />
                Đang tạo tài khoản...
              </Box>
            ) : (
              "Tạo tài khoản"
            )}
          </Button>
        </Box>

        {/* <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Hoặc đăng ký với
          </Typography>
        </Divider>

        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Google />}
            sx={{ borderColor: '#db4437', color: '#db4437' }}
          >
            Google
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Facebook />}
            sx={{ borderColor: '#4267B2', color: '#4267B2' }}
          >
            Facebook
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<GitHub />}
            sx={{ borderColor: '#333', color: '#333' }}
          >
            GitHub
          </Button>
        </Box> */}

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Đã có tài khoản?{" "}
            <Link
              onClick={onSwitchToLogin}
              href="#"
              underline="hover"
              sx={{ fontWeight: 600, color: "primary.main" }}
            >
              Đăng nhập ngay
            </Link>
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default RegisterForm;
