import React, { useContext, useEffect, useRef, useState } from 'react'
import SharedContext from '../../context/SharedContext'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Stack, Menu, MenuItem, ListItemIcon } from '@mui/material'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { sortBox, sortLabel, rotateAngle } from '../../common/sortStyles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import DeleteIcon from '@mui/icons-material/Delete'
import { menuPaperStyle } from './Players.styles'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PlayerDialog from './PlayerDialog'

const Players = () => {
  const { setShared } = useContext(SharedContext)
  const firstRenderRef = useRef(true)
  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)


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
    setShared(shared => ({ ...shared, currentPage: 2 }))
  }, [setShared])

  
  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Paper elevation={2} sx={{p: 2}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
          <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Играчи</Typography>
          <Box display='flex' alignItems='center' mr={-1}>
            <Tooltip title='Добави нов' arrow>
              <IconButton onClick={(e) => 1}>
                <LibraryAddIcon color='secondary' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Stack direction='row' pt={1} pb={1} pl={2.5} pr={1.5} minHeight={26}>
          <Box width='42%' sx={sortBox} onClick={()=> renderSort('currentLevel')}><Box sx={sortLabel}>Име</Box>{sortArrow('currentLevel')}</Box>
          <Box width='9%' sx={sortBox} onClick={()=> renderSort('finalScore')}><Box sx={sortLabel}>Номер</Box>{sortArrow('finalScore')}</Box>
          <Box width='10%' sx={sortBox} onClick={()=> renderSort('endReason')}><Box sx={sortLabel}>Пост</Box>{sortArrow('endReason')}</Box>
          <Box width='9%' sx={sortBox} onClick={()=> renderSort('createdAt')}><Box sx={sortLabel}>Хват</Box>{sortArrow('createdAt')}</Box>
          <Box width='11%' sx={sortBox} onClick={()=> renderSort('endedAt')}><Box sx={sortLabel}>Роден</Box>{sortArrow('endedAt')}</Box>
          <Box width='8%' sx={sortBox} onClick={()=> renderSort('endedAt')}><Box sx={sortLabel}>Ръст</Box>{sortArrow('endedAt')}</Box>
          <Box width='8%' sx={sortBox} onClick={()=> renderSort('endedAt')}><Box sx={sortLabel}>Тегло</Box>{sortArrow('endedAt')}</Box>
          <Box width='3%'/>
        </Stack>
        <Paper elevation={1} sx={{p: 1.5, mt: 1, borderLeft: '8px solid', borderColor: mainTheme.palette.secondary.main}}>
          <Stack direction='row' alignItems='center' minHeight={28}>
            <Box width='42%' fontFamily='CorsaGrotesk' fontSize='14px'>Симеон Младенов</Box>
            <Box width='9%' fontFamily='CorsaGrotesk' fontSize='14px'>13</Box>
            <Box width='10%' fontFamily='CorsaGrotesk' fontSize='14px'>Защитник</Box>
            <Box width='9%' fontFamily='CorsaGrotesk' fontSize='14px'>десен</Box>
            <Box width='11%' fontFamily='CorsaGrotesk' fontSize='14px'>01-04-1980</Box>
            <Box width='8%' fontFamily='CorsaGrotesk' fontSize='14px'>180</Box>
            <Box width='8%' fontFamily='CorsaGrotesk' fontSize='14px'>100</Box>
            <Box width='3%' display='flex' alignItems='center' justifyContent='right'>
              <IconButton size='small' onClick={(e) => setAnchorEl(e.currentTarget)}><MoreVertIcon fontSize='18px' color='secondary' /></IconButton>
            </Box>
          </Stack>
        </Paper>
        <Paper elevation={1} sx={{p: 1.5, mt: 1, borderLeft: '8px solid', borderColor: 'red'}}>
          <Stack direction='row' alignItems='center' minHeight={28}>
            <Box width='42%' fontFamily='CorsaGrotesk' fontSize='14px'>Симеон Младенов</Box>
            <Box width='9%' fontFamily='CorsaGrotesk' fontSize='14px'>13</Box>
            <Box width='10%' fontFamily='CorsaGrotesk' fontSize='14px'>Защитник</Box>
            <Box width='9%' fontFamily='CorsaGrotesk' fontSize='14px'>десен</Box>
            <Box width='11%' fontFamily='CorsaGrotesk' fontSize='14px'>01-04-1980</Box>
            <Box width='8%' fontFamily='CorsaGrotesk' fontSize='14px'>180</Box>
            <Box width='8%' fontFamily='CorsaGrotesk' fontSize='14px'>100</Box>
            <Box width='3%' display='flex' alignItems='center' justifyContent='right'>
              <IconButton size='small' onClick={(e) => setAnchorEl(e.currentTarget)}><MoreVertIcon fontSize='18px' color='secondary' /></IconButton>
            </Box>
          </Stack>
        </Paper>
      </Paper>
      <Menu
        anchorEl={anchorEl}
        keepMounted={true}
        open={open}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        PaperProps={menuPaperStyle}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{fontFamily: 'CorsaGrotesk', fontSize: '14px'}}>
        <ListItemIcon>
          <VisibilityOffIcon fontSize='small' color='primary' />
        </ListItemIcon>
          Скрий
        </MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> 1}>
          <ListItemIcon>
            <DeleteIcon fontSize='small' color='primary'/>
          </ListItemIcon>
            Изтрий
        </MenuItem>
      </Menu>
      <PlayerDialog editMode={false} />
    </Container>
  )
}

export default Players