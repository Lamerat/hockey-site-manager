import React, { useState, forwardRef } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import mainTheme from '../../theme/MainTheme'
import Slide from '@mui/material/Slide'
import TextField from '@mui/material/TextField'
import IOSSwitch from '../IOSwitch/IOSwitch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Box, Typography } from '@mui/material'
import ErrorDialog from '../ErrorDialog/ErrorDialog'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const AddCityDialog = ({actionFunc, closeFunc}) => {  
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [city, setCity] = useState({ name: '', shared: false })

  const changeState = (value) => setCity({ ...city, name: value })

  const addNewCity = () => {
    if (!city.name.trim()) {
      setErrorDialog({ show: true, message: 'Липсва името на града' })
      return
    }
    actionFunc(city)
  }

  return (
    <Dialog open={true} TransitionComponent={Transition} keepMounted>
      <Box sx={{ p: 3, pb: 0, mb: 0.5 }}>
        <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.primary.main} variant='h6' pb={0.5}>Добавяне на нов град</Typography>
      </Box>
      <Box sx={{pl: 3, pr: 3}}>
        <TextField
          label='Име на града'
          variant='outlined'
          fullWidth
          value={city.name}
          onChange={(e) => changeState(e.target.value)}
          sx={{mt: 1}}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pt: 2 }}>
        <FormControlLabel
          control={<IOSSwitch sx={{ m: 1 }} checked={city.shared} onChange={() => setCity({ ...city, shared: !city.shared })} />}
          label='Споделен'
        />
        <Box ml={5}>
          <Button variant='contained' color='secondary' onClick={() => closeFunc(false)}>Затвори</Button>
          <Button variant='contained' sx={{ml: 1}} onClick={addNewCity}>Добави</Button>
        </Box>
      </Box>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
    </Dialog>
  )
}


export default AddCityDialog