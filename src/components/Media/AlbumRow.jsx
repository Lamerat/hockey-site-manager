import React, { useRef, useState } from 'react'
import { Box, Typography, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import LockIcon from '@mui/icons-material/Lock'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import HomeIcon from '@mui/icons-material/Home';
import { menuPaperStyleSmall } from './Media.styles'
import mainTheme from '../../theme/MainTheme'

const AlbumRow = ({row, currentFolder, setCurrentFolder, setMainFunc, editFunc, deleteFunc}) => {
  const anchor = useRef(null)
  const [openMenu, setOpenMenu] = useState(false)
  const [selected, setSelected] = useState(false)
  return (
    <Box
      display='flex'
      minHeight={40}
      justifyContent='space-between'
      sx={{cursor: 'pointer', ml: 0, pl: 2, mr: 0, pr: 2, backgroundColor: selected ? mainTheme.palette.secondary.superLight : 'white'}}
      onMouseEnter={() => setSelected(true)}
      onMouseLeave={() => setSelected(false)}
    >
      <Box display='flex' alignItems='center' width='100%' onClick={() => setCurrentFolder({ id: row._id, name: row.name })}>
        <Box display='flex' alignItems='center' position='relative'>
          {
            currentFolder.id === row._id
              ? <FolderOpenIcon color='secondary' sx={{position: 'relative'}} />
              : <FolderIcon color='secondary' sx={{position: 'relative'}} />
          }
          { row.locked ? <LockIcon color='primary' fontSize='10px' sx={{ position: 'absolute', top: -3, left: 12 }} /> : null }
          { row.main ? <HomeIcon color='primary' fontSize='10px' sx={{ position: 'absolute', top: -3, left: 12 }} /> : null }
        </Box>
        <Typography variant='body2' fontFamily='CorsaGrotesk' ml={1}>{ row.name.length > 22 ? `${row.name.slice(0, 22)}...` : row.name }</Typography>
      </Box>
      <Box display='flex' alignItems='center'>
        <IconButton size='small' ref={anchor} onClick={() => setOpenMenu(!openMenu)} disabled={row.locked}><MoreVertIcon fontSize='small' /></IconButton>
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
        {
          !row.main
            ? <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={() => setMainFunc(row._id)} >
                <ListItemIcon sx={{minWidth: '30px !important'}}><HomeIcon fontSize='small' color='primary'/></ListItemIcon>
                  Задай като главен
              </MenuItem>
            : null
        }
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={() => editFunc(row._id, row.name)} >
          <ListItemIcon sx={{minWidth: '30px !important'}}><EditIcon fontSize='small' color='primary'/></ListItemIcon>
          Промени име
        </MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={() => deleteFunc(row._id, row.name)}>
          <ListItemIcon sx={{minWidth: '30px !important'}}><DeleteIcon fontSize='small' color='error'/></ListItemIcon>Изтрий</MenuItem>
      </Menu>
    </Box>
  )
}

export default AlbumRow