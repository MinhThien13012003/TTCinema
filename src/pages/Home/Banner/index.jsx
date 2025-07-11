import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Fade,
  LinearProgress,
  Chip,
  Stack,
} from "@mui/material";
import {
  ArrowBackIos,
  ArrowForwardIos,
  FiberManualRecord,
} from "@mui/icons-material";

import bannerData from "../../../utils/bannerData";

function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setProgress(0);
    setCurrentIndex((prev) => (prev === 0 ? bannerData.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setProgress(0);
    setCurrentIndex((prev) => (prev === bannerData.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setProgress(0);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (!isTransitioning) handleNext();
          return 0;
        }
        return prev + 1.5;
      });
    }, 75);
    return () => clearInterval(interval);
  }, [isTransitioning]);

  const item = bannerData[currentIndex];

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        width: "85%",
        height: "100%",
        overflow: "hidden",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        backgroundColor: "#000",
        alignSelf: "center",
        alignItems: "center",
      }}
    >
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 5,
          height: 3,
          backgroundColor: "rgba(255,255,255,0.2)",
          "& .MuiLinearProgress-bar": {
            background:
              "linear-gradient(90deg, #FFB800 0%, #FF8C00 50%, #FFB800 100%)",
            borderRadius: "0 3px 3px 0",
          },
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${item.image})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "all 0.8s ease",
          transform: isTransitioning ? "scale(1.05)" : "scale(1)",
          filter: isTransitioning ? "brightness(0.7)" : "brightness(1)",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)",
            zIndex: 1,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)",
            zIndex: 2,
          },
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 30,
          right: 0,
          p: { xs: 3, sm: 4, md: 6 },
          zIndex: 3,
        }}
      >
        <Fade in={!isTransitioning} timeout={800}>
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: "#FFB800",
                mb: 0.5,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {item.type === "promotion" && "🎁 Ưu đãi"}
              {item.type === "movie" && "🎬 Phim hot"}
              {item.type === "news" && "📰 Tin tức điện ảnh"}
            </Typography>

            {item.type === "movie" && (
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
              >
                <Chip
                  label={item.genre}
                  size="small"
                  sx={{
                    backgroundColor: "#FFB800",
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                  }}
                />
                <Chip
                  label={item.rating}
                  size="small"
                  variant="outlined"
                  sx={{
                    color: "white",
                    borderColor: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.75rem",
                  }}
                />
                <Chip
                  label={item.duration}
                  size="small"
                  variant="outlined"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    borderColor: "rgba(255, 255, 255, 0.4)",
                    fontSize: "0.75rem",
                  }}
                />
              </Stack>
            )}

            {/* Title */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "white",
                mb: 2,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {item.title}
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                mb: 4,
                fontSize: { xs: "1rem", md: "1.2rem" },
                maxWidth: { xs: "100%", md: "65%" },
                textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
                lineHeight: 1.6,
              }}
            >
              {item.description}
            </Typography>
          </Box>
        </Fade>
      </Box>

      {/* Arrows */}
      <IconButton
        onClick={handlePrev}
        disabled={isTransitioning}
        sx={arrowStyle("left")}
      >
        <ArrowBackIos sx={{ fontSize: { xs: 20, md: 24 } }} />
      </IconButton>
      <IconButton
        onClick={handleNext}
        disabled={isTransitioning}
        sx={arrowStyle("right")}
      >
        <ArrowForwardIos sx={{ fontSize: { xs: 20, md: 24 } }} />
      </IconButton>

      {/* Dots */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1.5,
          zIndex: 4,
        }}
      >
        {bannerData.map((_, index) => (
          <IconButton
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            sx={{
              width: 14,
              height: 14,
              minWidth: "unset",
              p: 0,
              color:
                index === currentIndex ? "white" : "rgba(255, 255, 255, 0.5)",
              transition: "all 0.3s ease",
              transform: index === currentIndex ? "scale(1.4)" : "scale(1)",
              "&:hover": {
                color: "white",
                transform: "scale(1.3)",
              },
              "&:disabled": {
                opacity: 0.7,
              },
            }}
          >
            <FiberManualRecord sx={{ fontSize: 14 }} />
          </IconButton>
        ))}
      </Box>
    </Box>
  );
}

const arrowStyle = (position) => ({
  position: "absolute",
  [position]: { xs: 12, md: 20 },
  top: "50%",
  transform: "translateY(-50%)",
  color: "white",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  backdropFilter: "blur(10px)",
  zIndex: 4,
  width: { xs: 45, md: 55 },
  height: { xs: 45, md: 55 },
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    transform: "translateY(-50%) scale(1.1)",
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  "&:disabled": {
    opacity: 0.4,
  },
});

export default Banner;
