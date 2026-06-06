import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './router'
import LoadingScreen from './components/LoadingScreen'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingScreen />
    <AppRouter />
  </StrictMode>,
)
