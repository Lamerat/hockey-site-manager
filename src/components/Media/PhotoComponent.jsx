import React, { useRef, useState, useEffect } from 'react'
import { Paper, Box, Typography, IconButton, Grid, ListItemIcon, CardMedia, Menu, MenuItem, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import mainTheme from '../../theme/MainTheme'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { menuPaperStyleSmall } from './Media.styles'
import DeleteIcon from '@mui/icons-material/Delete'
import ShareIcon from '@mui/icons-material/Share'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { changeNameRequest } from '../../api/photo'
import { cleanCredentials } from '../../config/storage'


const TextFieldInput = { disableUnderline: true, sx: { fontSize: '12px', letterSpacing: '0.03333em', fontFamily: 'CorsaGrotesk' }}

const PhotoComponent = ({ row, imageSize, setStartPosition, changePositionFunc, deleteFunc, setErrorDialog, globalEdit, setGlobalEdit }) => {
  const menuAnchor = useRef(null)
  const textRef = useRef(null)
  const oldName = useRef(null)

  const [openMenu, setOpenMenu] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(row.name || `Снимка ${row.position}`)

  const opacity = globalEdit && !editMode ? 0.2 : 1
  const history = useNavigate()

  useEffect(() => {
    if (editMode && textRef.current) textRef.current.focus()
  }, [editMode, textRef])
  

  const enterEditMode = () => {
    oldName.current = name
    setGlobalEdit(true)
    setEditMode(true)
  }


  const cancelEdit = () => {
    setName(oldName.current)
    setGlobalEdit(false)
    setEditMode(false)
  }

  const authError = () => {
    cleanCredentials()
    history('/')
  }


  const updateName = () => {
    if (!name.trim().length) {
      setErrorDialog({ show: true, message: `Името не може да е празно поле!` })
      return
    }

    changeNameRequest({ _id: row._id, name })
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setGlobalEdit(false)
        setEditMode(false)
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }

  return (
    <Grid item xs={imageSize.gridSpacing}>
      <Paper name={row.position} elevation={2} sx={{p: 1, backgroundColor: mainTheme.palette.primary.superLight}}
        draggable={ globalEdit ? false : true }
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
                  onKeyDown={(key) => key.key === 'Enter' ? updateName() : null}
                />
                <IconButton size='small' sx={{mr: -1.5}} onClick={updateName}><CheckIcon color='secondary'/></IconButton>
                <IconButton size='small' sx={{mr: -0.5}} onClick={cancelEdit}><CloseIcon color='error'/></IconButton>
              </Box>
            : <Box display='flex' alignItems='center' justifyContent='space-between' mb={1} maxHeight={30}>
                <Typography fontFamily='CorsaGrotesk' variant='caption' sx={{opacity}}>
                  {name.length > imageSize.maxSymbols ? `${name.slice(0, imageSize.maxSymbols)} ...` : name}
                </Typography>
                <IconButton sx={{mr: -0.5, opacity}} size='small' onClick={() => setOpenMenu(!openMenu)} ref={menuAnchor} disabled={globalEdit} >
                  <MoreVertIcon fontSize='small' />
                </IconButton>
              </Box>
        }
        <CardMedia component='img' height={imageSize.height} image={row.address} sx={{borderRadius: 1, opacity: globalEdit && !editMode ? 0.1 : 1}} draggable={false} />
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
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}><EditIcon fontSize='small' color='primary'/></ListItemIcon>
          Промени име
        </MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={() => 1}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}><ShareIcon fontSize='small' color='primary'/></ListItemIcon>
          Сподели
        </MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={() => deleteFunc(row._id, name)}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}><DeleteIcon fontSize='small' color='error'/></ListItemIcon>
          Изтрий
        </MenuItem>
      </Menu>
    </Grid>
  )
}


export default PhotoComponent