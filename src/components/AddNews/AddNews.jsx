import React, { useState } from 'react'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Chip , Stack , Button, TextField, FormControlLabel } from '@mui/material'
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
import { createNewsRequest } from '../../api/news'

const AddNews = () => {
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })
  const [title, SetTitle] = useState({ value: '', error: false })
  const [mainPhoto, setMainPhoto] = useState(null)
  const [photos, setPhotos] = useState([])
  const [htmlCode, setHtmlCode] = useState('')
  const [checkForm, setCheckForm] = useState(false)
  const [pinned, setPinned] = useState(false)

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

  const removePhoto = (id) => {
    setPhotos(photos.filter(x => x._id !== id))
  }


  const createNews = () => {
    setCheckForm(true)

    const messages = []
    if (!title.value.trim()) {
      messages.push('заглавието')
      SetTitle({ ...title, error: true })
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
      photos: photos.map(x => ({ name: x.originalName, address: x.url })),
      pinned
    }
    
    createNewsRequest(newsObject)
      .then(x => x.json())
      .then(result => {
        if (!result.success) throw new Error(result.message)
        history('/news')
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }

  const cancelCreate = () => {
    if (title.value.trim() !== '' || htmlCode !== '' || mainPhoto || photos.length ) {
      setConfirmDialog({ show: true, message: `Сигурни ли сте, че искате да прекратите процеса? Всички данни ще бъдат загубени!`, acceptFunc: () => history('/news') })
    } else {
      history('/news')
    }
  }


  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>

      
      <Paper elevation={2} sx={{p: 2, maxHeight: 'calc(100vh - 140px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
          <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Добавяне на новина</Typography>
          <Box display='flex' alignItems='center' mr={-1}>
            <Tooltip title='Затвори' arrow placement='left'>
              <IconButton onClick={cancelCreate}><CloseIcon color='secondary' /></IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Scrollbars style={{height: '100vh', padding: 16, marginLeft: -16}}>
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
                onChange={(e) => SetTitle({ value: e.target.value, error: false })}
              />
              <Button variant='contained' sx={{ml: 3, width: 220}} component='label' fullWidth onClick={createNews}>Добави новината</Button>
            </Box>
            <Box display='flex' alignItems='center' justifyContent='space-between' minHeight={35} mb={3}>
              <Box>
                <Button
                    startIcon={<PhotoCameraIcon />}
                    disabled={ mainPhoto !== null }
                    color={ checkForm && !mainPhoto ? 'error' : 'secondary'}
                    component='label'
                    variant='outlined'
                    sx={{ width: 200, justifyContent: 'flex-start', mr: 2 }}
                    onChange={(e) => fileUploadAction(e.target.files, 'main')}
                  >
                    Заглавна снимка<input hidden accept='image/*' type='file' />
                  </Button>
                  {
                    mainPhoto
                      ? <Chip label={mainPhoto.originalName} variant='outlined' color='secondary' onDelete={() => setMainPhoto(null)} />
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
                  ? photos.map(x => <Chip key={x._id} variant='outlined' label={x.originalName} color='secondary' onDelete={() => removePhoto(x._id)} />)
                  : null
              }
            </Stack>
            <CKEditor style={{marginTop: '24px'}} config={editorConfig} onChange={(e) => setHtmlCode(e.editor.getData())} />
          </Box>
        </Scrollbars>
      </Paper>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
    </Container>
  )
}

export default AddNews