import React, { useState, forwardRef, useRef, useEffect } from 'react'
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, IconButton, InputAdornment, Menu, ListItemIcon, Tooltip, Stack } from '@mui/material'
import { menuPaperStyle } from './Event.styles'
import { listCities } from '../../api/city'
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
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import 'react-datepicker/dist/react-datepicker.css'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})


const titleStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }
const secondColor = mainTheme.palette.secondary.main
const defaultEvent = { date: new Date(), time: null, city: '', description: '' }

const OtherEventDialog = ({ data, addFunction, closeFunc, editFunction, deleteFunc }) => {
  const menuAnchor = useRef(null)
  const firstRenderRef = useRef(true)

  const [player, setPlayer] = useState(data ? data : defaultEvent)
  const [cities, setCities] = useState(null)
  const [openMenu, setOpenMenu] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })


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
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [])




  return (
    <Dialog open={true} TransitionComponent={Transition} keepMounted maxWidth='xs' fullWidth PaperProps={{sx: { p: 2, overflow: 'unset' }}}>
      <Box sx={titleStyle} borderBottom={1} borderColor={secondColor}>
        <Typography fontFamily='CorsaGrotesk' color={secondColor} variant='h6' pb={0.5}>{ data ? editMode ? 'Редакция на профил' : 'Профил на играч' : 'Добавяне на ново събитие' }</Typography>
        <Box display='flex' alignItems='center' mr={-1}>
        </Box>
      </Box>

      {
        !cities 
          ? <Box minHeight={218} width={440} display='flex' alignItems='center' justifyContent='center'><CircularProgress size='100px'/></Box>
          : <>
              <Stack direction='row' spacing={0} mt={1}>
                <DatePicker
                  selected={new Date()}
                  onChange={(date) => 1}
                  maxDate={new Date()}
                  dateFormat='dd-MM-yyyy'
                  peekNextMonth
                  dropdownMode='select'
                  customInput={
                    <TextField
                      size='small'
                      fullWidth
                      label='Дата'
                      variant='outlined'
                      InputProps={{ fullWidth: true, autoComplete: 'off', endAdornment: (<InputAdornment position='start'><CalendarMonthIcon sx={{mr: -2}} color='primary' /></InputAdornment>) }}
                    />
                  }
                />
                <Box minWidth={24}></Box>
                
                <DatePicker
                  selected={new Date()}
                  onChange={(date) => 1}
                  dateFormat='HH:mm'
                  popperPlacement='bottom'
                  timeFormat='HH:mm'
                  timeIntervals={10}
                  showTimeSelect
                  showTimeSelectOnly
                  dropdownMode='scroll'
                  customInput={
                    <TextField
                      size='small'
                      InputLabelProps={{sx: {zIndex: 0}}}
                      fullWidth
                      label='Час'
                      variant='outlined'
                      InputProps={{ fullWidth: true, autoComplete: 'off', endAdornment: (<InputAdornment position='start'><AccessTimeIcon sx={{mr: -2}} color='primary' /></InputAdornment>) }}
                    />
                  }
                />
              </Stack>
              <FormControl fullWidth sx={{mt: 2, mb: 2}}>
                <InputLabel sx={{zIndex: 0}}>Град</InputLabel>
                <Select  size='small' value={cities[0]._id} label='Град' onChange={(e) => 1}>
                  { cities.map(x => <MenuItem key={x._id} value={x._id}>{x.name}</MenuItem> ) }
                </Select>
              </FormControl>
              <TextField
                label='Кратко описание'
                disabled={data && !editMode}
                variant='outlined'
                size='small'
                fullWidth
                multiline
                rows={5}
                InputLabelProps={{sx: {zIndex: 0}}}
                error={player.description.error}
                value={player.description.value}
                onChange={(e) => 1}
              />
              <Box mt={2} display='flex' justifyContent='right'>
                  <Button variant='contained' color='secondary'>Откажи</Button>
                  <Button variant='contained' sx={{ml: 2}}>Добави</Button>
              </Box>
            </>
      }
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
    </Dialog>
  )
}


export default OtherEventDialog