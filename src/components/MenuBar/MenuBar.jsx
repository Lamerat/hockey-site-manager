import React,{ useState, useContext } from 'react'
import { AppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem, Divider, ListItemIcon, ListItemText } from '@mui/material'
import StyledTab from './StyledTab'
import StyledTabs from './StyledTabs'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { menuPaperStyle } from './Styles'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import SharedContext from '../../context/SharedContext'




const MenuBar = () => {
  const {shared, setShared} = useContext(SharedContext)
  
  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)

  const handleChange = (_, newValue) => setShared({ ...shared, currentPage: newValue })
  

  return (
    <AppBar position='static' sx={{justifyContent: 'center', flexDirection: 'row'}}>
      <Toolbar sx={{ maxWidth: '1366px', width: '1366px', display: 'flex', justifyContent: 'space-between' }} >
        <Box>
          <Typography sx={{fontFamily: 'Dusha', fontSize: '1.75rem', letterSpacing: 1}}>HOCKEY SITE MANAGER</Typography>
        </Box>
        <Box height='100%'>
          <StyledTabs value={shared.currentPage} onChange={handleChange}>
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
          primary={'Simeon Mladenov'}
          secondary={'Red Star'}
          primaryTypographyProps={{sx: {fontFamily: 'CorsaGrotesk'}}}
          secondaryTypographyProps={{sx: {fontFamily: 'CorsaGrotesk'}}}
        />        
        <Divider />
        <MenuItem sx={{fontFamily: 'CorsaGrotesk'}}>
        <ListItemIcon>
          <PersonIcon fontSize='small' />
        </ListItemIcon>
          Моят профил
        </MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk'}} onClick={()=> 1}>
          <ListItemIcon>
            <LogoutIcon fontSize='small'/>
          </ListItemIcon>
            Изход
        </MenuItem>
      </Menu>
    </AppBar>
  )
}

export default MenuBar