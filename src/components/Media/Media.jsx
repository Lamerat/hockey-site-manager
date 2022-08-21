import React, { useContext, useEffect, useRef, useState } from 'react'
import SharedContext from '../../context/SharedContext'
import UserContext from '../../context/UserContext'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Grid, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getCredentials, cleanCredentials } from '../../config/storage'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual'
import PhotoSizeSelectLargeIcon from '@mui/icons-material/PhotoSizeSelectLarge'
import PhotoSizeSelectSmallIcon from '@mui/icons-material/PhotoSizeSelectSmall'
import { menuPaperStyle } from './Media.styles'
import CircularProgress from '@mui/material/CircularProgress'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { listAlbums, setMainAlbum } from '../../api/albums'
import AlbumRow from './AlbumRow'
import PhotoComponent from './PhotoComponent'


const tempArray = [
  { _id: 1, address: './temp1.jpg', caption: 'Няма описание' },
  { _id: 2, address: './temp2.jpg', caption: 'Няма описание' },
  { _id: 3, address: './temp3.jpg', caption: 'Няма описание' },
  { _id: 4, address: './temp1.jpg', caption: 'Няма описание' },
  { _id: 5, address: './temp2.jpg', caption: 'Няма описание' },
  { _id: 6, address: './temp3.jpg', caption: 'Няма описание' },
]

const imageSizeConst = {
  small: { gridSpacing: 3, height: '120px', icon: <PhotoSizeSelectSmallIcon color='secondary' /> },
  middle: { gridSpacing: 4, height: '160px', icon: <PhotoSizeSelectLargeIcon color='secondary' /> },
  large: { gridSpacing: 6, height: '260px', icon: <PhotoSizeSelectActualIcon color='secondary' /> },
}


const Media = () => {
  const { setShared } = useContext(SharedContext)
  const { user } = useContext(UserContext)
  
  const [imageSize, setImageSize] = useState(imageSizeConst.middle)
  const [anchorEl, setAnchorEl] = useState(null)
  const [albums, setAlbums] = useState(null)
  const [currentFolder, setCurrentFolder] = useState(null)
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [albumQuery, setAlbumQuery] = useState({ page: 1, hasNextPage: false })
  const [reload, setReload] = useState({ album: false, photos: false })
  
  const firstRenderSharedRef = useRef(true)
  const firstRenderRef = useRef(true)
  const open = Boolean(anchorEl)

  const history = useNavigate()


  useEffect(() => {
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    const authError = () => {
      cleanCredentials()
      history('/')
    }

    listAlbums({ pageNumber: albumQuery.page, pageSize: 25 })
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setAlbums(albums => albumQuery.page === 1 ? result.payload.docs : [ ...albums, ...result.payload.docs])
        setAlbumQuery({ page: result.payload.page, hasNextPage: result.payload.hasNextPage })
        if (result.payload.page === 1) setCurrentFolder(result.payload.docs[0]._id)
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))

  }, [history, albumQuery.page, reload.album])


  const handlePagination = (scrollTop, height, scrollHeight, column) => {
    if (scrollTop + height < scrollHeight - 20) return
    if (column === 'album' && albumQuery.hasNextPage) {
      setAlbumQuery({ page: albumQuery.page + 1 })
    }
  }


  const authError = () => {
    cleanCredentials()
    history('/')
  }


  const setMain = (albumId) => {
    setMainAlbum(albumId)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        albumQuery.page === 1
          ? setReload({ ...reload, album: !reload.album })
          : setAlbumQuery({ page: 1 })
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  useEffect(() => {
    if(firstRenderSharedRef.current) {
      firstRenderSharedRef.current = false
      return
    }
    setShared(shared => ({ ...shared, currentPage: 3 }))
  }, [setShared])

  if (!user || !getCredentials()) return null
  
  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <Paper elevation={2} sx={{pb: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
            <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} m={2} borderColor={mainTheme.palette.secondary.main} mb={1}>
              <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Албуми</Typography>
              <Box display='flex' alignItems='center' mr={-1}>
                <Tooltip title='Добави нов' arrow>
                  <IconButton onClick={(e) => 1}>
                    <LibraryAddIcon color='secondary' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
              <Scrollbars
                autoHeight
                autoHeightMin={100}
                autoHeightMax='calc(100vh - 187px)'
                onScroll={({ target }) => handlePagination(target.scrollTop, target.getBoundingClientRect().height, target.scrollHeight, 'album')}
              >
              {
                albums
                  ? albums.length
                    ? albums.map(x => <AlbumRow row={x} currentFolder={currentFolder} setCurrentFolder={setCurrentFolder} setMainFunc={setMain} key={x._id} />)
                    : 'Нямате нито един албум'
                  : <Box display='flex' alignItems='center' justifyContent='center' padding={5}><CircularProgress size={80} /></Box>
              }
              
              </Scrollbars>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper elevation={2} sx={{p: 2, pb: 1, maxHeight: 'calc(100vh - 130px - 8px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
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
              <Scrollbars style={{height: '100vh', padding: 16, marginLeft: -16}} >
                <Grid container spacing={2} sx={{pl: 2, pr: 2, pb: 1}}>
                  { tempArray.map(x => <PhotoComponent row={x} imageSize={imageSize} key={x._id} />) }
                </Grid>
              </Scrollbars>
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
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
    </Container>
  )
}

export default Media