import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import TFunFestival from './TFunFestival'
import LineupPage from './LineupPage'
import SecretGuests from './SecretGuests'
import SchedulePage from './SchedulePage'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<TFunFestival />} />
        <Route path="/lineup" element={<LineupPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/secret" element={<SecretGuests />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
