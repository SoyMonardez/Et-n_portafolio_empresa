import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { IdiomaProvider } from './context/IdiomaContext.jsx'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <IdiomaProvider>
          <App />
        </IdiomaProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
