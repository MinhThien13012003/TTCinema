// BookingSticket.jsx
import * as React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function BookingSticket() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/movie'); // chuyển sang trang booking
  };

  return (
    <Button variant='movie'  onClick={handleClick}>
      Đặt Vé
    </Button>
  );
}

export default BookingSticket;
