import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages người dùng
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';

// Pages admin
import AdminDashboard from './pages/Admin/Dashboard';
import AdminMovies from './pages/Admin/Movies';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Layout chính cho người dùng */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/booking/:showtimeId" element={<Booking />} />
          </Route>

          {/* Trang riêng */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Layout admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="movies" element={<AdminMovies />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
