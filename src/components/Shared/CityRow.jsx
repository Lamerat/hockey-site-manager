import React, { useState, useRef } from 'react'
import { Paper, Box, Tooltip, IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import VerifiedIcon from '@mui/icons-material/Verified'
import ShareIcon from '@mui/icons-material/Share'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import { menuPaperStyleSmall } from './RowStyles'


const CityRow = ({row, editFunction, deleteFunction}) => {
  const anchor = useRef(null)
  const [openMenu, setOpenMenu] = useState(false)
  return (
    <Paper elevation={1} sx={{ mb: 0.5, mt: 0.5, ml: 2, pr: 1, mr: 2, boxSizing: 'border-box' }}>
      <Box fontFamily='CorsaGrotesk' display='flex' justifyContent='space-between' alignItems='center' fontSize='14px'>
        <Box p={1.5} pr={0}>{row.name}</Box>
        {
          row.canEdit
            ? <Box display='flex' alignItems='center'>
                { row.shared ? <Tooltip arrow title='Споделен'><ShareIcon sx={{ pr: '5px' }} fontSize='small' color='primary' /></Tooltip> : null }
                <IconButton size='small' ref={anchor} onClick={() => setOpenMenu(!openMenu)}><MoreVertIcon fontSize='small' color='primary' /></IconButton>
              </Box>
            : row.type === 'system'
              ? <Tooltip placement='right' arrow title='Системно добавен'><VerifiedIcon sx={{ pr: '5px' }} fontSize='small' color='primary' /></Tooltip>
              : <Tooltip placement='right' arrow title='Споделен от друг потребител'><PeopleAltIcon sx={{pr: '5px'}} fontSize='small' color='primary' /></Tooltip>
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
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> editFunction(row._id)}>
          <ListItemIcon><EditIcon fontSize='small' color='primary'/></ListItemIcon>Редактирай</MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> deleteFunction(row._id, row.name)}>
          <ListItemIcon><DeleteIcon fontSize='small' color='error'/></ListItemIcon>Изтрий</MenuItem>
      </Menu>
    </Paper>
  )
}

export default CityRow