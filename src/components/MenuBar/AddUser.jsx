import React, { forwardRef, useState, useContext } from 'react'
import { Box, Typography, TextField, IconButton, InputAdornment, Button } from '@mui/material'
import { cleanCredentials } from '../../config/storage'
import { createNewUser } from '../../api/user'
import { styled } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import UserContext from '../../context/UserContext'
import mainTheme from '../../theme/MainTheme'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import validator from 'validator'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} { ...props } />
})

const titleStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }
const secondColor = mainTheme.palette.secondary.main

const DisabledField = styled(TextField)(() => ({
  '.MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: '#000',
    color: '#000'
  },
  '.MuiInputLabel-root.Mui-disabled': {
    color: 'rgba(0, 0, 0, 0.6)'
  }
}))

const userDataDefault = { 
  name: { value: '', error: false },
  email: { value: '', error: false },
  password: { value: '', error: false },
  rePassword: { value: '', error: false },
}

const AddUser = ({ closeFunc }) => {
  const { user } = useContext(UserContext)

  const[passFields, setPassFields] = useState({ password: false, rePassword: false })
  const[userData, setUserData] = useState(userDataDefault)
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [successDialog, setSuccessDialog] = useState({ show: false, message: '' })

  const history = useNavigate()

  const authError = () => {
    cleanCredentials()
    history('/')
  }

  const validateFields = () => {
    const errors = []
    const state = JSON.parse(JSON.stringify(userData))

    const { name, email, password, rePassword } = state

    if (!name.value.trim()) {
      errors.push('Липсва името')
      state.name.error = true
    } else {
      const checkName = name.value.trim().split(' ').filter(x => x !== '')
      if (checkName.length !== 2) {
        errors.push('Имената трябва да са две')
        state.name.error = true
      }
    }

    if (!email.value.trim()) {
      errors.push('Липсва името')
      state.email.error = true
    } else if (!validator.isEmail(email.value.trim())) {
      errors.push('Невалиден имейл')
      state.email.error = true
    }

    if (!password.value.trim()) {
      errors.push('Липсва паролата')
      state.password.error = true
    } else if (password.value.trim().length < 6) {
      errors.push('Минималната дължина на паролата е 6 символа')
      state.password.error = true
    }

    if (!rePassword.value.trim()) {
      errors.push('Липсва повторението на паролата')
      state.rePassword.error = true
    } else if (rePassword.value.trim().length < 6) {
      errors.push('Минималната дължина на паролата е 6 символа')
      state.rePassword.error = true
    } else if (password.value.trim() !== rePassword.value.trim()) {
      errors.push('Повторението на паролата не съвпада')
      state.rePassword.error = true
    }

    if (errors.length) {
      setUserData(state)
      setErrorDialog({ show: true, message: errors.join(', ') })
      return
    }

    const body = {
      email: email.value.trim(),
      name: name.value.trim(),
      password: password.value.trim()
    }

    createNewUser(body)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setSuccessDialog({ show: true, message: `Потребителят ${name.value} е създаден успешно` })
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }

  const changeState = (field, value) => setUserData({ ...userData, [field]: { value, error: false } })

  return (
    <Dialog open={true} TransitionComponent={Transition} keepMounted maxWidth='xs' fullWidth PaperProps={{sx: { p: 2}}}>
      <Box sx={titleStyle} borderBottom={1} borderColor={mainTheme.palette.secondary.main}>
        <Typography fontFamily='CorsaGrotesk' color={secondColor} variant='h6' pb={0.5}>Добавяне на нов потребител</Typography>
      </Box>
      <DisabledField
        disabled
        label='Отбор'
        value={user.team.name}
        InputLabelProps={ { sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px', scale: '1.1', pr: 0.7, backgroundColor: 'white' } } }
        InputProps={{
          sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px' },
          endAdornment: <InputAdornment position='end'><PeopleAltIcon color='secondary' /></InputAdornment>
        }}
        sx={{ mb: 3 }}
      />
      <TextField
        label='Име'
        autoComplete='off'
        error={userData.name.error}
        value={userData.name.value}
        onChange={(e) => changeState('name', e.target.value)}
        InputLabelProps={ { sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px', scale: '1.1', pr: 0.7, backgroundColor: 'white' } } }
        InputProps={{
          sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px' },
          endAdornment: <InputAdornment position='end'><AccountCircleIcon color='secondary' /></InputAdornment>
        }}
        sx={{ mb: 3 }}
      />
      <TextField
        label='Имейл'
        autoComplete='off'
        error={userData.email.error}
        value={userData.email.value}
        onChange={(e) => changeState('email', e.target.value)}
        InputLabelProps={ { sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px', scale: '1.1', pr: 0.7, backgroundColor: 'white' } } }
        InputProps={{
          sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px' },
          endAdornment: <InputAdornment position='end'><AlternateEmailIcon color='secondary' /></InputAdornment>
        }}
        sx={{ mb: 3 }}
      />
      <TextField
        label='Парола'
        autoComplete='off'
        error={userData.password.error}
        value={userData.password.value}
        onChange={(e) => changeState('password', e.target.value)}
        type={passFields.password ? 'text' : 'password'}
        InputLabelProps={ { sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px', scale: '1.1', pr: 0.7, backgroundColor: 'white' } } }
        InputProps={{
          sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px' },
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton size='small' sx={{ mr: -0.6 }} onClick={() => setPassFields({ ...passFields, password: !passFields.password })}>
              { passFields.password ? <VisibilityOff color='secondary' /> : <Visibility color='secondary' /> }
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{ mb: 3 }}
      />
      <TextField
        label='Повтори парола'
        autoComplete='off'
        error={userData.rePassword.error}
        value={userData.rePassword.value}
        onChange={(e) => changeState('rePassword', e.target.value)}
        type={passFields.rePassword ? 'text' : 'password'}
        InputLabelProps={ { sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px', scale: '1.1', pr: 0.7, backgroundColor: 'white' } } }
        InputProps={{
          sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px' },
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton size='small' sx={{ mr: -0.6 }} onClick={() => setPassFields({ ...passFields, rePassword: !passFields.password })}>
              { passFields.rePassword ? <VisibilityOff color='secondary' /> : <Visibility color='secondary' /> }
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{ mb: 3 }}
      />
      <Box display='flex' justifyContent='right' alignItems='center'>
        <Button variant='contained' color='primary' onClick={validateFields} sx={{mr: 1}}>Добави</Button>
        <Button variant='contained' color='secondary' onClick={() => closeFunc(false)}>Затвори</Button>
      </Box>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      {
        successDialog.show
          ? <Dialog fullWidth open={true} TransitionComponent={Transition} keepMounted>
              <DialogTitle>Информация</DialogTitle>
              <DialogContent>
                <DialogContentText>{successDialog.message}</DialogContentText>
              </DialogContent>
              <DialogActions sx={{pr: 3, pb: 2}}>
                <Button onClick={() => closeFunc(false)}>Затвори</Button>
              </DialogActions>
            </Dialog>
          : null
      }
    </Dialog>
  )
}

export default AddUser