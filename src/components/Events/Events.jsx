import React, { useContext, useEffect, useRef } from 'react'
import SharedContext from '../../context/SharedContext'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Stack } from '@mui/material'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'

import { sortBox, sortLabel, rotateAngle } from '../../common/sortStyles'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'



const Events = () => {
  const { setShared } = useContext(SharedContext)
  const firstRenderRef = useRef(true)


  const renderSort = (field) => {

  }

  const sortArrow = (field) => {
    // if (!(field in query.sort)) return null
    // return query.sort[field] === 1 ? <KeyboardArrowUpIcon color='primary' sx={rotateAngle(true)}/> : <KeyboardArrowDownIcon color='primary' sx={rotateAngle(false)}/>
    return <KeyboardArrowUpIcon color='primary' sx={rotateAngle(true)}/>
  }
  
  useEffect(() => {
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    setShared(shared => ({ ...shared, currentPage: 1 }))
  }, [setShared])

  
  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Paper elevation={2} sx={{p: 2}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
          <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Събития</Typography>
          <Box display='flex' alignItems='center' mr={-1}>
            <Tooltip title='Добави нов' arrow>
              <IconButton onClick={(e) => 1}>
                <LibraryAddIcon color='secondary' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Stack direction='row' pt={1} pb={1} pl={1.5} pr={1.5} minHeight={26}>
          <Box width='9%' sx={sortBox} onClick={()=> renderSort('name')}><Box sx={sortLabel}>Дата</Box>{sortArrow('name')}</Box>
          <Box width='9%' sx={sortBox} onClick={()=> renderSort('name')}><Box sx={sortLabel}>Тип</Box>{sortArrow('name')}</Box>
          <Box width='12%' sx={sortBox} onClick={()=> renderSort('name')}><Box sx={sortLabel}>Град</Box>{sortArrow('name')}</Box>
          <Box width='18%' sx={sortBox} onClick={()=> renderSort('name')}><Box sx={sortLabel}>Пързалка</Box>{sortArrow('name')}</Box>
          <Box width='13%' sx={sortBox} onClick={()=> renderSort('name')}><Box sx={sortLabel}>Домакин</Box>{sortArrow('name')}</Box>
          <Box width='13%' sx={sortBox} onClick={()=> renderSort('name')}><Box sx={sortLabel}>Гост</Box>{sortArrow('name')}</Box>
          <Box width='12%' sx={sortBox} onClick={()=> renderSort('name')}><Box sx={sortLabel}>Резултат</Box>{sortArrow('name')}</Box>
          <Box width='14%' sx={sortBox} onClick={()=> renderSort('name')}><Box sx={sortLabel}>Добавено от</Box>{sortArrow('name')}</Box>
          
        </Stack>
        <Paper elevation={1} sx={{p: 1.5, mt: 1}}>
          <Stack direction='row' alignItems='center' minHeight={28}>
            <Box width='9%' fontFamily='CorsaGrotesk' fontSize='14px'>02-10-2022</Box>
            <Box width='9%' fontFamily='CorsaGrotesk' fontSize='14px'>Тренировка</Box>
            <Box width='12%' fontFamily='CorsaGrotesk' fontSize='14px'>София</Box>
            <Box width='18%' fontFamily='CorsaGrotesk' fontSize='14px'>Зимен Дворец на спорта</Box>
            <Box width='13%' fontFamily='CorsaGrotesk' fontSize='14px'>Червена звезда</Box>
            <Box width='13%' fontFamily='CorsaGrotesk' fontSize='14px'>Ледени Дяволи</Box>
            <Box width='12%' fontFamily='CorsaGrotesk' fontSize='14px'>8 : 3</Box>
            <Box width='14%' fontFamily='CorsaGrotesk' fontSize='14px'>Симеон Младенов</Box>
          </Stack>
        </Paper>
        <Paper elevation={1} sx={{p: 1.5, mt: 1}}>
          <Stack direction='row' alignItems='center' minHeight={28}>
            <Box width='9%' fontFamily='CorsaGrotesk' fontSize='14px'>02-10-2022</Box>
            <Box width='9%' fontFamily='CorsaGrotesk' fontSize='14px'>Мач</Box>
            <Box width='12%' fontFamily='CorsaGrotesk' fontSize='14px'>София</Box>
            <Box width='18%' fontFamily='CorsaGrotesk' fontSize='14px'>Зимен Дворец на спорта</Box>
            <Box width='13%' fontFamily='CorsaGrotesk' fontSize='14px'>Червена звезда</Box>
            <Box width='13%' fontFamily='CorsaGrotesk' fontSize='14px'>Ледени Дяволи</Box>
            <Box width='12%' fontFamily='CorsaGrotesk' fontSize='14px'>8 : 3</Box>
            <Box width='14%' fontFamily='CorsaGrotesk' fontSize='14px'>Симеон Младенов</Box>
          </Stack>
        </Paper>
      </Paper>
    </Container>
  )
}

export default Events