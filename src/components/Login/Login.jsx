import React, { useState, useContext, useRef, useEffect } from 'react'
import validator from 'validator'
import { Container, Paper, Box, FormControl, IconButton, InputLabel, OutlinedInput, InputAdornment, FormHelperText, TextField } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useNavigate } from 'react-router-dom'
import UserContext from '../../context/UserContext'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import { login } from '../../api/user'
import { getCredentials, storeCredentials } from '../../config/storage'
import LoadingButton from '@mui/lab/LoadingButton';
import { DEV_MODE } from '../../config/constants'


const Login = () => {
  const { user, setUser } = useContext(UserContext)
  const firstRenderRef = useRef(true)

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState({ value: '', error: false, helperText: 'none' })
  const [password, setPassword] = useState({ value: '', error: false, helperText: 'none' })
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [connect, setConnect] = useState(false)

  const history = useNavigate()

  const changeEmail = (value) => setEmail({ ...email, value, error: false })
  const changePassword = (value) => setPassword({ ...password, value, error: false })

  const loginToServer = () => {
    let haveError = false

    if (!email.value.trim()) {
      setEmail({ ...email, error: true, helperText: 'Полето не е попълнено' })
      haveError = true
    } else if (!validator.isEmail(email.value.trim())) {
      setEmail({ ...email, error: true, helperText: 'Невалиден имейл' })
      haveError = true
    }

    if (!password.value.trim()) {
      setPassword({ ...password, error: true, helperText: 'Полето не е попълнено' })
      haveError = true
    } else if (password.value.trim().length < 6) {
      setPassword({ ...password, error: true, helperText: 'Невалидна парола, минималната дължина е 6 символа' })
      haveError = true
    }

    if (haveError) return
    setConnect(true)

    login({ email: email.value, password: password.value })
      .then((x) => x.json())
      .then((result) => {
        setConnect(false)
        if (!result.success) {
          setErrorDialog({ show: true, message: result.message })
        } else {
          storeCredentials(result.payload)
          setUser(result.payload.user)
        }
      })
      .catch((error) => {
        setErrorDialog({ show: true, message: error.message })
      })
  }

  useEffect(() => {
    if (firstRenderRef.current && DEV_MODE) {
      firstRenderRef.current = false
    }

    if (user && getCredentials()) {
      setUser(user)
      history('/news')
    }
  }, [user, history, setUser])

  return (
    <Container sx={{maxWidth: '500px !important', marginTop: 10, p: 3, display: 'flex', justifyContent: 'center'}} disableGutters={true}>
      <Paper elevation={3} sx={{p: 3}}>
        <Box m={3} display='flex' alignItems='center' justifyContent='center'>
          <img src='./site_logo_full.svg' alt='site_logo' />
        </Box>
        <TextField
          label='Имейл'
          helperText={email.helperText}
          value={email.value}
          error={email.error}
          fullWidth
          sx={{mb: 1}}
          FormHelperTextProps={{ sx:{ color: email.error ? null : 'transparent' } }}
          onChange={(e) => changeEmail(e.target.value)}
        />
        <FormControl fullWidth sx={{mb: 1}} error={password.error}>
          <InputLabel>Парола</InputLabel>
          <OutlinedInput
            endAdornment={
              <InputAdornment position='end'>
                <IconButton onClick={() => setShowPassword(!showPassword)} onMouseDown={(e) => e.preventDefault()} edge='end'>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            type={showPassword ? 'text' : 'password'}
            value={password.value}
            onChange={(e)=> changePassword(e.target.value)}
            label='Парола'
          />
          <FormHelperText sx={{ color: password.error ? null : 'transparent' }}>{password.helperText}</FormHelperText>
        </FormControl>
        <LoadingButton fullWidth onClick={loginToServer} loading={connect} loadingIndicator='Connect to server ...' variant='contained'>вход в системата</LoadingButton>
      </Paper>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
    </Container>
  )
}

export default Login