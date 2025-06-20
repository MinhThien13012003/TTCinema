import MainContent from "../pages/Home/MainContent";

const PATH = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ACCOUNTPROFILE: '/account/profile',
  MainContent: '/home',
  MOVIE_DETAIL: (id = ':id') => `/movie/${id}`,
  MOVIE: '/movie',
  BOOKING_ROUTE: '/booking/:id',
  BOOKING: (id) => `/booking/${id}`,
  

  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin',
    MOVIES: '/admin/movies',
  }
};

export default PATH;
