import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Leaderboard from './pages/Leaderboard'
import MumbaiBackstory from './pages/Mumbai/MumbaiBackstory'
import Mumbai from './pages/Mumbai/Mumbai'
import BangaloreBackstory from './pages/Bangalore/BangaloreBackstory'
import Bangalore from './pages/Bangalore/Bangalore'
import PuneBackstory from './pages/Pune/PuneBackstory'
import Pune from './pages/Pune/Pune'
import ChennaiBackstory from './pages/Chennai/ChennaiBackstory'
import Chennai from './pages/Chennai/Chennai'
import JammuBackstory from './pages/Jammu/JammuBackstory'
import Jammu from './pages/Jammu/Jammu'
import DelhiBackstory from './pages/Delhi/DelhiBackstory'
import Delhi from './pages/Delhi/Delhi'
import Disqualify from './pages/Disqualify'
import ProgressGuard from './components/ProgressGuard'

const App = () => {
  return (
    <BrowserRouter>
      <ProgressGuard>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/disqualify" element={<Disqualify />} />
          
          <Route path="/mumbai/backstory" element={<MumbaiBackstory />} />
          <Route path="/mumbai/game" element={<Mumbai />} />
          
          <Route path="/bangalore/backstory" element={<BangaloreBackstory />} />
          <Route path="/bangalore/game" element={<Bangalore />} />
          
          <Route path="/pune/backstory" element={<PuneBackstory />} />
          <Route path="/pune/game" element={<Pune />} />
          
          <Route path="/chennai/backstory" element={<ChennaiBackstory />} />
          <Route path="/chennai/game" element={<Chennai />} />
          
          <Route path="/jammu/backstory" element={<JammuBackstory />} />
          <Route path="/jammu/game" element={<Jammu />} />
          
          <Route path="/delhi/backstory" element={<DelhiBackstory />} />
          <Route path="/delhi/game" element={<Delhi />} />
        </Routes>
      </ProgressGuard>
    </BrowserRouter>
  )
}

export default App
