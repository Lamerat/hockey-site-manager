import React, { useContext, useEffect, useRef, useState } from 'react'
import SharedContext from '../../context/SharedContext'
import { Container, Paper, Box, Typography, Grid, IconButton, Tooltip, Stack } from '@mui/material'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import CircularProgress from '@mui/material/CircularProgress'


const cityTemp = [
  { 
    "_id" :"62f77b929dbb03e5eff3587b", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
  { 
    "_id" :"62f77b929dbb03e5eff35872", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
  { 
    "_id" :"62f77b929dbb03e5eff35873", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
  { 
    "_id" :"62f77b929dbb03e5eff35874", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
  { 
    "_id" :"62f77b929dbb03e5eff35875", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
  { 
    "_id" :"62f77b929dbb03e5eff35876", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
  { 
    "_id" :"62f77b929dbb03e5eff35877", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
  { 
    "_id" :"62f77b929dbb03e5eff35878", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
  { 
    "_id" :"62f77b929dbb03e5eff35879", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
  { 
    "_id" :"62f77b929dbb03e5eff35810", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
  { 
    "_id" :"62f77b929dbb03e5eff35811", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
  { 
    "_id" :"62f77b929dbb03e5eff35812", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
  { 
    "_id" :"62f77b929dbb03e5eff35813", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
  { 
    "_id" :"62f77b929dbb03e5eff35814", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
  { 
    "_id" :"62f77b929dbb03e5eff35815", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
  { 
    "_id" :"62f77b929dbb03e5eff35816", 
    "name" : "София", 
    "type" : "system", 
    "shared" : false, 
    "createdAt" : "2022-08-13T10:23:14.814+0000", 
    "updatedAt" : "2022-08-13T10:23:14.814+0000", 
    "createdBy" : "62f774dfe4fbb6c1f9839b73",
  },
]

const CityRow = ({row}) => {
  return (
    <Paper elevation={1} sx={{ mt: 1, p: 1.5, boxSizing: 'border-box' }}>
      <Stack direction='row' alignItems='center' minHeight={20}>
        <Box width='100%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.name}</Box>
      </Stack>
    </Paper>
  )
}


const Shared = () => {
  const { setShared } = useContext(SharedContext)
  const firstRenderRef = useRef(true)

  const [cities, setCities] = useState(null)
  
  useEffect(() => {
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    setCities(cityTemp)
    setShared(shared => ({ ...shared, currentPage: 4 }))
  }, [setShared])

  
  return (
    <Container sx={{maxWidth: '1366px !important', border: '1px solid black', overflow: 'hidden', height: 'calc(100% -100px)', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Grid container spacing={4}>
        <Grid item xs={3}>
          

          <Paper elevation={2} sx={{p: 2, height: '85%', boxSizing: 'border-box', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
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
            <Box sx={{overflowY: 'auto', maxHeight:'100%', boxSizing: 'border-box', mr: 0.2, p: 0.5}}>
              {
                cities
                  ? cities.length
                    ? cities.map(x => <CityRow key={x._id} row={x} /> )
                    : null
                  : <CircularProgress />
              }
            </Box>
          </Paper>


        </Grid>
        <Grid item xs={4}>
          <Paper elevation={2} sx={{p: 2}}>
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
            <Paper elevation={1} sx={{ mt: 1, p: 1.5 }}>
              <Stack direction='row' alignItems='center' minHeight={20}>
                <Box width='65%' fontFamily='CorsaGrotesk' fontSize='14px'>Зимен дворец на спорта</Box>
                <Box width='35%' fontFamily='CorsaGrotesk' fontSize='14px'>Велико Търново</Box>
              </Stack>
            </Paper>
          </Paper>
        </Grid>
        <Grid item xs={5}>
          <Paper elevation={2} sx={{p: 2}}>
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
            <Paper elevation={1}>
              <Stack
                direction='row'
                alignItems='center'
                minHeight={20}
                sx={{ mt: 1, p: 1.5, position: 'relative' }}
              > 
                <Box sx={{position: 'absolute', width: '100%', height: '100%', background: 'url(./rs.svg)', backgroundRepeat: 'no-repeat', opacity: '10%', backgroundPosition: 'right'}}/>
                <Box width='65%' fontFamily='CorsaGrotesk' fontSize='14px'>Червена Звезда</Box>
                <Box width='35%' fontFamily='CorsaGrotesk' fontSize='14px'>София</Box>
              </Stack>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Shared