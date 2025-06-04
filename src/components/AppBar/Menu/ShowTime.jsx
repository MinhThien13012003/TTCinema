import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function ShowTime() {
  return (
      <Button component="button" sx={{
        color: '#F8FAFC',
        background: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)'
      }}>
        Lịch Chiếu
      </Button>
  );
}

export default ShowTime