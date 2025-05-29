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
        gridTemplateRows: '50px 60px 1fr 50px',
        gridTemplateAreas: `
          "header"
          "banner"
          "content"
          "footer"
        `
      }}
    >
        <Box sx={{ gridArea: 'header', bgcolor: 'primary.main' }}>
          <AppBar />
        </Box>
        <Box sx={{ gridArea: 'banner', bgcolor: 'secondary.main' }}>
          <Banner />
        </Box>
        <Box sx={{ gridArea: 'content', bgcolor: 'red' }}>
          <MainContent />
        </Box>
        <Box sx={{ gridArea: 'footer', bgcolor: 'grey.300' }}>
          <Footer />
        </Box>
        
    </Container>
    
  );
}

export default MainLayout;
