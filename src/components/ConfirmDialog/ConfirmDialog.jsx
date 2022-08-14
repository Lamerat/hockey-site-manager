import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const ConfirmDialog = ({ text, acceptFunc, cancelFunc }) => {
  return (
    <Dialog
      fullWidth
      open={true}
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogTitle>Моля потвърдете</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{pr: 3, pb: 2}}>
        <Button variant='contained' color='error' onClick={() => acceptFunc()}>Потвърди</Button>
        <Button variant='contained' color='primary' onClick={() => cancelFunc({ show: false, text: '' })}>Откажи</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog