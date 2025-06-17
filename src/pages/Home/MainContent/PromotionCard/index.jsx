import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Paper } from '@mui/material';
import { LocalOfferOutlined } from '@mui/icons-material';

const PromotionCard = ({ promotion }) => {
  return (
    <Card 
      sx={{ 
        minWidth: '280px',
        maxWidth: '280px',
        height: '450px',
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(255,184,0,0.1) 0%, rgba(74,95,217,0.1) 100%)',
        border: '1px solid rgba(255,184,0,0.2)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        bgcolor: '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        mr: 2,
        '&:hover': {
          transform: 'translateY(-2px) scale(0.98)',
         
        },
      }}
    >
      {promotion.image && (
        <Box sx={{ height: '180px', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="180"
            image={promotion.image}
            alt={promotion.promo_name}
            sx={{ 
              borderRadius: '12px 12px 0 0',
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        </Box>
      )}
      <CardContent sx={{ 
        p: 2, 
        height: '270px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        flex: 1
      }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LocalOfferOutlined sx={{ fontSize: 18, color: '#FFB800' }} />
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              sx={{ 
                color: '#FFB800',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '1rem',
                flex: 1
              }}
            >
              {promotion.promo_name}
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#94A3B8', 
              mb: 2, 
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.85rem'
            }}
          >
            {promotion.description}
          </Typography>
        </Box>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            backgroundColor: 'rgba(239,68,68,0.1)',
            borderRadius: 2,
            border: '1px dashed #EF4444',
            mt: 'auto'
          }}
        >
          <Typography 
            variant="body2" 
            fontWeight="bold"
            sx={{ 
              color: '#EF4444',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              fontSize: '0.8rem'
            }}
          >
            🎟️ Mã: {promotion.promo_code}
          </Typography>
          <Typography 
            variant="h6" 
            fontWeight="bold"
            sx={{ 
              color: '#EF4444',
              textAlign: 'center',
              mt: 0.5,
              fontSize: '1.1rem'
            }}
          >
            Giảm {promotion.discount_percentage}%
          </Typography>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default PromotionCard;
