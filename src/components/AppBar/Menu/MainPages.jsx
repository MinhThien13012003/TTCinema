import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();
  
    const handleClick = () => {
      navigate('/'); // chuyển sang trang booking
    };
  return (
      <Button onClick={handleClick} component="button" sx={{
        background: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)',
        color: '#F8FAFC'
      }}>
        Trang Chủ 
      </Button>
  )
}

export default MainPage