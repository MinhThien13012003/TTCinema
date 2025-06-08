import React, { useState } from 'react'
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
  Container
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  LockOutlined,
  Login,
  Google,
  Facebook,
  GitHub
} from '@mui/icons-material'

function LoginForm({ onSuccess }) {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      if (onSuccess) onSuccess()
    }, 1500)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const autofillFix = {
    input: {
      '&:-webkit-autofill': {
        boxShadow: '0 0 0 1000px white inset',
        WebkitTextFillColor: '#000'
      }
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2
            }}
          >
            <Login fontSize="large" />
          </Avatar>
          <Typography variant="h4" gutterBottom>
            Đăng nhập
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Chào mừng bạn quay lại!
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2, ...autofillFix }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
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
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Đang đăng nhập...
              </Box>
            ) : (
              'Đăng nhập'
            )}
          </Button>
        </Box>

        {/* Divider */}
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Hoặc đăng nhập với
          </Typography>
        </Divider>

        {/* Social */}
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
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Chưa có tài khoản?{' '}
            <Link
              href="#"
              underline="hover"
              sx={{ fontWeight: 600, color: 'primary.main' }}
            >
              Đăng ký ngay
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default LoginForm
