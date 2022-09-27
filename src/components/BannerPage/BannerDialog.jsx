import React, { useState, forwardRef, useEffect, useRef } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import mainTheme from '../../theme/MainTheme'
import Slide from '@mui/material/Slide'
import TextField from '@mui/material/TextField'
import IOSSwitch from '../IOSwitch/IOSwitch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import { listCities } from '../../api/city'
import CircularProgress from '@mui/material/CircularProgress'
import { uploadFiles } from '../../api/files'
import moment from 'moment'
import { DEV_MODE } from '../../config/constants'

const titleStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }
const secondColor = mainTheme.palette.secondary.main

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const BannerDialog = ({data, editMode, actionFunc, closeFunc}) => {
  const firstRenderRef = useRef(true)

  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  
  const [team, setTeam] = useState(editMode ? data : { name: '', city: null, shared: false, logo: null })

  const lastUpdate = moment(data?.updatedAt).format('DD-MM-YYYY г.').toString()

  const changeState = (value, field) => setTeam({ ...team, [field]: value })

  const addOrUpdateTeam = () => {
    if (!team.name.trim()) {
      setErrorDialog({ show: true, message: 'Липсва името на отбора' })
      return
    }

    editMode ? actionFunc(data._id, team) : actionFunc(team)
  }

  


  const fileUploadAction = (file) => {
    if (!file || !file.length) return
    setTeam({ ...team, logo: false })
    const formData = new FormData()
    formData.append('images', file[0])
    uploadFiles(formData)
      .then(x => x.json())
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setTeam({ ...team, logo: result.payload[0].url })
      })
      .catch(error => {
        setTeam({ ...team, logo: null })
        setErrorDialog({ show: true, message: error.message })
      })
  }


  return (
    <Dialog open={true} TransitionComponent={Transition} keepMounted maxWidth='sm' fullWidth PaperProps={{sx: { p: 2}}}>
      <Box sx={titleStyle} borderBottom={1} borderColor={mainTheme.palette.secondary.main}>
        <Typography fontFamily='CorsaGrotesk' color={secondColor} variant='h6' pb={0.5}>{ data ? 'Редакция на банер' : 'Добавяне на банер' }</Typography>
      </Box>
        <Stack direction='row' spacing={4}>
          <Box maxWidth='200px' width='200px' maxHeight='200px' border='1px solid lightgray' display='flex' alignItems='center' justifyContent='center' overflow='hidden'>
            {
              team.logo
                ? <img src={team.logo} height='200' alt='logo' />
                : team.logo === null
                  ? <Box fontFamily='CorsaGrotesk' fontSize='14px' p={3} textAlign='center'>препоръчителен размер на файла 500 х 500 пиксела</Box>
                  : <CircularProgress size='100px'/>
            }
          </Box>
          <Box display='flex' flexDirection='column' justifyContent='space-between' minWidth='300px' minHeight='210px'>
            <TextField
              size='small'
              label='Име на отбора'
              variant='outlined'
              fullWidth
              value={team.name}
              onChange={(e) => changeState(e.target.value, 'name')}
            />                  
            
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button variant='contained' component='label'>
            Избери лого
            <input hidden accept='image/*' type='file' onChange={(e) => fileUploadAction(e.target.files)} />
          </Button>
          <Box ml={6}>
            <Button variant='contained' color='secondary' onClick={() => closeFunc(false)}>Затвори</Button>
            <Button variant='contained' sx={{ml: 1}} onClick={addOrUpdateTeam}>{ editMode ? 'Редактирай' : 'Добави'}</Button>
          </Box>
        </Box>
            
      
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
    </Dialog>
  )
}


export default BannerDialog