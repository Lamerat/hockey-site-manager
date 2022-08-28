import React,{ useState, useContext } from 'react'
import { AppBar, Toolbar, IconButton, Box, Menu, MenuItem, Divider, ListItemIcon, ListItemText } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import StyledTab from './StyledTab'
import StyledTabs from './StyledTabs'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { menuPaperStyle } from './Styles'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import SharedContext from '../../context/SharedContext'
import UserContext from '../../context/UserContext'
import { getCredentials } from '../../config/storage'


const MenuBar = () => {
  const {shared, setShared} = useContext(SharedContext)
  const { user } = useContext(UserContext)
  
  const [anchorEl, setAnchorEl] = useState(null)
  const history = useNavigate()

  const open = Boolean(anchorEl)

  const changeTabIndex = (_, newValue) => setShared({ ...shared, currentPage: newValue })

  const logOutFromServer = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    history('/')
  }

  if (!user || !getCredentials()) return null

  return (
    <AppBar position='static' sx={{justifyContent: 'center', flexDirection: 'row'}}>
      <Toolbar sx={{ maxWidth: '1366px', width: '1366px', display: 'flex', justifyContent: 'space-between' }} >
        <Box>
          <img src={'../../site_logo.svg'} alt='site_logo' height='48px' style={{paddingTop: '3px'}} />
        </Box>
        <Box height='100%'>
          <StyledTabs value={shared.currentPage} onChange={changeTabIndex}>
            <StyledTab label='Новини' name='/news' />
            <StyledTab label='Събития' name='/events' />
            <StyledTab label='Играчи' name='/players' />
            <StyledTab label='Медия' name='/media' />
            <StyledTab label='Споделени' name='/shared' />
          </StyledTabs>
        </Box>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <MoreVertIcon sx={{color: 'white'}}/>
        </IconButton>
      </Toolbar>
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
        <ListItemText
          sx={{pl: 2, pr: 2 }}
          primary={user.name}
          secondary={user.team.name}
          primaryTypographyProps={{sx: {fontFamily: 'CorsaGrotesk'}}}
          secondaryTypographyProps={{sx: {fontFamily: 'CorsaGrotesk'}}}
        />        
        <Divider />
        <MenuItem sx={{fontFamily: 'CorsaGrotesk'}}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}>
            <PersonIcon fontSize='small' />
          </ListItemIcon>
            Моят профил
        </MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk'}} onClick={logOutFromServer}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}>
            <LogoutIcon fontSize='small'/>
          </ListItemIcon>
          Изход
        </MenuItem>
      </Menu>
    </AppBar>
  )
}

export default MenuBar