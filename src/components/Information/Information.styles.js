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

export const searchMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
}


export const badgeProps = {
  '& .MuiBadge-badge': {
    color: 'lightgreen',
    backgroundColor: '#ffc107'
  }
}

export const photoStyle = {
  borderRadius: 1,
  boxShadow: 'rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px'
}


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