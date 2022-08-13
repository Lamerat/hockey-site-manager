import { styled } from '@mui/material/styles'
import { Tabs } from '@mui/material'

const StyledTabs = styled(Tabs)({
  height: '100%',
  alignItems: 'end',
  '& .MuiTabs-indicator': {
    backgroundColor: '#ffc107',
    height: 3,
  },
})

export default StyledTabs