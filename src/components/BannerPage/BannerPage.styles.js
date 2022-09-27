export const menuPaperStyleSmall = {
  elevation: 0,
  sx: {
    fontFamily: 'CorsaGrotesk',
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
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
      right: 10,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  },
}


export const bannerImageStyle = {
  maxHeight: '55px',
  maxWidth: '143px',
  backgroundColor: '#2b2b2b',
  border: '1px solid black',
  borderRadius: ' 4px'
}


export const dialogBannerStyle = {
  maxWidth: '200px',
  maxHeight: '78px',
  backgroundColor: '#2b2b2b',
  border: '1px solid black',
  borderRadius: ' 4px',
  
}


export const imageEmptyBox = {
  color: 'black',
  maxWidth: '184px',
  maxHeight: '62px',
  minHeight: '62px',
  display: 'flex',
  alignItems: 'center',
  border: '1px solid black',
  borderRadius: ' 4px',
  fontFamily: 'CorsaGrotesk',
  fontSize: '12px',
  textAlign: 'center',
  justifyContent: 'center',
  p: 1,  
}