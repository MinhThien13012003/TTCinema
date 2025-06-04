import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function MainPage() {
  return (
      <Button component="button" sx={{
        background: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)',
        color: '#F8FAFC'
      }}>
        Trang Chủ 
      </Button>
  )
}

export default MainPage