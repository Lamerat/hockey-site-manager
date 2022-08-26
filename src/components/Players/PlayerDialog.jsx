import React, { useState, forwardRef, useEffect, useRef } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import mainTheme from '../../theme/MainTheme'
import Slide from '@mui/material/Slide'
import TextField from '@mui/material/TextField'
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Tooltip, IconButton, InputAdornment } from '@mui/material'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import CircularProgress from '@mui/material/CircularProgress'
import { uploadFiles } from '../../api/files'
import DatePicker from 'react-datepicker'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import 'react-datepicker/dist/react-datepicker.css'


const titleStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }
const secondColor = mainTheme.palette.secondary.main

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const PlayerDialog = ({data, editMode, actionFunc, closeFunc}) => {
  const firstRenderRef = useRef(true)

  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })


  return (
    <Dialog open={true} TransitionComponent={Transition} keepMounted maxWidth='md' fullWidth PaperProps={{sx: { p: 2}}}>
      <Box sx={titleStyle} borderBottom={1} borderColor={mainTheme.palette.secondary.main}>
        <Typography fontFamily='CorsaGrotesk' color={secondColor} variant='h6' pb={0.5}>{ editMode ? 'Профил на играч' : 'Добавяне на нов играч' }</Typography>
        <Box display='flex' alignItems='center' mr={-1}>
          <Tooltip title='Редактирай' arrow>
            <IconButton onClick={() => 1}><EditIcon color='secondary' /></IconButton>
          </Tooltip>
          <Tooltip title='Изтрий' arrow>
            <IconButton onClick={() => 1}><DeleteIcon color='secondary' /></IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={5}>
          <Box width='100%' minHeight={356} border='1px solid black'></Box>
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label='Име' variant='outlined' size='small' fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label='Фамилия' variant='outlined' size='small' fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label='Номер'
                type='number'
                size='small'
                fullWidth
                InputLabelProps={{ shrink: false }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size='small'>
                <InputLabel>Пост</InputLabel>
                <Select
                  label='Пост'
                  value={'goalie'}
                  // onChange={handleChange}
                >
                  <MenuItem value={'goalie'}>Вратар</MenuItem>
                  <MenuItem value={'guard'}>Защитник</MenuItem>
                  <MenuItem value={'attacker'}>Нападател</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                // selected={filters.startDate}
                // onChange={(date) => changeStartDate(date)}
                popperPlacement='auto-end'
                maxDate={new Date()}
                dateFormat='dd-MM-yyyy'
                customInput={
                  <TextField
                    size='small'
                    fullWidth
                    label='Рождена дата'
                    variant='outlined'
                    InputProps={{ endAdornment: (<InputAdornment position='start'><CalendarMonthIcon sx={{mr: -2}} color='primary' /></InputAdornment>) }}
                  />
                }
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size='small'>
                <InputLabel>Водеща ръка</InputLabel>
                <Select
                  label='Водеща ръка'
                  value={'right'}
                  // onChange={handleChange}
                >
                  <MenuItem value={'left'}>Лява</MenuItem>
                  <MenuItem value={'right'}>Дясна</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label='Ръст'
                variant='outlined'
                size='small'
                fullWidth
                InputProps={{ endAdornment: <InputAdornment position='end'>см</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label='Тегло'
                variant='outlined'
                size='small'
                fullWidth
                InputProps={{ endAdornment: <InputAdornment position='end'>кг</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Тегло'
                variant='outlined'
                size='small'
                fullWidth
                multiline
                rows={5}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{...titleStyle, mb: 0, mt: 2}}>
        <Button variant='contained' component='label'>
          Избери лого
          <input hidden accept='image/*' type='file' onChange={(e) => 1} />
        </Button>
        <Box ml={6}>
          <Button variant='contained' color='secondary' onClick={() => 1}>Затвори</Button>
          <Button variant='contained' sx={{ml: 1}} onClick={() => 1}>{ editMode ? 'Редактирай' : 'Добави'}</Button>
        </Box>
      </Box>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
    </Dialog>
  )
}


export default PlayerDialog