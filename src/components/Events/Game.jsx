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
  overtime: 'draw',
  firstThird: { home: '', visitor: '' },
  secondThird: { home: '', visitor: '' },
  thirdThird: { home: '', visitor: '' },
  finalScore: { home: '', visitor: '' },
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
    const homeScore = Number(event.firstThird.home) + Number(event.secondThird.home) + Number(event.thirdThird.home)
    const visitorScore = Number(event.firstThird.visitor) + Number(event.secondThird.visitor) + Number(event.thirdThird.visitor)

    if (Number(event.finalScore.home) < homeScore || Number(event.finalScore.visitor < visitorScore)) {
      setErrorDialog({ show: true, message: 'Не е възможно общия резултат да е по-малък от сбора от третините!' })
      return
    }

    if (Number(event.finalScore.home) === Number(event.finalScore.visitor) && event.overtime !== 'draw') {
      setErrorDialog({ show: true, message: 'При продължение или наказателни удари трябва да има победител!' })
      return
    }

    if (![event.homeTeam, event.visitorTeam].includes(user.team._id)) {
      setErrorDialog({ show: true, message: 'Единият от двата отбора трябва да е вашият!' })
      return
    }

    if (event.homeTeam === event.visitorTeam) {
      setErrorDialog({ show: true, message: 'Двата отбора трябва да са различни!' })
      return
    }

    const body = {
      type: 'game',
      date: moment(getDate).toDate(),
      arena: event.arena,
      homeTeam: event.homeTeam,
      visitorTeam: event.visitorTeam,
      firstThird: event.firstThird,
      secondThird: event.secondThird,
      thirdThird: event.thirdThird,
      finalScore: event.finalScore,
      description: htmlData
    }
    if (homeScore === visitorScore) body.overtime = event.overtime
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

  const calcResult = () => {
    const allScores = [ ...Object.values(event.firstThird), ...Object.values(event.secondThird), ...Object.values(event.thirdThird)]
    if (allScores.some(x => x === null || x === undefined || x === '' || isNaN(x))) return false

    const homeScore = Number(event.firstThird.home) + Number(event.secondThird.home) + Number(event.thirdThird.home)
    const visitorScore = Number(event.firstThird.visitor) + Number(event.secondThird.visitor) + Number(event.thirdThird.visitor)
    
    return homeScore === visitorScore ? true : false
  }

  const changeScore = (part, team, value) => {
    if (isNaN(value) || Number(value) < 0 || value.length > 2) return

    const newScore = { ...event[part], [team]: value }
    const newEventData = { ...event, [part]: newScore }

    const allScores = [ ...Object.values(newEventData.firstThird), ...Object.values(newEventData.secondThird), ...Object.values(newEventData.thirdThird)]
    if (allScores.some(x => x === null || x === undefined || x === '' || isNaN(x))) {
      newEventData.finalScore = { home: '', visitor: '' }
    } else {
      newEventData.finalScore = {
        home: Number(newEventData.firstThird.home) + Number(newEventData.secondThird.home) + Number(newEventData.thirdThird.home),
        visitor: Number(newEventData.firstThird.visitor) + Number(newEventData.secondThird.visitor) + Number(newEventData.thirdThird.visitor)
      }  
    }
    setEvent(newEventData)
  }

  const changeFinalScore = (team, value) => {
    if (isNaN(value) || Number(value) < 0 || value.length > 2) return
    setEvent({ ...event, finalScore: { ...event.finalScore, [team]: value} })
  }

  const changeOvertime = (value) => {
    if (value === 'draw') {
      const finalScore = {
        home: Number(event.firstThird.home) + Number(event.secondThird.home) + Number(event.thirdThird.home),
        visitor: Number(event.firstThird.visitor) + Number(event.secondThird.visitor) + Number(event.thirdThird.visitor)
      }
      setEvent({ ...event, finalScore, overtime: value })
      return
    }
    setEvent({ ...event, overtime: value })
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
                    { teams.map(x => <MenuItem key={x._id} value={x._id}>{x.name} - {x.city.name}</MenuItem> ) }
                  </Select>
                </FormControl>
                <Box minWidth={20} />
                <FormControl fullWidth required>
                  <InputLabel sx={{zIndex: 0}} disabled={data && !editMode}>Гост</InputLabel>
                  <Select  size='small' value={event.visitorTeam} label='Гост' disabled={data && !editMode} onChange={(e) => setEvent({ ...event, visitorTeam: e.target.value })}>
                    { teams.map(x => <MenuItem key={x._id} value={x._id}>{x.name} - {x.city.name}</MenuItem> ) }
                  </Select>
                </FormControl>
                <Box minWidth={20} />
                <TextField size='small' label='Град' fullWidth value={arenas.filter(x => x._id === event.arena)[0].city.name} disabled />
              </Stack>
              <Stack direction='row' spacing={2.5} mb={2.5}>
                <Box height={40} border='1px solid rgba(0, 0, 0, 0.26)' borderRadius='4px' position='relative' p={2}>
                  <Typography variant='caption' sx={data && !editMode ? labelStyle : { ...labelStyle, color: 'rgba(0, 0, 0, 0.6)' }}>Първа третина</Typography>
                  <Stack direction='row' spacing={1}>
                    <TextField
                      size='small'
                      autoComplete='off'
                      disabled={data && !editMode}
                      sx={{width: 40}}
                      value={event.firstThird.home}
                      inputProps={event.firstThird.home?.toString().length > 1 ? {sx: { pl: 1.4, pr: 1.2 }} : {sx: {}}}
                      onChange={(e) => changeScore('firstThird', 'home', e.target.value)}
                    />
                    <Box display='flex' alignItems='center'>:</Box>
                    <TextField
                      size='small'
                      autoComplete='off'
                      disabled={data && !editMode}
                      value={event.firstThird.visitor}
                      sx={{width: 40}}
                      inputProps={event.firstThird?.visitor?.toString().length > 1 ? {sx: { pl: 1.4, pr: 1.2 }} : {sx: {}}}
                      onChange={(e) => changeScore('firstThird', 'visitor', e.target.value)}
                    />
                  </Stack>
                </Box>
                <Box height={40} border='1px solid rgba(0, 0, 0, 0.26)' borderRadius='4px' position='relative' p={2}>
                  <Typography variant='caption' sx={data && !editMode ? labelStyle : { ...labelStyle, color: 'rgba(0, 0, 0, 0.6)' }}>Втора третина</Typography>
                  <Stack direction='row' spacing={1}>
                    <TextField
                      size='small'
                      autoComplete='off'
                      disabled={data && !editMode}
                      sx={{width: 40}}
                      value={event.secondThird.home}
                      inputProps={event.secondThird.home.toString().length > 1 ? {sx: { pl: 1.4, pr: 1.2 }} : {sx: {}}}
                      onChange={(e) => changeScore('secondThird', 'home', e.target.value)}
                    />
                    <Box display='flex' alignItems='center'>:</Box>
                    <TextField
                      size='small'
                      autoComplete='off'
                      disabled={data && !editMode}
                      sx={{width: 40}}
                      value={event.secondThird.visitor}
                      inputProps={event.secondThird.visitor.toString().length > 1 ? {sx: { pl: 1.4, pr: 1.2 }} : {sx: {}}}
                      onChange={(e) => changeScore('secondThird', 'visitor', e.target.value)}
                    />
                  </Stack>
                </Box>
                <Box height={40} border='1px solid rgba(0, 0, 0, 0.26)' borderRadius='4px' position='relative' p={2}>
                  <Typography variant='caption' sx={data && !editMode ? labelStyle : { ...labelStyle, color: 'rgba(0, 0, 0, 0.6)' }}>Трета третина</Typography>
                  <Stack direction='row' spacing={1}>
                    <TextField
                      size='small'
                      autoComplete='off'
                      disabled={data && !editMode}
                      sx={{width: 40}}
                      value={event.thirdThird.home}
                      inputProps={event.thirdThird.home.toString().length > 1 ? {sx: { pl: 1.4, pr: 1.2 }} : {sx: {}}}
                      onChange={(e) => changeScore('thirdThird', 'home', e.target.value)}
                    />
                    <Box display='flex' alignItems='center'>:</Box>
                    <TextField
                      size='small'
                      autoComplete='off'
                      disabled={data && !editMode}
                      sx={{width: 40}}
                      value={event.thirdThird.visitor}
                      inputProps={event.thirdThird.visitor.toString().length > 1 ? {sx: { pl: 1.4, pr: 1.2 }} : {sx: {}}}
                      onChange={(e) => changeScore('thirdThird', 'visitor', e.target.value)}
                    />
                  </Stack>
                </Box>
                <Box height={40} border='1px solid rgba(0, 0, 0, 0.26)' borderRadius='4px' position='relative' p={2}>
                  <Typography variant='caption' sx={data && !editMode ? labelStyle : { ...labelStyle, color: 'rgba(0, 0, 0, 0.6)' }}>Краен резултат</Typography>
                  <Stack direction='row' spacing={1}>
                    <TextField
                      size='small'
                      autoComplete='off'
                      disabled={(data && !editMode) || event.overtime === 'draw'}
                      sx={{width: 40}}
                      value={event.finalScore.home}
                      inputProps={event.finalScore.home.toString().length > 1 ? {sx: { pl: 1.4, pr: 1.2 }} : {sx: {}}}
                      onChange={(e) => changeFinalScore('home', e.target.value)}
                    />
                    <Box display='flex' alignItems='center'>:</Box>
                    <TextField
                      size='small'
                      autoComplete='off'
                      disabled={(data && !editMode) || event.overtime === 'draw'}
                      sx={{width: 40}}
                      value={event.finalScore.visitor}
                      inputProps={event.finalScore.visitor.toString().length > 1 ? {sx: { pl: 1.4, pr: 1.2 }} : {sx: {}}}
                      onChange={(e) => changeFinalScore('visitor', e.target.value)}
                    />
                  </Stack>
                </Box>
                {
                  calcResult()
                    ? <FormControl fullWidth required>
                        <InputLabel sx={{zIndex: 0}} disabled={data && !editMode}>Забележка</InputLabel>
                        <Select size='small' value={event.overtime} disabled={data && !editMode} label='Забележка' onChange={(e) => changeOvertime(e.target.value)}>
                          <MenuItem value='draw'>Равен резултат</MenuItem>
                          <MenuItem value='overtime'>Продължение</MenuItem>
                          <MenuItem value='penalties'>Наказателни удари</MenuItem>
                        </Select>
                      </FormControl>
                    : null
                }
              </Stack>
              {
                data && !editMode
                  ? <Box height={154} border='1px solid rgba(0, 0, 0, 0.26)' borderRadius='4px' position='relative' p={2} pr={0}>
                      <Typography variant='caption' sx={labelStyle}>Описание</Typography>
                      <Scrollbars style={{color: 'rgba(0, 0, 0, 0.38)'}}>
                        <Box pr={2} fontFamily='CorsaGrotesk' fontSize='14px'>{ parse(data.description) }</Box>
                      </Scrollbars>
                    </Box>
                  : <CKEditor config={{ ...editorConfig, height: 140}} initData={event.description} onChange={(e) => setHtmlData(e.editor.getData())} />
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