import React, { useState } from 'react'
import { Box, Menu, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText, TextField, Button, InputAdornment } from '@mui/material'
import { newsSearchFieldsTranslation, newsSearchFields, eventTranslation } from '../../config/constants'
import { menuPaperStyle, searchMenuProps } from './Event.styles'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

const filtersDefault = { searchFields: Object.keys(eventTranslation), startDate: null, endDate: null }

const FilterMenu = ({ searchMenuRef, openMenu, setOpenMenu, addFilterFunc }) => {
  const [filters, setFilters] = useState(filtersDefault)

  const updateSearchFilter = (value) => setFilters({ ...filters, searchFields: typeof value === 'string' ? value.split(',') : value })

  const sendFilter = () => {
    setOpenMenu(false)
    addFilterFunc(filters)
  }

  const clearFilter = () => {
    setOpenMenu(false)
    setFilters(filtersDefault)
    addFilterFunc(filtersDefault)
  }

  const changeStartDate = (value) => {
    if (moment(value).isAfter(filters.endDate) || !filters.endDate) setFilters({ ...filters, startDate: value, endDate: new Date() })
    else setFilters({ ...filters, startDate: value })
  }

  const changeEndDate = (value) => filters.startDate ? setFilters({ ...filters, endDate: value }) : setFilters({ ...filters, startDate: value, endDate: value })

  return (
    <Menu
      anchorEl={searchMenuRef.current}
      keepMounted={true}
      open={openMenu}
      PaperProps={menuPaperStyle}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box p={2} maxWidth='300px' minWidth='300px'>
        <FormControl fullWidth>
          <InputLabel size='small'>Тип</InputLabel>
          <Select
            size='small'
            multiple
            value={filters.searchFields}
            onChange={(e) => updateSearchFilter(e.target.value)}
            input={<OutlinedInput label='Тип' size='small' />}
            renderValue={(selected) => selected.map(x => eventTranslation[x]).join(' ● ')}
            MenuProps={searchMenuProps}
          >
            {
              Object.keys(eventTranslation).map((name) => (
                <MenuItem key={name} value={name}><Checkbox checked={filters.searchFields.indexOf(name) > -1} /><ListItemText primary={eventTranslation[name]}/></MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <DatePicker
          selected={filters.startDate}
          onChange={(date) => changeStartDate(date)}
          maxDate={new Date()}
          dateFormat='dd-MM-yyyy'
          customInput={
            <TextField
              size='small'
              fullWidth
              label='Начална дата'
              variant='outlined'
              InputProps={{ endAdornment: (<InputAdornment position='start'><CalendarMonthIcon sx={{mr: -2}} color='primary' /></InputAdornment>) }}
              sx={{mt: 3}}
            />
          }
        />
        <DatePicker
          selected={filters.endDate}
          onChange={(date) => changeEndDate(date)}
          maxDate={new Date()}
          minDate={new Date(filters.startDate)}
          dateFormat='dd-MM-yyyy'
          customInput={
            <TextField
              size='small'
              InputLabelProps={{sx: {zIndex: 0}}}
              fullWidth
              label='Крайна дата'
              variant='outlined'
              InputProps={{ endAdornment: (<InputAdornment position='start'><CalendarMonthIcon sx={{mr: -2}} color='primary' /></InputAdornment>) }}
              sx={{mt: 3}}
            />
          }
        />
        <Box display='flex' justifyContent='flex-end' mt={3}>
          <Button size='small' fullWidth sx={{mr: 1}} variant='contained' onClick={sendFilter}>Приложи</Button>
          <Button size='small' fullWidth sx={{ml: 1}} color='secondary' variant='contained' onClick={clearFilter}>Изчисти</Button>
        </Box>
      </Box>
    </Menu>
  )
}

export default FilterMenu