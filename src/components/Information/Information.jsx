import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { sortBox, sortLabel, rotateAngle } from '../../common/sortStyles'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { getCredentials, cleanCredentials } from '../../config/storage'
import { listArticles, deleteArticleRequest } from '../../api/article'
import SharedContext from '../../context/SharedContext'
import UserContext from '../../context/UserContext'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import LinearProgress from '@mui/material/LinearProgress'
import InformationRow from './InformationRow'
import InformationPreview from './InformationPreview'
import { DEV_MODE } from '../../config/constants'

const queryDefault = { pageNumber: 1, pageSize: 20, noPagination: false,  hasNextPage: false, sort: { position: 1 } }


const Information = () => {
  const { setShared } = useContext(SharedContext)
  const { user } = useContext(UserContext)

  const firstRenderSharedRef = useRef(true)
  const firstRenderRef = useRef(true)
  
  const [query, setQuery] = useState(queryDefault)
  const [articles, setArticles] = useState(null)
  const [reloadList, setReloadList] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState({ show: false, data: null })
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })

  const history = useNavigate()

  useEffect(() => {
    if (firstRenderRef.current && DEV_MODE) {
      firstRenderRef.current = false
      return
    }

    const authError = () => {
      cleanCredentials()
      history('/')
    }

    listArticles({ pageNumber: query.pageNumber, pageSize: 20, sort: query.sort })
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        setArticles(articles => query.pageNumber === 1 ? result.payload.docs : [ ...articles, ...result.payload.docs])
        setQuery(query => ({ ...query, pageNumber: result.payload.page, hasNextPage: result.payload.hasNextPage }))
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }, [query.pageNumber, query.sort, history, reloadList])


  const handlePagination = (scrollTop, height, scrollHeight) => {
    if (scrollTop + height < scrollHeight - 20) return
    if (query.hasNextPage) {
      setQuery({ ...query, pageNumber: query.pageNumber + 1, hasNextPage: false })
    }
  }


  const renderSort = (field) => {
    const newQuery = { ...query, pageNumber: 1, hasNextPage: false }
    if (!(field in query.sort)) {
      newQuery.sort =  { [field]: -1 }
    } else {
      query.sort[field] === 1
      ? newQuery.sort = { [field]: -1 }
      : newQuery.sort = { [field]: 1 }
    }
    setQuery(newQuery)
  }


  const sortArrow = (field) => {
    if (!(field in query.sort)) return null
    return query.sort[field] === 1 ? <KeyboardArrowUpIcon color='primary' sx={rotateAngle(true)}/> : <KeyboardArrowDownIcon color='primary' sx={rotateAngle(false)}/>
  }


  const authError = () => {
    cleanCredentials()
    history('/')
  }


  const deleteArticle = (articleId) => {
    setConfirmDialog({ show: false, message: '' })
    deleteArticleRequest(articleId)
      .then(x => {
        if (x.status === 401) authError()
        return x.json()
      })
      .then(result => {
        if (!result.success) throw new Error(result.message)
        query.hasNextPage
          ? query.pageNumber === 1 ? setReloadList(!reloadList) : setQuery({ ...query, pageNumber: 1, hasNextPage: false })
          : setArticles(articles.filter(x => x._id !== result.payload._id))
      })
      .catch(error => setErrorDialog({ show: true, message: error.message }))
  }


  const prepareDeleteArticle = (newsId, title) => {
    setConfirmDialog({ show: true, message: `Сигурни ли сте, че искате да изтриете статия "${title}"`, acceptFunc: () => deleteArticle(newsId) })
  }
  

  const startEditArticle = (articleId) => history(`/information/${articleId}`)

  const previewArticle = (articleId) => setShowPreviewDialog({ show: true, data: articleId })


  useEffect(() => {
    if (firstRenderSharedRef.current && DEV_MODE) {
      firstRenderSharedRef.current = false
      return
    }
    setShared(shared => ({ ...shared, currentPage: 4 }))
  }, [setShared])


  if (!user || !getCredentials()) return null
  
  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Paper elevation={2} sx={{p: 2, pb: 0, maxHeight: 'calc(100vh - 130px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
          <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Статии</Typography>
          <Box display='flex' alignItems='center' mr={-1}>
            <Tooltip title='Добави нова' arrow>
              <IconButton onClick={() => history('/information/create')}>
                <LibraryAddIcon color='secondary' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Stack direction='row' pt={1} pb={1} pl={1.5} pr={1.5} minHeight={26}>
          <Box width='9%' sx={sortBox} onClick={()=> renderSort('position')}><Box sx={sortLabel}>Позиция</Box>{sortArrow('position')}</Box>
          <Box width='17%' sx={sortBox} onClick={()=> renderSort('shortTitle')}><Box sx={sortLabel}>Кратко заглавие</Box>{sortArrow('shortTitle')}</Box>
          <Box width='42%' sx={sortBox} onClick={()=> renderSort('longTitle')}><Box sx={sortLabel}>Дълго заглавие</Box>{sortArrow('longTitle')}</Box>
          <Box width='10%' sx={sortBox} onClick={()=> renderSort('createdAt')}><Box sx={sortLabel}>Дата</Box>{sortArrow('createdAt')}</Box>
          <Box width='15%' sx={sortBox} onClick={()=> renderSort('createdBy')}><Box sx={sortLabel}>Добавена от</Box>{sortArrow('createdBy')}</Box>
          <Box width='10%'/>
        </Stack>
        {
          articles
            ? articles.length
              ? <Scrollbars
                  style={{height: '100vh', padding: 16, paddingTop: 0, marginLeft: -16}}
                  onScroll={({ target }) => handlePagination(target.scrollTop, target.getBoundingClientRect().height, target.scrollHeight)}
                >
                  <Box p={2} pt={0}>
                    { articles.map(x => <InformationRow key={x._id} row={x} editFunc={startEditArticle} deleteFunction={prepareDeleteArticle} previewFunc={previewArticle} />) }
                  </Box>
                </Scrollbars>
              : <Box m={2} textAlign='center'>Няма намерени записи</Box>
            : <LinearProgress color='secondary' sx={{height: 20, borderRadius: '4px', m: 2 }}/>
        }
      </Paper>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
      { showPreviewDialog.show ? <InformationPreview articleId={showPreviewDialog.data} closeFunc={setShowPreviewDialog}/> : null }
    </Container>
  )
}

export default Information