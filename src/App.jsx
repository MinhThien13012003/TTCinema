import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import PATH from "./utils/path";
import Box from "@mui/material/Box";
// Pages người dùng
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Container from "@mui/material/Container";
import AccountProfile from "./components/AppBar/Menu/AccountProfile";
import ShowTime from "./pages/ShowTime";
import Movie from "./pages/Movie";

// Pages admin
import AdminDashboard from "./components/Admin/DashBoard";
import MovieManagement from "./pages/Admin/MovieManagement";
import MovieCard from "./pages/Home/MainContent/MovieCard";
import SeatPriceManagement from "./pages/Admin/SeatPriceManagement";
import ShowTimesManagement from "./pages/Admin/ShowTimesManagament";
import AdminRoute from "./route/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout chính cho người dùng */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path={PATH.MOVIE_DETAIL()} element={<MovieDetail />} />
          <Route path={PATH.LOGIN} element={<Login />} />
          <Route path={PATH.REGISTER} element={<Register />} />
          <Route path={PATH.ACCOUNTPROFILE} element={<AccountProfile />} />
          <Route path={PATH.MOVIE} element={<Movie />} />
          <Route path={PATH.BOOKING_ROUTE} element={<Booking />} />
        </Route>

        {/* Layout admin */}
        <Route
          path={PATH.ADMIN.ROOT}
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path={PATH.ADMIN.MOVIES} element={<MovieManagement />} />
          <Route
            path={PATH.ADMIN.SEATPRICE}
            element={<SeatPriceManagement />}
          />
          <Route
            path={PATH.ADMIN.SHOWTIMES}
            element={<ShowTimesManagement />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
