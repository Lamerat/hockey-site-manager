import mainTheme from '../theme/MainTheme'

export const previewPopoverStyle = {
  elevation: 0,
  sx: {
    fontFamily: 'CorsaGrotesk',
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    backgroundColor: 'white',
    border: `1px solid ${mainTheme.palette.primary.light}`,
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      backgroundColor: 'white',
      borderLeft: `1px solid ${mainTheme.palette.primary.light}`,
      borderTop: `1px solid ${mainTheme.palette.primary.light}`,
      zIndex: 1,
    },
  },
}

export const photoStyle = {
  borderRadius: 3,
  padding: 1,
  maxWidth: 150
}