import React, { useState } from 'react';
import PatientProfile from './dashboard/PatientProfile.jsx';
import MedicalRecords from './dashboard/MedicalRecords.jsx';
import Appointments from './dashboard/Appointments.jsx';
import LabReports from './dashboard/LabReports.jsx';
import Medications from './dashboard/Medications.jsx';
import HealthMonitoring from './dashboard/HealthMonitoring.jsx';
import Insurance from './dashboard/Insurance.jsx';
import ThemeToggle from './dashboard/ThemeToggle.jsx';
import UserQRCode from '@/components/UserQRCode.jsx';

import { Bell, Share, User, Sun, Moon, Settings } from 'lucide-react';

const QRCodeDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  return (
    <div className={`min-h-screen relative ${darkMode ? 'bg-gray-900 text-white' : 'bg-[0xFFFFB6C1] text-gray-800'}`}>
      <div className="container mx-auto px-4 py-6 bg-[#ffdde2] border-radius-5 border-black">

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3">
        
          {/* Second Row */}
          <div className="col-span-1 h-120">
            <MedicalRecords darkMode={darkMode} />
          </div>
          <div className="col-span-1 h-120">
            <LabReports darkMode={darkMode} />
          </div>
          <div className="col-span-1 h-120">
            <Medications darkMode={darkMode} />
          </div>

          {/* Third Row */}
          <div className="col-span-1">
            <Insurance darkMode={darkMode} />
          </div>
          <div className="col-span-2">
            <HealthMonitoring darkMode={darkMode} />
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <UserQRCode closeModal={() => setShowModal(false)} />
        </div>
      )}
    </div>
  );
};

export default QRCodeDashboard;
