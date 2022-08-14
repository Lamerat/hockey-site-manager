import React, { useContext, useEffect, useRef, useState } from 'react'
import SharedContext from '../../context/SharedContext'
import { Container, Paper, Box, Typography, Grid, IconButton, Tooltip, Stack } from '@mui/material'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import CircularProgress from '@mui/material/CircularProgress'
import { Scrollbars } from 'react-custom-scrollbars-2'
import CityRow from './CityRow'
import ArenaRow from './ArenaRow'
import TeamRow from './TeamRow'

const cityTemp = [
  { 
    "_id" :"62f77b929dbb03e5eff3587b", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
    "canEdit": false,
  },
  { 
    "_id" :"62f77b929dbb03e5eff3das587b", 
    "name" : "Велико Търново", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
    "canEdit": true,
  },
  { 
    "_id" :"62f77b929dbb03e5eff33587b", 
    "name" : "Перник", 
    "type" : "system2", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
    "canEdit": false,
  },
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
    "canEdit": false,
  },
  { 
    "_id" :"62f77b929dbb03e5efdf35816", 
    "name" : "Ледена пързалка Славия", 
    "type" : "system", 
    "city": { name: 'София' },
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
    "canEdit": true,
  },
  { 
    "_id" :"62f77b929dddbb03e5efdf35816", 
    "name" : "Някаква пързалка", 
    "type" : "dasdassd", 
    "city": { name: 'София' },
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
    "canEdit": false,
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
    "_id" : "62f77ca15f4578ea5e2fbded89", 
    "name" : "НСА", 
    "city" : { name: 'София' }, 
    "logo" : "https://lamerat.github.io/ChervenaZvezda/images/nsa.jpg", 
    "type" : "syste2m",
    "shared" : false    
  },
  { 
    "_id" : "62f77ca15f4578ea522efbed8ccs9", 
    "name" : "Торпедо", 
    "city" : { name: 'София' }, 
    "logo" : "https://lamerat.github.io/ChervenaZvezda/images/Torpedo.png", 
    "type" : "system",
    "shared" : false ,   
    "canEdit": true,
  }
]

for (let i = 0; i < 20; i++) {
  tempTeams.push({ ...tempTeams[0], _id: i })
  arenasTemp.push({ ...arenasTemp[0], _id: i })
  cityTemp.push({ ...cityTemp[0], _id: i })
}


const Shared = () => {
  const { setShared } = useContext(SharedContext)
  const firstRenderRef = useRef(true)

  const [cities, setCities] = useState(null)
  const [arenas, setArenas] = useState(null)
  const [teams, setTeams] = useState(null)


  const handlePagination = (scrollTop, height, scrollHeight) => {
    if (scrollTop + height >= scrollHeight - 20) {
      console.log('OK')
    }
  }
  
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
            <Scrollbars
              style={{height: '100vh', padding: 16, marginLeft: -16}}
              onScroll={({ target }) => handlePagination(target.scrollTop, target.getBoundingClientRect().height, target.scrollHeight)}
            >
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
            <Stack direction='row' pt={1} pb={1} pl={1.5} pr={1.5} width='calc(100% - 46px)' minHeight={20} fontFamily='CorsaGrotesk' fontWeight='bold' fontSize='14px' >
              <Box width='65%'>Име</Box>
              <Box width='35%'>Град</Box>
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
            <Stack direction='row' pt={1} pb={1} pl={1.5} pr={1.5} width='calc(100% - 46px)' minHeight={20} fontFamily='CorsaGrotesk' fontWeight='bold' fontSize='14px'>
              <Box width='65%'>Име</Box>
              <Box width='35%'>Град</Box>
            </Stack>
            <Scrollbars
              style={{height: '100vh', padding: 16, marginLeft: -16}}
              renderThumbVertical={() =><div style={{backgroundColor: mainTheme.palette.primary.light, borderRadius: 'inherit', cursor: 'pointer'}}/>}
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
    </Container>
  )
}

export default Shared