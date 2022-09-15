import React, { forwardRef, useState } from 'react'
import { Box, FormHelperText, InputLabel, OutlinedInput, IconButton, InputAdornment, FormControl, Button } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import { changePassword } from '../../api/user'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} { ...props } />
})

const defaultState = {
  oldPassword: { value: '', error: false, show: false },
  newPassword: { value: '', error: false, show: false },
  repeatPassword: { value: '', error: false, show: false }
}

const PasswordDialog = ({ closeFunc, authError }) => {
  const [passwords, setPasswords] = useState(JSON.parse(JSON.stringify(defaultState)))
  const [errors, setErrors] = useState({ oldPassword: ' ', newPassword: ' ', repeatPassword: ' ' })
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })

  const changeState = (field, value) => {
    setErrors({ ...errors, [field]: ' ' })
    setPasswords({ ...passwords, [field]: { ...passwords[field], value, error: false } })
  }

  const validateFields = () => {
    let haveError = false
    const messages = { ...errors }
    const state = JSON.parse(JSON.stringify(passwords))

    if (!state.oldPassword.value.trim()) {
      haveError = true
      messages.oldPassword = 'Не е въведена паролата'
      state.oldPassword.error = true
    }

    if (state.oldPassword.value.trim().length < 6 && state.oldPassword.value.trim() ) {
      haveError = true
      messages.oldPassword = 'Минималната дължина на паролата е 6 символа'
      state.oldPassword.error = true
    }

    if (!state.newPassword.value.trim()) {
      haveError = true
      messages.newPassword = 'Не е въведена новата парола'
      state.newPassword.error = true
    }

    if (state.newPassword.value.trim().length < 6 && state.newPassword.value.trim() ) {
      haveError = true
      messages.newPassword = 'Минималната дължина на паролата е 6 символа'
      state.newPassword.error = true
    }

    if (!state.repeatPassword.value.trim()) {
      haveError = true
      messages.repeatPassword = 'Не е въведенo повторението на новата парола'
      state.repeatPassword.error = true
    }

    if (state.repeatPassword.value.trim().length < 6 && state.repeatPassword.value.trim() ) {
      haveError = true
      messages.repeatPassword = 'Минималната дължина на паролата е 6 символа'
      state.repeatPassword.error = true
    }
    
    if (!state.repeatPassword.error) {
      if (state.repeatPassword.value.trim() !== state.newPassword.value.trim()) {
        haveError = true
        messages.repeatPassword = 'Повторението не съвпада с новата парола'
        state.repeatPassword.error = true
      }
    }
    
    if (haveError) {
      setErrors(messages)
      setPasswords(state)
      return
    }

    const body = {
      password: passwords.oldPassword.value,
      newPassword: passwords.newPassword.value,
      reNewPassword: passwords.repeatPassword.value
    }

    changePassword(body)
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      closeFunc(false)
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }

  
  return (
    <Dialog open={true} TransitionComponent={Transition} keepMounted fullWidth PaperProps={{sx: { p: 2, width: '100%', maxWidth: '400px'}}}>
      <FormControl variant='outlined' sx={{mb: 1.5, mt: 1}} error={passwords.oldPassword.error}>
        <InputLabel>Стара парола</InputLabel>
        <OutlinedInput
          label='Стара парола'
          type={passwords.oldPassword.show ? 'text' : 'password'}
          value={passwords.oldPassword.value}
          onChange={(e) => changeState('oldPassword', e.target.value)}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                onClick={() => setPasswords({ ...passwords, oldPassword: { ...passwords.oldPassword, show: !passwords.oldPassword.show } })}
                onMouseDown={(e) => e.preventDefault()}
                edge='end'
              >
                { passwords.oldPassword.show ? <VisibilityOff /> : <Visibility /> }
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText sx={{ml: 1}}>{errors.oldPassword}</FormHelperText>
      </FormControl>
      <FormControl variant='outlined' sx={{mb: 1.5}} error={passwords.newPassword.error}>
        <InputLabel>Нова парола</InputLabel>
        <OutlinedInput
          label='Нова парола'
          type={passwords.newPassword.show ? 'text' : 'password'}
          value={passwords.newPassword.value}
          onChange={(e) => changeState('newPassword', e.target.value)}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                onClick={() => setPasswords({ ...passwords, newPassword: { ...passwords.newPassword, show: !passwords.newPassword.show } })}
                onMouseDown={(e) => e.preventDefault()}
                edge='end'
              >
                { passwords.newPassword.show ? <VisibilityOff /> : <Visibility /> }
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText sx={{ml: 1}}>{errors.newPassword}</FormHelperText>
      </FormControl>
      <FormControl variant='outlined' sx={{mb: 1.5}} error={passwords.repeatPassword.error}>
        <InputLabel>Повторете новата парола</InputLabel>
        <OutlinedInput
          label='Повторете новата парола'
          type={passwords.repeatPassword.show ? 'text' : 'password'}
          value={passwords.repeatPassword.value}
          onChange={(e) => changeState('repeatPassword', e.target.value)}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                onClick={() => setPasswords({ ...passwords, repeatPassword: { ...passwords.repeatPassword, show: !passwords.repeatPassword.show } })}
                onMouseDown={(e) => e.preventDefault()}
                edge='end'
              >
                { passwords.repeatPassword.show ? <VisibilityOff /> : <Visibility /> }
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText sx={{ml: 1}}>{errors.repeatPassword}</FormHelperText>
      </FormControl>
      <Box display='flex' justifyContent='right' alignItems='center'>
        <Button variant='contained' color='primary' onClick={validateFields} sx={{mr: 2}}>Промени</Button>
        <Button variant='contained' color='secondary' onClick={() => closeFunc(false)}>Откажи</Button>
      </Box>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
    </Dialog>
  )
}

export default PasswordDialog