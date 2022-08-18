import React, { useRef, useState } from 'react'
import { Paper, Box, IconButton, Stack, Menu, MenuItem, ListItemIcon } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import PushPinIcon from '@mui/icons-material/PushPin'
import { menuPaperStyle } from './News.styles'
import { formatDate } from '../../common/help-functions'
import mainTheme from '../../theme/MainTheme'
import RemoveIcon from '@mui/icons-material/Remove'


const NewsRow = ({row}) => {
  const anchor = useRef(null)
  const [openMenu, setOpenMenu] = useState(false)
  
  const pinnedStyle = row.pinned ? { backgroundColor: mainTheme.palette.secondary.superLight } : {}

  return (
    <Paper elevation={1} sx={{p: 1.5, mt: 1, ...pinnedStyle}}>
      <Stack direction='row' alignItems='center' minHeight={28}>
        <Box width='55%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.title}</Box>
        <Box width='10%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.photosCount}</Box>
        <Box width='15%' fontFamily='CorsaGrotesk' fontSize='14px'>{formatDate(row.createdAt)}</Box>
        <Box width='15%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.user.name}</Box>
        <Box width='5%' display='flex' alignItems='center' justifyContent='right'>
          <IconButton size='small' ref={anchor} onClick={() => setOpenMenu(!openMenu)}><MoreVertIcon fontSize='18px' color='secondary' /></IconButton>
        </Box>
      </Stack>
      <Menu
        anchorEl={anchor.current}
        keepMounted={true}
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        onClick={() => setOpenMenu(false)}
        PaperProps={menuPaperStyle}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{fontFamily: 'CorsaGrotesk', fontSize: '14px'}}>
        <ListItemIcon>
          <Box position='relative' width='20px' height='20px'>
            { row.pinned ? <RemoveIcon color='error' sx={{position: 'absolute', bottom: -4, left: -3, transform: 'rotate(45deg)', zIndex: 10, fontSize: '30px' }} /> : null }
            <PushPinIcon fontSize='small' color='primary' sx={{transform: 'rotate(45deg)'}} />
          </Box>
        </ListItemIcon>
          { row.pinned ? 'Откачи' : 'Закачи' }
        </MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> 1}>
          <ListItemIcon>
            <DeleteIcon fontSize='small' color='error'/>
          </ListItemIcon>
            Изтрий
        </MenuItem>
      </Menu>
    </Paper>
  )
}

export default NewsRow