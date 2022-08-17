import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Chip , Stack , Button, TextField, InputLabel } from '@mui/material'
import { CKEditor } from 'ckeditor4-react';
import SharedContext from '../../context/SharedContext'
import mainTheme from '../../theme/MainTheme'
import { Scrollbars } from 'react-custom-scrollbars-2'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { editorConfig } from './AddNews.styles';


const AddNews = () => {
  const { setShared } = useContext(SharedContext)
  const firstRenderRef = useRef(true)

  
  
  useEffect(() => {
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    setShared(shared => ({ ...shared, currentPage: 0 }))
  }, [setShared])

  
  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Paper elevation={2} sx={{p: 2, maxHeight: 'calc(100vh - 140px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
          <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Добавяне на новина</Typography>
          <Box display='flex' alignItems='center' mr={-1}>
            <Tooltip title='Добави нов' arrow>
              <IconButton onClick={(e) => 1}>
                <LibraryAddIcon color='secondary' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Scrollbars
          style={{height: '100vh', padding: 16, marginLeft: -16}}
          // onScroll={({ target }) => handlePagination(target.scrollTop, target.getBoundingClientRect().height, target.scrollHeight, 'team')}
          // renderThumbVertical={() =><div style={{backgroundColor: mainTheme.palette.primary.light, borderRadius: 'inherit', cursor: 'pointer'}}/>}
        >
          <Box p={2} pt={1}>
            <TextField
              label='Заглавие'
              fullWidth
              size='small'
              required
              variant='outlined'
            />
            
            <Stack direction='row' spacing={1} sx={{mt: 2, mb: 2}}>
              <Button variant='contained' size='small' component='label'>Заглавна снимка<input hidden accept='image/*' multiple type='file' /></Button>
              <Chip label='Deletable' onDelete={() => 1} />
              <Chip label='Deletable' variant='outlined' onDelete={() => 1} />
            </Stack>
            <Stack direction='row' spacing={1}>
              <Button variant='contained' size='small' component='label'>Снимки<input hidden accept='image/*' multiple type='file' /></Button>
              <Chip label='Deletable' onDelete={() => 1} />
              <Chip label='Deletable' variant='outlined' onDelete={() => 1} />
            </Stack>
            
            <CKEditor style={{marginTop: '16px'}} config={editorConfig} onChange={(e) => console.log(e.editor.getData())} />
          </Box>
        </Scrollbars>
      </Paper>
    </Container>
  )
}

export default AddNews