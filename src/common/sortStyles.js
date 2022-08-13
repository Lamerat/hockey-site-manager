export const sortBox = {
  display: 'flex',
  fontFamily: 'CorsaGrotesk',
  fontWeight: 'bold',
  fontSize: '14px',
  alignContent: 'center',
  cursor: 'pointer',
}

export const sortLabel = {
  marginRight: 0.5,
  paddingTop: 0.1,
}

export const rotateAngle = (direction) => {
  return {
    animation: 'spin 0.3s linear',
  '@keyframes spin': {
    '0%': {
      transform: `rotate(${ direction ? 180 : -180}deg)`,
    },
    '100%': {
      transform: `rotate(0deg)`,
    },
  },
  }
}