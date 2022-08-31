import React, { useState, forwardRef, useRef } from 'react'
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid, IconButton, InputAdornment, CardMedia, Menu, ListItemIcon, Tooltip } from '@mui/material'
import { menuPaperStyle } from './Players.styles'
import { uploadFiles } from '../../api/files'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import mainTheme from '../../theme/MainTheme'
import Slide from '@mui/material/Slide'
import TextField from '@mui/material/TextField'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import DatePicker from 'react-datepicker'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MenuIcon from '@mui/icons-material/Menu'
import CircularProgress from '@mui/material/CircularProgress'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import EditOffIcon from '@mui/icons-material/EditOff'
import 'react-datepicker/dist/react-datepicker.css'


const titleStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }
const secondColor = mainTheme.palette.secondary.main

const playerDefault = { 
  firstName: { value: '', error: false},
  lastName: { value: '', error: false},
  number: { value: 1, error: false},
  position: { value: 'goalie', error: false},
  hand: { value: 'right', error: false},
  birthDate: { value: new Date('1980-01-01'), error: false },
  height: { value: 176, error: false},
  weight: { value: 75, error: false},
  photo: { value: 'https://iili.io/4zmQHX.jpg', error: false },
  description: { value: '', error: false},
}

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})


const PlayerDialog = ({ data, addFunction, closeFunc, editFunction, deleteFunc }) => {
  const menuAnchor = useRef(null)

  const [player, setPlayer] = useState(data ? data : playerDefault)
  const [openMenu, setOpenMenu] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })


  const changeData = (field, value) => {
    if (field === 'number' && (Number(value) < 1 || Number(value) > 99) ) {
      setErrorDialog({show: true, message: 'Стойността трябва да бъде в интервала 1 - 99'})
      return
    }

    if ((field === 'height' || field === 'weight') && (isNaN(value) || value.length > 3)) return

    if ((field === 'height' || field === 'weight') && (Number(value) < 0 || Number(value) > 999) ) {
      setErrorDialog({show: true, message: 'Стойността трябва да бъде в интервала 1 - 999'})
      setPlayer({ ...player, [field]: { ...player[field], error: true } })
      return
    }

    setPlayer({ ...player, [field]: { value: typeof value === 'string' && field !== 'description' ? value.trim() : value, error: false } })
  }


  const validateFields = () => {
    const errorMessages = []
    const tempPlayer = { ...player }

    if (!player.firstName.value.trim()) {
      tempPlayer.firstName = { value: player.firstName.value, error: true }
      errorMessages.push('името на играча')
    }

    if (!player.lastName.value.trim()) {
      tempPlayer.lastName = { value: player.lastName.value, error: true }
      errorMessages.push('фамилията на играча')
    }

    if (!player.height.value) {
      tempPlayer.height = { value: player.height.value, error: true }
      errorMessages.push('ръстът на играча')
    }

    if (!player.weight.value) {
      tempPlayer.weight = { value: player.weight.value, error: true }
      errorMessages.push('теглото на играча')
    }

    if (errorMessages.length) {
      setPlayer(tempPlayer)
      setErrorDialog({ show: true, message: `Не са попълнени следните полета: ${errorMessages.join(', ')}` })
      return
    }
    
    const body = {}
    Object.keys(player).forEach(x => body[x] = player[x].value)

    if (!editMode) {
      addFunction(body)
    } else {
      editFunction(body)
    }
  }


  const closeDialog = () => {
    let haveChanges = false

    if (!data) {
      Object.keys(player).forEach(x => player[x].value.toString() !== playerDefault[x].value.toString() ? haveChanges = true : null)
    } else if (editMode) {
      Object.keys(player).forEach(x => player[x].value.toString() !== data[x].value.toString() ? haveChanges = true : null)
    }

    if (haveChanges) {
      setConfirmDialog({
        show: true,
        message: `Сигурни ли сте, че искате да прекратите процеса?<br/>Всички данни ще бъдат загубени!`,
        acceptFunc: () => closeFunc({ show: false, data: null })
      })
    } else {
      closeFunc({ show: false, data: null })
    }
  }


  const fileUploadAction = (file) => {
    if (!file || !file.length) return
    const lastPhoto = player.photo.value
    setPlayer({ ...player, photo: { value: null, error: false } })
    const formData = new FormData()
    formData.append('images', file[0])
    uploadFiles(formData)
      .then(x => x.json())
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setPlayer({ ...player, photo: { value: result.payload[0].url, error: false } })
      })
      .catch(error => {
        setPlayer({ ...player, photo: { value: lastPhoto, error: false } })
        setErrorDialog({ show: true, message: error.message })
      })
  }


  const cancelEdit = () => {
    let haveChanges = false
    Object.keys(player).forEach(x => player[x].value.toString() !== data[x].value.toString() ? haveChanges = true : null)


    if (haveChanges) {
      setConfirmDialog({
        show: true,
        message: `Сигурни ли сте, че искате да прекратите процеса?<br/>Всички данни ще бъдат загубени!`,
        acceptFunc: () => {
          setConfirmDialog({ show: false, message: '' })
          setPlayer(data)
          setEditMode(false)
        }
      })
    } else {
      setPlayer(data)
      setEditMode(false)
    }
  }


  return (
    <Dialog open={true} TransitionComponent={Transition} keepMounted maxWidth='md' fullWidth PaperProps={{sx: { p: 2}}}>
      <Box sx={titleStyle} borderBottom={1} borderColor={mainTheme.palette.secondary.main}>
        <Typography fontFamily='CorsaGrotesk' color={secondColor} variant='h6' pb={0.5}>{ data ? editMode ? 'Редакция на профил' : 'Профил на играч' : 'Добавяне на нов играч' }</Typography>
        <Box display='flex' alignItems='center' mr={-1}>
          {
            data && !editMode
              ? <IconButton ref={menuAnchor} onClick={() => setOpenMenu(!openMenu)}><MenuIcon color='secondary' /></IconButton>
              : editMode
                ? <Tooltip title='Откажи редактирането' arrow>
                    <IconButton onClick={cancelEdit}><EditOffIcon color='secondary' /></IconButton>
                  </Tooltip>
                : null
          }
        </Box>
      </Box>
      <Grid container spacing={2.5}>
        <Grid item xs={5.2}>
          {
            player.photo.value
              ? <CardMedia component='img' sx={{maxHeight: 372, borderRadius: '4px'}} image={player.photo.value} />
              : <Box sx={{ ...titleStyle, mb: 0, border: '1px solid black', justifyContent: 'center', ml: '1px', mr: '1px', height: 370}}><CircularProgress size='200px'/></Box>
          }
          
        </Grid>
        <Grid item xs={6.8}>
          <Grid container spacing={2.5} p={0}>
            <Grid item xs={6}>
              <TextField
                label='Име'
                disabled={data && !editMode}
                variant='outlined'
                size='small'
                fullWidth
                required
                error={player.firstName.error}
                value={player.firstName.value}
                onChange={(e) => changeData('firstName', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label='Фамилия'
                disabled={data && !editMode}
                variant='outlined'
                size='small'
                fullWidth
                required
                error={player.lastName.error}
                value={player.lastName.value}
                onChange={(e) => changeData('lastName', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoComplete='off'
                label='Номер'
                disabled={data && !editMode}
                type='number'
                size='small'
                fullWidth
                required
                error={player.number.error}
                value={player.number.value}
                onChange={(e) => changeData('number', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size='small'>
                <InputLabel required>Пост</InputLabel>
                <Select
                  label='Пост'
                  disabled={data && !editMode}
                  required
                  value={player.position.value}
                  onChange={(e) => changeData('position', e.target.value)}
                >
                  <MenuItem value={'goalie'}>Вратар</MenuItem>
                  <MenuItem value={'guard'}>Защитник</MenuItem>
                  <MenuItem value={'attacker'}>Нападател</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                selected={player.birthDate.value}
                onChange={(date) => changeData('birthDate', date)}
                disabled={data && !editMode}
                popperPlacement='auto-end'
                maxDate={new Date()}
                dateFormat='dd-MM-yyyy'
                customInput={
                  <TextField
                    size='small'
                    disabled={data && !editMode}
                    fullWidth
                    required
                    label='Рождена дата'
                    variant='outlined'
                    InputLabelProps={{ required: true }}
                    InputProps={{
                      required: true,
                      autoComplete: 'off',
                      endAdornment: (<InputAdornment position='start'><CalendarMonthIcon sx={{mr: -2, opacity: data && !editMode ? 0.2 : 1 }} color='primary' /></InputAdornment>)
                    }}
                  />
                }
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size='small'>
                <InputLabel required>Водеща ръка</InputLabel>
                <Select
                  label='Водеща ръка'
                  disabled={data && !editMode}
                  required
                  value={player.hand.value}
                  onChange={(e) => changeData('hand', e.target.value)}
                >
                  <MenuItem value={'left'}>Лява</MenuItem>
                  <MenuItem value={'right'}>Дясна</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label='Ръст'
                disabled={data && !editMode}
                variant='outlined'
                size='small'
                autoComplete='off'
                fullWidth
                required
                InputProps={{ endAdornment: <InputAdornment position='end'>см</InputAdornment> }}
                error={player.height.error}
                value={player.height.value}
                onChange={(e) => changeData('height', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label='Тегло'
                disabled={data && !editMode}
                autoComplete='off'
                variant='outlined'
                size='small'
                fullWidth
                required
                InputProps={{ endAdornment: <InputAdornment position='end'>кг</InputAdornment> }}
                error={player.weight.error}
                value={player.weight.value}
                onChange={(e) => changeData('weight', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Кратко описание'
                disabled={data && !editMode}
                variant='outlined'
                size='small'
                fullWidth
                multiline
                rows={5}
                error={player.description.error}
                value={player.description.value}
                onChange={(e) => changeData('description', e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{...titleStyle, mb: 0, mt: 2.5, justifyContent: data && !editMode ? 'right' : 'space-between'}}>
        {
          data && !editMode
            ? null
            : <Button variant='contained' component='label'>
                Избери снимка
                <input hidden accept='image/*' type='file' onClick={(e) => e.target.value = ''} onChange={(e) => fileUploadAction(e.target.files)} />
              </Button>
        }
        <Box ml={6}>
          <Button variant='contained' color='secondary' onClick={closeDialog}>Затвори</Button>
          { data && !editMode ? null : <Button variant='contained' sx={{ml: 1}} onClick={validateFields}>{ editMode ? 'Редактирай' : 'Добави'}</Button> }
        </Box>
      </Box>
      <Menu
        anchorEl={menuAnchor.current}
        keepMounted={true}
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        onClick={() => setOpenMenu(false)}
        PaperProps={menuPaperStyle}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{fontFamily: 'CorsaGrotesk', fontSize: '14px'}} onClick={() => setEditMode(true)}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}>
            <EditIcon fontSize='small' color='primary' />
          </ListItemIcon>
          Редактирай
        </MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={() => deleteFunc(data._id.value, `${data.firstName.value} ${data.lastName.value}`)}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}>
            <DeleteIcon fontSize='small' color='error'/>
          </ListItemIcon>
          Изтрий
        </MenuItem>
      </Menu>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
    </Dialog>
  )
}


export default PlayerDialog