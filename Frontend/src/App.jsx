import React from 'react'
import { BrowserRouter, Route ,Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Otp from './pages/Otp'
import DashBoard from './pages/DashBoard'
import { Provider } from 'react-redux'
import Store from './store/Store'
import Login from './pages/Login'
import Menuu from './pages/Menuu'
import MainMenu from './pages/MainMenu'
import AudioToText from './pages/AudioToText'
import AudioSummary from './pages/AudioSummary'
import AudioToAudio from './pages/AudioToAudio'


const App = () => {
  return (
  <>
  <Provider store={Store}>
  <BrowserRouter>
  <Routes>
    <Route path='/signup' element={<Signup/>} />
    <Route path='/otp' element={<Otp/>}/>
    <Route path='/' element={<DashBoard/>}/>
    <Route path='/login' element={<Login/>} />
    <Route path='/menuu' element={<Menuu/>} />
    <Route path='/menu' element={<MainMenu/>} />
    <Route path='/audio-to-text' element={<AudioToText/>} />
    <Route path='/audio-to-summary' element={<AudioSummary/>} />
    <Route path='/audio-to-audio' element={<AudioToAudio/>} />
    
  </Routes>
  </BrowserRouter>
  </Provider>
  </>
  )
}

export default App