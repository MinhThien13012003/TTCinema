import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function ShowTime() {
  return (
      <Button component="button" sx={{
        color: '#F8FAFC',
        bgcolor: '#FFB800'
      }}>
        Lịch Chiếu
      </Button>
  );
}

export default ShowTime