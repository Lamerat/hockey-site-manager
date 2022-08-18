import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'


const StyledButton = styled(Button)({  
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  width: 40,
  minWidth: 40,
  maxHeight: 40,
  padding: 6,
  '& .MuiButton-startIcon': { margin: 0 }
});

export default StyledButton