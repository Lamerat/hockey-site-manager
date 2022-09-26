import React, { useContext, useEffect, useRef, useState } from 'react'
import SharedContext from '../../context/SharedContext'
import UserContext from '../../context/UserContext'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Grid, ListItemIcon, Menu, MenuItem, Backdrop } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getCredentials, cleanCredentials } from '../../config/storage'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual'
import PhotoSizeSelectLargeIcon from '@mui/icons-material/PhotoSizeSelectLarge'
import PhotoSizeSelectSmallIcon from '@mui/icons-material/PhotoSizeSelectSmall'
import { menuPaperStyle } from './Media.styles'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { createAlbum, editAlbumRequest, listAlbums, setMainAlbum, deleteAlbumRequest } from '../../api/albums'
import AlbumRow from './AlbumRow'
import PhotoComponent from './PhotoComponent'
import AlbumDialog from './AlbumDialog'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import { listPhotosRequest, uploadPhotosRequest, changePositionsRequest, deletePhotoRequest, changePhotoAlbumRequest } from '../../api/photo'
import { DEV_MODE } from '../../config/constants'


const imageSizeConst = {
  small: { gridSpacing: 3, height: '140px', icon: <PhotoSizeSelectSmallIcon color='secondary' />, pageSize: 25, maxSymbols: 17, },
  middle: { gridSpacing: 4, height: '180px', icon: <PhotoSizeSelectLargeIcon color='secondary' />, pageSize: 15, maxSymbols: 27, },
  large: { gridSpacing: 6, height: '280px', icon: <PhotoSizeSelectActualIcon color='secondary' />, pageSize: 8, maxSymbols: 47, },
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
  const [dragStart, setDragStart] = useState(null)
  const [globalEdit, setGlobalEdit] = useState(false)
  const [showBackDrop, setShowBackDrop] = useState(false)
  
  const firstRenderSharedRef = useRef(true)
  const firstRenderRef = useRef(true)
  const prevCurrent = useRef(null)

  const open = Boolean(anchorEl)
  const opacity = globalEdit ? 0.2 : 1

  const history = useNavigate()


  useEffect(() => {
    if (firstRenderRef.current && DEV_MODE) {
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
        if (result.payload.page === 1) setCurrentFolder({ id: result.payload.docs[0]._id, name: result.payload.docs[0].name })
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))

  }, [history, albumQuery.page, reload.album])


  useEffect(() => {
    if (!currentFolder?.id) return

    const authError = () => {
      cleanCredentials()
      history('/')
    }

    const page = currentFolder.id !== prevCurrent.current ? 1 : imageQuery.page

    listPhotosRequest({ album: currentFolder.id, pageNumber: page, pageSize: imageQuery.pageSize })
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setImages(images => result.payload.page === 1  ? result.payload.docs : [ ...images, ...result.payload.docs])
        setImageQuery({ page: result.payload.page, pageSize: result.payload.limit, hasNextPage: result.payload.hasNextPage })
        prevCurrent.current = currentFolder.id
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [currentFolder?.id, imageQuery.page, imageQuery.pageSize, reload.photos, history])


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


  const uploadPhotos = (file) => {
    if (!file || !file.length) return

    const formData = new FormData()
    formData.append('album', currentFolder.id)
    for (let i = 0; i < file.length; i++) formData.append('images', file[i])

    
    uploadPhotosRequest(formData)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        imageQuery.hasNextPage
          ? setReload({ ...reload, photos: !reload.photos })
          : setImages([ ...result.payload, ...images.map(x => ({ ...x, position: x.position + result.payload.length })) ])
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
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
        if (result.payload._id === currentFolder.id) setCurrentFolder({ ...currentFolder,name })
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const changeImageSize = (size) => {
    setImageSize(imageSizeConst[size])
    setImageQuery({ page: 1, pageSize: imageSizeConst[size].pageSize, hasNextPage: false })
  }


  const changeImagePosition = (target) => {
    if (target === dragStart) return

    const draggedImage = images.filter(x => x.position === dragStart)[0]
    const targetImage = images.filter(x => x.position === target)[0]
    
    draggedImage.position = target
    targetImage.position = dragStart

    const updateBody = [ draggedImage, targetImage ].map(x => ({ _id: x._id, position: x.position }))
    changePositionsRequest({ photos: updateBody })
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      const newImages = images.map(x => {
        if (x.position === targetImage.position) {
          return draggedImage
        } else if (x.position === draggedImage.position) {
          return targetImage
        }
        return x
      })
      setImages(newImages)

    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const prepareDeletePhoto = (_id, name) => {
    const message = `Сигурни ли сте, че искате да изтриете снимка "${name}"?`
    setConfirmDialog({ show: true, message, acceptFunc: () => deletePhoto(_id) })
  }


  const deletePhoto = (_id) => {
    setConfirmDialog({ show: false, message: '' })
    deletePhotoRequest(_id)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        imageQuery.hasNextPage
          ? setReload({ ...reload, photos: !reload.photos })
          : setImages(images.filter(x => x._id !== result.payload._id))
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const changePhotoFolder = (album, photoPosition) => {
    const photo = images.filter(x => x.position === photoPosition)[0]
    setShowBackDrop(true)
    changePhotoAlbumRequest({ album, photo })
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        imageQuery.hasNextPage
          ? setReload({ ...reload, photos: !reload.photos })
          : setImages(images.filter(x => x._id !== result.payload._id))
        setShowBackDrop(false)
      })
      .catch(error => {
        setShowBackDrop(false)
        setErrorDialog({ show: true, message: error.message })
      })
  }


  useEffect(() => {
    if (firstRenderSharedRef.current && DEV_MODE) {
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
            <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} m={2} borderColor={`rgb(38, 166, 154, ${opacity})`} mb={1}>
              <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' sx={{opacity}} pb={0.5}>Албуми</Typography>
              { showBackDrop ? <LinearProgress sx={{width: '100%' , mr: 4, ml: 4}}  variant='query'/> : null }
              <Box display='flex' alignItems='center' mr={-1}>
                <Tooltip title='Добави нов' arrow>
                  <IconButton disabled={globalEdit} onClick={() => setShowAlbumDialog({ show: true, editMode: false, data: null, actionFunc: addNewAlbum })}>
                    <LibraryAddIcon color='secondary' sx={{opacity}} />
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
                        key={x._id}
                        currentFolder={currentFolder}
                        setCurrentFolder={setCurrentFolder}
                        deleteFunc={prepareDeleteAlbum}
                        editFunc={prepareEditAlbum}
                        setMainFunc={setMain}
                        globalEdit={globalEdit}
                        moveFunc={changePhotoFolder}
                        dragPhoto={dragStart}
                      />))
                    : 'Нямате нито един албум'
                  : <Box display='flex' alignItems='center' justifyContent='center' padding={5}><CircularProgress size={80} /></Box>
              }
              
              </Scrollbars>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper elevation={2} sx={{p: 2, pb: 1, maxHeight: 'calc(100vh - 130px - 8px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
            <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={`rgb(38, 166, 154, ${opacity})`} mb={1}>
              <Typography fontFamily='CorsaGrotesk' sx={{opacity}} color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>{currentFolder?.name}</Typography>
              <Box display='flex' alignItems='center' mr={-1}>
                <Tooltip title='Размер на изображенията' arrow>
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} disabled={globalEdit} sx={{opacity}}>
                    {imageSize.icon}
                  </IconButton>
                </Tooltip>
                <Tooltip title='Добави нова' arrow>
                  <IconButton component='label' onClick={(e) => e.target.value = ''} disabled={globalEdit}>
                    <input hidden multiple accept='image/*' type='file' onChange={(e) => uploadPhotos(e.target.files)} />
                    <LibraryAddIcon color='secondary' sx={{opacity}} />
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
                        ? images.map(x => (
                          <PhotoComponent
                            key={x._id}
                            row={x}
                            imageSize={imageSize}
                            changePositionFunc={changeImagePosition}
                            setStartPosition={setDragStart}
                            setErrorDialog={setErrorDialog}
                            deleteFunc={prepareDeletePhoto}
                            globalEdit={globalEdit}
                            setGlobalEdit={setGlobalEdit}
                          />))
                        : <Box width='100%' textAlign='center' justifyContent='center' padding={5}>{'Албумът е празен'}</Box>
                      : <Box width='100%' display='flex' alignItems='center' justifyContent='center' padding={5}><CircularProgress size={80} /></Box>
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
        <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}><PhotoSizeSelectActualIcon fontSize='small' color='primary' /></ListItemIcon>Големи</MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> changeImageSize('middle')} >
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}><PhotoSizeSelectLargeIcon fontSize='small' color='primary'/></ListItemIcon>Средни</MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={()=> changeImageSize('small')}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}><PhotoSizeSelectSmallIcon fontSize='small' color='primary'/></ListItemIcon>Малки</MenuItem>
      </Menu>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { showAlbumDialog.show ? <AlbumDialog editMode={showAlbumDialog.editMode} data={showAlbumDialog.data} actionFunc={showAlbumDialog.actionFunc} closeFunc={setShowAlbumDialog} /> : null }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
      <Backdrop sx={{ mt: '64px', backgroundColor: `rgb(255, 255, 255, 0)`, zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showBackDrop} />
    </Container>
  )
}

export default Media