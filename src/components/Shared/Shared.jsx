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


const arenasTemp = [
  { "_id" :"62f77b929dbb03e5eff35816", "name" : "Зимен дворец на спорта", "type" : "sy2stem", "city": { name: 'София' }, shared: true, "canEdit": true },
  { "_id" :"62f77b929dbb03e5edasdff35816", "name" : "Зимен дворец на спорта", "type" : "sy2stem", "city": { name: 'Велико Търново' }, shared: true, "canEdit": true },
  { "_id" :"62f77b929dbb3203e5eff35816", "name" : "Зимен дворец на спорта", "type" : "system", "city": { name: 'Ботевград' }, shared: false, "canEdit": false },
  { "_id" :"62f77b929dbb03e5ef2323f35816", "name" : "Зимен дворец на спорта", "type" : "sys2tem", "city": { name: 'София' }, shared: true, "canEdit": false },
]
const tempTeams = [
  { "_id" : "62f77ca15f4578ea5efbed89","name" : "Червена звезда","city" : { name: 'София' }, "logo" : "https://lamerat.github.io/ChervenaZvezda/images/Logo.svg", "type" : "syste2m", "shared" : true , "canEdit": true },
  { "_id" : "62f77ca15f4578ea5efbed8d","name" : "Червена звезда","city" : { name: 'София' }, "logo" : "https://lamerat.github.io/ChervenaZvezda/images/Logo.svg", "type" : "system", "shared" : true , "canEdit": false },
  { "_id" : "62f77ca15f4578ea5ef8d","name" : "Червена звезда","city" : { name: 'София' }, "logo" : "https://lamerat.github.io/ChervenaZvezda/images/Logo.svg", "type" : "dsd", "shared" : false , "canEdit": true },
  { "_id" : "62f77ca15f4578ea3232335ef8d","name" : "Червена звезда","city" : { name: 'Велико Търново' }, "logo" : "https://lamerat.github.io/ChervenaZvezda/images/Logo.svg", "type" : "dsd", "shared" : true , "canEdit": false },
  { "_id" : "62f77ca15f4578ea32f8d","name" : "Червена звезда","city" : { name: 'Велико Търново' }, "logo" : "https://lamerat.github.io/ChervenaZvezda/images/Logo.svg", "type" : "dsd", "shared" : true , "canEdit": true }
]

for (let i=0; i < 30; i++) {
  arenasTemp.push({...arenasTemp[0], _id: i})
}


const Shared = () => {
  const { setShared } = useContext(SharedContext)
  const { user } = useContext(UserContext)

  const firstRenderRef = useRef(true)

  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })
  const [cities, setCities] = useState(null)
  const [arenas, setArenas] = useState(null)
  const [teams, setTeams] = useState(null)
  const [showAddCityDialog, setShowAddCityDialog] = useState(false)
  const [showAddArenaDialog, setShowAddArenaDialog] = useState(false)
  const [showEditCityDialog, setShowEditCityDialog] = useState({ show: false, data: {} })

  const history = useNavigate()
  const newCities = []

  const authError = () => {
    cleanCredentials()
    history('/')
  }

  const handlePagination = (scrollTop, height, scrollHeight) => {
    if (scrollTop + height >= scrollHeight - 20) {
      console.log('OK')
    }
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

  const prepareDeleteCity = (cityId, name) => setConfirmDialog({ show: true, message: `Сигурни ли сте, че искате да изтриете град ${name}`, acceptFunc: () => deleteCityFunc(cityId) })

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


  useEffect(() => {
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    const authError = () => {
      cleanCredentials()
      history('/')
    }
    console.log('SHARED RENDER')

    listCities()
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setCities(result.payload.docs)
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
    
    setArenas(arenasTemp)
    setTeams(tempTeams)
    setShared(shared => ({ ...shared, currentPage: 4 }))
  }, [setShared, history])


  const createNewCity = (city) => {
    createCity(city)
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      setShowAddCityDialog(false)
      newCities.push(result.payload._id)
      setCities([result.payload, ...cities])
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }

  const createNewArena = (arena) => {
    console.log(arena)
  }

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
              onScroll={({ target }) => handlePagination(target.scrollTop, target.getBoundingClientRect().height, target.scrollHeight)}
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
            <Scrollbars style={{height: '100vh', padding: 16, marginLeft: -16}} >
              {
                arenas
                  ? arenas.length
                    ? arenas.map(x => <ArenaRow key={x._id} row={x} /> )
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
                  <IconButton onClick={(e) => 1}>
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
              // renderThumbVertical={() =><div style={{backgroundColor: mainTheme.palette.primary.light, borderRadius: 'inherit', cursor: 'pointer'}}/>}
            >
              {
                teams
                  ? teams.length
                    ? teams.map(x => <TeamRow key={x._id} row={x} /> )
                    : null
                  : <Box display='flex' alignItems='center' justifyContent='center' padding={5}><CircularProgress size={80} /></Box>
              }
            </Scrollbars>
          </Paper>
        </Grid>
      </Grid>
      { showAddCityDialog ? <AddCityDialog closeFunc={setShowAddCityDialog} actionFunc={createNewCity} /> : null }
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
      { showEditCityDialog.show ? < EditCityDialog data={showEditCityDialog.data} closeFunc={setShowEditCityDialog} actionFunc={EditCityFunc} /> : null }
      { showAddArenaDialog ? <AddArenaDialog closeFunc={setShowAddArenaDialog} actionFunc={createNewArena} /> : null }
    </Container>
  )
}

export default Shared