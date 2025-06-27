import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import PatientDashboard from './PatientDashboard.jsx';
import Profile from '@/pages/ProfilePage.jsx';
import AppointmentPage from './MyAppointments.jsx';
import LabRecordsPage from './LabRecordsPage.jsx';
import MedicalRecordsPage from './MedicalRecordsPage.jsx';
import MedicationPage from './MedicationPage.jsx';
import InsurancePage from './InsurancePage.jsx';
import HealthMonitoringPage from './HealthMonitoringPage.jsx';
import Doctors from './Doctors.jsx';
import Landing from './Landing.jsx';
import Appointments from './Appointments.jsx';
import VideoCall from './videoCall/VideoCall.jsx';

function Home() {
  return (
    <div className="flex h-screen">
      {/* Sidebar on the left */}
      <Sidebar className="w-1/3 dark:bg-gray-900"/>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#e6f7ef]">
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/medical-records" element={<MedicalRecordsPage />} />
          <Route path="/lab-records" element={<LabRecordsPage />} />
          <Route path="/medication" element={<MedicationPage />} />
          <Route path="/insurance" element={<InsurancePage />} />
          <Route path="/health-monitoring" element={<HealthMonitoringPage />} />
          <Route path="/appointment/:docId" element={<Appointments />} />
          <Route path="/video-call/:appointmentId" element={<VideoCall />} />
          {/* <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} /> */}
          {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default Home;