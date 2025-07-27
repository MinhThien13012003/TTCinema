import MainContent from "../pages/Home/MainContent";

const PATH = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ACCOUNTPROFILE: "/account/profile",
  MainContent: "/home",
  MOVIE_DETAIL: (id = ":id") => `/movie/${id}`,
  MOVIE: "/movie",
  BOOKING_ROUTE: "/booking/:id",
  BOOKING: (id) => `/booking/${id}`,
  BOOKINGCONFIRM: "/booking/confirm",

  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin",
    MOVIES: "/admin/movies",
    SEATPRICE: "/admin/seatprice",
    SHOWTIMES: "/admin/showtimes",
    USER: "/admin/user",
  },
};

export default PATH;
