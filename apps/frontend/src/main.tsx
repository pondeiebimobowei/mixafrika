import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './App'
import { ThemeProvider } from './context/theme-context'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Toaster />
      <AppRouter />
    </ThemeProvider>
  </StrictMode>,
)
