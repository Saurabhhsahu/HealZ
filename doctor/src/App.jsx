import React, { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, Navigate } from 'react-router-dom';

// Assuming component paths are relative to the App.jsx file
import NavBar from '../components/Navbar.jsx';
import SideBar from '../components/SideBar.jsx';
import Login from '../pages/Login.jsx';
import DoctorDashboard from '../pages/doctor/DoctorDashboard.jsx';
import DoctorAppointments from '../pages/doctor/DoctorAppointments.jsx';
import DoctorProfile from '../pages/doctor/DoctorProfile.jsx';
// Import the VideoCall component for the new route
import VideoCall from '../pages/doctor/videoCall/VideoCall.jsx'; 
import { DoctorContext } from '../Context/DoctorContext.jsx';

function App() {
  const { dToken } = useContext(DoctorContext);

  // A simple mock for logout if it's not provided by a context/hook
  const handleLogout = () => {
    // In a real app, you would clear the token from localStorage and update the state
    console.log("Logging out...");
    // For example: localStorage.removeItem('dToken'); window.location.reload();
  };

  // Render routes for authenticated doctor
  if (dToken) {
    return (
      <div className="bg-[#F8F9FD]">
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
        <NavBar logout={handleLogout} />
        <div className="flex items-start">
          <SideBar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Routes>
              {/* Redirect base path to the dashboard */}
              <Route path="/" element={<Navigate to="/doctor-dashboard" replace />} />

              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor-appointments" element={<DoctorAppointments />} />
              <Route path="/doctor-profile" element={<DoctorProfile />} />
              
              {/* This is the new, crucial route for the video call */}
              <Route path="/doctor/video-call/:appointmentId" element={<VideoCall />} />

              {/* Redirect any other paths to the dashboard */}
              <Route path="*" element={<Navigate to="/doctor-dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    );
  }

  // Render Login page if not authenticated
  return <Login />;
}

export default App;
