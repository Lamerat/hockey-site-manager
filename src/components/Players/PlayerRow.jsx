import React, { useRef, useState } from 'react'
import { Paper, Box, IconButton, Stack, Menu, MenuItem, ListItemIcon } from '@mui/material'
import { menuPaperStyleSmall } from './Players.styles'
import mainTheme from '../../theme/MainTheme'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { handTranslation, positionTranslation } from '../../config/constants'
import { formatDate } from '../../common/help-functions'

const PlayerRow = ({row}) => {
  const menuAnchor = useRef(null)
  const [openMenu, setOpenMenu] = useState(false)

  return (
    <Paper elevation={1} sx={{p: 1.5, mt: 1, borderLeft: '8px solid', borderColor: row.hidden ? 'red' : mainTheme.palette.secondary.main}}>
      <Stack direction='row' alignItems='center' minHeight={28}>
        <Box width='42%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.fullName}</Box>
        <Box width='9%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.number}</Box>
        <Box width='10%' fontFamily='CorsaGrotesk' fontSize='14px'>{positionTranslation[row.position]}</Box>
        <Box width='9%' fontFamily='CorsaGrotesk' fontSize='14px'>{handTranslation[row.hand]}</Box>
        <Box width='11%' fontFamily='CorsaGrotesk' fontSize='14px'>{formatDate(row.birthDate)}</Box>
        <Box width='8%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.height}</Box>
        <Box width='8%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.weight}</Box>
        <Box width='3%' display='flex' alignItems='center' justifyContent='right'>
          <IconButton size='small' ref={menuAnchor} onClick={(e) => setOpenMenu(!openMenu)}><MoreVertIcon fontSize='18px' color='secondary' /></IconButton>
        </Box>
      </Stack>
      <Menu
        anchorEl={menuAnchor.current}
        keepMounted={true}
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        onClick={() => setOpenMenu(false)}
        PaperProps={menuPaperStyleSmall}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{fontFamily: 'CorsaGrotesk', fontSize: '14px'}} onClick={() => 1}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}>
            { row.hidden ? <VisibilityIcon fontSize='small' color='primary' /> : <VisibilityOffIcon fontSize='small' color='primary' /> }
          </ListItemIcon>
          { row.hidden ? 'Покажи' : 'Скрий' }
        </MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={() => 1}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}>
            <DeleteIcon fontSize='small' color='error'/>
          </ListItemIcon>
          Изтрий
        </MenuItem>
      </Menu>
    </Paper>
  )
}


export default PlayerRow