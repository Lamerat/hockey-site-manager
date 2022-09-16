import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const ErrorDialog = ({ text, closeFunc }) => {
  return (
    <Dialog
      fullWidth
      open={true}
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogTitle>Грешка</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{pr: 3, pb: 2}}>
        <Button onClick={() => closeFunc({ show: false, message: '' })}>Затвори</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ErrorDialog