import React, { useState } from 'react'
import { Box, Menu, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText, TextField, Button, InputAdornment } from '@mui/material'
import { eventTranslation } from '../../config/constants'
import { menuPaperStyle, searchMenuProps } from './Event.styles'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

const eventFilterDefault = { startDate: null, endDate: null, homeTeam: '', visitorTeam: '', arena: '', city: '', createdBy: '' }

const FilterMenu = ({ searchMenuRef, filterData, openMenu, setOpenMenu, addFilterFunc }) => {
  const [filters, setFilters] = useState({ ...eventFilterDefault, type: filterData.type })
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })

  const updateSearchFilter = (value) => setFilters({ ...filters, type: typeof value === 'string' ? value.split(',') : value })

  const sendFilter = () => {
    setOpenMenu(false)
    addFilterFunc(filters)
  }

  const clearFilter = () => {
    setOpenMenu(false)
    setFilters({ ...eventFilterDefault, type: filterData.type })
    addFilterFunc({ ...eventFilterDefault, type: filterData.type })
  }

  const changeStartDate = (value) => {
    if (moment(value).isAfter(filters.endDate) || !filters.endDate) setFilters({ ...filters, startDate: value, endDate: new Date() })
    else setFilters({ ...filters, startDate: value })
  }

  const changeEndDate = (value) => filters.startDate ? setFilters({ ...filters, endDate: value }) : setFilters({ ...filters, startDate: value, endDate: value })

  if (!filterData) return

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
            value={filters.type}
            onChange={(e) => updateSearchFilter(e.target.value)}
            input={<OutlinedInput label='Тип' size='small' />}
            renderValue={(selected) => selected.map(x => eventTranslation[x]).join(' ● ')}
            MenuProps={searchMenuProps}
          >
            {
              filterData.type.map((name) => (
                <MenuItem key={name} value={name}><Checkbox checked={filters.type.indexOf(name) > -1} /><ListItemText primary={eventTranslation[name]}/></MenuItem>
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
              InputProps={{ autoComplete: 'off', endAdornment: (<InputAdornment position='start'><CalendarMonthIcon sx={{mr: -2}} color='primary' /></InputAdornment>) }}
              sx={{mt: 2}}
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
              InputProps={{ autoComplete: 'off', endAdornment: (<InputAdornment position='start'><CalendarMonthIcon sx={{mr: -2}} color='primary' /></InputAdornment>) }}
              sx={{mt: 3}}
            />
          }
        />
        <FormControl fullWidth sx={{mt: 3}} size='small'>
          <InputLabel sx={{zIndex: 0}}>Домакин</InputLabel>
          <Select value={filters.homeTeam} label='Домакин' onChange={(e) => setFilters({ ...filters, homeTeam: e.target.value })}>
            <MenuItem value=''>Изчисти</MenuItem>
            { filterData.homeTeam.map(x => <MenuItem key={x._id} value={x._id}>{x.name}</MenuItem>) }
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{mt: 3}} size='small'>
          <InputLabel sx={{zIndex: 0}}>Гост</InputLabel>
          <Select value={filters.visitorTeam} label='Гост' onChange={(e) => setFilters({ ...filters, visitorTeam: e.target.value })}>
            <MenuItem value=''>Изчисти</MenuItem>
            { filterData.visitorTeam.map(x => <MenuItem key={x._id} value={x._id}>{x.name}</MenuItem>) }
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{mt: 3}} size='small'>
          <InputLabel sx={{zIndex: 0}}>Пързалка</InputLabel>
          <Select value={filters.arena} label='Пързалка' onChange={(e) => setFilters({ ...filters, arena: e.target.value })}>
            <MenuItem value=''>Изчисти</MenuItem>
            { filterData.arena.map(x => <MenuItem key={x._id} value={x._id}>{x.name}</MenuItem>) }
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{mt: 3}} size='small'>
          <InputLabel sx={{zIndex: 0}}>Град</InputLabel>
          <Select value={filters.city} label='Град' onChange={(e) => setFilters({ ...filters, city: e.target.value })}>
            <MenuItem value=''>Изчисти</MenuItem>
            { filterData.city.map(x => <MenuItem key={x._id} value={x._id}>{x.name}</MenuItem>) }
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{mt: 3}} size='small'>
          <InputLabel sx={{zIndex: 0}}>Създал</InputLabel>
          <Select value={filters.createdBy} label='Създал' onChange={(e) => setFilters({ ...filters, createdBy: e.target.value })}>
            <MenuItem value=''>Изчисти</MenuItem>
            { filterData.createdBy.map(x => <MenuItem key={x._id} value={x._id}>{x.name}</MenuItem>) }
          </Select>
        </FormControl>
        <Box display='flex' justifyContent='flex-end' mt={3}>
          <Button size='small' fullWidth sx={{mr: 1}} variant='contained' onClick={sendFilter}>Приложи</Button>
          <Button size='small' fullWidth sx={{ml: 1}} color='secondary' variant='contained' onClick={clearFilter}>Изчисти</Button>
        </Box>
      </Box>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
    </Menu>
  )
}

export default FilterMenu