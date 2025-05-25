import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';

function AdminLayout() {
  return (
    <>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            TTCine Admin
          </Typography>
          <Button color="inherit" component={Link} to="/admin">Dashboard</Button>
          <Button color="inherit" component={Link} to="/admin/movies">Phim</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}

export default AdminLayout;
