import { styled } from '@mui/material/styles'
import { TextField } from '@mui/material'


const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
})

export default StyledTextField