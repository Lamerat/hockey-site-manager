import React, { useContext, useEffect, useRef, useState } from 'react'
import SharedContext from '../../context/SharedContext'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Grid, ListItemIcon, CardMedia, Menu, MenuItem } from '@mui/material'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import FolderIcon from '@mui/icons-material/Folder'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual'
import PhotoSizeSelectLargeIcon from '@mui/icons-material/PhotoSizeSelectLarge'
import PhotoSizeSelectSmallIcon from '@mui/icons-material/PhotoSizeSelectSmall'
import { menuPaperStyle, menuPaperStyleSmall } from './Media.styles'
import DeleteIcon from '@mui/icons-material/Delete'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import ShareIcon from '@mui/icons-material/Share'
import EditIcon from '@mui/icons-material/Edit'
import LockIcon from '@mui/icons-material/Lock'
import CircularProgress from '@mui/material/CircularProgress'


const PhotoComponent = ({row, imageSize}) => {
  const anchor = useRef(null)
  const [openMenu, setOpenMenu] = useState(false)
  return (
    <Grid item xs={imageSize.gridSpacing}>
      <Paper elevation={2} sx={{p: 1, backgroundColor: mainTheme.palette.primary.superLight}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' mb={1}>
          <Typography fontFamily='CorsaGrotesk' variant='caption'>{row.caption}</Typography>
          <Box display='flex' alignItems='center' mr={-0.5} >
            <IconButton size='small' onClick={() => setOpenMenu(!openMenu)} ref={anchor}>
              <MoreVertIcon fontSize='small' />
            </IconButton>
          </Box>
        </Box>
        <CardMedia component='img' height={imageSize.height} image={row.address} sx={{borderRadius: 1}} />
      </Paper>
      <Menu
        anchorEl={anchor.current}
        onClose={() => setOpenMenu(false)}
        onClick={() => setOpenMenu(false)}
        keepMounted={true}
        open={openMenu}
        PaperProps={menuPaperStyleSmall}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> 1} >
          <ListItemIcon><EditIcon fontSize='small' color='primary'/></ListItemIcon>Промени име</MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> 1} >
          <ListItemIcon><DriveFileMoveIcon fontSize='small' color='primary'/></ListItemIcon>Премести</MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> 1}>
          <ListItemIcon><ShareIcon fontSize='small' color='primary'/></ListItemIcon>Сподели</MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> 1}>
          <ListItemIcon><DeleteIcon fontSize='small' color='error'/></ListItemIcon>Изтрий</MenuItem>
      </Menu>
    </Grid>
  )
}


const FolderComponent = ({row, currentFolder, setCurrentFolder}) => {
  const anchor = useRef(null)
  const [openMenu, setOpenMenu] = useState(false)
  const [selected, setSelected] = useState(false)
  return (
    <Box
      display='flex'
      minHeight={40}
      justifyContent='space-between'
      sx={{cursor: 'pointer', ml: -2, pl: 2, mr: -2, pr: 2, backgroundColor: selected ? mainTheme.palette.secondary.superLight : 'white'}}
      onMouseEnter={() => setSelected(true)}
      onMouseLeave={() => setSelected(false)}
    >
      <Box display='flex' alignItems='center' onClick={() => setCurrentFolder(row._id)}>
        <Box display='flex' alignItems='center' position='relative'>
          {
            currentFolder === row._id
              ? <FolderOpenIcon color='secondary' sx={{position: 'relative'}} />
              : <FolderIcon color='secondary' sx={{position: 'relative'}} />
          }
          { row.locked ? <LockIcon color='primary' fontSize='10px' sx={{position: 'absolute', top: -3, left: 12}} /> : null }          
        </Box>
        <Typography variant='body2' fontFamily='CorsaGrotesk' ml={1}>{ row.name.length > 22 ? `${row.name.slice(0, 22)}...` : row.name }</Typography>
      </Box>
      <Box display='flex' alignItems='center'>
        <IconButton size='small' ref={anchor} onClick={() => setOpenMenu(!openMenu)} disabled={row.locked}><MoreVertIcon fontSize='small' /></IconButton>
      </Box>
      <Menu
        anchorEl={anchor.current}
        onClose={() => setOpenMenu(false)}
        onClick={() => setOpenMenu(false)}
        keepMounted={true}
        open={openMenu}
        PaperProps={menuPaperStyleSmall}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> 1} >
          <ListItemIcon><EditIcon fontSize='small' color='primary'/></ListItemIcon>Промени име</MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> 1}>
          <ListItemIcon><DeleteIcon fontSize='small' color='error'/></ListItemIcon>Изтрий</MenuItem>
      </Menu>
    </Box>
  )
}


