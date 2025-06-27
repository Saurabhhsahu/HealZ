import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useUser } from './context/userContext';

import Home from './pages/Home.jsx';
import Auth from './pages/AuthPage.jsx';
import QRCodeData from './pages/QRCodeData';
import Landing from './pages/Landing';
import ReportData from './pages/ReportData';
import Doctors from './pages/Doctors';

function App() {
  const { token } = useUser();
  // console.log("token:", token);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* If not authenticated, only allow access to /auth */}
      <Route path="/auth" element={token ? <Navigate to="/dashboard" replace /> : <Auth />} />
      {!token ? (
        <>
      
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </>
      ) : (
        <>
          {/* Authenticated Routes */}
          
          <Route path="/*" element={<Home />} />
          <Route path="/qr-code" element={<QRCodeData />} />
          <Route path="/report" element={<ReportData />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </>
      )}
    </Routes>
  );
}

export default App;
