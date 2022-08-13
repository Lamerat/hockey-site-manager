import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import MenuBar from './components/MenuBar/MenuBar'
import mainTheme from './theme/MainTheme.js'
import './App.css'
import SharedContext from './context/SharedContext'
import Shared from './components/Shared/Shared'
import News from './components/News/News'
import Events from './components/Events/Events'
import Players from './components/Players/Players'
import Media from './components/Media/Media'


function App() {
  const [ shared, setShared ] = useState({ currentPage: 0 })

  return (
    <SharedContext.Provider value={{ shared, setShared }}>
      <ThemeProvider theme={mainTheme}>
        <BrowserRouter>
          <MenuBar/>
          <Routes>
            <Route exact path='/news' element={<News />} />
            <Route exact path='/events' element={<Events />} />
            <Route exact path='/players' element={<Players />} />
            <Route exact path='/media' element={<Media />} />
            <Route exact path='/shared' element={<Shared />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </SharedContext.Provider>
  )
}

export default App