const tempArray = [
  { _id: 1, address: './temp1.jpg', caption: 'Няма описание' },
  { _id: 2, address: './temp2.jpg', caption: 'Няма описание' },
  { _id: 3, address: './temp3.jpg', caption: 'Няма описание' },
  { _id: 4, address: './temp1.jpg', caption: 'Няма описание' },
  { _id: 5, address: './temp2.jpg', caption: 'Няма описание' },
  { _id: 6, address: './temp3.jpg', caption: 'Няма описание' },
]

const tempFolders = [
  { _id: 1, name: 'Новини', locked: true },
  { _id: 2, name: 'Някакво заглавие на папка което е дълго', locked: false },
  { _id: 3, name: 'Някакво заглавие', locked: false },
  { _id: 4, name: 'Някакво заглавие', locked: false },
  { _id: 5, name: '2020-02-10 Снимки', locked: false },
  { _id: 6, name: 'Нещо си там', locked: false },
]

const imageSizeConst = {
  small: { gridSpacing: 3, height: '120px', icon: <PhotoSizeSelectSmallIcon color='secondary' /> },
  middle: { gridSpacing: 4, height: '160px', icon: <PhotoSizeSelectLargeIcon color='secondary' /> },
  large: { gridSpacing: 6, height: '260px', icon: <PhotoSizeSelectActualIcon color='secondary' /> },
}


const Media = () => {
  const { setShared } = useContext(SharedContext)
  
  const [imageSize, setImageSize] = useState(imageSizeConst.middle)
  const [anchorEl, setAnchorEl] = useState(null)
  const [albums, setAlbums] = useState(null)
  const [currentFolder, setCurrentFolder] = useState(null)
  
  const firstRenderRef = useRef(true)
  const open = Boolean(anchorEl)


  
  useEffect(() => {
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    setShared(shared => ({ ...shared, currentPage: 3 }))
    setAlbums(tempFolders)
    setCurrentFolder(tempFolders[0]._id)
  }, [setShared])

  
  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <Paper elevation={2} sx={{p: 2}}>
            <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
              <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Албуми</Typography>
              <Box display='flex' alignItems='center' mr={-1}>
                <Tooltip title='Добави нов' arrow>
                  <IconButton onClick={(e) => 1}>
                    <LibraryAddIcon color='secondary' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            {
              albums
                ? albums.length
                  ? albums.map(x => <FolderComponent row={x} currentFolder={currentFolder} setCurrentFolder={setCurrentFolder} key={x._id} />)
                  : 'Нямате нито един албум'
                : <Box display='flex' alignItems='center' justifyContent='center' padding={5}><CircularProgress size={80} /></Box>
            }            
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper elevation={2} sx={{p: 2}}>
            <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
              <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Албум 01</Typography>
              <Box display='flex' alignItems='center' mr={-1}>
                <Tooltip title='Размер на изображенията' arrow>
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    {imageSize.icon}
                  </IconButton>
                </Tooltip>
                <Tooltip title='Добави нова' arrow>
                  <IconButton onClick={(e) => 1}>
                    <LibraryAddIcon color='secondary' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Grid container spacing={2} >
              { tempArray.map(x => <PhotoComponent row={x} imageSize={imageSize} key={x._id} />) }
            </Grid>
          </Paper>
        </Grid>
      </Grid>
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
        <MenuItem sx={{fontFamily: 'CorsaGrotesk', fontSize: '14px'}} onClick={() => setImageSize(imageSizeConst.large)}>
          <ListItemIcon><PhotoSizeSelectActualIcon fontSize='small' color='primary' /></ListItemIcon>Големи</MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> setImageSize(imageSizeConst.middle)} >
          <ListItemIcon><PhotoSizeSelectLargeIcon fontSize='small' color='primary'/></ListItemIcon>Средни</MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> setImageSize(imageSizeConst.small)}>
          <ListItemIcon><PhotoSizeSelectSmallIcon fontSize='small' color='primary'/></ListItemIcon>Малки</MenuItem>
      </Menu>
    </Container>
  )
}

export default Media