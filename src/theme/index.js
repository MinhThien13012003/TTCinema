import { extendTheme } from '@mui/material/styles'

const APP_BAR_HEIGHT= '58px'
const Banner_HEIGHT= '60px'
const Footer_HEIGHT= '50px'
const Main_CONTENT_HEIGHT= `calc(300vh - ${APP_BAR_HEIGHT} - ${Banner_HEIGHT}- ${Footer_HEIGHT})`
const theme = extendTheme({
  cine: {
    appBarHeight: APP_BAR_HEIGHT,
    bannerHeight: Banner_HEIGHT,
    mainContentHeight: Main_CONTENT_HEIGHT,
    footerHeight: Footer_HEIGHT
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#2C84D6',      // Xanh TTCine
      dark: '#1B5EAB',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FEC20E',      // Vàng accent
    },
    background: {
      default: '#F3F9FF',   // Nền trang
      paper: '#ffffff',     // Nền thẻ, form
    },
    text: {
      primary: '#222222',   // Màu chữ chính
    },
  },

  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#ffffff',
          },
          '&::-webkit-scrollbar-track': {
            margin: '8px', // sửa lỗi m:2 không hợp lệ trong styleOverrides
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.5px',
          '&:hover': {
            borderWidth: '0.5px',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': {
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset': {
            borderWidth: '0.5px !important',
          },
          '&:hover fieldset': {
            borderWidth: '2px !important',
          },
          '&.Mui-focused fieldset': {
            borderWidth: '2px !important',
          },
        },
      },
    },
  },
})

export default theme
