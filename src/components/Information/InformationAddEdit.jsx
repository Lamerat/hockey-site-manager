import React, { useState, useEffect, useRef } from 'react'
import { Container, Paper, Box, IconButton, Button, TextField, Tooltip, Typography } from '@mui/material'
import { createArticleRequest, editArticleRequest, singleArticleRequest } from '../../api/article'
import { editorConfig } from '../../common/ck-article-config'
import { useNavigate, useParams } from 'react-router-dom'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { CKEditor } from 'ckeditor4-react'
import { cleanCredentials } from '../../config/storage'
import mainTheme from '../../theme/MainTheme'
import CloseIcon from '@mui/icons-material/Close'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import sanitizeHtml from 'sanitize-html'
import { DEV_MODE } from '../../config/constants'

const defaultArticle = {
  shortTitle: { value: '', error: false },
  longTitle: { value: '', error: false },
  position: { value: 1, error: false },
}

const initialArticleData = {}


const InformationAddEdit = ({ editMode }) => {
  const firstRenderRef = useRef(true)

  const [article, setArticle] = useState(defaultArticle)
  const [htmlData, setHtmlData] = useState('')
  const [loadComplete, setLoadComplete] = useState(false)
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })

  const history = useNavigate()
  const { id: articleId } = useParams()

  const changeState = (field, value) => setArticle({ ...article, [field]: { value, error: false } })

  const authError = () => {
    cleanCredentials()
    history('/')
  }


  useEffect(() => {
    if (!editMode) return

    if (firstRenderRef.current && DEV_MODE) {
      firstRenderRef.current = false
      return
    }

    singleArticleRequest(articleId)
      .then(x => x.json())
      .then(result => {
        if (!result.success) throw new Error(result.message)
        const { payload } = result
        const data = {
          shortTitle: { value: payload.shortTitle, error: false },
          longTitle: { value: payload.longTitle, error: false },
          position: { value: payload.position, error: false },
        }
        setHtmlData(payload.text)
        setArticle(data)
        setLoadComplete(true)

        initialArticleData.shortTitle = payload.shortTitle
        initialArticleData.longTitle = payload.longTitle
        initialArticleData.position = payload.position
        initialArticleData.htmlData = payload.text
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [editMode, articleId ])


  const validateFields = () => {
    const currentState = JSON.parse(JSON.stringify(article))
    const errors = []
    
    if (!article.shortTitle.value.trim()) {
      currentState.shortTitle.error = true
      errors.push('Липсва краткото заглавие')
    }

    if (!article.longTitle.value.trim()) {
      currentState.longTitle.error = true
      errors.push('Липсва дългото заглавие')
    }

    if (article.position.value < 1) {
      currentState.position.error = true
      errors.push('Невалидна позиция - трябва да е мин. 1')
    }

    const simpleText = sanitizeHtml(htmlData, { allowedTags: []})
    if (!simpleText.trim()) errors.push('Липсва текста')

    if (errors.length) {
      setArticle(currentState)
      setErrorDialog({ show: true, message: errors.join(', ') })
      return
    }

    if (!editMode) {
      const body = {
        shortTitle: article.shortTitle.value,
        longTitle: article.longTitle.value,
        text: htmlData,
        position: article.position.value
      }

      createArticleRequest(body)
        .then(x => {
          if (x.status === 401) authError()
          return x.json()
        })
        .then(result => {
          if (!result.success) throw new Error(result.message)
          history('/information')
        })
        .catch(error => setErrorDialog({ show: true, message: error.message }))
    } else {
      const body = {}
      if (article.shortTitle.value.trim() !== initialArticleData.shortTitle) body.shortTitle = article.shortTitle.value
      if (article.longTitle.value.trim() !== initialArticleData.longTitle) body.longTitle = article.longTitle.value
      if (article.position.value !== initialArticleData.position) body.position = article.position.value
      if (htmlData !== initialArticleData.htmlData) body.text = htmlData

      editArticleRequest(articleId, body)
        .then(x => {
          if (x.status === 401) authError()
          return x.json()
        })
        .then(result => {
          if (!result.success) throw new Error(result.message)
          history('/information')
        })
        .catch(error => setErrorDialog({ show: true, message: error.message }))
    }
  }

  const cancelCreate = () => {
    const compareData = editMode
      ? { ...initialArticleData }
      : { shortTitle: defaultArticle.shortTitle.value, longTitle: defaultArticle.longTitle.value, position: defaultArticle.position.value, htmlData: '' }

    let haveChanges = false

    if (article.shortTitle.value.trim() !== compareData.shortTitle) haveChanges = true
    if (article.longTitle.value.trim() !== compareData.longTitle) haveChanges = true
    if (article.position.value !== compareData.position) haveChanges = true
    if (compareData.htmlData) {
      if (compareData.htmlData !== htmlData) haveChanges = true
    } else {
      const simpleText = sanitizeHtml(htmlData, { allowedTags: []})
      if (simpleText.trim()) haveChanges = true
    }

    if (haveChanges) {
      setConfirmDialog({ show: true, message: `Сигурни ли сте, че искате да прекратите процеса? Всички данни ще бъдат загубени!`, acceptFunc: () => history('/information') })
    } else {
      history('/information')
    }
  }

  if (editMode && !loadComplete) return

  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Paper elevation={2} sx={{p: 2, pb: 0, maxHeight: 'calc(100vh - 130px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
            <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>
            { editMode ? 'Редактиране на статия' : 'Добавяне на статия' }  
            </Typography>
            <Box display='flex' alignItems='center' mr={-1}>
              <Tooltip title='Затвори' arrow placement='left'>
                <IconButton onClick={cancelCreate}><CloseIcon color='secondary' /></IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Scrollbars style={{height: '100vh', padding: 16, marginLeft: -16}}>
            <Box p={2} pt={1}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '250px auto 140px 130px' }}>
                <TextField
                  label='Кратко заглавие'
                  error={article.shortTitle.error}
                  size='small'
                  sx={{mr: 3}}
                  required
                  variant='outlined'
                  value={article.shortTitle.value}
                  onChange={(e) => changeState('shortTitle', e.target.value)}
                />
                <TextField
                  label='Дълго заглавие'
                  error={article.longTitle.error}
                  size='small'
                  sx={{mr: 3}}
                  required
                  variant='outlined'
                  value={article.longTitle.value}
                  onChange={(e) => changeState('longTitle', e.target.value)}
                />
                <TextField
                  label='Позиция'
                  type='number'
                  error={article.position.error}
                  InputProps={{ inputProps: { min: 1 } }}
                  size='small'
                  sx={{mr: 3}}
                  required
                  variant='outlined'
                  value={article.position.value}
                  onChange={(e) => changeState('position', e.target.value)}
                />
                <Button variant='contained' component='label' onClick={validateFields}>{ editMode ? 'Редактирай' : 'Добави' }</Button>
              </Box>
              <CKEditor initData={htmlData} style={{marginTop: '24px'}} config={editorConfig} onChange={(e) => setHtmlData(e.editor.getData())} />
            </Box>
          </Scrollbars>
      </Paper>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
    </Container>
  )
}

export default InformationAddEdit