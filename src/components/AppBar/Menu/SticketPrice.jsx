import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function SticketPrice() {
  return (
      <Button component="button" sx={{
        color: '#F8FAFC',
        background: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)'
      }}>
        Giá Vé
      </Button>
  )
}

export default SticketPrice