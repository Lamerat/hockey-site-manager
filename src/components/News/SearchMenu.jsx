import React, { useState } from 'react'
import { Box, Menu, FormGroup, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText } from '@mui/material'
import { newsSearchFieldsTranslation, newsSearchFields } from '../../config/constants'
import { menuPaperStyle, searchMenuProps } from './News.styles'
import StyledTextField from '../StyledElements/StyledTextField'
import StyledButton from '../StyledElements/StyledButton'
import SearchIcon from '@mui/icons-material/Search'

const SearchMenu = ({ searchMenuRef, setOpenSearchMenu, startSearch }) => {
  const [searchFilter, setSearchFilter] = useState(newsSearchFields)
  const [keyword, setKeyWord] = useState('')

  const updateSearchFilter = (value) => setSearchFilter(typeof value === 'string' ? value.split(',') : value)

  const sendSearch = () => {
    setOpenSearchMenu(false)
    startSearch(keyword, searchFilter)
  }

  return (
    <Menu
      anchorEl={searchMenuRef.current}
      keepMounted={true}
      open={true}
      onClose={() => setOpenSearchMenu(false)}
      PaperProps={menuPaperStyle}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box p={2} maxWidth='300px' minWidth='300px'>
        <FormGroup row>
          <StyledTextField
            label='Ключова дума'
            size='small'
            variant='outlined'
            sx={{ width: 'calc(100% - 40px)'}}
            value={keyword}
            name='currentMeterValue'
            onChange={(e) => setKeyWord(e.target.value)}
            onFocus={event => {event.target.select()}}
          />
          <StyledButton variant='contained' startIcon={<SearchIcon />} onClick={sendSearch}/>
        </FormGroup>
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel size='small'>Търсене в</InputLabel>
          <Select
            size='small'
            multiple
            value={searchFilter}
            onChange={(e) => updateSearchFilter(e.target.value)}
            input={<OutlinedInput label='Търсене в' size='small' />}
            renderValue={(selected) => selected.map(x => newsSearchFieldsTranslation[x]).join(' ● ')}
            MenuProps={searchMenuProps}
          >
            {
              newsSearchFields.map((name) => (
                <MenuItem key={name} value={name}><Checkbox checked={searchFilter.indexOf(name) > -1} /><ListItemText primary={newsSearchFieldsTranslation[name]}/></MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Box>
    </Menu>
  )
}

export default SearchMenu