import React, { useRef, useState } from 'react'
import { Paper, Box, IconButton, Stack, Menu, MenuItem, ListItemIcon, Tooltip } from '@mui/material'
import { formatDate } from '../../common/help-functions'
import { menuPaperStyleSmall } from './Information.styles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LockIcon from '@mui/icons-material/Lock'


const InformationRow = ({row, deleteFunction, editFunc, previewFunc }) => {
  const anchor = useRef(null)
  const [openMenu, setOpenMenu] = useState(false) 

  const openPreview = () => previewFunc(row._id)

  return (
    <Paper elevation={1} sx={{p: 1.5, mt: 1, fontSize: '14px', fontFamily: 'CorsaGrotesk' }}>
      <Stack direction='row' alignItems='center' minHeight={28}>
        <Box width='9%' sx={{cursor: 'pointer'}} onClick={openPreview}>{row.position}</Box>
        <Box width='17%' sx={{cursor: 'pointer'}} onClick={openPreview}>{ row.shortTitle.length > 18 ? `${row.shortTitle.slice(0, 18)} ...` : row.shortTitle }</Box>
        <Box width='42%' sx={{cursor: 'pointer'}} onClick={openPreview}>{ row.longTitle.length > 55 ? `${row.longTitle.slice(0, 55)} ...` : row.longTitle }</Box>
        <Box width='10%' sx={{cursor: 'pointer'}} onClick={openPreview}>{formatDate(row.createdAt)}</Box>
        <Box width='15%' sx={{cursor: 'pointer'}} onClick={openPreview}>{row.createdBy.name}</Box>
        <Box width='10%' display='flex' alignItems='center' justifyContent='right'>
          { row.locked ? <Tooltip title='заключена' arrow><LockIcon fontSize='18px' color='secondary' sx={{mr: 0.5}} /></Tooltip> : null }
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
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> editFunc(row._id)}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}>
            <EditIcon fontSize='small' color='primary'/>
          </ListItemIcon>
            Редактирай
        </MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> deleteFunction(row._id, row.shortTitle)} disabled={row.locked}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}>
            <DeleteIcon fontSize='small' color='error'/>
          </ListItemIcon>
            Изтрий
        </MenuItem>
      </Menu>
    </Paper>
  )
}

export default InformationRow