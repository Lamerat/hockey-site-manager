import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SharedContext from '../../context/SharedContext'
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

const queryDefault = { page: 1, limit: 15, noPagination: false, sort: { createdAt: -1 } }

const News = () => {
  const { setShared } = useContext(SharedContext)
  const firstRenderSharedRef = useRef(true)
  const firstRenderRef = useRef(true)

  const [query, setQuery] = useState(queryDefault)
  const [news, setNews] = useState([])

  const history = useNavigate()

  useEffect(() => {
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    listNewsRequest({ pageSize: 20 })
      .then(x => x.json())
      .then(result => setNews(result.payload.docs))
      .catch(error => console.log(error))
  }, [])


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

  
  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Paper elevation={2} sx={{p: 2, pb: 0, maxHeight: 'calc(100vh - 130px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
          <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Новини</Typography>
          <Box display='flex' alignItems='center' mr={-1}>
            <Tooltip title='Търсене' arrow>
              <IconButton onClick={() => 1}>
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
        <Scrollbars style={{height: '100vh', padding: 16, paddingTop: 0, marginLeft: -16}} >
          <Box p={2} pt={0}>
            { news.filter(record => !record.pinned).map(x => <NewsRow key={x._id} row={x} />) }
          </Box>
        </Scrollbars>
      </Paper>
    </Container>
  )
}

export default News