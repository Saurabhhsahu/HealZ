import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DoctorContextProvider from './Context/DoctorContext.jsx'
import { Auth0Provider } from '@auth0/auth0-react';
import {BrowserRouter} from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={import.meta.env.VITE_DOMAIN}
    clientId={import.meta.env.VITE_CLIENT_ID}
    redirectUri={window.location.origin}
  >
    <BrowserRouter>
      <DoctorContextProvider>
        <App />
      </DoctorContextProvider>
    </BrowserRouter>
  </Auth0Provider>,
)
