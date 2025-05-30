import { extendTheme } from '@mui/material/styles'

const APP_BAR_HEIGHT= '58px'
const Banner_HEIGHT= '80px'
const Footer_HEIGHT= '50px'
const Main_CONTENT_HEIGHT= `calc(300vh - ${APP_BAR_HEIGHT} - ${Banner_HEIGHT}- ${Footer_HEIGHT})`
const colors = {
  // Màu chính từ logo
  primary: {
    main: '#FFB800',      // Vàng Cinema
    light: '#FFCA28',     // Vàng sáng hơn
    dark: '#FF9500',      // Cam ấm
    contrastText: '#1a1a2e'
  },
  secondary: {
    main: '#4A5FD9',      // Xanh Hoàng Gia  
    light: '#6366F1',     // Tím xanh nhẹ
    dark: '#3949AB',      // Xanh đậm hơn
    contrastText: '#FFFFFF'
  },
  // Màu nền
  background: {
    default: '#1a1a2e',   // Nền tối chính
    paper: '#16213e',     // Nền tối phụ (cards, modals)
    level1: '#242845',    // Nền tối cấp 1
    level2: '#2d3561'     // Nền tối cấp 2
  },
  // Màu text
  text: {
    primary: '#F8FAFC',   // Text chính (trắng)
    secondary: '#94A3B8', // Text phụ (xám sáng)
    disabled: '#64748B',  // Text disabled
    hint: '#64748B'       // Text hint
  },
  // Màu đường viền
  divider: 'rgba(148, 163, 184, 0.12)',
  // Màu trạng thái
  error: {
    main: '#EF4444',
    light: '#FCA5A5',
    dark: '#DC2626'
  },
  warning: {
    main: '#F59E0B',
    light: '#FCD34D',
    dark: '#D97706'
  },
  success: {
    main: '#10B981',
    light: '#6EE7B7',
    dark: '#059669'
  },
  info: {
    main: '#3B82F6',
    light: '#93C5FD',
    dark: '#1D4ED8'
  }
}
const theme = extendTheme({
  cine: {
    appBarHeight: APP_BAR_HEIGHT,
    bannerHeight: Banner_HEIGHT,
    mainContentHeight: Main_CONTENT_HEIGHT,
    footerHeight: Footer_HEIGHT
  },
  palette: {
    mode: 'dark',
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
    divider: colors.divider,
    error: colors.error,
    warning: colors.warning,
    success: colors.success,
    info: colors.info,
    // Custom colors riêng cho TTCINE
    cinema: {
      gold: '#FFB800',
      goldLight: '#FFCA28',
      goldDark: '#FF9500',
      blue: '#4A5FD9',
      blueLight: '#6366F1',
      blueDark: '#3949AB',
      darkBg: '#1a1a2e',
      darkCard: '#16213e'
    }
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  },
  components: {
    
    MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 'bold',
        '&:hover': {
          textDecoration: 'none',
        },
        '&:focus': {
          outline: 'none',
        },
        '&:focus-visible': {
          outline: 'none',
        },
        '&:focus:not(:focus-visible)': {
          outline: 'none',
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
    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     root: {
    //       fontSize: '0.875rem',
    //       '& fieldset': {
    //         borderWidth: '0.5px !important',
    //       },
    //       '&:hover fieldset': {
    //         borderWidth: '2px !important',
    //       },
    //       '&.Mui-focused fieldset': {
    //         borderWidth: '2px !important',
    //       },
    //     },
    //   },
    // },
  },
})

export default theme
