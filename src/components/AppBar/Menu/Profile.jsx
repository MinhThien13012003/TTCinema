import {
  AccountBox as AccountBoxIcon,
  History as HistoryIcon,
  Logout,
  AccountCircleOutlined as AccountCircleOutlinedIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 🧩 Form đăng nhập và đăng ký
import LoginForm from "../../../pages/Login";
import RegisterForm from "../../../pages/Register";

// ✅ Zustand store
import { useAuthStore } from "../../../store/authStore";

// Menu khi đã đăng nhập
const UserMenu = ({ setAnchorEl, onLogout }) => {
  const navigate = useNavigate();

  const handleGoToProfile = () => {
    setAnchorEl(null);
    navigate("/account/profile");
  };

  return (
    <>
      <MenuItem onClick={handleGoToProfile}>
        <AccountBoxIcon sx={{ height: 28, width: 28, mr: 2 }} />
        Tài khoản
      </MenuItem>
      <MenuItem onClick={onLogout}>
        <Logout sx={{ height: 28, width: 28, mr: 2 }} />
        Đăng xuất
      </MenuItem>
    </>
  );
};

function Profile() {
  const { user, logout } = useAuthStore();
  const isLoggedIn = !!user;
  const userRole = user?.role;

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleLoginSuccess = ({ role, user, token }) => {
    // Không cần set state nữa vì đã dùng Zustand
    setShowLogin(false);
    setShowRegister(false);
  };

  const avatarSrc =
    userRole === "user"
      ? user?.avatar || ""
      : "https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png";

  return (
    <Box>
      {!isLoggedIn ? (
        <Box sx={{ display: "flex", gap: 0.5, color: "#F8FAFC" }}>
          <Button
            startIcon={
              <AccountCircleOutlinedIcon sx={{ width: 24, height: 24 }} />
            }
            color="inherit"
            variant="outlined"
            onClick={() => setShowLogin(true)}
            sx={{
              border: "none",
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
            }}
          >
            Đăng nhập
          </Button>
        </Box>
      ) : (
        <>
          <Tooltip title="Account settings">
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
              sx={{ padding: 0, color: "white" }}
              aria-controls={openMenu ? "basic-menu-profile" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
            >
              <Avatar
                sx={{ width: 32, height: 32 }}
                alt="Avatar"
                src={avatarSrc}
              />
            </IconButton>
          </Tooltip>
          <Menu
            id="basic-menu-profile"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={() => setAnchorEl(null)}
            MenuListProps={{
              "aria-labelledby": "basic-button-profile",
            }}
          >
            <UserMenu setAnchorEl={setAnchorEl} onLogout={logout} />
          </Menu>
        </>
      )}

      {/* Dialog đăng nhập */}
      <Dialog open={showLogin} onClose={() => setShowLogin(false)}>
        <LoginForm
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      </Dialog>

      {/* Dialog đăng ký */}
      <Dialog open={showRegister} onClose={() => setShowRegister(false)}>
        <RegisterForm
          onSuccess={handleLoginSuccess}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      </Dialog>
    </Box>
  );
}

export default Profile;
