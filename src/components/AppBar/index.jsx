import { default as SvgIcon } from "@mui/icons-material/Apps";
import Close from "@mui/icons-material/Close";
import Search from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { CardMedia } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useMemo, useRef } from "react";
import TTCine from "../../assets/TTCine.svg?react";
import Profile from "./Menu/Profile";
import BookingSticket from "./Menu/BookingSticket";
import MainPage from "./Menu/MainPages";
import { useSearch } from "../../contexts/SearchContext";
import axios from "../../service/axios";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

function AppBar() {
  const { keyword, setKeyword } = useSearch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [movieList, setMovieList] = useState([]);
  const anchorRef = useRef(null);
  const [openPopper, setOpenPopper] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("/api/movies");
        setMovieList(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách phim:", err);
      }
    };
    fetchMovies();
  }, []);
  const filteredMovies = useMemo(() => {
    if (!keyword.trim()) return [];
    return movieList.filter((movie) =>
      movie.title.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [movieList, keyword]);
  // console.log("Phim lọc được:", filteredMovies);

  // Styled component cho menu items với hover effect
  const MenuItemStyled = ({ children, ...props }) => (
    <Box
      {...props}
      sx={{
        position: "relative",
        cursor: "pointer",
        padding: "8px 12px",
        gap: 1,
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "4px",
          left: 0,
          width: 0,
          height: "2px",
          backgroundColor: "#4A5FD9",
          transition: "width 0.3s ease",
        },
        "&:hover::after": {
          width: "100%",
        },
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 250, height: "100%", bgcolor: "#16213e" }}>
      <List sx={{ gap: 2 }}>
        <ListItem sx={{ p: 0 }}>
          <MenuItemStyled sx={{ width: "100%", justifyContent: "flex-start" }}>
            <MainPage />
          </MenuItemStyled>
        </ListItem>

        <ListItem sx={{ p: 0 }}>
          <MenuItemStyled sx={{ width: "100%", justifyContent: "flex-start" }}>
            <BookingSticket />
          </MenuItemStyled>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          px: isMobile ? 2 : 12,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          overflow: "hidden",
          height: "100%",
          backgroundColor: "#16213e",
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <SvgIcon component={TTCine} fontSize="small" inheritViewBox />
          <Typography
            variant="span"
            sx={{ color: "#FFB800", fontSize: "1.2rem", fontWeight: "bold" }}
          >
            TTCINE
          </Typography>
        </Box>

        {/* Desktop Menu */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <MenuItemStyled>
              <MainPage />
            </MenuItemStyled>
            <MenuItemStyled>
              <BookingSticket />
            </MenuItemStyled>
          </Box>
        )}

        {/* Search + Profile + Menu icon*/}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: isMobile ? 0 : "6px",
            position: "relative",
          }}
        >
          {/* Ô tìm kiếm */}
          <Box sx={{ position: "relative" }}>
            <TextField
              sx={{
                minWidth: isMobile ? 100 : 140,
                maxWidth: isMobile ? 140 : 170,
                "& label": { color: "white" },
                "& input": { color: "white" },
                "& label.Mui-focused": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
              }}
              id="outlined-search"
              size="small"
              type="text"
              value={keyword}
              inputRef={anchorRef}
              onChange={(e) => {
                setKeyword(e.target.value);
                setOpenPopper(true);
              }}
              onFocus={() => {
                if (filteredMovies.length > 0) setOpenPopper(true);
              }}
              placeholder="Tìm phim..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "white" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <Close
                    fontSize="small"
                    sx={{
                      color: keyword ? "white" : "transparent",
                      cursor: "pointer",
                    }}
                    onClick={() => setKeyword("")}
                  />
                ),
              }}
            />

            {/* Dropdown kết quả tìm kiếm */}
            <Popper
              open={openPopper && filteredMovies.length > 0}
              anchorEl={anchorRef.current}
              placement="bottom-start"
              style={{ zIndex: 1500 }}
            >
              <ClickAwayListener onClickAway={() => setOpenPopper(false)}>
                <Paper
                  sx={{
                    mt: 1,
                    width: anchorRef.current
                      ? Math.max(anchorRef.current.offsetWidth, 300)
                      : 300,
                    maxHeight: 400,
                    overflowY: "auto",
                    bgcolor: "#16213e",
                    border: "1px solid #4A5FD9",
                  }}
                >
                  {filteredMovies.map((movie) => (
                    <Box
                      key={movie.phim_id}
                      onClick={() => {
                        setOpenPopper(false);
                        setKeyword("");
                        navigate(`/movie/${movie.phim_id}`);
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 1.5,
                        cursor: "pointer",
                        borderBottom: "1px solid #2a3a5c",
                        "&:hover": {
                          backgroundColor: "#2a3a5c",
                        },
                        "&:last-child": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      {/* Hình ảnh poster */}
                      <Box
                        sx={{
                          width: 50,
                          height: 75,
                          borderRadius: 1,
                          overflow: "hidden",
                          flexShrink: 0,
                          bgcolor: "#333",
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={movie.poster}
                          alt={movie.title}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.style.backgroundColor =
                              "#555";
                            e.target.parentElement.innerHTML = `
                  <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    color: #888;
                    font-size: 12px;
                    text-align: center;
                  ">
                    No Image
                  </div>
                `;
                          }}
                        />
                      </Box>

                      {/* Thông tin phim */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "white",
                            fontWeight: "medium",
                            mb: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {movie.title}
                        </Typography>

                        {movie.genre && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#aaa",
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {Array.isArray(movie.genre)
                              ? movie.genre.join(", ")
                              : movie.genre}
                          </Typography>
                        )}
                      </Box>

                      {/* Icon search hoặc play */}
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          backgroundColor: "#4A5FD9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Search sx={{ fontSize: 14, color: "white" }} />
                      </Box>
                    </Box>
                  ))}

                  {/* Hiển thị khi không có kết quả */}
                  {filteredMovies.length === 0 && keyword.trim() && (
                    <Box
                      sx={{
                        p: 2,
                        textAlign: "center",
                        color: "#aaa",
                      }}
                    >
                      <Typography variant="body2">
                        Không tìm thấy phim "{keyword}"
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </ClickAwayListener>
            </Popper>
          </Box>

          {/* Avatar/Profile */}
          <Profile />

          {/* Hamburger Menu cho mobile */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile.
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default AppBar;
