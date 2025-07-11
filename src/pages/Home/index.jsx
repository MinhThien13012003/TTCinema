import { Container } from "@mui/material";
import AppBar from "../../components/AppBar";
import Banner from "../Home/Banner";
import MainContent from "../Home/MainContent";
import Footer from "../../components/Footer";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

function Home() {
  const backgroundColor = "#16213e";
  return (
    <>
      {/* Tạo background fullwidth */}
      <Box
        sx={{
          bgcolor: backgroundColor,
          minHeight: "100vh",
          width: "100%",
          position: "relative",
        }}
      >
        <Container
          disableGutters
          maxWidth="lg"
          sx={{
            display: "grid",
            minHeight: "100vh",
            gridTemplateRows: "400px 1fr auto",
            gridTemplateAreas: `
              "banner"
              "content"
              "footer"
            `,
            bgcolor: "transparent", // Trong suốt để hiển thị background bên ngoài
            margin: "0 auto",
            padding: 0,
          }}
        >
          {/* <Box 
        sx={{ 
          gridArea: 'header', 
          bgcolor: backgroundColor, // Sử dụng màu nền chung
          position: 'sticky', 
          top: 0, 
          zIndex: 1000,
          width: '100%'
        }}>
        <AppBar />
      </Box> */}

          <Box
            sx={{
              gridArea: "banner",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              background: backgroundColor,
              width: "100%",
              overflow: "hidden",
            }}
          >
            <Banner />
          </Box>

          <Box
            sx={{
              gridArea: "content",
              width: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: backgroundColor, // Thêm màu nền cho content area
              padding: 0, // Đảm bảo không có padding tạo khoảng trắng
            }}
          >
            {/* Căn giữa nội dung tại đây */}
            <Box
              sx={{
                width: "90%",
                maxWidth: "1200px",
                bgcolor: backgroundColor, // Thêm màu nền cho box con
                minHeight: "100%", // Đảm bảo chiều cao tối thiểu
              }}
            >
              <MainContent />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Home;
