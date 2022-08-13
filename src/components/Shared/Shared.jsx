import React, { useContext, useEffect, useRef, useState } from 'react'
import SharedContext from '../../context/SharedContext'
import { Container, Paper, Box, Typography, Grid, IconButton, Tooltip, Stack } from '@mui/material'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import CircularProgress from '@mui/material/CircularProgress'
import { Scrollbars } from 'react-custom-scrollbars-2'


const cityTemp = [
  { 
    "_id" :"62f77b929dbb03e5eff3587b", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  }
]

const arenasTemp = [
  { 
    "_id" :"62f77b929dbb03e5eff35816", 
    "name" : "Зимен дворец на спорта", 
    "type" : "system", 
    "city": { name: 'София' },
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  }
]

const tempTeams = [
  { 
    "_id" : "62f77ca15f4578ea5efbed89", 
    "name" : "Червена звезда", 
    "city" : { name: 'София' }, 
    "logo" : "https://lamerat.github.io/ChervenaZvezda/images/Logo.svg", 
    "type" : "system",
    "shared" : false    
  },
  { 
    "_id" : "62f77ca15f4578ea5e2fbed89", 
    "name" : "НСА", 
    "city" : { name: 'София' }, 
    "logo" : "https://lamerat.github.io/ChervenaZvezda/images/nsa.jpg", 
    "type" : "system",
    "shared" : false    
  },
  { 
    "_id" : "62f77ca15f4578ea522efbed89", 
    "name" : "Торпедо", 
    "city" : { name: 'София' }, 
    "logo" : "https://lamerat.github.io/ChervenaZvezda/images/Torpedo.png", 
    "type" : "system",
    "shared" : false    
  }
]

for (let i = 0; i < 20; i++) {
  tempTeams.push({ ...tempTeams[0], _id: i })
  arenasTemp.push({ ...arenasTemp[0], _id: i })
  cityTemp.push({ ...cityTemp[0], _id: i })
}


const CityRow = ({row}) => {
  return (
    <Paper elevation={1} sx={{ mb: 0.5, mt: 0.5, ml: 2, mr: 2, p: 1.5, boxSizing: 'border-box' }}>
      <Stack direction='row' alignItems='center' minHeight={20}>
        <Box width='100%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.name}</Box>
      </Stack>
    </Paper>
  )
}

const ArenaRow = ({row}) => {
  return (
    <Paper elevation={1} sx={{ mb: 0.5, mt: 0.5, ml: 2, mr: 2, p: 1.5, boxSizing: 'border-box' }}>
      <Stack direction='row' alignItems='center' minHeight={20}>
        <Box width='65%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.name}</Box>
        <Box width='35%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.city.name}</Box>
      </Stack>
    </Paper>
  )
}

const TeamRow = ({row}) => {
  return (
    <Paper elevation={1} sx={{ mb: 0.5, mt: 0.5, ml: 2, mr: 2 }}>
      <Stack
        direction='row'
        alignItems='center'
        minHeight={20}
        sx={{ mt: 1, p: 1.5, position: 'relative', overflow: 'hidden' }}
      > 
        <Box width='65%' fontFamily='CorsaGrotesk' fontSize='14px' zIndex={2}>{row.name}</Box>
        <Box width='35%' fontFamily='CorsaGrotesk' fontSize='14px' zIndex={2}>{row.city.name}</Box>
        <Box sx={{position: 'absolute', width: '100%', height: '100%', background: `url(${row.logo})`, backgroundRepeat: 'no-repeat', backgroundSize: '200px', opacity: '10%', backgroundPosition: 'right' }}/>
      </Stack>
    </Paper>
  )
}

const Shared = () => {
  const { setShared } = useContext(SharedContext)
  const firstRenderRef = useRef(true)

  const [cities, setCities] = useState(null)
  const [arenas, setArenas] = useState(null)
  const [teams, setTeams] = useState(null)
  
  useEffect(() => {
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    setCities(cityTemp)
    setArenas(arenasTemp)
    setTeams(tempTeams)
    setShared(shared => ({ ...shared, currentPage: 4 }))
  }, [setShared])

  
  return (
    <Container sx={{maxWidth: '1366px !important', height: 'calc(100vh - 88px)', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Grid container spacing={4}>
        <Grid item xs={3} >
          <Paper elevation={2} sx={{p: 2, maxHeight: 'calc(100vh - 150px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
            <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
              <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Градове</Typography>
              <Box display='flex' alignItems='center' mr={-1}>
                <Tooltip title='Добави нов' arrow>
                  <IconButton onClick={(e) => 1}>
                    <LibraryAddIcon color='secondary' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Stack direction='row' pt={1} pb={1} pl={1.5} pr={1.5} minHeight={20} fontFamily='CorsaGrotesk' fontWeight='bold' fontSize='14px'>
              <Box width='100%'>Име</Box>
            </Stack>
            <Scrollbars style={{height: '100vh', padding: 16, marginLeft: -16, color: 'red'}}>
              {
                cities
                  ? cities.length
                    ? cities.map(x => <CityRow key={x._id} row={x} /> )
                    : null
                  : <Box display='flex' alignItems='center' justifyContent='center' padding={5}><CircularProgress size={80} /></Box>
              }
            </Scrollbars>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={2} sx={{p: 2, maxHeight: 'calc(100vh - 150px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
            <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
              <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Пързалки</Typography>
              <Box display='flex' alignItems='center' mr={-1}>
                <Tooltip title='Добави нова' arrow>
                  <IconButton onClick={(e) => 1}>
                    <LibraryAddIcon color='secondary' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Stack direction='row' pt={1} pb={1} pl={1.5} pr={1.5} minHeight={20} fontFamily='CorsaGrotesk' fontWeight='bold' fontSize='14px'>
              <Box width='65%'>Име</Box>
              <Box width='35%'>Град</Box>
            </Stack>
            <Scrollbars style={{height: '100vh', padding: 16, marginLeft: -16, color: 'red'}}>
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
        <Grid item xs={5}>
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
            <Stack direction='row' pt={1} pb={1} pl={1.5} pr={1.5} minHeight={20} fontFamily='CorsaGrotesk' fontWeight='bold' fontSize='14px'>
              <Box width='65%'>Име</Box>
              <Box width='35%'>Град</Box>
            </Stack>
            <Scrollbars style={{height: '100vh', padding: 16, marginLeft: -16}}>
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
    </Container>
  )
}

export default Shared