import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Stack, Badge } from '@mui/material'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { badgeProps } from './Players.styles'
import { useNavigate } from 'react-router-dom'
import { getCredentials, cleanCredentials } from '../../config/storage'
import { listPlayerRequest, createPlayerRequest, singlePlayerRequest, editPlayerRequest, deletePlayerRequest } from '../../api/player'
import { sortBox, sortLabel, rotateAngle } from '../../common/sortStyles'
import moment from 'moment'
import SharedContext from '../../context/SharedContext'
import UserContext from '../../context/UserContext'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PlayerDialog from './PlayerDialog'
import LinearProgress from '@mui/material/LinearProgress'
import PlayerRow from './PlayerRow'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import PlayerFilterMenu from './PlayerFilterMenu'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import { DEV_MODE } from '../../config/constants'


const queryDefault = { pageNumber: 1, pageSize: 20, noPagination: false, hidden: true,  hasNextPage: false, sort: { number: 1 }, search: '' }


const Players = () => {
  const { setShared } = useContext(SharedContext)
  const { user } = useContext(UserContext)

  const firstRenderRef = useRef(true)
  const firstRenderSharedRef = useRef(true)
  const filterMenuRef = useRef(null)


  const [query, setQuery] = useState(queryDefault)
  const [players, setPlayers] = useState(null)
  const [reloadList, setReloadList] = useState(false)
  const [filterBadge, setFilterBadge] = useState(true)
  const [openFilterMenu, setOpenFilterMenu] = useState(false)
  const [showPlayerDialog, setShowPlayerDialog] = useState({ show: false, data: null })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })

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
      endDate: query.endDate,
      hand: query.hand,
      position: query.position,
      minNumber: query.minNumber,
      maxNumber: query.maxNumber,
      hidden: query.hidden,
    }

    listPlayerRequest(body)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setPlayers(players => query.pageNumber === 1 ? result.payload.docs : [ ...players, ...result.payload.docs])
        setQuery(query => ({ ...query, pageNumber: result.payload.page, hasNextPage: result.payload.hasNextPage }))
        // Check for filter
        const positionFilter = () => body.position?.length > 0 && body.position?.length < 3 ? true : false
        setFilterBadge(body.startDate || body.search || query.hand || positionFilter() || body.minNumber || body.maxNumber ? false : true)
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [query.pageNumber, query.search, query.sort, query.endDate, query.startDate,
    query.position, query.minNumber, query.maxNumber, query.hand, query.searchFields, query.hidden, history, reloadList])


  const handlePagination = (scrollTop, height, scrollHeight) => {
    if (scrollTop + height < scrollHeight - 20) return
    if (query.hasNextPage) {
      setQuery({ ...query, pageNumber: query.pageNumber + 1, hasNextPage: false })
    }
  }


  const addFilter = (filters) => setQuery({ ...query, ...filters, pageNumber: 1, hasNextPage: false })


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


  const createPlayer = (body) => {
    createPlayerRequest(body)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        query.pageNumber === 1
          ? setReloadList(!reloadList)
          : setQuery({ ...query, pageNumber: 1 })
        setShowPlayerDialog({ show: false, data: null })
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const openProfile = (playerId) => {
    singlePlayerRequest(playerId)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        const data = {}
        Object.keys(result.payload).forEach(x => data[x] = { value: x === 'birthDate' ? moment(result.payload[x]).toDate() : result.payload[x], error: false })
        setShowPlayerDialog({ show: true, data })
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const editPlayer = (playerData) => {
    const { _id, ...body } = playerData

    editPlayerRequest(_id, body)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        const editedPlayer = { ...result.payload, fullName: `${result.payload.firstName} ${result.payload.lastName}` }
        const updatePlayers = players.map(x => x._id === result.payload._id ? editedPlayer : x)
        setPlayers(updatePlayers)
        setShowPlayerDialog({ show: false, data: null })
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const prepareDeletePlayer = (playerId, playerName) => {
    setConfirmDialog({ show: true, message: `Сигурни ли сте, че искате да изтриете играч "${playerName}"`, acceptFunc: () => deletePlayer(playerId) })
  }


  const deletePlayer = (playerId) => {
    deletePlayerRequest(playerId)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setShowPlayerDialog({ show: false, data: null })
        setConfirmDialog({ show: false, message: '' })
        query.hasNextPage
          ? query.pageNumber === 1 ? setReloadList(!reloadList) : setQuery({ ...query, pageNumber: 1, hasNextPage: false })
          : setPlayers(players.filter(x => x._id !== result.payload._id))
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const hidePlayer = (playerId, action) => {
    editPlayerRequest(playerId, { hidden: action === 'hide' ? true : false })
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        const editedPlayer = { ...result.payload, fullName: `${result.payload.firstName} ${result.payload.lastName}` }
        const updatePlayers = players.map(x => x._id === result.payload._id ? editedPlayer : x)
        setPlayers(updatePlayers)
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }
  
  useEffect(() => {
    if (firstRenderSharedRef.current && DEV_MODE) {
      firstRenderSharedRef.current = false
      return
    }
    setShared(shared => ({ ...shared, currentPage: 2 }))
  }, [setShared])

  if (!user || !getCredentials()) return null
  
  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Paper elevation={2} sx={{p: 2, pb: 0, maxHeight: 'calc(100vh - 130px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
          <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Играчи</Typography>
          <Box display='flex' alignItems='center' mr={-1}>
            <Tooltip title={ query.hidden ? 'Не показвай скритите' : 'Покажи всички' } arrow>
              <IconButton onClick={() => setQuery({ ...query, hidden: !query.hidden, pageNumber: 1, hasNextPage: false })}>
                { query.hidden ? <PeopleAltIcon color='secondary' /> : <PeopleAltOutlinedIcon color='secondary' /> }
              </IconButton>
            </Tooltip>
            <Tooltip title='Филтри' arrow>
              <IconButton onClick={() => setOpenFilterMenu(!openFilterMenu)} ref={filterMenuRef}>
                <Badge sx={badgeProps} color='primary' variant='dot' invisible={filterBadge}>
                  <FilterAltIcon color='secondary' />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title='Добави нов' arrow>
              <IconButton onClick={() => setShowPlayerDialog({ show: true, data: null })}>
                <LibraryAddIcon color='secondary' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Stack direction='row' pt={1} pb={1} pl={2.5} pr={1.5} minHeight={26}>
          <Box width='42%' sx={sortBox} onClick={()=> renderSort('fullName')}><Box sx={sortLabel}>Име</Box>{sortArrow('fullName')}</Box>
          <Box width='9%' sx={sortBox} onClick={()=> renderSort('number')}><Box sx={sortLabel}>Номер</Box>{sortArrow('number')}</Box>
          <Box width='10%' sx={sortBox} onClick={()=> renderSort('position')}><Box sx={sortLabel}>Пост</Box>{sortArrow('position')}</Box>
          <Box width='9%' sx={sortBox} onClick={()=> renderSort('hand')}><Box sx={sortLabel}>Хват</Box>{sortArrow('hand')}</Box>
          <Box width='11%' sx={sortBox} onClick={()=> renderSort('birthDate')}><Box sx={sortLabel}>Роден</Box>{sortArrow('birthDate')}</Box>
          <Box width='8%' sx={sortBox} onClick={()=> renderSort('height')}><Box sx={sortLabel}>Ръст</Box>{sortArrow('height')}</Box>
          <Box width='8%' sx={sortBox} onClick={()=> renderSort('weight')}><Box sx={sortLabel}>Тегло</Box>{sortArrow('weight')}</Box>
          <Box width='3%'/>
        </Stack>
        {
          players
            ? players.length
              ?  <Scrollbars
                    style={{height: '100vh', padding: 16, paddingTop: 0, marginLeft: -16}}
                    onScroll={({ target }) => handlePagination(target.scrollTop, target.getBoundingClientRect().height, target.scrollHeight)}
                  >
                    <Box p={2} pt={0}>
                      {
                        players.filter(record => !record.pinned).length
                          ? players
                              .filter(record => !record.pinned)
                              .map(x => <PlayerRow key={x._id} row={x} profileFunc={openProfile} deleteFunc={prepareDeletePlayer} hideFunc={hidePlayer} />)
                          : <Box m={2} textAlign='center'>Няма намерени записи</Box>
                      }
                    </Box>
                  </Scrollbars>
              : <Box m={2} textAlign='center'>Няма намерени записи</Box>
            : <LinearProgress color='secondary' sx={{height: 20, borderRadius: '4px', m: 2 }}/>
        }
      </Paper>
      <PlayerFilterMenu searchMenuRef={filterMenuRef} openMenu={openFilterMenu} setOpenMenu={setOpenFilterMenu} addFilterFunc={addFilter} />
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
      {
        showPlayerDialog.show
          ? <PlayerDialog data={showPlayerDialog.data} closeFunc={setShowPlayerDialog} addFunction={createPlayer} deleteFunc={prepareDeletePlayer} editFunction={editPlayer} />
          : null
      }
    </Container>
  )
}

export default Players