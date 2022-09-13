import React, { useState, forwardRef, useRef, useEffect, useContext } from 'react'
import { Box, Typography, FormControl, InputLabel, Select, Button, MenuItem, IconButton, InputAdornment, Menu, ListItemIcon, Tooltip, Stack, TextField } from '@mui/material'
import { CKEditor } from 'ckeditor4-react'
import { editorConfig } from '../../common/ck-simple-config'
import { labelStyle, menuPaperStyle } from './Event.styles'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { listArenas } from '../../api/arena'
import { listTeams } from '../../api/team'
import UserContext from '../../context/UserContext'
import moment from 'moment'
import Dialog from '@mui/material/Dialog'
import mainTheme from '../../theme/MainTheme'
import Slide from '@mui/material/Slide'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import DatePicker from 'react-datepicker'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MenuIcon from '@mui/icons-material/Menu'
import CircularProgress from '@mui/material/CircularProgress'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import EditOffIcon from '@mui/icons-material/EditOff'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import parse from 'html-react-parser'
import sanitizeHtml from 'sanitize-html'
import 'react-datepicker/dist/react-datepicker.css'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})


const titleStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }
const secondColor = mainTheme.palette.secondary.main
const defaultGame = {
  date: new Date(),
  time: new Date(),
  arena: '',
  homeTeam: '',
  visitorTeam: '',
  draw: false,
  overtime: 'overtime',
  firstThird: { home: 0, visitor: 0 },
  secondThird: { home: 0, visitor: 0 },
  thirdThird: { home: 0, visitor: 0 },
  finalScore: { home: 0, visitor: 0 },
  description: '',
}

