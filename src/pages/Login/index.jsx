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
  Link,
  Container,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  LockOutlined,
  Login,
} from "@mui/icons-material";
// import { adminData } from '../../utils/adminData'
// import { userData } from '../../utils/userData'
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

function LoginForm({ onSuccess, onSwitchToRegister }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const { user, token } = await login(formData.email, formData.password);
      //console.log("Đăng nhập thành công:", user);

      if (onSuccess) onSuccess({ role: user.role, user, token });

      // Phân quyền theo vai trò
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setErrors({ email: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar sx={{ width: 64, height: 64, mx: "auto", mb: 2 }}>
            <Login fontSize="large" />
          </Avatar>
          <Typography variant="h4" gutterBottom>
            Đăng nhập
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Chào mừng bạn quay lại!
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
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
            sx={{ mb: 3, ...autofillFix }}
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
                <CircularProgress size={20} color="inherit" />
                Đang đăng nhập...
              </Box>
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Chưa có tài khoản?{" "}
            <Link
              onClick={onSwitchToRegister}
              href="#"
              underline="hover"
              sx={{ fontWeight: 600, color: "primary.main" }}
            >
              Đăng ký ngay
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginForm;
