import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import PATH from './utils/path';
import Box from '@mui/material/Box';
// Pages người dùng
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import Container from '@mui/material/Container';
import AccountProfile from './components/AppBar/Menu/AccountProfile';
// Pages admin
import AdminDashboard from './pages/Admin/Dashboard';
import AdminMovies from './pages/Admin/Movies';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* Layout chính cho người dùng */}
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path={PATH.MOVIE_DETAIL()} element={<MovieDetail />} />
            <Route path={PATH.BOOKING()} element={<Booking />} />
            <Route path={PATH.LOGIN} element={<Login />} />
            <Route path={PATH.REGISTER} element={<Register />} />
            <Route path={PATH.ACCOUNTPROFILE} element={<AccountProfile />} />
          </Route>


          {/* Layout admin */}
          <Route path={PATH.ADMIN.ROOT} element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="movies" element={<AdminMovies />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
