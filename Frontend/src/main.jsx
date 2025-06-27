import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/userContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/* ✅ Wrap the whole app in BrowserRouter */}
      <UserProvider>  {/* ✅ Now inside Router, so useNavigate() will work */}
        <App />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
