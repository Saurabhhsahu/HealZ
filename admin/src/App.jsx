import React,{useContext, useState} from 'react'
import Login from './pages/Login.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext.jsx';
import NavBar from './components/NavBar.jsx';
import SideBar from './components/SideBar.jsx';
import { Routes,Route } from 'react-router-dom';
import DashBoard from './pages/admin/DashBoard.jsx';
import AllAppointments from './pages/admin/AllAppointments.jsx';
import AddDoctor from './pages/admin/AddDoctor.jsx';
import DoctorsList from './pages/admin/DoctorsList.jsx';
import { DoctorContext } from './context/DoctorContext.jsx';

import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx'
import DoctorAppointments from './pages/doctor/DoctorAppointments.jsx'
import DoctorProfile from './pages/doctor/DoctorProfile.jsx'

function App() {
  const {aToken} = useContext(AdminContext);
  const {dToken} = useContext(DoctorContext)

  return aToken || dToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <NavBar />
      <div className='flex items-start'>
        <SideBar/>
        <Routes>
          {/* Admin Route */}
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<DashBoard/>} />
          <Route path='/all-appointments' element={<AllAppointments/>} />
          <Route path='/add-doctor' element={<AddDoctor/>} />
          <Route path='/doctor-list' element={<DoctorsList/>} />

          {/* Doctor Route */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
          <Route path="/doctor-appointments" element={<DoctorAppointments/>} />
          <Route path="/doctor-profile" element={<DoctorProfile/>} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
}

export default App;
