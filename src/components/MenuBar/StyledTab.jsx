import { styled } from '@mui/material/styles'
import { Tab } from '@mui/material'
import { useNavigate } from 'react-router-dom';

const StyledTab = styled(props => {
    const history = useNavigate()

    const goToLink = (event) => {
      event.preventDefault()
      history(event.target.name)
    }

    return <Tab disableRipple {...props} onClick={goToLink} component='a' />
  }
  )
  (
  ({ theme }) => ({
    textTransform: 'none',
    fontFamily: 'CorsaGrotesk',
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: 'white',
    paddingBottom: 20,
    '&:hover': {
      color: '#ffe082',
      opacity: 1,
    },
    '&.Mui-selected': {
      color: '#ffc107',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&.Mui-focusVisible': {
      backgroundColor: '#ffc107',
    },
  }),
)

export default StyledTab