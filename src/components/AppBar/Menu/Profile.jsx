import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Logout from '@mui/icons-material/Logout'
import Settings from '@mui/icons-material/Settings'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'

// 🧩 Giả sử bạn có các form này
import LoginForm from '../../../pages/Login'
import RegisterForm from '../../../pages/Register'

function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setShowLogin(false)
    setShowRegister(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setAnchorEl(null)
  }

  return (
    <Box>
      {!isLoggedIn ? (
        <Box sx={{ display: 'flex', gap: 2, color: '#F8FAFC' }}>
          <Button color="inherit" variant="outlined" onClick={() => setShowLogin(true)}
            sx={{
                border: 'none',
                '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '4px',
                left: 0,
                width: 0,
                height: '2px',
                backgroundColor: '#4A5FD9',
                transition: 'width 0.3s ease',
              },
              '&:hover::after': {
                width: '100%',
              }, 
              }}
          >
            Đăng nhập
          </Button>
          <Button color="inherit"  onClick={() => setShowRegister(true)} 
            sx={{
                border: 'none',
                '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '4px',
                left: 0,
                width: 0,
                height: '2px',
                backgroundColor: '#4A5FD9',
                transition: 'width 0.3s ease',
              },
              '&:hover::after': {
                width: '100%',
              }, 
              }}
          >
            Đăng ký
          </Button>
        </Box>
      ) : (
        <>
          <Tooltip title="Account settings">
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
              sx={{ padding: 0, color: 'white' }}
              aria-controls={openMenu ? 'basic-menu-profile' : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? 'true' : undefined}
            >
              <Avatar
                sx={{ width: 32, height: 32 }}
                alt="Avatar"
                src="https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png"
              />
            </IconButton>
          </Tooltip>
          <Menu
            id="basic-menu-profile"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={() => setAnchorEl(null)}
            MenuListProps={{
              'aria-labelledby': 'basic-button-profile',
            }}
          >
            <MenuItem onClick={() => setAnchorEl(null)}>
              <Avatar sx={{ height: 28, width: 28, mr: 2 }} /> Profile
            </MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>
              <Avatar sx={{ height: 28, width: 28, mr: 2 }} /> My account
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => setAnchorEl(null)}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </>
      )}

      {/* Dialog Đăng nhập */}
      <Dialog open={showLogin} onClose={() => setShowLogin(false)}>
        <LoginForm onSuccess={handleLoginSuccess} />
      </Dialog>

      {/* Dialog Đăng ký */}
      <Dialog open={showRegister} onClose={() => setShowRegister(false)}>
        <RegisterForm onSuccess={handleLoginSuccess} />
      </Dialog>
    </Box>
  )
}

export default Profile
