import { useState } from 'react'

import './App.css'
import { Route, Routes } from 'react-router-dom'
import LobbyScreen from './screens/Lobby'
import RoomPage from './screens/Room'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='App'>
          <Routes>
            <Route path='/' element={<LobbyScreen/>} />
            <Route path='/room/:roomId' element={<RoomPage/>} />
          </Routes>
      </div>
    </>
  )
}

export default App
