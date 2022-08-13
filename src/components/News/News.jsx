import React, { useContext, useEffect, useRef, useState } from 'react'
import SharedContext from '../../context/SharedContext'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Stack, Menu, MenuItem, ListItemIcon } from '@mui/material'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { menuPaperStyle } from './News.styles'
import { sortBox, sortLabel, rotateAngle } from '../../common/sortStyles'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import PushPinIcon from '@mui/icons-material/PushPin'


const News = () => {
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
    setShared(shared => ({ ...shared, currentPage: 0 }))
  }, [setShared])

  
  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Paper elevation={2} sx={{p: 2}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
          <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Новини</Typography>
          <Box display='flex' alignItems='center' mr={-1}>
            <Tooltip title='Добави нов' arrow>
              <IconButton onClick={(e) => 1}>
                <LibraryAddIcon color='secondary' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Stack direction='row' pt={1} pb={1} pl={1.5} pr={1.5} minHeight={26}>
          <Box width='55%' sx={sortBox} onClick={()=> renderSort('name')}><Box sx={sortLabel}>Заглавие</Box>{sortArrow('name')}</Box>
          <Box width='10%' sx={sortBox} onClick={()=> renderSort('name')}><Box sx={sortLabel}>Снимки</Box>{sortArrow('name')}</Box>
          <Box width='15%' sx={sortBox} onClick={()=> renderSort('name')}><Box sx={sortLabel}>Дата</Box>{sortArrow('name')}</Box>
          <Box width='15%' sx={sortBox} onClick={()=> renderSort('name')}><Box sx={sortLabel}>Добавена от</Box>{sortArrow('name')}</Box>
          <Box width='5%'/>
        </Stack>
        <Paper elevation={1} sx={{p: 1.5, mt: 1}}>
          <Stack direction='row' alignItems='center' minHeight={28}>
            <Box width='55%' fontFamily='CorsaGrotesk' fontSize='14px'>Някакво заглавие</Box>
            <Box width='10%' fontFamily='CorsaGrotesk' fontSize='14px'>3</Box>
            <Box width='15%' fontFamily='CorsaGrotesk' fontSize='14px'>02-10-2022</Box>
            <Box width='15%' fontFamily='CorsaGrotesk' fontSize='14px'>Симеон Младенов</Box>
            <Box width='5%' display='flex' alignItems='center' justifyContent='right'>
              <IconButton size='small' onClick={(e) => setAnchorEl(e.currentTarget)}><MoreVertIcon fontSize='18px' color='secondary' /></IconButton>
            </Box>
          </Stack>
        </Paper>
        <Paper elevation={1} sx={{p: 1.5, mt: 1}}>
          <Stack direction='row' alignItems='center' minHeight={28}>
            <Box width='55%' fontFamily='CorsaGrotesk' fontSize='14px'>Някакво заглавие</Box>
            <Box width='10%' fontFamily='CorsaGrotesk' fontSize='14px'>3</Box>
            <Box width='15%' fontFamily='CorsaGrotesk' fontSize='14px'>02-10-2022</Box>
            <Box width='15%' fontFamily='CorsaGrotesk' fontSize='14px'>Симеон Младенов</Box>
            <Box width='5%' display='flex' alignItems='center' justifyContent='right'>
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
          <PushPinIcon fontSize='small' color='primary' />
        </ListItemIcon>
          Закачи
        </MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> 1}>
          <ListItemIcon>
            <DeleteIcon fontSize='small' color='primary'/>
          </ListItemIcon>
            Изтрий
        </MenuItem>
      </Menu>
    </Container>
  )
}

export default News