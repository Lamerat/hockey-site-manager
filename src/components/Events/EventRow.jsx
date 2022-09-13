import React, { useState, useRef } from 'react'
import { Paper, Box, Stack, Popover, Typography } from '@mui/material'
import { formatDate } from '../../common/help-functions'
import { eventTranslation } from '../../config/constants'
import moment from 'moment'

const EventRow = ({ row, actionFunc }) => {
  const [showWarning, setShowWarning] = useState(false)
  const anchorPopover = useRef(null)

  const score = row.type === 'game' && row.finalScore.home ? `${row.finalScore.home} : ${row.finalScore.visitor}` : ' - '
  const overtime = row.type === 'game' && row.finalScore.home && row?.overtime !== 'draw'
    ? row?.overtime === 'overtime' ? '(пр)' : '(д)'
    : null

  let pastGame = false
  if (row.type === 'game' && moment(row.date).add(1, 'days').isBefore(new Date())) {
    if (!row.finalScore.home || !row.finalScore.visitor) pastGame = true
  }
  

  return (
    <Paper
      elevation={1}
      sx={{p: 1.5, mt: 1, cursor: 'pointer', backgroundColor: pastGame ? '#ffebc8' : null}}
      onClick={() => actionFunc(row._id)}
      onMouseEnter={() => setShowWarning(true)}
      onMouseLeave={() => setShowWarning(false)}
      ref={anchorPopover}
    >   
      <Stack direction='row' alignItems='center' minHeight={28}>
        <Box width='9%' fontFamily='CorsaGrotesk' fontSize='14px'>{formatDate(row.date)}</Box>
        <Box width='9%' fontFamily='CorsaGrotesk' fontSize='14px'>{eventTranslation[row.type]}</Box>
        <Box width='12%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.city.name}</Box>
        <Box width='18%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.type === 'other' ? '-' : row.arena.name}</Box>
        <Box width='13%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.type !== 'game' ? '-' : row.homeTeam.name}</Box>
        <Box width='13%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.type !== 'game' ? '-' : row.visitorTeam.name}</Box>
        <Box width='12%' fontFamily='CorsaGrotesk' fontSize='14px'>{score}<span style={{fontSize: '12px', paddingLeft: 3}}>{overtime}</span></Box>
        <Box width='14%' fontFamily='CorsaGrotesk' fontSize='14px'>{row.createdBy.name}</Box>
      </Stack>
      <Popover
        sx={{ pointerEvents: 'none' }}
        PaperProps={{sx: { backgroundColor: 'red', color: 'white' }}}
        open={pastGame && showWarning}
        anchorEl={anchorPopover.current}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => setShowWarning(false)}
        disableRestoreFocus
      >
        <Typography fontFamily='CorsaGrotesk' fontSize='14px' sx={{ p: 1 }}>Мачът трябва вече да е завършил но липсва резултат</Typography>
      </Popover>
    </Paper>
  )
}

export default EventRow