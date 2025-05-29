import Box from '@mui/material/Box'


function index() {
  return (
    <Box sx={{
        height: (theme) => theme.cine.bannerHeight,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}
    >
    Banner Side
    </Box>
  )
}

export default index