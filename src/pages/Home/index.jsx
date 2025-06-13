import { Container } from '@mui/material';
import AppBar from '../../components/AppBar';
import Banner from '../Home/Banner';
import MainContent from '../Home/MainContent';
import Footer from '../Home/Footer';
import Box from '@mui/material/Box';
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <Container 
      disableGutters 
      maxWidth={false} 
      sx={{
        display: 'grid',
        minHeight: '100vh', // Thay đổi từ height sang minHeight
        gridTemplateRows: ' 400px 1fr auto',
        gridTemplateAreas: `
          
          "banner"
          "content"
          "footer"
        `,
        // Loại bỏ overflow: 'auto' để tránh conflict
        '@media (max-width: 768px)': {
          gridTemplateRows: '50px 300px 1fr auto', // Banner nhỏ hơn trên mobile
        },
        '@media (max-width: 480px)': {
          gridTemplateRows: '50px 250px 1fr auto', // Banner còn nhỏ hơn trên mobile nhỏ
        }
      }}
    >
      {/* <Box 
        sx={{ 
          gridArea: 'header', 
          bgcolor: '#2C84D6', 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000,
          width: '100%' // Đảm bảo full width
        }}
      >
        <AppBar />
      </Box> */}
      
      <Box 
        sx={{ 
          gridArea: 'banner', 
          alignItems: 'center', 
          display: 'flex', 
          justifyContent: 'center', 
          background: 'linear-gradient(135deg, #4A5FD9 0%, #6B73E0 25%, #8A87E7 50%, #B5A5E8 75%, #ffd700 100%)',
          width: '100%',
          overflow: 'hidden' // Tránh overflow trong banner
        }}
      >
        <Banner />
      </Box>
      
      <Box 
        sx={{ 
          gridArea: 'content',
          width: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: 0, // Quan trọng: cho phép flex shrink trong grid
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <MainContent />
      </Box>
      
      <Box 
        sx={{ 
          gridArea: 'footer',
          width: '100%'
        }}
      >
        <Footer />
      </Box>
    </Container>
  )
}

export default Home