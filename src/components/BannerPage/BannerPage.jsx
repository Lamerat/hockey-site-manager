import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Stack } from '@mui/material'
import SharedContext from '../../context/SharedContext'
import { useNavigate } from 'react-router-dom'
import { sortBox, sortLabel, rotateAngle } from '../../common/sortStyles'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { getCredentials, cleanCredentials } from '../../config/storage'
import { listArticles, deleteArticleRequest } from '../../api/article'
import UserContext from '../../context/UserContext'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ErrorDialog from '../ErrorDialog/ErrorDialog'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import LinearProgress from '@mui/material/LinearProgress'
import { DEV_MODE } from '../../config/constants'

const queryDefault = { pageNumber: 1, pageSize: 20, noPagination: false,  hasNextPage: false, sort: { position: 1 } }


const BannerPage = () => {
  const { setShared } = useContext(SharedContext)

  const firstRenderSharedRef = useRef(true)
  const firstRenderRef = useRef(true)

  const [query, setQuery] = useState(queryDefault)
  const [banners, setBanners] = useState(null)
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '' })


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


  useEffect(() => {
    if (firstRenderSharedRef.current && DEV_MODE) {
      firstRenderSharedRef.current = false
      return
    }
    setShared(shared => ({ ...shared, currentPage: 5 }))
  }, [setShared])

  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Paper elevation={2} sx={{p: 2, pb: 0, maxHeight: 'calc(100vh - 130px)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
          <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Банери</Typography>
          <Box display='flex' alignItems='center' mr={-1}>
            <Tooltip title='Добави нова' arrow>
              <IconButton onClick={() => 1}>
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
          banners
            ? banners.length
              ? <Scrollbars
                  style={{height: '100vh', padding: 16, paddingTop: 0, marginLeft: -16}}
                  onScroll={({ target }) => handlePagination(target.scrollTop, target.getBoundingClientRect().height, target.scrollHeight)}
                >
                  <Box p={2} pt={0}>
                    { banners.map(x => 1) }
                  </Box>
                </Scrollbars>
              : <Box m={2} textAlign='center'>Няма намерени записи</Box>
            : <LinearProgress color='secondary' sx={{height: 20, borderRadius: '4px', m: 2 }}/>
        }
      </Paper>
      { errorDialog.show ? <ErrorDialog text={errorDialog.message} closeFunc={setErrorDialog} /> : null }
      { confirmDialog.show ? <ConfirmDialog text={confirmDialog.message} cancelFunc={setConfirmDialog} acceptFunc={confirmDialog.acceptFunc} /> : null }
    </Container>
  )
}

export default BannerPage