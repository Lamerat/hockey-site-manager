import React from 'react'
import { Popover, CardMedia } from '@mui/material'
import { previewPopoverStyle, photoStyle } from '../../common/image-preview-style'


const ImagePreview = ({ data, anchor, closeFunc }) => {
  return (
    <Popover
      sx={{ pointerEvents: 'none' }}
      open={data.show}
      anchorEl={anchor}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      onClose={closeFunc}
      disableRestoreFocus
      PaperProps={previewPopoverStyle}
    >
      <CardMedia component='img' image={data.image} sx={photoStyle} />
    </Popover>
  )
}

export default ImagePreview