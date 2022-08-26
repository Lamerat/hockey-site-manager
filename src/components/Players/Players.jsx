import React, { useContext, useEffect, useRef, useState } from 'react'
import SharedContext from '../../context/SharedContext'
import { Container, Paper, Box, Typography, IconButton, Tooltip, Stack, Badge } from '@mui/material'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { badgeProps } from './Players.styles'
import { sortBox, sortLabel, rotateAngle } from '../../common/sortStyles'
import mainTheme from '../../theme/MainTheme'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PlayerDialog from './PlayerDialog'
import LinearProgress from '@mui/material/LinearProgress'
import PlayerRow from './PlayerRow'
import FilterAltIcon from '@mui/icons-material/FilterAlt'



const queryDefault = { pageNumber: 1, pageSize: 20, noPagination: false,  hasNextPage: false, sort: { number: -1 }, search: '', searchFields: [], startDate: null, endDate: null }

const Players = () => {
  const { setShared } = useContext(SharedContext)
  const firstRenderRef = useRef(true)
  const filterMenuRef = useRef(null)


  const [query, setQuery] = useState(queryDefault)
  const [filterBadge, setFilterBadge] = useState(true)
  const [players, setPlayers] = useState([{ _id: 1, hidden: false }])
  const [showPlayerDialog, setShowPlayerDialog] = useState(false)

  


  const handlePagination = (scrollTop, height, scrollHeight) => {
    if (scrollTop + height < scrollHeight - 20) return
    // if (query.hasNextPage) {
    //   setQuery({ ...query, pageNumber: query.pageNumber + 1, hasNextPage: false })
    // }
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
    if(firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    setShared(shared => ({ ...shared, currentPage: 2 }))
  }, [setShared])

  
  return (
    <Container sx={{maxWidth: '1366px !important', marginTop: 3, pl: 3, pr: 3}} disableGutters={true}>
      <Paper elevation={2} sx={{p: 2}}>
        <Box display='flex' alignItems='center' justifyContent='space-between' borderBottom={1} borderColor={mainTheme.palette.secondary.main} mb={1}>
          <Typography fontFamily='CorsaGrotesk' color={mainTheme.palette.secondary.main} variant='h6' pb={0.5}>Играчи</Typography>
          <Box display='flex' alignItems='center' mr={-1}>
          <Tooltip title='Филтри' arrow>
              <IconButton onClick={() => 1} ref={filterMenuRef}>
                <Badge sx={badgeProps} color='primary' variant='dot' invisible={filterBadge}>
                  <FilterAltIcon color='secondary' />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title='Добави нов' arrow>
              <IconButton onClick={() => setShowPlayerDialog(true)}>
                <LibraryAddIcon color='secondary' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Stack direction='row' pt={1} pb={1} pl={2.5} pr={1.5} minHeight={26}>
          <Box width='42%' sx={sortBox} onClick={()=> renderSort('playerName')}><Box sx={sortLabel}>Име</Box>{sortArrow('playerName')}</Box>
          <Box width='9%' sx={sortBox} onClick={()=> renderSort('number')}><Box sx={sortLabel}>Номер</Box>{sortArrow('number')}</Box>
          <Box width='10%' sx={sortBox} onClick={()=> renderSort('position')}><Box sx={sortLabel}>Пост</Box>{sortArrow('position')}</Box>
          <Box width='9%' sx={sortBox} onClick={()=> renderSort('hand')}><Box sx={sortLabel}>Хват</Box>{sortArrow('hand')}</Box>
          <Box width='11%' sx={sortBox} onClick={()=> renderSort('birthDate')}><Box sx={sortLabel}>Роден</Box>{sortArrow('birthDate')}</Box>
          <Box width='8%' sx={sortBox} onClick={()=> renderSort('height')}><Box sx={sortLabel}>Ръст</Box>{sortArrow('height')}</Box>
          <Box width='8%' sx={sortBox} onClick={()=> renderSort('weight')}><Box sx={sortLabel}>Тегло</Box>{sortArrow('weight')}</Box>
          <Box width='3%'/>
        </Stack>
        {
          players
            ? players.length
              ?  <Scrollbars
                    style={{height: '100vh', padding: 16, paddingTop: 0, marginLeft: -16}}
                    onScroll={({ target }) => handlePagination(target.scrollTop, target.getBoundingClientRect().height, target.scrollHeight)}
                  >
                    <Box p={2} pt={0}>
                      {
                        players.filter(record => !record.pinned).length
                          ? players
                              .filter(record => !record.pinned)
                              .map(x => <PlayerRow key={x._id} row={x} />)
                          : <Box m={2} textAlign='center'>Няма намерени записи</Box>
                      }
                    </Box>
                  </Scrollbars>
              : <Box m={2} textAlign='center'>Няма намерени записи</Box>
            : <LinearProgress color='secondary' sx={{height: 20, borderRadius: '4px', m: 2 }}/>
        }
      </Paper>
      { showPlayerDialog ? <PlayerDialog editMode={false} /> : null }
      
    </Container>
  )
}

export default Players