import React from "react";
import { Box, Typography, Link, Grid, IconButton, Divider } from "@mui/material";
import { Facebook, Instagram, YouTube, Email, Phone, LocationOn } from "@mui/icons-material";
import TTCine from '../../../assets/TTCine.svg?react'; // Import your SVG logo
import { default as SvgIcon } from '@mui/icons-material/Apps'

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        //background: '#16213e',
        color: "white",
        py: 6,
        px: { xs: 3, sm: 6, md: 8 },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: 'linear-gradient(45deg, #FFB800, #4A5FD9)',
        },
      }}
    >
      <Grid container spacing={5}>
        {/* Cột 1 - Giới thiệu */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 3 }}>
          
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: "bold",
                background: "#FFB800",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2
              }}
            >
              <SvgIcon component={TTCine} fontSize='small' inheritViewBox />
               TTCine
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 1.7,
                color: "#b0b0b0",
                fontSize: "0.95rem"
              }}
            >
              TTCine là hệ thống đặt vé xem phim tiện lợi, nhanh chóng và hiện đại. 
              Trải nghiệm phim ảnh đỉnh cao chỉ với vài cú click!
            </Typography>
          </Box>
        </Grid>

        {/* Cột 2 - Liên hệ */}
        <Grid item xs={12} md={4}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: "bold",
              mb: 3,
              color: "#ffffff"
            }}
          >
            Liên hệ
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Email sx={{ color: "#4ecdc4", fontSize: "1.2rem" }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                support@ttcine.vn
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Phone sx={{ color: "#ff6b6b", fontSize: "1.2rem" }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                1900 123 456
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <LocationOn sx={{ color: "#45b7d1", fontSize: "1.2rem" }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                180 Cao Lổ, TP.HCM
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Cột 3 - Mạng xã hội */}
        <Grid item xs={12} md={4}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: "bold",
              mb: 3,
              color: "#ffffff"
            }}
          >
            Kết nối với chúng tôi
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <IconButton
              href="https://www.facebook.com/?locale=vi_VN"
              target="_blank"
              sx={{
                bgcolor: "#1877f2",
                color: "white",
                width: 45,
                height: 45,
                "&:hover": {
                  bgcolor: "#166fe5",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(24, 119, 242, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Facebook />
            </IconButton>
            <IconButton
              href="https://www.instagram.com/"
              target ="_blank"
              sx={{
                background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                color: "white",
                width: 45,
                height: 45,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(225, 48, 108, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Instagram />
            </IconButton>
            <IconButton
              href="https://www.youtube.com/"
              target= "_blank"
              sx={{
                bgcolor: "#ff0000",
                color: "white",
                width: 45,
                height: 45,
                "&:hover": {
                  bgcolor: "#cc0000",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(255, 0, 0, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <YouTube />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ color: "#b0b0b0", fontStyle: "italic" }}>
            Theo dõi chúng tôi để cập nhật những bộ phim mới nhất!
          </Typography>
        </Grid>
      </Grid>

      {/* Đường phân cách */}
      <Divider sx={{ my: 4, bgcolor: "#333" }} />

      {/* Dòng bản quyền */}
      <Box 
        sx={{ 
          textAlign: "center",
          py: 2
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: "#888",
            fontSize: "0.9rem",
            "& .year": {
              color: "#4ecdc4",
              fontWeight: "bold"
            }
          }}
        >
          © <span className="year">{new Date().getFullYear()}</span> TTCine. All rights reserved. 
          Made with ❤️ for movie lovers.
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;