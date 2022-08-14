import React, { useState, useRef } from 'react'
import { Paper, Box, Tooltip, IconButton, Stack, Menu, MenuItem, ListItemIcon } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import VerifiedIcon from '@mui/icons-material/Verified'
import ShareIcon from '@mui/icons-material/Share'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { menuPaperStyleSmall } from './RowStyles'


const TeamRow = ({row}) => {
  const anchor = useRef(null)
  const [openMenu, setOpenMenu] = useState(false)
  return (
    <Paper elevation={1} sx={{ mb: 0.5, mt: 0.5, ml: 2, pr: 1, mr: 2, boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ pr: 2, position: 'absolute', width: '100%', height: '100%', background: `url(${row.logo})`, backgroundRepeat: 'no-repeat', backgroundSize: '200px', opacity: '10%', backgroundPosition: 'right' }}/>
      <Box fontFamily='CorsaGrotesk' display='flex' justifyContent='space-between' alignItems='center' fontSize='14px' p={1.5} pr={0}>
        <Stack direction='row' alignItems='center' minHeight={20} width='100%' sx={{zIndex: 100}} >
          <Box width='65%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.name}</Box>
          <Box width='35%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.city.name}</Box>
        </Stack>
        {
          row.canEdit
            ? <IconButton size='small' ref={anchor} onClick={() => setOpenMenu(!openMenu)}><MoreVertIcon fontSize='small' color='primary' /></IconButton>
            : row.type === 'system'
              ? <Tooltip placement='right' arrow title='Системно добавен'><VerifiedIcon sx={{ pr: '5px', zIndex: 100 }} fontSize='small' color='primary' /></Tooltip>
              : <Tooltip placement='right' arrow title='Споделен от друг потребител'><ShareIcon sx={{pr: '5px', zIndex: 100}} fontSize='small' color='primary' /></Tooltip>
        }
      </Box>
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
          <ListItemIcon><EditIcon fontSize='small' color='primary'/></ListItemIcon>Редактирай</MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> 1}>
          <ListItemIcon><DeleteIcon fontSize='small' color='error'/></ListItemIcon>Изтрий</MenuItem>
      </Menu>
    </Paper>
  )
}

export default TeamRow