import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TTCine from '../../assets/TTCine.svg?react'

import { default as AppsIcon, default as SvgIcon } from '@mui/icons-material/Apps'
import Button from '@mui/material/Button'

function AppBar() {
  return (
    <Box sx={{
        px: 2,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflow: 'auto',
        height: (theme) => theme.cine.appBarHeight,
        borderBottom: '1px solid'
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap:2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap:0.5 }} >
            <SvgIcon component={TTCine} fontSize='small' inheritViewBox sx={{ color:'white' }}/>
            <Typography variant='span' sx={{ color:'text.primary', fontSize:'1.2rem', fontWeight:'bold' }}> TTCINE</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap:0.5 }} >
            <Button sx={{color: 'text.primary'}} > PHIM</Button>
          </Box>
          </Box>
    </Box>
  )
}

export default AppBar