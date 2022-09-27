import React, { useState, forwardRef } from 'react'
import { Box, Typography, Stack, CardMedia } from '@mui/material'
import { dialogBannerStyle, imageEmptyBox } from './BannerPage.styles'
import { uploadFiles } from '../../api/files'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import mainTheme from '../../theme/MainTheme'
import Slide from '@mui/material/Slide'
import TextField from '@mui/material/TextField'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import CircularProgress from '@mui/material/CircularProgress'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import validator from 'validator'

const titleStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }
const secondColor = mainTheme.palette.secondary.main

const defaultBanner = {
  position: { value: 1, error: false },
  link: { value: '', error: false },
  text: { value: '', error: false },
  photo: { value: null, error: false }
}

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})


const BannerDialog = ({data, createFunc, editFunc, closeFunc}) => {
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [banner, setBanner] = useState(data ? JSON.parse(JSON.stringify(data)) : defaultBanner)
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })

  const changeState = (value, field) => setBanner({ ...banner, [field]: { value, error: false } })

  const validateBanner = () => {
    const currentState = JSON.parse(JSON.stringify(banner))
    const errors = []
    
    if (!banner.text.value.trim()) {
      currentState.text.error = true
      errors.push('Липсва текстът')
    }

    if (!banner.link.value.trim()) {
      currentState.link.error = true
      errors.push('Липсва връзката')
    }

    if (!validator.isURL(banner.link.value.trim())) {
      currentState.link.error = true
      errors.push('Невалидна връзка')
    }

    if (banner.position.value < 1) {
      currentState.position.error = true
      errors.push('Невалидна позиция - трябва да е мин. 1')
    }

    if (!banner.photo.value) {
      currentState.photo.error = true
      errors.push('Липсва изображението на банера')
    }

    if (errors.length) {
      setBanner(currentState)
      setErrorDialog({ show: true, message: errors.join(', ') })
      return
    }

    if (!data) {
      const body = {
        position: banner.position.value,
        link: banner.link.value,
        photo: banner.photo.value,
        text: banner.text.value
      }
      
      createFunc(body)
    } else {
      const body = {}
      if (banner.position.value !== data.position.value) body.position = banner.position.value
      if (banner.link.value.trim() !== data.link.value) body.link = banner.link.value
      if (banner.photo.value.trim() !== data.photo.value) body.photo = banner.photo.value
      if (banner.text.value.trim() !== data.text.value) body.text = banner.text.value

      editFunc(data._id, body)
    }
  }



  const fileUploadAction = (file) => {
    if (!file || !file.length) return
    setBanner({ ...banner, photo: { value: false, error: false } })
    const formData = new FormData()
    formData.append('images', file[0])
    uploadFiles(formData)
      .then(x => x.json())
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setBanner({ ...banner, photo: { value: result.payload[0].url, error: false } })
      })
      .catch(error => {
        setBanner({ ...banner, photo: { value: null, error: false } })
        setErrorDialog({ show: true, message: error.message })
      })
  }


  const closeDialog = () => {
    const compareData = data
    ? { ...data }
    : { ...defaultBanner }

    let haveChanges = false

    if (banner.link.value.trim() !== compareData.link.value) haveChanges = true
    if (banner.text.value.trim() !== compareData.text.value) haveChanges = true
    if (banner.photo.value !== compareData.photo.value) haveChanges = true
    if (banner.position.value !== compareData.position.value) haveChanges = true

    if (haveChanges) {
      setConfirmDialog({
        show: true,
        message: `Сигурни ли сте, че искате да прекратите процеса?<br/>Всички данни ще бъдат загубени!`,
        acceptFunc: () => closeFunc({ show: false, data: null })
      })
    } else {
      closeFunc({ show: false, data: null })
    }
  }


  return (
    <Dialog open={true} TransitionComponent={Transition} keepMounted maxWidth='xs' fullWidth PaperProps={{sx: { p: 2}}}>
      <Box sx={titleStyle} borderBottom={1} borderColor={mainTheme.palette.secondary.main}>
        <Typography fontFamily='CorsaGrotesk' color={secondColor} variant='h6' pb={0.5}>{ data ? 'Редакция на банер' : 'Добавяне на банер' }</Typography>
      </Box>
        <Stack spacing={3}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '202px auto' }}>
          {
            banner.photo.value
              ? <CardMedia component='img' sx={dialogBannerStyle} image={banner.photo.value} />
              : banner.photo.value === null
                ? <Box sx={banner.photo.error ? { ...imageEmptyBox, borderColor: '#d32f2f', color: '#d32f2f' } : imageEmptyBox}>препоръчителен размер на файла 202 х 80 пиксела</Box>
                : <Box sx={imageEmptyBox}><CircularProgress size='40px'/></Box>
          }
            <Button variant='contained' component='label' sx={{ ml: 3, maxHeight: '40px', alignSelf: 'end' }}>
              Избери файл
              <input hidden accept='image/*' type='file' onChange={(e) => fileUploadAction(e.target.files)} />
            </Button>
          </Box>
          <TextField
            size='small'
            label='Текст'
            variant='outlined'
            fullWidth
            error={banner.text.error}
            value={banner.text.value}
            onChange={(e) => changeState(e.target.value, 'text')}
          />
          <TextField
            size='small'
            label='Връзка'
            variant='outlined'
            fullWidth
            error={banner.link.error}
            value={banner.link.value}
            onChange={(e) => changeState(e.target.value, 'link')}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <TextField
            size='small'
            label='Позиция'
            type='number'
            InputProps={{ inputProps: { min: 1 } }}
            variant='outlined'
            fullWidth
            error={banner.position.error}
            value={banner.position.value}
            onChange={(e) => changeState(e.target.value, 'position')}
          />
            <Box ml={3} display='flex'>
              <Button fullWidth variant='contained' color='secondary' onClick={closeDialog}>Затвори</Button>
              <Button fullWidth variant='contained' sx={{ml: 1}} onClick={validateBanner}>{ data ? 'Редактирай' : 'Добави'}</Button>
            </Box>
          </Box>
          
        </Stack>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
    </Dialog>
  )
}


export default BannerDialog