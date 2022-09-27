import React, { useRef, useState } from 'react'
import { Paper, Box, IconButton, Stack, Menu, MenuItem, ListItemIcon, CardMedia } from '@mui/material'
import { formatDate } from '../../common/help-functions'
import { bannerImageStyle, menuPaperStyleSmall } from './BannerPage.styles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'



const BannerRow = ({ row, deleteFunction, editFunc }) => {
  const anchor = useRef(null)
  const [openMenu, setOpenMenu] = useState(false)

  return (
    <Paper elevation={1} sx={{p: 1, mt: 1, fontSize: '14px', fontFamily: 'CorsaGrotesk' }}>
      <Stack direction='row' alignItems='center' minHeight={28}>
        <Box width='14%'>
          <CardMedia component='img' sx={bannerImageStyle} image={row.photo} />
        </Box>
        <Box width='9%'>{row.position}</Box>
        <Box width='24%'>{ row.text.length > 30 ? `${row.text.slice(0, 30)} ...` : row.text }</Box>
        <Box width='24%'>{ row.link.length > 30 ? `${row.link.slice(0, 30)} ...` : row.link }</Box>
        <Box width='10%'>{formatDate(row.createdAt)}</Box>
        <Box width='15%'>{row.createdBy.name}</Box>
        <Box width='4%' display='flex' alignItems='center' justifyContent='right'>
          <IconButton size='small' ref={anchor} onClick={() => setOpenMenu(!openMenu)}><MoreVertIcon fontSize='18px' color='secondary' /></IconButton>
        </Box>
      </Stack>
      <Menu
        anchorEl={anchor.current}
        keepMounted={true}
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        onClick={() => setOpenMenu(false)}
        PaperProps={menuPaperStyleSmall}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> editFunc(row)}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}>
            <EditIcon fontSize='small' color='primary'/>
          </ListItemIcon>
            Редактирай
        </MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> deleteFunction(row._id, row.text)}>
          <ListItemIcon sx={{ ml: -0.5, minWidth: '30px !important' }}>
            <DeleteIcon fontSize='small' color='error'/>
          </ListItemIcon>
            Изтрий
        </MenuItem>
      </Menu>
    </Paper>
  )
}

export default BannerRow