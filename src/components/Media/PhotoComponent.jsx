import React, { useRef, useState, useEffect } from 'react'
import { Paper, Box, Typography, IconButton, Grid, ListItemIcon, CardMedia, Menu, MenuItem, TextField } from '@mui/material'
import mainTheme from '../../theme/MainTheme'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { menuPaperStyleSmall } from './Media.styles'
import DeleteIcon from '@mui/icons-material/Delete'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import ShareIcon from '@mui/icons-material/Share'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

const TextFieldInput = { disableUnderline: true, sx: { fontSize: '12px', letterSpacing: '0.03333em', fontFamily: 'CorsaGrotesk' }}

const PhotoComponent = ({ row, imageSize, setStartPosition, changePositionFunc, editFunction }) => {
  const menuAnchor = useRef(null)
  const textRef = useRef(null)
  const oldName = useRef(null)

  const [openMenu, setOpenMenu] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(row.name || `Снимка ${row.position}`)

  useEffect(() => {
    if (editMode && textRef.current) textRef.current.focus()
  }, [editMode, textRef])
  
  const enterEditMode = () => {
    oldName.current = name
    setEditMode(true)
  }

  const cancelEdit = () => {
    setName(oldName.current)
    setEditMode(false)
  }

  const updateName = () => {
    setEditMode(false)
    editFunction(row._id, name)
  }

  return (
    <Grid item xs={imageSize.gridSpacing}>
      <Paper name={row.position} elevation={2} sx={{p: 1, backgroundColor: mainTheme.palette.primary.superLight}}
        draggable={ editMode ? false : true }
        onDragStart={() => setStartPosition(row.position)}
        onDrop={() => changePositionFunc(row.position)}
        onDragOver={(e) => e.preventDefault()}
      >
        {
          editMode
            ? <Box display='flex' alignItems='center' justifyContent='space-between' mb={1} maxHeight={30}>
                <TextField
                  value={name}
                  variant='standard'
                  InputProps={TextFieldInput}
                  inputRef={textRef}
                  sx={{ width: 'calc(100% - 64px)' }}
                  onChange={(e) => setName(e.target.value) }
                />
                <IconButton size='small' sx={{mr: -1.5}} onClick={updateName}><CheckIcon color='secondary'/></IconButton>
                <IconButton size='small' sx={{mr: -0.5}} onClick={cancelEdit}><CloseIcon color='error'/></IconButton>
              </Box>
            : <Box display='flex' alignItems='center' justifyContent='space-between' mb={1} maxHeight={30}>
                <Typography fontFamily='CorsaGrotesk' variant='caption'>
                  {
                    row.name
                      ? row.name.length > imageSize.maxSymbols ? `${row.name.slice(0, imageSize.maxSymbols)} ...` : row.name
                      : `Снимка ${row.position}`
                  }
                  
                </Typography>
                <IconButton sx={{mr: -0.5}} size='small' onClick={() => setOpenMenu(!openMenu)} ref={menuAnchor} >
                  <MoreVertIcon fontSize='small' />
                </IconButton>
              </Box>
        }
        <CardMedia component='img' height={imageSize.height} image={row.address} sx={{borderRadius: 1}} draggable={false} />
      </Paper>
      <Menu
        anchorEl={menuAnchor.current}
        onClose={() => setOpenMenu(false)}
        onClick={() => setOpenMenu(false)}
        keepMounted={true}
        open={openMenu}
        PaperProps={menuPaperStyleSmall}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={enterEditMode} >
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