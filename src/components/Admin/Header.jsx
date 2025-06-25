import { AppBar, Toolbar, Typography, Box, Avatar } from '@mui/material';
import Profile from '../AppBar/Menu/Profile';

const Header = () => (
  <AppBar
    position="fixed"
    sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
      bgcolor: '#1976d2',
      boxShadow: 2,
    }}
  >
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="h6" noWrap component="div"> Admin
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Profile />
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;
