import { Container } from '@mui/material';
import AppBar from '../components/AppBar';
import Banner from '../pages/Home/Banner';
import MainContent from '../pages/Home/MainContent';
import Footer from '../pages/Home/Footer';
import Box from '@mui/material/Box'

function MainLayout() {
  return (
    <Container disableGutters maxWidth={false} sx={{
        display: 'grid',
        height: '100vh',
        gridTemplateRows: '50px 400px 1fr 50px',
        gridTemplateAreas: `
          "header"
          "banner"
          "content"
          "footer"
        `
      }}
    >
        <Box sx={{ gridArea: 'header', bgcolor: '#2C84D6' }}>
          <AppBar />
        </Box>
        <Box sx={{ gridArea: 'banner', alignItems: 'center', display: 'flex', justifyContent: 'center', background: 'linear-gradient(135deg, #4A5FD9 0%, #6B73E0 25%, #8A87E7 50%, #B5A5E8 75%, #ffd700 100%)' }}>
          <Banner />
        </Box>
        <Box sx={{ gridArea: 'content', }}>
          <MainContent />
        </Box>
        <Box sx={{ gridArea: 'footer', bgcolor: 'grey.300' }}>
          <Footer />
        </Box>
        
    </Container>
    
  );
}

export default MainLayout;
