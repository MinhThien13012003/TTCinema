import { default as SvgIcon } from '@mui/icons-material/Apps'
import Close from '@mui/icons-material/Close'
import Search from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import TTCine from '../../assets/TTCine.svg?react'
import Movie from './Menu/Movie'
import Profile from './Menu/Profile'
import ShowTime from './Menu/ShowTime'
import SticketPrice from './Menu/SticketPrice'
import MainPage from './Menu/MainPages'

function AppBar() {
  const [searchValue, setSearchValue] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  // Styled component cho menu items với hover effect
  const MenuItemStyled = ({ children, ...props }) => (
    <Box
      {...props}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        padding: '8px 12px',
        gap: 1,
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
        ...props.sx
      }}
    >
      {children}
    </Box>
  )

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 250, height: '100%',bgcolor:'#16213e' }}>
      <List sx={{gap:2}}>
        <ListItem sx={{ p: 0 }}>
          <MenuItemStyled sx={{ width: '100%', justifyContent: 'flex-start' }}>
            <MainPage />
          </MenuItemStyled>
        </ListItem>
        <ListItem sx={{ p: 0 }}>
          <MenuItemStyled sx={{ width: '100%', justifyContent: 'flex-start' }}>
            <Movie />
          </MenuItemStyled>
        </ListItem>
        <ListItem sx={{ p: 0 }}>
          <MenuItemStyled sx={{ width: '100%', justifyContent: 'flex-start' }}>
            <ShowTime />
          </MenuItemStyled>
        </ListItem>
        <ListItem sx={{ p: 0 }}>
          <MenuItemStyled sx={{ width: '100%', justifyContent: 'flex-start' }}>
            <SticketPrice />
          </MenuItemStyled>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <>
      <Box sx={{
        px: 2,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflow: 'hidden',
        height: '100%',
        backgroundColor: '#16213e',
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon component={TTCine} fontSize='small' inheritViewBox />
          <Typography variant='span' sx={{ 
            color: '#FFB800', 
            fontSize: '1.2rem', 
            fontWeight: 'bold' 
          }}>
            TTCINE
          </Typography>
        </Box>

        {/* Desktop Menu */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, }}>
            <MenuItemStyled>
              <MainPage />
            </MenuItemStyled>
            <MenuItemStyled>
              <Movie />
            </MenuItemStyled>
            <MenuItemStyled>
              <ShowTime />
            </MenuItemStyled>
            <MenuItemStyled>
              <SticketPrice />
            </MenuItemStyled>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '6px'}}>
            <TextField
              sx={{
                minWidth: 120,
                maxWidth: isMobile ? 140 : 170,
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
              id="outlined-search"
              label="Search..."
              size='small'
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <Close
                    fontSize='small'
                    sx={{
                      color: searchValue ? 'white' : 'transparent',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSearchValue('')}
                  />
                )
              }}
            />
          <Profile />

          {/* Hamburger Menu cho mobile */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                color: 'white'
              }}
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
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default AppBar