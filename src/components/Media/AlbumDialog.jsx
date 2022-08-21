import React, { useState } from 'react'
import { FormGroup, Box, Typography, IconButton, Dialog, Slide } from '@mui/material'
import mainTheme from '../../theme/MainTheme'
import CloseIcon from '@mui/icons-material/Close'
import StyledTextField from '../StyledElements/StyledTextField'
import StyledButton from '../StyledElements/StyledButton'


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})


const AlbumDialog = ({ data, editMode, actionFunc, closeFunc }) => {
  const [title, setTitle] = useState({ value: editMode ? data.value : '', error: false })

  const checkTitle = () => {
    if (!title.value.trim() || title.value.length < 2) {
      setTitle({ ...title, error: true })
      return
    }

    editMode ? actionFunc(data.id, title.value) : actionFunc(title.value)
  }

  return (
    <Dialog open={true} TransitionComponent={Transition} keepMounted fullWidth maxWidth='xs'>
      <Box display='flex' justifyContent='space-between' alignItems='center' m={1.5} mb={0}>
        <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.primary.main} variant='h6' pb={0.5}>
          { editMode ? 'Редактиране на албум' : 'Добавяне на нов албум' }
        </Typography>
        <IconButton onClick={() => closeFunc({ show: false })}><CloseIcon /></IconButton>
      </Box>
      <Box m={1.5} mb={2}>
        <FormGroup row>
          <StyledTextField
            size='small'
            variant='outlined'
            label={ title.error ? 'Име на албума (мин. 2 символа)' : 'Име на албума' }  
            error={title.error}
            value={title.value}
            sx={{ width: editMode ? 'calc(100% - 120px)' : 'calc(100% - 100px)'}}
            onChange={(e) => setTitle({ value: e.target.value, error: false })}
          />
          <StyledButton variant='contained' sx={{minWidth: editMode ? 120 : 100}} onClick={checkTitle}>{ editMode ? 'Редактирай' : 'Добави' }</StyledButton>
        </FormGroup>
      </Box>
    </Dialog>
  )
}

export default AlbumDialog