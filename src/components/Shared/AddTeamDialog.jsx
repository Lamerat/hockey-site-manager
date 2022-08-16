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

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const AddTeamDialog = ({data, editMode, actionFunc, closeFunc}) => {
  const firstRenderRef = useRef(true)

  const [file, setFile] = useState(undefined)

  const [errorDialog, setErrorDialog] = useState(editMode ? data : { show: false, message: '' })
  const [cities, setCities] = useState(null)
  const [team, setTeam] = useState({ name: '', city: null, shared: false })

  const changeState = (value, field) => setTeam({ ...team, [field]: value })

  const addNewTeam = () => {
    if (!team.name.trim()) {
      setErrorDialog({ show: true, message: 'Липсва името на отбора' })
      return
    }
    // actionFunc(team)
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
          ? setTeam( team => ({ ...team, city: data.city }))
          : setTeam( team => ({ ...team, city: result.payload.docs[0]._id }))
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [data, editMode])


  const uploadFile = (fileName) => {
    const formData = new FormData()

    formData.append('key', '6d207e02198a847aa98d0a2a901485a5')
    formData.append('format', 'json')
    formData.append('source', fileName[0])
    

    fetch(`https://freeimage.host/api/1/upload`,{
      method: 'POST',
      headers: { "Access-Control-Allow-Origin": "*", 'Content-Type': 'application/json' },
      body: formData,
    })
      .then(x => x.json())
      .then(result => console.log(result))
      .catch(e => console.log(e.message))

    

  }


  return (
    <Dialog open={true} TransitionComponent={Transition} keepMounted>
      <Box sx={{ p: 3, pb: 0, mb: 0.5 }}>
        <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.primary.main} variant='h6' pb={0.5}>Добавяне на нов отбор</Typography>
      </Box>
      {
        cities
          ? <>
              <Stack direction='row' sx={{pl: 3, pr: 3, mt: 1}} spacing={4}>
                <Box minWidth='200px' maxHeight='200px' border='1px solid black'>
                  logo
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
                <input hidden accept='image/*' type='file' value={file} onChange={(e) => uploadFile(e.target.files)} />
              </Button>
                  <Box ml={6}>
                    <Button variant='contained' color='secondary' onClick={() => closeFunc(false)}>Затвори</Button>
                    <Button variant='contained' sx={{ml: 1}} onClick={addNewTeam}>Добави</Button>
                  </Box>
                </Box>
            </>
          : <Box minHeight={218} width={440} display='flex' alignItems='center' justifyContent='center'><CircularProgress size='100px'/></Box>
      }
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
    </Dialog>
  )
}


export default AddTeamDialog