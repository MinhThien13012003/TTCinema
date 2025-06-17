import Home from '../pages/Home';
import { Outlet } from 'react-router-dom';
import AppBar from '../components/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Footer from '../pages/Home/Footer';
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
      <Box 
        sx={{ 
          width: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: backgroundColor, // Thêm màu nền cho content area
          padding: 0, // Đảm bảo không có padding tạo khoảng trắng
        }}>
        {/* Căn giữa nội dung tại đây */}
        <Box sx={{ 
          width: '90%', 
          maxWidth: '1200px',
          bgcolor: backgroundColor, // Thêm màu nền cho box con
          minHeight: '100%', // Đảm bảo chiều cao tối thiểu
        }}>
        <Container 
          disableGutters
          maxWidth="lg"
          sx={{ 
            bgcolor: 'transparent',
            margin: '0 auto',
            padding: 0,
            width: '90%'
          }}>
          <Outlet/>
          </Container>
          <Container 
          disableGutters
          maxWidth="lg"
          sx={{ 
            bgcolor: 'transparent',
            margin: '0 auto',
            padding: 0,
            width: '85%'
          }}>
          <Footer />
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default MainLayout;