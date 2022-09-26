import React, { useState, forwardRef, useEffect, useRef } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import mainTheme from '../../theme/MainTheme'
import Slide from '@mui/material/Slide'
import TextField from '@mui/material/TextField'
import IOSSwitch from '../IOSwitch/IOSwitch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import { listCities } from '../../api/city'
import CircularProgress from '@mui/material/CircularProgress'
import { DEV_MODE } from '../../config/constants'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const AddArenaDialog = ({actionFunc, closeFunc}) => {
  const firstRenderRef = useRef(true)

  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [cities, setCities] = useState(null)
  const [arena, setArena] = useState({ name: '', city: null, shared: false })

  const changeState = (value, field) => setArena({ ...arena, [field]: value })

  const addNewArena = () => {
    if (!arena.name.trim()) {
      setErrorDialog({ show: true, message: 'Липсва името на пързалката' })
      return
    }
    actionFunc(arena)
  }

  useEffect(() => {
    if (firstRenderRef.current && DEV_MODE) {
      firstRenderRef.current = false
      return
    }

    listCities({ noPagination: true })
      .then(x => x.json())
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setCities(result.payload.docs)
        setArena( arena => ({ ...arena, city: result.payload.docs[0]._id }))
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [])  


  return (
    <Dialog open={true} TransitionComponent={Transition} keepMounted>
      <Box sx={{ p: 3, pb: 0, mb: 0.5 }}>
        <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.primary.main} variant='h6' pb={0.5}>Добавяне на нова пързалка</Typography>
      </Box>
      {
        cities
          ? <>
              <Box sx={{pl: 3, pr: 3}}>
                <TextField
                  label='Име на пързалката'
                  variant='outlined'
                  fullWidth
                  value={arena.name}
                  onChange={(e) => changeState(e.target.value, 'name')}
                  sx={{mt: 1}}
                />
                <FormControl fullWidth sx={{mt: 2}}>
                  <InputLabel>Град</InputLabel>
                  <Select value={arena.city} label='Град' onChange={(e) => changeState(e.target.value, 'city')}>
                    { cities.map(x => <MenuItem key={x._id} value={x._id}>{x.name}</MenuItem> ) }
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pt: 2 }}>
                <FormControlLabel
                  control={<IOSSwitch sx={{ m: 1 }} checked={arena.shared} onChange={() => setArena({ ...arena, shared: !arena.shared })} />}
                  label='Споделена'
                />
                <Box ml={6}>
                  <Button variant='contained' color='secondary' onClick={() => closeFunc(false)}>Затвори</Button>
                  <Button variant='contained' sx={{ml: 1}} onClick={addNewArena}>Добави</Button>
                </Box>
              </Box>
            </> 
          : <Box minHeight={218} width={440} display='flex' alignItems='center' justifyContent='center'><CircularProgress size='100px'/></Box>
      }
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
    </Dialog>
  )
}


export default AddArenaDialog