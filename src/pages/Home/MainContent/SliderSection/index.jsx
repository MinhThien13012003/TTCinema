import React, { useRef, useState, useEffect } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import MovieCard from '../MovieCard';
import PromotionCard from '../PromotionCard';
import SectionHeader from '../SectionHeader';

const SliderSection = ({ title, icon, subtitle, items, type }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const targetScroll = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
      
      setTimeout(checkScrollButtons, 300);
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [items]);

  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
        <SectionHeader title={title} icon={icon} subtitle={subtitle} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            sx={{
              backgroundColor: canScrollLeft ? 'rgba(255, 184, 0, 0.1)' : 'rgba(148, 163, 184, 0.1)',
              color: canScrollLeft ? '#FFB800' : '#64748B',
              '&:hover': {
                backgroundColor: canScrollLeft ? 'rgba(255, 184, 0, 0.2)' : 'rgba(148, 163, 184, 0.1)',
              },
              '&:disabled': {
                color: '#64748B',
              }
            }}
          >
            <ArrowBackIos />
          </IconButton>
          <IconButton
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            sx={{
              backgroundColor: canScrollRight ? 'rgba(255, 184, 0, 0.1)' : 'rgba(148, 163, 184, 0.1)',
              color: canScrollRight ? '#FFB800' : '#64748B',
              '&:hover': {
                backgroundColor: canScrollRight ? 'rgba(255, 184, 0, 0.2)' : 'rgba(148, 163, 184, 0.1)',
              },
              '&:disabled': {
                color: '#64748B',
              }
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>
      </Box>
      
      {items.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: '#16213e',
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: '#94A3B8' }}>
            {type === 'promotion' ? 'Hiện tại chưa có khuyến mãi nào' : 'Chưa có phim nào'}
          </Typography>
        </Paper>
      ) : (
        <Box
          ref={scrollRef}
          onScroll={checkScrollButtons}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(148, 163, 184, 0.1)',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255, 184, 0, 0.5)',
              borderRadius: 4,
              '&:hover': {
                backgroundColor: 'rgba(255, 184, 0, 0.7)',
              },
            },
          }}
        >
          {items.map((item, index) => (
            type === 'movie' ? (
              <MovieCard key={index} movie={item} isUpcoming={title.includes('Sắp Chiếu')} />
            ) : (
              <PromotionCard key={index} promotion={item} />
            )
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SliderSection;

