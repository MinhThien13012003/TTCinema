import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

function Movie() {
   const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <Box>
        <Button
        sx={{ color: '#F8FAFC', border: 'none',background:'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)' }}
        id="basic-button-movie"
        aria-controls={open ? 'basic-menu-movie' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon/>}
      >
        Phim
      </Button>
      <Menu sx={{ color: 'secondary.main' }}
        id="basic-menu-movie"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        
      >
        <MenuItem>
          <ListItemText>Phim Đang Chiếu</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>Phim Sắp Chiếu </ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Movie