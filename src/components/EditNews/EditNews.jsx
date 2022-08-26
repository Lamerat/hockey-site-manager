import React, { useState, useEffect, useRef, useContext } from 'react'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Chip , Stack , Button, TextField, FormControlLabel } from '@mui/material'
import UserContext from '../../context/UserContext'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { CKEditor } from 'ckeditor4-react'
import { editorConfig } from '../../common/ck-editor-config'
import { Scrollbars } from 'react-custom-scrollbars-2'
import mainTheme from '../../theme/MainTheme'
import CloseIcon from '@mui/icons-material/Close'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import { uploadFiles } from '../../api/files'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import IOSSwitch from '../IOSwitch/IOSwitch'
import { editNewsRequest, singleNewsRequest } from '../../api/news'
import { getCredentials, cleanCredentials } from '../../config/storage'
import ImagePreview from '../StyledElements/ImagePreview'

const initialNewsData = {}

const EditNews = () => {
  const { user } = useContext(UserContext)
  const firstRenderRef = useRef(true)

  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })
  const [title, setTitle] = useState({ value: '', error: false })
  const [mainPhoto, setMainPhoto] = useState(null)
  const [photos, setPhotos] = useState([])
  const [htmlCode, setHtmlCode] = useState('')
  const [pinned, setPinned] = useState(false)
  const [loadComplete, setLoadComplete] = useState(false)
  const [imagePreview, setImagePreview] = useState({ show: false, image: '' })
  const [anchorPreview, setAnchorPreview] = useState(null)

  const { id: newsId } = useParams()
  const history = useNavigate()


  const fileUploadAction = (file, field) => {
    if (!file || !file.length) return

    const formData = new FormData()
    if (file.length > 1) {
      for (let i = 0; i < file.length; i++) formData.append('images', file[i])
    } else {
      formData.append('images', file[0])
    }

    uploadFiles(formData)
      .then(x => x.json())
      .then(result => field === 'main' ? setMainPhoto(result.payload[0]) : setPhotos([...result.payload, ...photos]))
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const updateNews = () => {
    const messages = []
    if (!title.value.trim()) {
      messages.push('заглавието')
      setTitle({ ...title, error: true })
    }

    if (!mainPhoto) messages.push('заглавната снимка')

    if (messages.length) {
      setErrorDialog({ show: true, message: `Не са попълнени полетата: ${messages.join(', ')}` })
      return
    }

    const newsObject = {
      title: title.value,
      text: htmlCode,
      coverPhoto: { name: mainPhoto.originalName, address: mainPhoto.url },
      photos: photos.map(x => ({ name: x.originalName, address: x.url })).sort(),
      pinned
    }
    
    editNewsRequest(newsId, newsObject)
      .then(x => x.json())
      .then(result => {
        if (!result.success) throw new Error(result.message)
        history('/news')
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const cancelCreate = () => {
    let haveChanges = false
    if (title.value !== initialNewsData.title) haveChanges = true
    if (mainPhoto?.url !== initialNewsData.mainPhoto) haveChanges = true
    if (pinned !== initialNewsData.pinned) haveChanges = true
    if (htmlCode !== initialNewsData.htmlCode) haveChanges = true
    
    photos.map(x => x._id).sort().forEach((el, index) => {
      if (el.toString() !== initialNewsData.photos[index].toString()) haveChanges = true
    })

    if (haveChanges) {
      setConfirmDialog({ show: true, message: `Сигурни ли сте, че искате да прекратите процеса? Всички редакции ще бъдат загубени!`, acceptFunc: () => history('/news') })
    } else {
      history('/news')
    }
  }

  useEffect(() => {
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    const authError = () => {
      cleanCredentials()
      history('/')
    }

    singleNewsRequest(newsId)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        const { payload } = result
        setTitle({ value: payload.title, error: false })
        setMainPhoto({ originalName: payload.coverPhoto.name, url: payload.coverPhoto.address })
        setPhotos(payload.photos.map(x => ({ originalName: x.name, url: x.address, _id: x._id })))
        setPinned(payload.pinned)
        setHtmlCode(payload.text)
        setLoadComplete(true)

        initialNewsData.title = payload.title
        initialNewsData.mainPhoto = payload.coverPhoto.address
        initialNewsData.photos = payload.photos.map(x => x._id)
        initialNewsData.pinned = payload.pinned
        initialNewsData.htmlCode = payload.text
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [history, newsId])


  const showPreviewImage = (event, image) => {
    setAnchorPreview(event.currentTarget)
    setImagePreview({ show: true, image })
  }


  const hidePreviewImage = () => {
    setAnchorPreview(null)
    setImagePreview({ show: false, image: '' })
  }


  const deleteMainImage = () => {
    hidePreviewImage()
    setMainPhoto(null)
  }


  const removePhoto = (id) => {
    hidePreviewImage()
    setPhotos(photos.filter(x => x._id !== id))
  }


  if (!user || !getCredentials()) return null

  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Paper elevation={2} sx={{p: 2, maxHeight: 'calc(100vh - 140px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
          <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Редактиране на новина</Typography>
          <Box display='flex' alignItems='center' mr={-1}>
            <Tooltip title='Затвори' arrow placement='left'>
              <IconButton onClick={cancelCreate}><CloseIcon color='secondary' /></IconButton>
            </Tooltip>
          </Box>
        </Box>
        {
          !loadComplete
            ? null
            : <Scrollbars style={{height: '100vh', padding: 16, marginLeft: -16}}>
                <Box p={2} pt={1}>
                  <Box display='flex' alignItems='center' justifyContent='space-between' minWidth='100%' mb={3}>
                    <TextField
                      label='Заглавие'
                      error={title.error}
                      size='small'
                      required
                      fullWidth
                      variant='outlined'
                      value={title.value}
                      onChange={(e) => setTitle({ value: e.target.value, error: false })}
                    />
                    <Button variant='contained' sx={{ml: 3, width: 260}} component='label' fullWidth onClick={updateNews}>Редактирай новината</Button>
                  </Box>
                  <Box display='flex' alignItems='center' justifyContent='space-between' minHeight={35} mb={3}>
                    <Box>
                      <Button
                          startIcon={<PhotoCameraIcon />}
                          disabled={ mainPhoto !== null }
                          color={ !mainPhoto ? 'error' : 'secondary' }
                          component='label'
                          variant='outlined'
                          sx={{ width: 200, justifyContent: 'flex-start', mr: 2 }}
                          onChange={(e) => fileUploadAction(e.target.files, 'main')}
                        >
                          Заглавна снимка<input hidden accept='image/*' type='file' />
                        </Button>
                        {
                          mainPhoto
                            ? <Chip
                                label={mainPhoto.originalName}
                                variant='outlined'
                                color='secondary'
                                onDelete={deleteMainImage}
                                onMouseEnter={(event) => showPreviewImage(event, mainPhoto.url)}
                                onMouseLeave={hidePreviewImage}
                              />
                            : null
                        }
                      </Box>
                      <FormControlLabel control={<IOSSwitch sx={{ mr: 2 }} checked={pinned} onChange={() => setPinned(!pinned)} />} label='Закачена' sx={{mr: 1}}/>
                  </Box>
                  <Stack direction='row' alignItems='center' minHeight={35} spacing={2}>
                  <Button
                    startIcon={<PhotoLibraryIcon />}
                    color='secondary'
                    component='label'
                    variant='outlined'
                    sx={{ minWidth: 200, justifyContent: 'flex-start' }}
                    onChange={(e) => fileUploadAction(e.target.files, 'other')}
                  >
                    Снимки<input hidden accept='image/*' multiple type='file' />
                  </Button>
                  {
                    photos.length
                      ? photos
                        .map(x => (
                          <Chip
                            key={x._id}
                            variant='outlined'
                            label={x.originalName}
                            color='secondary'
                            onDelete={() => removePhoto(x._id)}
                            onMouseEnter={(event) => showPreviewImage(event, x.url)}
                            onMouseLeave={hidePreviewImage}
                          />)
                        )
                      : null
                    }
                  </Stack>
                  <CKEditor initData={htmlCode} style={{marginTop: '24px'}} config={editorConfig} onChange={(e) => setHtmlCode(e.editor.getData())} />
                </Box>
              </Scrollbars>
        }
      </Paper>
      <ImagePreview anchor={anchorPreview} data={imagePreview} closeFunc={hidePreviewImage} />
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
    </Container>
  )
}

export default EditNews