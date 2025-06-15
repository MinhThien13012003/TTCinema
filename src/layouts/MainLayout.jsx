import Home from '../pages/Home';
import { Outlet } from 'react-router-dom';
import AppBar from '../components/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
function MainLayout() {
  const backgroundColor = '#16213e';
  return (
    <>

      {/* AppBar với cùng tỷ lệ như Home */}
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        width: '100%',
        bgcolor: backgroundColor,
        borderBottom: 'none',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Container 
          disableGutters
          maxWidth="lg"
          sx={{ 
            bgcolor: 'transparent',
            margin: '0 auto',
            padding: 0,
            width: '100%'
          }}>
          <AppBar />
        </Container>
      </Box>
      <Outlet/>

    </>
  );
}

export default MainLayout;