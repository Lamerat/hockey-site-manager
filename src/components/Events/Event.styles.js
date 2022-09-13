export const menuPaperStyle = {
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
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  },
}

export const badgeProps = {
  '& .MuiBadge-badge': {
    color: 'lightgreen',
    backgroundColor: '#ffc107'
  }
}


export const labelStyle = {
  backgroundColor: 'white',
  position: 'absolute',
  fontSize: '1rem !important',
  scale: '0.75 !important',
  lineHeight: '1.4375em',
  letterSpacing: '0.00938em',
  pl: 0.6,
  pr: 0.6,
  whiteSpace: 'nowrap',
  top: -14,
  left: -2,
  color: 'rgba(0, 0, 0, 0.38)'
}

export const searchMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
}