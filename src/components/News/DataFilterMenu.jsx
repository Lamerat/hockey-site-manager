import React, { useState } from 'react'
import { Box, Menu, TextField, InputAdornment, Button } from '@mui/material'
import { menuPaperStyle } from './News.styles'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';


const DataFilterMenu = ({ refMenu, openMenu, actionFunc }) => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  return (
    <Menu
      anchorEl={refMenu.current}
      keepMounted={true}
      open={true}
      onClose={() => openMenu(false)}
      PaperProps={menuPaperStyle}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box p={2} maxWidth='240px' minWidth='240px'>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          customInput={
            <TextField
              size='small'
              fullWidth
              label='Начална дата'
              variant='outlined'
              InputProps={{ endAdornment: (<InputAdornment position='start'><CalendarMonthIcon color='primary' /></InputAdornment>) }}
            />
          }
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          customInput={
            <TextField
              size='small'
              fullWidth
              label='Крайна дата'
              variant='outlined'
              InputProps={{ endAdornment: (<InputAdornment position='start'><CalendarMonthIcon color='primary' /></InputAdornment>) }}
              sx={{mt: 3, mb: 2}}
            />
          }
        />
        <Box display='flex' justifyContent='flex-end'>
          <Button size='small' fullWidth sx={{mr: 1}} color='secondary' variant='contained'>Откажи</Button>
          <Button size='small' fullWidth sx={{ml: 1}} variant='contained'>Приложи</Button>
        </Box>
      </Box>
    </Menu>
  )
}

export default DataFilterMenu