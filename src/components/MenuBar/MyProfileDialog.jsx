import React, { forwardRef, useState, useEffect, useRef, useContext } from 'react'
import { styled } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, IconButton, InputAdornment, Tooltip, Button } from '@mui/material'
import { cleanCredentials } from '../../config/storage'
import { myProfileRequest, changeProfileName } from '../../api/user'
import UserContext from '../../context/UserContext'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EditIcon from '@mui/icons-material/Edit'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import mainTheme from '../../theme/MainTheme'
import CircularProgress from '@mui/material/CircularProgress'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import PasswordDialog from './PasswordDialog'


const titleStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }
const secondColor = mainTheme.palette.secondary.main

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} { ...props } />
})

const DisabledField = styled(TextField)(() => ({
  '.MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: '#000',
    color: '#000'
  }  
}))

const infoDefault = { email: '', name: '', team: { name: '' } }

const MyProfileDialog = ({ closeFunc }) => {
  const { user, setUser } = useContext(UserContext)

  const firstRenderRef = useRef(true)
  const nameField = useRef(null)

  const [info, setInfo] = useState(infoDefault)
  const [editMode, setEditMode] = useState(false)
  const [prepareEdit, setPrepareEdit] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })

  const history = useNavigate()

  const authError = () => {
    cleanCredentials()
    history('/')
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

    myProfileRequest()
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      setInfo(result.payload)
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [history])


  const changeName = () => {
    changeProfileName({ name: info.name })
    .then(x => {
      if (x.status === 401) authError()
      return x.json()
    })
    .then(result => {
      if (!result.success) throw new Error(result.message)
      setInfo(result.payload)
      setUser({ ...user, name: result.payload.name })
      const oldUserData = JSON.parse(localStorage.getItem('user'))
      localStorage.setItem('user', JSON.stringify({ ...oldUserData, name: result.payload.name }))
      setEditMode(false)
    })
    .catch(error => setErrorDialog({ show: true, message: error.message }))
  }

  const cancelChangeName = () => {
    setInfo({ ...info, name: user.name })
    setEditMode(false)
  }

  const closeDialog = () => {
    if (editMode) {
      setConfirmDialog({
        show: true,
        message: `Сигурни ли сте, че искате да прекратите започнатата редакция?`,
        acceptFunc: () => {
          setConfirmDialog({ show: false, message: '' })
          setEditMode(false)
          closeFunc(false)
        }
      })
    } else {
      closeFunc(false)
    }
  }

  return (
    <Dialog open={true} TransitionComponent={Transition} keepMounted maxWidth='xs' fullWidth PaperProps={{sx: { p: 2}}}>
      <Box sx={titleStyle} borderBottom={1} borderColor={mainTheme.palette.secondary.main}>
        <Typography fontFamily='CorsaGrotesk' color={secondColor} variant='h6' pb={0.5}>Моят профил</Typography>
      </Box>
      {
        info.team.name === ''
          ? <Box minHeight='267.89px' display='flex' alignItems='center' justifyContent='center'><CircularProgress size='150px' /></Box>
          : <>
              <DisabledField
                disabled
                label='Отбор'
                value={info.team.name}
                InputLabelProps={ { sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px', scale: '1.1', pr: 0.5, backgroundColor: 'white' } } }
                InputProps={{
                  sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px' },
                  endAdornment: <InputAdornment position='end'><PeopleAltIcon color='secondary' /></InputAdornment>
                }}
                sx={{ mb: 3 }}
              />
              <DisabledField
                disabled
                label='Имейл'
                value={info.email}
                InputLabelProps={ { sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px', scale: '1.1', pr: 0.5, backgroundColor: 'white' } } }
                InputProps={{
                  sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px' },
                  endAdornment: <InputAdornment position='end'><AlternateEmailIcon color='secondary' /></InputAdornment>
                }}
                sx={{ mb: 3 }}
              />
              <DisabledField
                disabled={!editMode}
                ref={nameField}
                label='Име'
                value={info.name}
                sx={{ mb: 3 }}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                onMouseEnter={() => editMode ? null : setPrepareEdit(true)}
                onMouseLeave={() => editMode ? null : setPrepareEdit(false)}
                InputLabelProps={ { sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px', scale: '1.1', pr: 0.5, backgroundColor: 'white' } } }
                InputProps={{
                  sx: { fontFamily: 'CorsaGrotesk', fontSize: '14px' },
                  endAdornment: (
                    <InputAdornment position='end'>
                      {
                        prepareEdit
                          ? editMode
                            ? <>
                                <Tooltip title='Потвърди' placement='top' arrow>
                                  <IconButton size='small' sx={{ mr: 0 }} onClick={changeName}><CheckIcon color='success' /></IconButton>
                                </Tooltip>
                                <Tooltip title='Откажи' placement='top' arrow>
                                  <IconButton size='small' sx={{ mr: -0.6 }} onClick={cancelChangeName}><ClearIcon color='error' /></IconButton>
                                </Tooltip>
                              </>
                            : <Tooltip title='Редактирай' placement='top' arrow>
                                <IconButton size='small' sx={{ mr: -0.6 }} onClick={() => setEditMode(true)}><EditIcon /></IconButton>
                              </Tooltip>
                          : <AccountCircleIcon color='secondary' />
                      }
                    </InputAdornment>
                  )
                }}
              />
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Button variant='contained' color='secondary' onClick={() => setShowPasswordDialog(true)}>Смяна на парола</Button>
                <Button variant='contained' color='secondary' onClick={closeDialog}>Затвори</Button>
              </Box>
            </>
      }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { showPasswordDialog ? <PasswordDialog closeFunc={setShowPasswordDialog} authError={authError} /> : null }
    </Dialog>
  )
}

export default MyProfileDialog