import Box from "@mui/material/Box";


function index() {
  return (
    <Box sx={{
        height: (theme) => theme.cine.mainContentHeight,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}
    >
        Main Content Side
    </Box>
  )
}

export default index