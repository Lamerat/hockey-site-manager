import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import MenuBar from './components/MenuBar/MenuBar'
import mainTheme from './theme/MainTheme.js'
import './App.css'
import SharedContext from './context/SharedContext'
import UserContext from './context/UserContext.js'
import Shared from './components/Shared/Shared'
import News from './components/News/News'
import Events from './components/Events/Events'
import Players from './components/Players/Players'
import Media from './components/Media/Media'
import Login from './components/Login/Login'
import AddNews from './components/AddNews/AddNews'
import EditNews from './components/EditNews/EditNews'
import Information from './components/Information/Information'
import InformationAddEdit from './components/Information/InformationAddEdit'
import BannerPage from './components/BannerPage/BannerPage'


function App() {
  const [ shared, setShared ] = useState({ currentPage: 0 })
  const [ user, setUser ] = useState(JSON.parse(localStorage.getItem('user')) || null)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SharedContext.Provider value={{ shared, setShared }}>
        <ThemeProvider theme={mainTheme}>
          <BrowserRouter>
            <MenuBar/>
            <Routes>
              <Route exact path='/' element={<Login />} />
              <Route exact path='/news' element={<News />} />
              <Route exact path='/news/create' element={<AddNews />} />
              <Route exact path='/news/:id' element={<EditNews />} />
              <Route exact path='/events' element={<Events />} />
              <Route exact path='/players' element={<Players />} />
              <Route exact path='/media' element={<Media />} />
              <Route exact path='/information' element={<Information />} />
              <Route exact path='/information/create' element={<InformationAddEdit editMode={false} />} />
              <Route exact path='/information/:id' element={<InformationAddEdit editMode={true} />} />
              <Route exact path='/banners' element={<BannerPage />} />
              <Route exact path='/shared' element={<Shared />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </SharedContext.Provider>
    </UserContext.Provider>
  )
}

export default App
