import React, { useContext, useEffect, useRef } from 'react'
import SharedContext from '../../context/SharedContext'
import { Container, Paper, Box, Typography, Grid, IconButton, Tooltip, Stack } from '@mui/material'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'


const Shared = () => {
  const { setShared } = useContext(SharedContext)
  const firstRenderRef = useRef(true)
  
  useEffect(() => {
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    setShared(shared => ({ ...shared, currentPage: 4 }))
  }, [setShared])

  
  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <Paper elevation={2} sx={{p: 2}}>
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
            <Paper elevation={1} sx={{ mt: 1, p: 1.5 }}>
              <Stack direction='row' alignItems='center' minHeight={20}>
                <Box width='100%' fontFamily='CorsaGrotesk' fontSize='14px'>София</Box>
              </Stack>
            </Paper>
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