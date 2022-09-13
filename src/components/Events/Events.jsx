import React, { useState, useContext, useEffect, useRef } from 'react'
import SharedContext from '../../context/SharedContext'
import UserContext from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Stack, Menu, MenuItem, ListItemIcon, Badge } from '@mui/material'
import { getCredentials, cleanCredentials } from '../../config/storage'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { menuPaperStyle, badgeProps } from './Event.styles.js'
import { listEvents, createEventRequest, singleEventRequest, editEventRequest, deleteEventRequest } from '../../api/event'
import { sortBox, sortLabel, rotateAngle } from '../../common/sortStyles'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ForestIcon from '@mui/icons-material/Forest'
import IceSkatingIcon from '@mui/icons-material/IceSkating'
import SportsHockeyIcon from '@mui/icons-material/SportsHockey'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import LinearProgress from '@mui/material/LinearProgress'
import EventRow from './EventRow'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import OtherEventDialog from './OtherEventDialog'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import moment from 'moment'
import Training from './Training'
import Game from './Game'

const queryDefault = { pageNumber: 1, pageSize: 20, noPagination: false, hidden: true,  hasNextPage: false, sort: { date: -1 } }


const Events = () => {
  const { setShared } = useContext(SharedContext)
  const { user } = useContext(UserContext)

  const firstRenderRef = useRef(true)
  const addMenuAnchor = useRef(null)
  const filterMenuRef = useRef(null)

  const [query, setQuery] = useState(queryDefault)
  const [events, setEvents] = useState(null)
  const [openAddMenu, setOpenAddMenu] = useState(false)
  const [openFilterMenu, setOpenFilterMenu] = useState(false)
  const [filterBadge, setFilterBadge] = useState(true)
  const [reloadList, setReloadList] = useState(false)
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })
  const [showOtherDialog, setShowOtherDialog] = useState({ show: false, data: null })
  const [showTrainingDialog, setShowTrainingDialog] = useState({ show: false, data: null })
  const [showGameDialog, setShowGameDialog] = useState({ show: false, data: null })

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

    const body = {
      pageNumber: query.pageNumber,
      pageSize: 20,
      sort: query.sort,
    }

    listEvents(body)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setEvents(events => query.pageNumber === 1 ? result.payload.docs : [ ...events, ...result.payload.docs])
        setQuery(query => ({ ...query, pageNumber: result.payload.page, hasNextPage: result.payload.hasNextPage }))
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [query.pageNumber, query.sort, history, reloadList])


  const handlePagination = (scrollTop, height, scrollHeight) => {
    if (scrollTop + height < scrollHeight - 20) return
    if (query.hasNextPage) {
      setQuery({ ...query, pageNumber: query.pageNumber + 1, hasNextPage: false })
    }
  }


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


  const authError = () => {
    cleanCredentials()
    history('/')
  }


  const createEvent = (body) => {
    createEventRequest(body)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        query.pageNumber === 1
          ? setReloadList(!reloadList)
          : setQuery({ ...query, pageNumber: 1 })

        if (result.payload.type === 'other') {
          setShowOtherDialog({ show: false, data: null })
        } else if (result.payload.type === 'training') {
          setShowTrainingDialog({ show: false, data: null })
        }
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const getEventData = (eventId) => {
    singleEventRequest(eventId)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        const { payload } = result

        switch (result.payload.type) {
          case 'other':
            setShowOtherDialog({ show: true, data: { _id: payload._id, date: new Date(payload.date), time: new Date(payload.date), city: payload.city._id, description: payload.description } })
            break
          case 'training':
            setShowTrainingDialog({ show: true, data: { _id: payload._id, date: new Date(payload.date), time: new Date(payload.date), arena: payload.arena._id, description: payload.description } })
            break
          default:
            setShowGameDialog({
              show: true,
              data: {
                _id: payload._id,
                date: new Date(payload.date),
                time: new Date(payload.date),
                arena: payload.arena._id,
                homeTeam: payload.homeTeam._id,
                visitorTeam: payload.visitorTeam._id,
                draw: payload.draw,
                overtime: payload.overtime,
                firstThird: payload.firstThird,
                secondThird: payload.secondThird,
                thirdThird: payload.thirdThird,
                finalScore: payload.finalScore,
                description: payload.description
              }
            })
            break
        }
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }
  

  const editEvent = (eventData) => {
    const { _id, ...body } = eventData

    editEventRequest(_id, body)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        query.pageNumber === 1
          ? setReloadList(!reloadList)
          : setQuery({ ...query, pageNumber: 1 })

        switch (result.payload.type) {
          case 'other':
            setShowOtherDialog({ show: false, data: null })
            break
          case 'training':
            setShowTrainingDialog({ show: false, data: null })
            break

          default:
            break
        }
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const prepareDeleteEvent = (eventId) => {
    const eventInfo = events.filter(x => x._id === eventId)[0]
    const eventDate =  moment(eventInfo.date).format('DD-MM-YYYY от HH:mm часа')
    setConfirmDialog({ show: true, message: `Сигурни ли сте, че искате да изтриете събитието на <b>${eventDate}</b>?`, acceptFunc: () => deleteEvent(eventId) })
  }


  const deleteEvent = (eventId) => {
    deleteEventRequest(eventId)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        switch (result.payload.type) {
          case 'other':
            setShowOtherDialog({ show: false, data: null })
            break

          default:
            break
        }

        setConfirmDialog({ show: false, message: '' })
        query.hasNextPage
          ? query.pageNumber === 1 ? setReloadList(!reloadList) : setQuery({ ...query, pageNumber: 1, hasNextPage: false })
          : setEvents(events.filter(x => x._id !== result.payload._id))
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  useEffect(() => {
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    setShared(shared => ({ ...shared, currentPage: 1 }))
  }, [setShared])

  
  if (!user || !getCredentials()) return null

  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Paper elevation={2} sx={{p: 2, pb: 0, maxHeight: 'calc(100vh - 130px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
          <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Събития</Typography>
          <Box display='flex' alignItems='center' mr={-1}>
            <Tooltip title='Филтри' arrow>
              <IconButton onClick={() => setOpenFilterMenu(!openFilterMenu)} ref={filterMenuRef}>
                <Badge sx={badgeProps} color='primary' variant='dot' invisible={filterBadge}>
                  <FilterAltIcon color='secondary' />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title='Добави ново' arrow>
              <IconButton ref={addMenuAnchor} onClick={() => setOpenAddMenu(!openAddMenu)}>
                <LibraryAddIcon color='secondary' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Stack direction='row' pt={1} pb={1} pl={1.5} pr={1.5} minHeight={26}>
          <Box width='9%' sx={sortBox} onClick={()=> renderSort('date')}><Box sx={sortLabel}>Дата</Box>{sortArrow('date')}</Box>
          <Box width='9%' sx={sortBox} onClick={()=> renderSort('type')}><Box sx={sortLabel}>Тип</Box>{sortArrow('type')}</Box>
          <Box width='12%' sx={sortBox} onClick={()=> renderSort('city.name')}><Box sx={sortLabel}>Град</Box>{sortArrow('city.name')}</Box>
          <Box width='18%' sx={sortBox} onClick={()=> renderSort('arena.name')}><Box sx={sortLabel}>Пързалка</Box>{sortArrow('arena.name')}</Box>
          <Box width='13%' sx={sortBox} onClick={()=> renderSort('homeTeam.name')}><Box sx={sortLabel}>Домакин</Box>{sortArrow('homeTeam.name')}</Box>
          <Box width='13%' sx={sortBox} onClick={()=> renderSort('visitorTeam.name')}><Box sx={sortLabel}>Гост</Box>{sortArrow('visitorTeam.name')}</Box>
          <Box width='12%' sx={sortBox} onClick={()=> renderSort('finalScore.home')}><Box sx={sortLabel}>Резултат</Box>{sortArrow('finalScore.home')}</Box>
          <Box width='14%' sx={sortBox} onClick={()=> renderSort('createdBy.name')}><Box sx={sortLabel}>Добавено от</Box>{sortArrow('createdBy.name')}</Box>
        </Stack>
        {
          events
            ? events.length
              ?  <Scrollbars
                    style={{height: '100vh', padding: 16, paddingTop: 0, marginLeft: -16}}
                    onScroll={({ target }) => handlePagination(target.scrollTop, target.getBoundingClientRect().height, target.scrollHeight)}
                  >
                    <Box p={2} pt={0}>
                      {
                        events.filter(record => !record.pinned).length
                          ? events.filter(record => !record.pinned).map(x => <EventRow key={x._id} row={x} actionFunc={getEventData} />)
                          : <Box m={2} textAlign='center'>Няма намерени записи</Box>
                      }
                    </Box>
                  </Scrollbars>
              : <Box m={2} textAlign='center'>Няма намерени записи</Box>
            : <LinearProgress color='secondary' sx={{height: 20, borderRadius: '4px', m: 2 }}/>
        }
      </Paper>
      <Menu
        anchorEl={addMenuAnchor.current}
        keepMounted={true}
        open={openAddMenu}
        onClose={() => setOpenAddMenu(false)}
        onClick={() => setOpenAddMenu(false)}
        PaperProps={menuPaperStyle}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={() => setShowGameDialog({ show: true, data: null })}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}><SportsHockeyIcon fontSize='small' /></ListItemIcon>Мач
        </MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={() => setShowTrainingDialog({ show: true, data: null })}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}><IceSkatingIcon fontSize='small'/></ListItemIcon>Тренировка
        </MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={() => setShowOtherDialog({ show: true, data: null })}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}><ForestIcon fontSize='small'/></ListItemIcon>Друго
        </MenuItem>
      </Menu>
      {
        showOtherDialog.show
          ? <OtherEventDialog closeFunc={setShowOtherDialog} data={showOtherDialog.data} deleteFunc={prepareDeleteEvent} editFunction={editEvent} addFunction={createEvent} />
          : null
      }
      {
        showTrainingDialog.show
          ? <Training closeFunc={setShowTrainingDialog} data={showTrainingDialog.data} deleteFunc={prepareDeleteEvent} editFunction={editEvent} addFunction={createEvent} />
          : null
      }
      {
        showGameDialog.show
          ? <Game closeFunc={setShowGameDialog} data={showGameDialog.data} deleteFunc={prepareDeleteEvent} editFunction={editEvent} addFunction={createEvent} />
          : null
      }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
    </Container>
  )
}

export default Events