const Game = ({ data, addFunction, closeFunc, editFunction, deleteFunc }) => {
  const { user } = useContext(UserContext)

  const firstRenderRef = useRef(true)
  const menuAnchor = useRef(null)

  const [event, setEvent] = useState(data ? data : defaultGame)
  const [htmlData, setHtmlData] = useState(data ? data.description : '')
  const [arenas, setArenas] = useState(null)
  const [teams, setTeams] = useState(null)
  const [openMenu, setOpenMenu] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })


  useEffect(() => {
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    listArenas({ noPagination: true })
      .then(x => x.json())
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setArenas(result.payload.docs)
        if (!data) {
          setEvent(event => ({ ...event, arena: result.payload.docs[0]._id }))
          defaultGame.arena = result.payload.docs[0]._id
        }
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [data])


  useEffect(() => {
    if(event.arena === '') return

    listTeams({ noPagination: true })
      .then(x => x.json())
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setTeams(result.payload.docs)
        if (!data) {
          const homeTeam = user.team._id
          const visitorTeam = result.payload.docs.filter(z => z._id.toString() !== homeTeam.toString())[0]._id
          setEvent(event => ({ ...event, homeTeam, visitorTeam}))
          defaultGame.homeTeam = homeTeam
          defaultGame.visitorTeam = visitorTeam
        }
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [data, event.arena, user])


  const closeDialog = () => {
    let haveChanges = false

    if (!data) {
      Object.keys(event).forEach(x => event[x].toString() !== defaultGame[x].toString() ? haveChanges = true : null)
      const simpleText = sanitizeHtml(htmlData, { allowedTags: []})
      if (simpleText.trim()) haveChanges = true
    } else if (editMode) {
      Object.keys(event).forEach(x => event[x].toString() !== data[x].toString() ? haveChanges = true : null)
      if (htmlData !== data.description) haveChanges = true
    }

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


  const actionFunc = () => {
    const getDate = moment(event.date).format('YYYY-MM-DD') + 'T' + moment(event.time).format('HH:mm')
    const body = {
      type: 'training',
      date: moment(getDate).toDate(),
      arena: event.arena,
      description: htmlData
    }

    if (data && data._id) body._id = data._id

    if (!editMode) {
      addFunction(body)
    } else {
      editFunction(body)
    }
  }


  const cancelEdit = () => {
    let haveChanges = false
    Object.keys(event).forEach(x => event[x].toString() !== data[x].toString() ? haveChanges = true : null)
    if (htmlData !== data.description) haveChanges = true

    if (haveChanges) {
      setConfirmDialog({
        show: true,
        message: `Сигурни ли сте, че искате да прекратите процеса?<br/>Всички данни ще бъдат загубени!`,
        acceptFunc: () => {
          setConfirmDialog({ show: false, message: '' })
          setEvent(data)
          setEditMode(false)
        }
      })
    } else {
      setEvent(data)
      setEditMode(false)
    }
  }


  return (
    <Dialog disableEnforceFocus open={true} TransitionComponent={Transition} keepMounted maxWidth='md' fullWidth PaperProps={{sx: { p: 2, overflow: 'unset' }}}>
      <Box sx={titleStyle} borderBottom={1} borderColor={secondColor}>
        <Typography fontFamily='CorsaGrotesk' color={secondColor} variant='h6' pb={0.5}>{ data ? editMode ? 'Редакция на мач' : 'Преглед на мач' : 'Добавяне на нов мач' }</Typography>
        <Box display='flex' alignItems='center' mr={-1}>
          {
            data && !editMode
              ? <IconButton ref={menuAnchor} onClick={() => setOpenMenu(!openMenu)}><MenuIcon color='secondary' /></IconButton>
              : editMode
                ? <Tooltip title='Откажи редактирането' arrow>
                    <IconButton onClick={cancelEdit}><EditOffIcon color='secondary' /></IconButton>
                  </Tooltip>
                : null
          }
        </Box>
      </Box>
      {
        !arenas || !teams
          ? <Box minHeight='424.5px' width='100%' display='flex' alignItems='center' justifyContent='center'><CircularProgress size='100px'/></Box>
          : <Box>
              <Stack direction='row' spacing={0} mb={2.5}>
                <DatePicker
                  selected={event.date}
                  onChange={(date) => setEvent({ ...event, date })}
                  dateFormat='dd-MM-yyyy'
                  peekNextMonth
                  dropdownMode='select'
                  disabled={data && !editMode}
                  customInput={
                    <TextField
                      size='small'
                      disabled={data && !editMode}
                      fullWidth
                      label='Дата'
                      variant='outlined'
                      InputLabelProps={{ required: true }}
                      InputProps={{
                        required: true,
                        fullWidth: true,
                        autoComplete: 'off',
                        endAdornment: (<InputAdornment position='start'><CalendarMonthIcon sx={{mr: -2, opacity: data && !editMode ? 0.2 : 1}} color='primary' /></InputAdornment>)
                      }}
                    />
                  }
                />
                <Box minWidth={20} />
                <DatePicker
                  selected={event.time}
                  onChange={(time) => setEvent({ ...event, time })}
                  dateFormat='HH:mm'
                  popperPlacement='bottom'
                  timeFormat='HH:mm'
                  timeIntervals={10}
                  showTimeSelect
                  showTimeSelectOnly
                  dropdownMode='scroll'
                  disabled={data && !editMode}
                  customInput={
                    <TextField
                      size='small'
                      fullWidth
                      label='Час'
                      variant='outlined'
                      InputLabelProps={{ required: true }}
                      InputProps={{
                        required: true,
                        fullWidth: true,
                        autoComplete: 'off',
                        endAdornment: (<InputAdornment position='start'><AccessTimeIcon sx={{mr: -2, opacity: data && !editMode ? 0.2 : 1}} color='primary' /></InputAdornment>)
                      }}
                    />
                  }
                />
                <Box minWidth={20} />
                <FormControl fullWidth required>
                  <InputLabel sx={{zIndex: 0}} disabled={data && !editMode}>Пързалка</InputLabel>
                  <Select  size='small' value={event.arena} label='Пързалка' disabled={data && !editMode} onChange={(e) => setEvent({ ...event, arena: e.target.value })}>
                    { arenas.map(x => <MenuItem key={x._id} value={x._id}>{x.name}</MenuItem> ) }
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction='row' spacing={0} mb={2.5}>
                <FormControl fullWidth required>
                  <InputLabel sx={{zIndex: 0}} disabled={data && !editMode}>Домакин</InputLabel>
                  <Select  size='small' value={event.homeTeam} label='Домакин' disabled={data && !editMode} onChange={(e) => setEvent({ ...event, homeTeam: e.target.value })}>
                    { teams.map(x => <MenuItem key={x._id} value={x._id}>{x.name}</MenuItem> ) }
                  </Select>
                </FormControl>
                <Box minWidth={20} />
                <FormControl fullWidth required>
                  <InputLabel sx={{zIndex: 0}} disabled={data && !editMode}>Гост</InputLabel>
                  <Select  size='small' value={event.visitorTeam} label='Гост' disabled={data && !editMode} onChange={(e) => setEvent({ ...event, visitorTeam: e.target.value })}>
                    { teams.map(x => <MenuItem key={x._id} value={x._id}>{x.name}</MenuItem> ) }
                  </Select>
                </FormControl>
                <Box minWidth={20} />
                <TextField size='small' label='Град' fullWidth value={arenas.filter(x => x._id === event.arena)[0].city.name} disabled />
              </Stack>
              <Stack direction='row' spacing={2.5} mb={2.5}>
                <Box height={40} border='1px solid rgba(0, 0, 0, 0.26)' borderRadius='4px' position='relative' p={2}>
                  <Typography variant='caption' sx={labelStyle}>Първа третина</Typography>
                  <Stack direction='row' spacing={1}>
                    <TextField size='small' value={0} sx={{width: 40}} />
                    <Box display='flex' alignItems='center'>:</Box>
                    <TextField size='small' value={0} sx={{width: 40}} />
                  </Stack>
                </Box>
                <Box height={40} border='1px solid rgba(0, 0, 0, 0.26)' borderRadius='4px' position='relative' p={2}>
                  <Typography variant='caption' sx={labelStyle}>Втора третина</Typography>
                  <Stack direction='row' spacing={1}>
                    <TextField size='small' value={0} sx={{width: 40}} />
                    <Box display='flex' alignItems='center'>:</Box>
                    <TextField size='small' value={0} sx={{width: 40}} />
                  </Stack>
                </Box>
                <Box height={40} border='1px solid rgba(0, 0, 0, 0.26)' borderRadius='4px' position='relative' p={2}>
                  <Typography variant='caption' sx={labelStyle}>Трета третина</Typography>
                  <Stack direction='row' spacing={1}>
                    <TextField size='small' value={0} sx={{width: 40}} />
                    <Box display='flex' alignItems='center'>:</Box>
                    <TextField size='small' value={0} sx={{width: 40}} />
                  </Stack>
                </Box>
                <Box height={40} border='1px solid rgba(0, 0, 0, 0.26)' borderRadius='4px' position='relative' p={2}>
                  <Typography variant='caption' sx={labelStyle}>Краен резултат</Typography>
                  <Stack direction='row' spacing={1}>
                    <TextField size='small' value={0} sx={{width: 40}} />
                    <Box display='flex' alignItems='center'>:</Box>
                    <TextField size='small' value={0} sx={{width: 40}} />
                  </Stack>
                </Box>
                <FormControl fullWidth required>
                  <InputLabel sx={{zIndex: 0}} disabled={data && !editMode}>Забележка</InputLabel>
                  <Select size='small' value='draw' label='Забележка'>
                    <MenuItem value='draw'>Равен резултат</MenuItem>
                    <MenuItem value='overtime'>Продължение</MenuItem>
                    <MenuItem value='penalty'>Наказателни удари</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              {
                data && !editMode
                  ? <Box height={212} border='1px solid rgba(0, 0, 0, 0.26)' borderRadius='4px' position='relative' p={2} pr={0}>
                      <Typography variant='caption' sx={labelStyle}>Описание</Typography>
                      <Scrollbars style={{color: 'rgba(0, 0, 0, 0.38)'}}>
                        <Box pr={2}>{ parse(data.description) }</Box>
                      </Scrollbars>
                    </Box>
                  : <CKEditor config={{ ...editorConfig, height: 100}} initData={event.description} onChange={(e) => setHtmlData(e.editor.getData())} />
              }
              <Box mt={3} display='flex' justifyContent='right'>
                  <Button variant='contained' color='secondary' onClick={closeDialog}>Затвори</Button>
                  { data && !editMode ? null : <Button variant='contained' sx={{ml: 1}} onClick={actionFunc}>{ editMode ? 'Редактирай' : 'Добави'}</Button> }
              </Box>
            </Box>
      }
      <Menu
        anchorEl={menuAnchor.current}
        keepMounted={true}
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        onClick={() => setOpenMenu(false)}
        PaperProps={menuPaperStyle}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{fontFamily: 'CorsaGrotesk', fontSize: '14px'}} onClick={() => setEditMode(true)}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}>
            <EditIcon fontSize='small' color='primary' />
          </ListItemIcon>
          Редактирай
        </MenuItem>
        <MenuItem sx={{fontFamily: 'CorsaGrotesk',  fontSize: '14px'}} onClick={() => deleteFunc(data._id)}>
          <ListItemIcon sx={{ml: -0.5, minWidth: '30px !important'}}>
            <DeleteIcon fontSize='small' color='error'/>
          </ListItemIcon>
          Изтрий
        </MenuItem>
      </Menu>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
    </Dialog>
  )
}

export default Game