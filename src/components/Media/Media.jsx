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
import { createAlbum, editAlbumRequest, listAlbums, setMainAlbum, deleteAlbumRequest } from '../../api/albums'
import AlbumRow from './AlbumRow'
import PhotoComponent from './PhotoComponent'
import AlbumDialog from './AlbumDialog'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import { listPhotosRequest } from '../../api/photo'


const imageSizeConst = {
  small: { gridSpacing: 3, height: '120px', icon: <PhotoSizeSelectSmallIcon color='secondary' />, pageSize: 25 },
  middle: { gridSpacing: 4, height: '160px', icon: <PhotoSizeSelectLargeIcon color='secondary' />, pageSize: 15 },
  large: { gridSpacing: 6, height: '260px', icon: <PhotoSizeSelectActualIcon color='secondary' />, pageSize: 8 },
}

const Media = () => {
  const { setShared } = useContext(SharedContext)
  const { user } = useContext(UserContext)
  
  const [albums, setAlbums] = useState(null)
  const [images, setImages] = useState(null)
  const [albumQuery, setAlbumQuery] = useState({ page: 1, hasNextPage: false })
  const [imageQuery, setImageQuery] = useState({ page: 1, pageSize: 15, hasNextPage: false })
  const [imageSize, setImageSize] = useState(imageSizeConst.middle)
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentFolder, setCurrentFolder] = useState(null)
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [reload, setReload] = useState({ album: false, photos: false })
  const [showAlbumDialog, setShowAlbumDialog] = useState({ show: false, data: null, editMode: false, actionFunc: () => null })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })
  
  const firstRenderSharedRef = useRef(true)
  const firstRenderRef = useRef(true)
  const prevCurrent = useRef(null)
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

    listAlbums({ pageNumber: albumQuery.page, pageSize: 20 })
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


  useEffect(() => {
    if (!currentFolder) return

    const authError = () => {
      cleanCredentials()
      history('/')
    }

    const page = currentFolder !== prevCurrent.current ? 1 : imageQuery.page

    listPhotosRequest({ album: currentFolder, pageNumber: page, pageSize: imageQuery.pageSize })
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setImages(images => result.payload.page === 1  ? result.payload.docs : [ ...images, ...result.payload.docs])
        setImageQuery({ page: result.payload.page, pageSize: result.payload.limit, hasNextPage: result.payload.hasNextPage })
        prevCurrent.current = currentFolder
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [currentFolder, imageQuery.page, imageQuery.pageSize, history])


  const handlePagination = (scrollTop, height, scrollHeight, column) => {
    if (scrollTop + height < scrollHeight - 20) return

    if (column === 'album' && albumQuery.hasNextPage) {
      setAlbumQuery({ page: albumQuery.page + 1 })
    }

    if (column === 'photo' && imageQuery.hasNextPage) {
      setImageQuery({ page: albumQuery.page + 1, pageSize: imageSize.pageSize })
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

  
  const prepareEditAlbum = (albumId, name) => setShowAlbumDialog({ show: true, editMode: true, data: { value: name, id: albumId }, actionFunc: editAlbum })


  const prepareDeleteAlbum = (albumId, name) => {
    let message = `Сигурни ли сте, че искате да изтриете албум "${name}"?<br/>Всички снимки в него ще бъдат загубени!`
    const checkAlbum = albums.filter(x => x._id === albumId)
    if (checkAlbum.length && checkAlbum[0].main === true) {
      message = `Албум "${name}" е вашият <b>ГЛАВЕН АЛБУМ</b>.<br/>Снимките на първа страница в сайта на отбора са тези от него.
      <br/>
      Ако след изтриването му не посочите нов главен албум, може да има проблеми със сайта.<br/><br/>
      Сигурни ли сте, че искате да изтриете албум "${name}"?<br/>Всички снимки в него ще бъдат загубени!`
    }
    setConfirmDialog({ show: true, message, acceptFunc: () => deleteAlbum(albumId) })
  }


  const deleteAlbum = (albumId) => {
    setConfirmDialog({ show: false, message: '' })
    deleteAlbumRequest(albumId)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        albumQuery.hasNextPage
          ? setReload({ ...reload, album: !reload.album })
          : setAlbums(albums.filter(x => x._id !== result.payload._id))
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const addNewAlbum = (name) => {
    createAlbum({ name })
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        albumQuery.page === 1
          ? setReload({ ...reload, album: !reload.album })
          : setAlbumQuery({ page: 1 })
        setShowAlbumDialog({ show: false })
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const editAlbum = (id, name) => {
    editAlbumRequest(id, { name })
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setShowAlbumDialog({ show: false })
        setAlbums(albums.map(x => x._id === result.payload._id ? result.payload : x))
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const changeImageSize = (size) => {
    setImageSize(imageSizeConst[size])
    setImageQuery({ page: 1, pageSize: imageSizeConst[size].pageSize, hasNextPage: false })
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
                  <IconButton onClick={() => setShowAlbumDialog({ show: true, editMode: false, data: null, actionFunc: addNewAlbum })}>
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
                    ? albums.map(x => (
                      <AlbumRow
                        row={x}
                        currentFolder={currentFolder}
                        setCurrentFolder={setCurrentFolder}
                        deleteFunc={prepareDeleteAlbum}
                        editFunc={prepareEditAlbum}
                        setMainFunc={setMain} key={x._id}
                      />))
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
              <Scrollbars
                style={{height: '100vh', padding: 16, marginLeft: -16}}
                onScroll={({ target }) => handlePagination(target.scrollTop, target.getBoundingClientRect().height, target.scrollHeight, 'photo')}
              >
                <Grid container spacing={2} sx={{pl: 2, pr: 2, pb: 1}}>
                  {
                    images
                      ? images.length
                        ? images.map(x => <PhotoComponent row={x} imageSize={imageSize} key={x._id} />)
                        : <Box width='100%' textAlign='center' justifyContent='center' padding={5}>{'Албумът е празен'}</Box>
                      : <Box display='flex' alignItems='center' justifyContent='center' padding={5}><CircularProgress size={80} /></Box>
                  }
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
        <MenuItem sx={{fontFamily: 'CorsaGrotesk', fontSize: '14px'}} onClick={() => changeImageSize('large')}>
          <ListItemIcon><PhotoSizeSelectActualIcon fontSize='small' color='primary' /></ListItemIcon>Големи</MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> changeImageSize('middle')} >
          <ListItemIcon><PhotoSizeSelectLargeIcon fontSize='small' color='primary'/></ListItemIcon>Средни</MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> changeImageSize('small')}>
          <ListItemIcon><PhotoSizeSelectSmallIcon fontSize='small' color='primary'/></ListItemIcon>Малки</MenuItem>
      </Menu>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { showAlbumDialog.show ? <AlbumDialog editMode={showAlbumDialog.editMode} data={showAlbumDialog.data} actionFunc={showAlbumDialog.actionFunc} closeFunc={setShowAlbumDialog} /> : null }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
    </Container>
  )
}

export default Media