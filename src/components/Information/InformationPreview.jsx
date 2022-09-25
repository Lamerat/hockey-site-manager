import React, { useEffect, useState, useRef } from 'react'
import Dialog from '@mui/material/Dialog'
import CircularProgress from '@mui/material/CircularProgress'
import Slide from '@mui/material/Slide'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import mainTheme from '../../theme/MainTheme'
import { Box, Typography, IconButton } from '@mui/material'
import { singleArticleRequest } from '../../api/article'
import { Scrollbars } from 'react-custom-scrollbars-2'
import CloseIcon from '@mui/icons-material/Close'
import parse from 'html-react-parser'

const borderColor = mainTheme.palette.secondary.main

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})


const InformationPreview = ({articleId, closeFunc}) => {
  const firstRenderRef = useRef(true)

  const [articleData, setArticleData] = useState(null)
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })

  useEffect(() => {
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    singleArticleRequest(articleId)
      .then(x => x.json())
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setArticleData(result.payload)
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))

  }, [articleId])

  return (
    <Dialog fullWidth={true} maxWidth='md' open={true} TransitionComponent={Transition}>
      {
        !articleData
          ? <Box minHeight='300px' display='flex' justifyContent='center' alignItems='center'><CircularProgress color='secondary' size={100} /></Box>
          : <>
              <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={borderColor} m={2} mb={0}>
                <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>{articleData.longTitle}</Typography>
                <IconButton size='small' onClick={() => closeFunc({ show: false })} sx={{mr: -1}}><CloseIcon color='secondary' /></IconButton>
              </Box>
              <Scrollbars autoHeight autoHeightMin={100} autoHeightMax='calc(100vh - 175px)'>
              <Box p={2} fontFamily='CorsaGrotesk' fontSize='13px'>
                { parse(articleData.text) }
              </Box>
            </Scrollbars>
            </>
      }
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
    </Dialog>
  )
}

export default InformationPreview
