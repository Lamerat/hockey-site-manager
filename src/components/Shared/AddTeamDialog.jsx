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

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const AddTeamDialog = ({data, editMode, actionFunc, closeFunc}) => {
  const firstRenderRef = useRef(true)

  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [cities, setCities] = useState(null)
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

  useEffect(() => {
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    listCities({ noPagination: true })
      .then(x => x.json())
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setCities(result.payload.docs)
        editMode
          ? setTeam( team => ({ ...team, city: data.city._id }))
          : setTeam( team => ({ ...team, city: result.payload.docs[0]._id }))
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [data, editMode])


  const fileUploadAction = (file) => {
    if (!file || !file.length) return
    setTeam({ ...team, logo: false })
    const formData = new FormData()
    formData.append('images', file[0])
    uploadFiles(formData)
      .then(x => x.json())
      .then(result => setTeam({ ...team, logo: result.payload[0].url }))
      .catch(error => {
        setTeam({ ...team, logo: null })
        setErrorDialog({ show: true, message: error.message })
      })
  }


  return (
    <Dialog open={true} TransitionComponent={Transition} keepMounted>
      <Box sx={{ p: 3, pb: 0, mb: 0.5 }}>
        <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.primary.main} variant='h6' pb={0.5}>
          { editMode ? 'Редактиране на отбор' : 'Добавяне на нов отбор' }
        </Typography>
      </Box>
      {
        cities
          ? <>
              {
                editMode
                  ? <>
                      <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.primary.main} variant='body2' pl={3} pb={1}><b>Създал:</b> {data?.createdBy.name}</Typography>
                      <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.primary.main} variant='body2' pl={3} pb={3}><b>Последна редакция:</b> {lastUpdate}</Typography>
                    </>
                  : null
              }
              <Stack direction='row' sx={{pl: 3, pr: 3, mt: 1}} spacing={4}>
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
                    label='Име на отбора'
                    variant='outlined'
                    fullWidth
                    value={team.name}
                    onChange={(e) => changeState(e.target.value, 'name')}
                  />                  
                  <FormControl fullWidth sx={{mt: 2}}>
                    <InputLabel>Град</InputLabel>
                    <Select value={team.city} label='Град' onChange={(e) => changeState(e.target.value, 'city')}>
                      { cities.map(x => <MenuItem key={x._id} value={x._id}>{x.name}</MenuItem> ) }
                    </Select>
                  </FormControl>
                  <FormControlLabel
                    control={<IOSSwitch sx={{ m: 1 }} checked={team.shared} onChange={() => setTeam({ ...team, shared: !team.shared })} />}
                    label='Споделен'
                  />
                </Box>
              </Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
              <Button variant='contained' component='label'>
                Избери лого
                <input hidden accept='image/*' type='file' onChange={(e) => fileUploadAction(e.target.files)} />
              </Button>
                  <Box ml={6}>
                    <Button variant='contained' color='secondary' onClick={() => closeFunc(false)}>Затвори</Button>
                    <Button variant='contained' sx={{ml: 1}} onClick={addOrUpdateTeam}>{ editMode ? 'Редактирай' : 'Добави'}</Button>
                  </Box>
                </Box>
            </>
          : <Box height={306} width={582} display='flex' alignItems='center' justifyContent='center'><CircularProgress size='100px'/></Box>
      }
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
    </Dialog>
  )
}


export default AddTeamDialog