import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Stack, Menu, FormGroup, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SharedContext from '../../context/SharedContext'
import UserContext from '../../context/UserContext'
import { Scrollbars } from 'react-custom-scrollbars-2'
import NewsRow from './NewsRow'
import { sortBox, sortLabel, rotateAngle } from '../../common/sortStyles'
import { listNewsRequest } from '../../api/news'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import SearchIcon from '@mui/icons-material/Search'
import DateRangeIcon from '@mui/icons-material/DateRange'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { menuPaperStyle, searchMenuProps } from './News.styles'
import StyledTextField from '../StyledElements/StyledTextField'
import StyledButton from '../StyledElements/StyledButton'
import { newsSearchFieldsTranslation, newsSearchFields } from '../../config/constants'
import { getCredentials, cleanCredentials } from '../../config/storage'

const queryDefault = { pageNumber: 1, pageSize: 20, noPagination: false,  hasNextPage: false, sort: { createdAt: -1 } }


const News = () => {
  const { setShared } = useContext(SharedContext)
  const { user } = useContext(UserContext)

  const firstRenderSharedRef = useRef(true)
  const firstRenderRef = useRef(true)
  const searchMenuRef = useRef(null)

  const [searchFilter, setSearchFilter] = useState(newsSearchFields)
  const [query, setQuery] = useState(queryDefault)
  const [news, setNews] = useState([])
  const [openSearchMenu, setOpenSearchMenu] = useState(false)

  const history = useNavigate()

  useEffect(() => {
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    const authError = () => {
      cleanCredentials()
      history('/')
    }

    listNewsRequest({ pageNumber: query.pageNumber, pageSize: 20, sort: query.sort })
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setNews(news => query.pageNumber === 1 ? result.payload.docs : [ ...news, ...result.payload.docs])
        setQuery(query => ({ ...query, pageNumber: result.payload.page, hasNextPage: result.payload.hasNextPage }))
      })
      .catch(error => console.log(error))
  }, [query.pageNumber, query.sort, history])
  

  const handlePagination = (scrollTop, height, scrollHeight) => {
    if (scrollTop + height < scrollHeight - 20) return
    if (query.hasNextPage) {
      setQuery({ ...query, pageNumber: query.pageNumber + 1, hasNextPage: false })
    }
  }


  const renderSort = (field) => {
    let newQuery
    if (!(field in query.sort)) {
      newQuery = { ...queryDefault, sort: { [field]: -1 } }
    } else {
      newQuery = query.sort[field] === 1
      ? { ...queryDefault, sort: { [field]: -1 } }
      : { ...queryDefault, sort: { [field]: 1 } }
    }
    setQuery(newQuery)
  }

  const sortArrow = (field) => {
    if (!(field in query.sort)) return null
    return query.sort[field] === 1 ? <KeyboardArrowUpIcon color='primary' sx={rotateAngle(true)}/> : <KeyboardArrowDownIcon color='primary' sx={rotateAngle(false)}/>
  }
  
  useEffect(() => {
    if(firstRenderSharedRef.current) {
      firstRenderSharedRef.current = false
      return
    }
    setShared(shared => ({ ...shared, currentPage: 0 }))
  }, [setShared])

  const updateSearchFilter = (value) => setSearchFilter(typeof value === 'string' ? value.split(',') : value)

  const startSearch = () => {
    console.log(searchFilter)
  }

  if (!user || !getCredentials()) return null
  
  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Paper elevation={2} sx={{p: 2, pb: 0, maxHeight: 'calc(100vh - 130px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
          <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Новини</Typography>
          <Box display='flex' alignItems='center' mr={-1}>
            <Tooltip title='Търсене' arrow>
              <IconButton onClick={() => setOpenSearchMenu(!openSearchMenu)} ref={searchMenuRef}>
                <SearchIcon color='secondary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Филтрирай по период' arrow>
              <IconButton onClick={() => 1}>
                <DateRangeIcon color='secondary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Добави нова' arrow>
              <IconButton onClick={() => history('/news/create')}>
                <LibraryAddIcon color='secondary' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Stack direction='row' pt={1} pb={1} pl={1.5} pr={1.5} minHeight={26}>
          <Box width='55%' sx={sortBox} onClick={()=> renderSort('title')}><Box sx={sortLabel}>Заглавие</Box>{sortArrow('title')}</Box>
          <Box width='10%' sx={sortBox} onClick={()=> renderSort('photosCount')}><Box sx={sortLabel}>Снимки</Box>{sortArrow('photosCount')}</Box>
          <Box width='15%' sx={sortBox} onClick={()=> renderSort('createdAt')}><Box sx={sortLabel}>Дата</Box>{sortArrow('createdAt')}</Box>
          <Box width='15%' sx={sortBox} onClick={()=> renderSort('user.name')}><Box sx={sortLabel}>Добавена от</Box>{sortArrow('user.name')}</Box>
          <Box width='5%'/>
        </Stack>
        { news.filter(record => record.pinned).map(x => <NewsRow key={x._id} row={x} />) }
        <Scrollbars
          style={{height: '100vh', padding: 16, paddingTop: 0, marginLeft: -16}}
          onScroll={({ target }) => handlePagination(target.scrollTop, target.getBoundingClientRect().height, target.scrollHeight)}
        >
          <Box p={2} pt={0}>
            { news.filter(record => !record.pinned).map(x => <NewsRow key={x._id} row={x} />) }
          </Box>
        </Scrollbars>
      </Paper>
      <Menu
        anchorEl={searchMenuRef.current}
        keepMounted={true}
        open={openSearchMenu}
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
              // value={settings.currentMeterValue}
              name='currentMeterValue'
              // onChange={(e) => updateData(e.target.name, e.target.value)}
              onFocus={event => {event.target.select()}}
            />
            <StyledButton variant='contained' startIcon={<SearchIcon />} onClick={startSearch}/>
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
    </Container>
  )
}

export default News