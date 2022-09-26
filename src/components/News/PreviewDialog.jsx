import React, { useEffect, useState, useRef } from 'react'
import Dialog from '@mui/material/Dialog'
import CircularProgress from '@mui/material/CircularProgress'
import Slide from '@mui/material/Slide'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import { singleNewsRequest } from '../../api/news'
import { Box, Typography, Grid, CardMedia, Divider, IconButton } from '@mui/material'
import parse from 'html-react-parser'
import { photoStyle } from './News.styles'
import { Scrollbars } from 'react-custom-scrollbars-2'
import CloseIcon from '@mui/icons-material/Close'
import { DEV_MODE } from '../../config/constants'


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const PreviewDialog = ({newsId, closeFunc}) => {
  const firstRenderRef = useRef(true)

  const [newsData, setNewsData] = useState(null)
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })

  useEffect(() => {
    if (firstRenderRef.current && DEV_MODE) {
      firstRenderRef.current = false
      return
    }
    singleNewsRequest(newsId)
      .then(x => x.json())
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setNewsData(result.payload)
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))

  }, [newsId])

  return (
    <Dialog
      fullWidth={true}
      maxWidth='md'
      open={true}
      TransitionComponent={Transition}
    >
      <Box display='flex' justifyContent='flex-end' mb={-2} sx={{zIndex: 200, backgroundColor: 'white'}}>
        <IconButton size='small' onClick={() => closeFunc({ show: false })}>
          <CloseIcon />
        </IconButton>
      </Box>
      {
        !newsData
          ? <Box minHeight='300px' display='flex' justifyContent='center' alignItems='center'><CircularProgress color='secondary' size={100} /></Box>
          : <Scrollbars autoHeight autoHeightMin={100} autoHeightMax='calc(100vh - 75px)'>
              <Box p={2} fontFamily='CorsaGrotesk' fontSize='13px'>
                <Grid container spacing={1.5}>
                  <Grid item xs={4}>
                    <CardMedia component='img' image={newsData.coverPhoto.address} sx={photoStyle} />
                      <Grid container spacing={2} mt={0}>
                      { newsData.photos.map((el, index) => <Grid key={index} item xs={6}><CardMedia component='img' image={el.address} sx={photoStyle} /></Grid>) }
                      </Grid>
                  </Grid>
                  <Grid item xs={8} display='flex'>
                    <Divider orientation='vertical'/>
                    <Box ml={1.5}>
                      <Typography fontFamily='inherit' fontWeight='bold' variant='h5'>{newsData.title}</Typography>
                      {parse(newsData.text)}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Scrollbars>
      }
      
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
    </Dialog>
  )
}

export default PreviewDialog
