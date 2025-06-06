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
        overflow: 'auto',
        gridTemplateRows: '50px 400px 1fr auto',
        gridTemplateAreas: `
          "header"
          "banner"
          "content"
          "footer"
        `
      }}
    >
        <Box sx={{ gridArea: 'header', bgcolor: '#2C84D6', position: 'sticky', top: 0, zIndex: 1000 }}>
          <AppBar />
        </Box>
        <Box sx={{ gridArea: 'banner', alignItems: 'center', display: 'flex', justifyContent: 'center', background: 'linear-gradient(135deg, #4A5FD9 0%, #6B73E0 25%, #8A87E7 50%, #B5A5E8 75%, #ffd700 100%)' }}>
          <Banner />
        </Box>
        <Box sx={{ gridArea: 'content', }}>
          <MainContent />
        </Box>
        <Box sx={{ gridArea: 'footer' }}>
          <Footer />
        </Box>
        
    </Container>
    
  );
}

export default MainLayout;
