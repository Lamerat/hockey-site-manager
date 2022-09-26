import React, { useContext, useEffect, useRef, useState } from 'react'
import SharedContext from '../../context/SharedContext'
import UserContext from '../../context/UserContext'
import { Container, Paper, Box, Typography, Grid, IconButton, Tooltip, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import CircularProgress from '@mui/material/CircularProgress'
import { Scrollbars } from 'react-custom-scrollbars-2'
import CityRow from './CityRow'
import ArenaRow from './ArenaRow'
import TeamRow from './TeamRow'
import { listCities, createCity, deleteCity, singleCity, editCity } from '../../api/city'
import { getCredentials, cleanCredentials } from '../../config/storage'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import AddCityDialog from './AddCityDialog'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import EditCityDialog from './EditCityDialog'
import AddArenaDialog from './AddArenaDialog'
import { listArenas, createArena, deleteArena, singleArena, editArena } from '../../api/arena'
import EditArenaDialog from './EditArenaDialog'
import AddTeamDialog from './AddTeamDialog'
import { createTeam, deleteTeam, listTeams, singleTeam, editTeam } from '../../api/team'
import { DEV_MODE } from '../../config/constants'


const Shared = () => {
  const { setShared } = useContext(SharedContext)
  const { user } = useContext(UserContext)

  const firstRenderSharedRef = useRef(true)
  const firstRenderCityRef = useRef(true)
  const firstRenderArenaRef = useRef(true)
  const firstRenderTeamRef = useRef(true)

  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })
  const [cities, setCities] = useState(null)
  const [arenas, setArenas] = useState(null)
  const [teams, setTeams] = useState(null)
  const [showAddCityDialog, setShowAddCityDialog] = useState(false)
  const [showAddArenaDialog, setShowAddArenaDialog] = useState(false)
  const [showAddTeamDialog, setShowAddTeamDialog] = useState(false)
  const [showEditCityDialog, setShowEditCityDialog] = useState({ show: false, data: {} })
  const [showEditArenaDialog, setShowEditArenaDialog] = useState({ show: false, data: {} })
  const [showEditTeamDialog, setShowEditTeamDialog] = useState({ show: false, data: {} })
  const [arenaQuery, setArenaQuery] = useState({ page: 1, hasNextPage: false })
  const [cityQuery, setCityQuery] = useState({ page: 1, hasNextPage: false })
  const [teamQuery, setTeamQuery] = useState({ page: 1, hasNextPage: false })
  const [reload, setReload] = useState({ city: false, arena: false, team: false })

  const history = useNavigate()


  // Load cities
  useEffect(() => {
    if (firstRenderCityRef.current && DEV_MODE) {
      firstRenderCityRef.current = false
      return
    }

    const authError = () => {
      cleanCredentials()
      history('/')
    }

    listCities({ pageNumber: cityQuery.page, pageSize: 20 })
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setCities(cities => cityQuery.page === 1 ? result.payload.docs : [ ...cities, ...result.payload.docs])
        setCityQuery({ page: result.payload.page, hasNextPage: result.payload.hasNextPage })
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [history, cityQuery.page, reload.city])


  // Load arenas
  useEffect(() => {
    if (firstRenderArenaRef.current && DEV_MODE) {
      firstRenderArenaRef.current = false
      return
    }

    const authError = () => {
      cleanCredentials()
      history('/')
    }

    listArenas({ pageNumber: arenaQuery.page, pageSize: 20 })
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setArenas(arenas => arenaQuery.page === 1 ? result.payload.docs : [ ...arenas, ...result.payload.docs])
        setArenaQuery({ page: result.payload.page, hasNextPage: result.payload.hasNextPage })
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [history, arenaQuery.page, reload.arena])


  // Load teams
  useEffect(() => {
    if (firstRenderTeamRef.current && DEV_MODE) {
      firstRenderTeamRef.current = false
      return
    }

    const authError = () => {
      cleanCredentials()
      history('/')
    }

    listTeams({ pageNumber: teamQuery.page, pageSize: 20 })
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setTeams(teams => teamQuery.page === 1 ? result.payload.docs : [ ...teams, ...result.payload.docs])
        setTeamQuery({ page: result.payload.page, hasNextPage: result.payload.hasNextPage })
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [history, teamQuery.page, reload.team])


  const handlePagination = (scrollTop, height, scrollHeight, column) => {
    if (scrollTop + height < scrollHeight - 20) return
    
    if (column === 'city' && cityQuery.hasNextPage) {
      setCityQuery({ page: cityQuery.page + 1 })
    } else if (column === 'arena' && arenaQuery.hasNextPage) {
      setArenaQuery({ page: arenaQuery.page + 1 })
    } else if (column === 'team' && teamQuery.hasNextPage) {
      setTeamQuery({ page: teamQuery.page + 1 })
    }
  }


  const authError = () => {
    cleanCredentials()
    history('/')
  }


  const deleteCityFunc = (cityId) => {
    setConfirmDialog({ show: false, message: '' })
    deleteCity(cityId)
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      setCities(cities.filter(x => x._id !== result.payload._id))
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const deleteArenaFunc = (arenaId) => {
    setConfirmDialog({ show: false, message: '' })
    deleteArena(arenaId)
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      setArenas(arenas.filter(x => x._id !== result.payload._id))
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const deleteTeamFunc = (arenaId) => {
    setConfirmDialog({ show: false, message: '' })
    deleteTeam(arenaId)
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      setTeams(teams.filter(x => x._id !== result.payload._id))
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const prepareDeleteCity = (cityId, name) => setConfirmDialog({ show: true, message: `Сигурни ли сте, че искате да изтриете град ${name}`, acceptFunc: () => deleteCityFunc(cityId) })
  const prepareDeleteArena = (arenaId, name) => setConfirmDialog({ show: true, message: `Сигурни ли сте, че искате да изтриете пързалка ${name}`, acceptFunc: () => deleteArenaFunc(arenaId) })
  const prepareDeleteTeam = (teamId, name, city) => {
    setConfirmDialog({ show: true, message: `Сигурни ли сте, че искате да изтриете отбор ${name} от град ${city}`, acceptFunc: () => deleteTeamFunc(teamId) })
  }


  const prepareEditCity = (cityId) => {
    singleCity(cityId)
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      setShowEditCityDialog({ show: true, data: result.payload })
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const prepareEditArena = (arenaId) => {
    singleArena(arenaId)
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      setShowEditArenaDialog({ show: true, data: result.payload })
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const prepareEditTeam = (teamId) => {
    singleTeam(teamId)
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      setShowEditTeamDialog({ show: true, data: result.payload })
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const EditCityFunc = (cityId, payload) => {
    editCity(cityId, payload)
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      setShowEditCityDialog({ show: false, data: {} })
      setCities(cities.map(x => x._id === result.payload._id ? result.payload : x))
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const EditArenaFunc = (arenaId, payload) => {
    editArena(arenaId, payload)
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      setShowEditArenaDialog({ show: false, data: {} })
      setArenas(arenas.map(x => x._id === result.payload._id ? result.payload : x))
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const EditTeamFunc = (teamId, payload) => {
    editTeam(teamId, payload)
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      setShowEditTeamDialog({ show: false, data: {} })
      setTeams(teams.map(x => x._id === result.payload._id ? result.payload : x))
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const createNewCity = (city) => {
    createCity(city)
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      setShowAddCityDialog(false)
      cityQuery.page === 1
        ? setReload({ ...reload, city: !reload.city })
        : setCityQuery({ page: 1 })
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const createNewArena = (arena) => {
    createArena(arena)
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      setShowAddArenaDialog(false)
      arenaQuery.page === 1
        ? setReload({ ...reload, arena: !reload.arena })
        : setArenaQuery({ page: 1 })
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const createNewTeam = (team) => {
    createTeam(team)
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      setShowAddTeamDialog(false)
      teamQuery.page === 1
        ? setReload({ ...reload, team: !reload.team })
        : setTeamQuery({ page: 1 })
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  useEffect(() => {
    if (firstRenderSharedRef.current && DEV_MODE) {
      firstRenderSharedRef.current = false
      return
    }
    setShared(shared => ({ ...shared, currentPage: 6 }))
  }, [setShared])


  if (!user || !getCredentials()) return null

  return (
    <Container sx={{maxWidth: '1366px !important', height: 'calc(100vh - 88px)', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Grid container spacing={4}>
        <Grid item xs={3} >
          <Paper elevation={2} sx={{p: 2, maxHeight: 'calc(100vh - 150px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
            <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
              <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Градове</Typography>
              <Box display='flex' alignItems='center' mr={-1}>
                <Tooltip title='Добави нов' arrow>
                  <IconButton onClick={() => setShowAddCityDialog(true)}>
                    <LibraryAddIcon color='secondary' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Stack direction='row' pt={1} pb={1} pl={1.5} pr={1.5} minHeight={20} fontFamily='CorsaGrotesk' fontWeight='bold' fontSize='14px'>
              <Box width='100%'>Име</Box>
            </Stack>
            <Scrollbars
              style={{height: '100vh', padding: 16, marginLeft: -16}}
              onScroll={({ target }) => handlePagination(target.scrollTop, target.getBoundingClientRect().height, target.scrollHeight, 'city')}
            >
              {
                cities
                  ? cities.length
                    ? cities.map(x => <CityRow key={x._id} row={x} editFunction={prepareEditCity} deleteFunction={prepareDeleteCity} /> )
                    : null
                  : <Box display='flex' alignItems='center' justifyContent='center' padding={5}><CircularProgress size={80} /></Box>
              }
            </Scrollbars>
          </Paper>
        </Grid>
        <Grid item xs={4.5}>
          <Paper elevation={2} sx={{p: 2, maxHeight: 'calc(100vh - 150px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
            <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
              <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Пързалки</Typography>
              <Box display='flex' alignItems='center' mr={-1}>
                <Tooltip title='Добави нова' arrow>
                  <IconButton onClick={() => setShowAddArenaDialog(true)}>
                    <LibraryAddIcon color='secondary' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Stack direction='row' pt={1} pb={1} pl={1.5} width='calc(100% - 80px)' minHeight={20} fontFamily='CorsaGrotesk' fontWeight='bold' fontSize='14px' >
              <Box width='60%'>Име</Box>
              <Box width='40%'>Град</Box>
            </Stack>
            <Scrollbars
              style={{height: '100vh', padding: 16, marginLeft: -16}}
              onScroll={({ target }) => handlePagination(target.scrollTop, target.getBoundingClientRect().height, target.scrollHeight, 'arena')}
            >
              {
                arenas
                  ? arenas.length
                    ? arenas.map(x => <ArenaRow key={x._id} row={x} editFunction={prepareEditArena} deleteFunction={prepareDeleteArena} /> )
                    : null
                  : <Box display='flex' alignItems='center' justifyContent='center' padding={5}><CircularProgress size={80} /></Box>
              }
            </Scrollbars>
          </Paper>
        </Grid>
        <Grid item xs={4.5}>
          <Paper elevation={2} sx={{p: 2, maxHeight: 'calc(100vh - 150px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
            <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
              <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Отбори</Typography>
              <Box display='flex' alignItems='center' mr={-1}>
                <Tooltip title='Добави нов' arrow>
                  <IconButton onClick={() => setShowAddTeamDialog(true)}>
                    <LibraryAddIcon color='secondary' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Stack direction='row' pt={1} pb={1} pl={1.5} width='calc(100% - 80px)' minHeight={20} fontFamily='CorsaGrotesk' fontWeight='bold' fontSize='14px' >
              <Box width='60%'>Име</Box>
              <Box width='40%'>Град</Box>
            </Stack>
            <Scrollbars
              style={{height: '100vh', padding: 16, marginLeft: -16}}
              onScroll={({ target }) => handlePagination(target.scrollTop, target.getBoundingClientRect().height, target.scrollHeight, 'team')}
              // renderThumbVertical={() =><div style={{backgroundColor: mainTheme.palette.primary.light, borderRadius: 'inherit', cursor: 'pointer'}}/>}
            >
              {
                teams
                  ? teams.length
                    ? teams.map(x => <TeamRow key={x._id} row={x} editFunction={prepareEditTeam}  deleteFunction={prepareDeleteTeam} /> )
                    : null
                  : <Box display='flex' alignItems='center' justifyContent='center' padding={5}><CircularProgress size={80} /></Box>
              }
            </Scrollbars>
          </Paper>
        </Grid>
      </Grid>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
      { showAddCityDialog ? <AddCityDialog closeFunc={setShowAddCityDialog} actionFunc={createNewCity} /> : null }
      { showAddArenaDialog ? <AddArenaDialog closeFunc={setShowAddArenaDialog} actionFunc={createNewArena} /> : null }
      { showAddTeamDialog ? <AddTeamDialog closeFunc={setShowAddTeamDialog} actionFunc={createNewTeam} editMode={false} /> : null }
      { showEditCityDialog.show ? < EditCityDialog data={showEditCityDialog.data} closeFunc={setShowEditCityDialog} actionFunc={EditCityFunc} /> : null }
      { showEditArenaDialog.show ? <EditArenaDialog data={showEditArenaDialog.data} closeFunc={setShowEditArenaDialog} actionFunc={EditArenaFunc} /> : null }
      { showEditTeamDialog.show ? <AddTeamDialog data={showEditTeamDialog.data} editMode={true} closeFunc={setShowEditTeamDialog} actionFunc={EditTeamFunc} /> : null }
    </Container>
  )
}

export default Shared