import React, { useRef, useState } from 'react'
import { Paper, Box, Typography, IconButton, Grid, ListItemIcon, CardMedia, Menu, MenuItem } from '@mui/material'
import mainTheme from '../../theme/MainTheme'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { menuPaperStyleSmall } from './Media.styles'
import DeleteIcon from '@mui/icons-material/Delete'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import ShareIcon from '@mui/icons-material/Share'
import EditIcon from '@mui/icons-material/Edit'



const PhotoComponent = ({row, imageSize}) => {
  const anchor = useRef(null)
  const [openMenu, setOpenMenu] = useState(false)
  return (
    <Grid item xs={imageSize.gridSpacing}>
      <Paper elevation={2} sx={{p: 1, backgroundColor: mainTheme.palette.primary.superLight}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' mb={1}>
          <Typography fontFamily='CorsaGrotesk' variant='caption'>{row.caption}</Typography>
          <Box display='flex' alignItems='center' mr={-0.5} >
            <IconButton size='small' onClick={() => setOpenMenu(!openMenu)} ref={anchor}>
              <MoreVertIcon fontSize='small' />
            </IconButton>
          </Box>
        </Box>
        <CardMedia component='img' height={imageSize.height} image={row.address} sx={{borderRadius: 1}} />
      </Paper>
      <Menu
        anchorEl={anchor.current}
        onClose={() => setOpenMenu(false)}
        onClick={() => setOpenMenu(false)}
        keepMounted={true}
        open={openMenu}
        PaperProps={menuPaperStyleSmall}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> 1} >
          <ListItemIcon sx={{minWidth: '30px !important'}}><EditIcon fontSize='small' color='primary'/></ListItemIcon>Промени име</MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> 1} >
          <ListItemIcon sx={{minWidth: '30px !important'}}><DriveFileMoveIcon fontSize='small' color='primary'/></ListItemIcon>Премести</MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> 1}>
          <ListItemIcon sx={{minWidth: '30px !important'}}><ShareIcon fontSize='small' color='primary'/></ListItemIcon>Сподели</MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> 1}>
          <ListItemIcon sx={{minWidth: '30px !important'}}><DeleteIcon fontSize='small' color='error'/></ListItemIcon>Изтрий</MenuItem>
      </Menu>
    </Grid>
  )
}


export default PhotoComponent