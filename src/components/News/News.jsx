import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Stack, Badge } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { sortBox, sortLabel, rotateAngle } from '../../common/sortStyles'
import { editNewsRequest, listNewsRequest, deleteNewsRequest } from '../../api/news'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { badgeProps } from './News.styles'
import { getCredentials, cleanCredentials } from '../../config/storage'
import SharedContext from '../../context/SharedContext'
import UserContext from '../../context/UserContext'
import NewsRow from './NewsRow'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import FilterMenu from './FilterMenu'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import LinearProgress from '@mui/material/LinearProgress'
import PreviewDialog from './PreviewDialog'
import { DEV_MODE } from '../../config/constants'


const queryDefault = { pageNumber: 1, pageSize: 20, noPagination: false,  hasNextPage: false, sort: { createdAt: -1 }, search: '', searchFields: [], startDate: null, endDate: null }


const News = () => {
  const { setShared } = useContext(SharedContext)
  const { user } = useContext(UserContext)

  const firstRenderSharedRef = useRef(true)
  const firstRenderRef = useRef(true)
  const filterMenuRef = useRef(null)
  
  const [query, setQuery] = useState(queryDefault)
  const [news, setNews] = useState(null)
  const [openFilterMenu, setOpenFilterMenu] = useState(false)
  const [filterBadge, setFilterBadge] = useState(true)
  const [reloadList, setReloadList] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState({ show: false, data: null })
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })

  const history = useNavigate()

  useEffect(() => {
    if (firstRenderRef.current && DEV_MODE) {
      firstRenderRef.current = false
      return
    }

    const authError = () => {
      cleanCredentials()
      history('/')
    }

    const body = {
      pageNumber: query.pageNumber,
      pageSize: 20,
      sort: query.sort,
      search: query.search,
      searchFields: query.searchFields,
      startDate: query.startDate,
      endDate: query.endDate
    }

    listNewsRequest(body)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setNews(news => query.pageNumber === 1 ? result.payload.docs : [ ...news, ...result.payload.docs])
        setQuery(query => ({ ...query, pageNumber: result.payload.page, hasNextPage: result.payload.hasNextPage }))
        setFilterBadge(body.startDate || body.search ? false : true)
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [query.pageNumber, query.search, query.sort, query.endDate, query.startDate, query.searchFields, history, reloadList])


  const handlePagination = (scrollTop, height, scrollHeight) => {
    if (scrollTop + height < scrollHeight - 20) return
    if (query.hasNextPage) {
      setQuery({ ...query, pageNumber: query.pageNumber + 1, hasNextPage: false })
    }
  }


  const addFilter = (filters) => setQuery({ ...query, ...filters, pageNumber: 1, hasNextPage: false })


  const authError = () => {
    cleanCredentials()
    history('/')
  }


  const pinNewsAction = (newsId, action) => {
    editNewsRequest(newsId, { pinned: action })
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        query.pageNumber === 1 
          ? setReloadList(!reloadList)
          : setQuery({ ...query, pageNumber: 1, hasNextPage: false })
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const deleteNews = (newsId) => {
    setConfirmDialog({ show: false, message: '' })
    deleteNewsRequest(newsId)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        query.hasNextPage
          ? query.pageNumber === 1 ? setReloadList(!reloadList) : setQuery({ ...query, pageNumber: 1, hasNextPage: false })
          : setNews(news.filter(x => x._id !== result.payload._id))
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const prepareDeleteNews = (newsId, title) => {
    setConfirmDialog({ show: true, message: `Сигурни ли сте, че искате да изтриете новина "${title}"`, acceptFunc: () => deleteNews(newsId) })
  }


  const startEditNews = (newsId) => history(`/news/${newsId}`)


  const renderSort = (field) => {
    const newQuery = { ...query, pageNumber: 1, hasNextPage: false }
    if (!(field in query.sort)) {
      newQuery.sort =  { [field]: -1 }
    } else {
      query.sort[field] === 1
      ? newQuery.sort = { [field]: -1 }
      : newQuery.sort = { [field]: 1 }
    }
    setQuery(newQuery)
  }


  const sortArrow = (field) => {
    if (!(field in query.sort)) return null
    return query.sort[field] === 1 ? <KeyboardArrowUpIcon color='primary' sx={rotateAngle(true)}/> : <KeyboardArrowDownIcon color='primary' sx={rotateAngle(false)}/>
  }



  const previewNews = (newsId) => setShowPreviewDialog({ show: true, data: newsId })


  useEffect(() => {
    if (firstRenderSharedRef.current && DEV_MODE) {
      firstRenderSharedRef.current = false
      return
    }
    setShared(shared => ({ ...shared, currentPage: 0 }))
  }, [setShared])


  if (!user || !getCredentials()) return null
  
  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Paper elevation={2} sx={{p: 2, pb: 0, maxHeight: 'calc(100vh - 130px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
          <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Новини</Typography>
          <Box display='flex' alignItems='center' mr={-1}>
            <Tooltip title='Филтри' arrow>
              <IconButton onClick={() => setOpenFilterMenu(!openFilterMenu)} ref={filterMenuRef}>
                <Badge sx={badgeProps} color='primary' variant='dot' invisible={filterBadge}>
                  <FilterAltIcon color='secondary' />
                </Badge>
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
        {
          news
            ? news.length
              ? <>
                {
                  news
                    .filter(record => record.pinned)
                    .map(x => <NewsRow key={x._id} row={x} pinnedFunction={pinNewsAction} previewFunc={previewNews} editFunc={startEditNews} deleteFunction={prepareDeleteNews}/>)
                }
                <Scrollbars
                  style={{height: '100vh', padding: 16, paddingTop: 0, marginLeft: -16}}
                  onScroll={({ target }) => handlePagination(target.scrollTop, target.getBoundingClientRect().height, target.scrollHeight)}
                >
                  <Box p={2} pt={0}>
                    {
                      news.filter(record => !record.pinned).length
                        ? news
                            .filter(record => !record.pinned)
                            .map(x => <NewsRow key={x._id} row={x} pinnedFunction={pinNewsAction} previewFunc={previewNews} editFunc={startEditNews} deleteFunction={prepareDeleteNews}/>)
                        : <Box m={2} textAlign='center'>Няма намерени записи</Box>
                    }
                  </Box>
                </Scrollbars>
                </>
              : <Box m={2} textAlign='center'>Няма намерени записи</Box>
            : <LinearProgress color='secondary' sx={{height: 20, borderRadius: '4px', m: 2 }}/>
        }
      </Paper>
      <FilterMenu searchMenuRef={filterMenuRef} openMenu={openFilterMenu} setOpenMenu={setOpenFilterMenu} addFilterFunc={addFilter} />
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
      { showPreviewDialog.show ? <PreviewDialog newsId={showPreviewDialog.data} closeFunc={setShowPreviewDialog}/> : null }
    </Container>
  )
}

export default News