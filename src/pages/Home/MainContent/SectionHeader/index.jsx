import React from 'react';
import { Box, Typography } from '@mui/material';

const SectionHeader = ({ title, icon: Icon, subtitle }) => {
  return (
    <Box sx={{ mb: 3, textAlign: 'left' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Icon sx={{ fontSize: 28, color: '#FFB800' }} />
        <Typography 
          variant="h4" 
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(45deg, #FFB800, #4A5FD9)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.8rem'
          }}
        >
          {title}
        </Typography>
      </Box>
      {subtitle && (
        <Typography variant="body1" sx={{ color: '#94A3B8', fontSize: '0.9rem' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default SectionHeader;
