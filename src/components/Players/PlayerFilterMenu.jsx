import React, { useState } from 'react'
import { Box, Menu, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText, TextField, Button, InputAdornment, Stack } from '@mui/material'
import { positionTranslation } from '../../config/constants'
import { menuPaperStyle, searchMenuProps } from './Players.styles'
import SearchIcon from '@mui/icons-material/Search'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

const filtersDefault = { search: '', position: Object.keys(positionTranslation), hand: false, minNumber: '', maxNumber: '', startDate: null, endDate: null }

const PlayerFilterMenu = ({ searchMenuRef, openMenu, setOpenMenu, addFilterFunc }) => {
  const [filters, setFilters] = useState(filtersDefault)

  const updateSearchFilter = (value) => setFilters({ ...filters, position: typeof value === 'string' ? value.split(',') : value })

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

  const changeMinNumber = (value) => {
    if ((value < 1 || value > 99) && value !== '') return
    if (Number(filters.maxNumber) < Number(value) && filters.maxNumber) {
      setFilters({ ...filters, minNumber: value, maxNumber: value})
      return
    }

    setFilters({ ...filters, minNumber: value})
  }

  const changeMaxNumber = (value) => {
    if ((value < 1 || value > 99) && value !== '') return
    if (Number(filters.minNumber) > Number(value) && filters.minNumber) {
      setFilters({ ...filters, minNumber: value, maxNumber: value})
      return
    }

    setFilters({ ...filters, maxNumber: value})
  }

  return (
    <Menu
      anchorEl={searchMenuRef.current}
      keepMounted={true}
      open={openMenu}
      PaperProps={menuPaperStyle}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box p={2} maxWidth='330px' minWidth='330px'>
        <TextField
          size='small'
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value})}
          fullWidth
          label='Търсене по име'
          variant='outlined'
          autoComplete='off'
          InputProps={{ endAdornment: (<InputAdornment position='start'><SearchIcon sx={{mr: -2}} color='primary' /></InputAdornment>) }}
        />
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel size='small'>Пост</InputLabel>
          <Select
            size='small'
            multiple
            value={filters.position}
            onChange={(e) => updateSearchFilter(e.target.value)}
            input={<OutlinedInput label='Пост' size='small' />}
            renderValue={(selected) => selected.map(x => positionTranslation[x]).join(' ● ')}
            MenuProps={searchMenuProps}
          >
            {
              Object.keys(positionTranslation).map((name) => (
                <MenuItem key={name} value={name}><Checkbox checked={filters.position.indexOf(name) > -1} /><ListItemText primary={positionTranslation[name]}/></MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <FormControl fullWidth size='small' sx={{ mt: 3 }}>
          <InputLabel>Водеща ръка</InputLabel>
          <Select
            label='Водеща ръка'
            value={filters.hand}
            onChange={(e) => setFilters({ ...filters, hand: e.target.value })}
          >
            <MenuItem value={false}>Без значение</MenuItem>
            <MenuItem value={'left'}>Лява</MenuItem>
            <MenuItem value={'right'}>Дясна</MenuItem>
          </Select>
        </FormControl>
        <Stack direction='row' spacing={3} mt={3}>
          <TextField
            autoComplete='off'
            label='Номер мин.'
            type='number'
            size='small'
            fullWidth
            value={filters.minNumber}
            onChange={(e) => changeMinNumber(e.target.value)}
          />
          <TextField
            autoComplete='off'
            label='Номер макс.'
            type='number'
            size='small'
            fullWidth
            value={filters.maxNumber}
            onChange={(e) => changeMaxNumber(e.target.value)}
          />
        </Stack>
        <Stack direction='row' spacing={0} mt={3}>
          <DatePicker
            selected={filters.startDate}
            onChange={(date) => changeStartDate(date)}
            maxDate={new Date()}
            dateFormat='dd-MM-yyyy'
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode='select'
            customInput={
              <TextField
                size='small'
                fullWidth
                label='Роден след'
                variant='outlined'
                InputProps={{ fullWidth: true, autoComplete: 'off', endAdornment: (<InputAdornment position='start'><CalendarMonthIcon sx={{mr: -2}} color='primary' /></InputAdornment>) }}
              />
            }
          />
          <Box minWidth={24}></Box>
          <DatePicker
            selected={filters.endDate}
            onChange={(date) => changeEndDate(date)}
            maxDate={new Date()}
            minDate={new Date(filters.startDate)}
            dateFormat='dd-MM-yyyy'
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode='select'
            customInput={
              <TextField
                size='small'
                InputLabelProps={{sx: {zIndex: 0}}}
                fullWidth
                label='Роден преди'
                variant='outlined'
                InputProps={{ fullWidth: true, autoComplete: 'off', endAdornment: (<InputAdornment position='start'><CalendarMonthIcon sx={{mr: -2}} color='primary' /></InputAdornment>) }}
              />
            }
          />
        </Stack>
        <Box display='flex' justifyContent='flex-end' mt={3}>
          <Button size='small' fullWidth sx={{mr: 1}} variant='contained' onClick={sendFilter}>Приложи</Button>
          <Button size='small' fullWidth sx={{ml: 1}} color='secondary' variant='contained' onClick={clearFilter}>Изчисти</Button>
        </Box>
      </Box>
    </Menu>
  )
}

export default PlayerFilterMenu