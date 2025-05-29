const PATH = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MOVIE_DETAIL: (id = ':id') => `/movie/${id}`,
  BOOKING: (showtimeId = ':showtimeId') => `/booking/${showtimeId}`,

  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin',
    MOVIES: '/admin/movies',
  }
};

export default PATH;
