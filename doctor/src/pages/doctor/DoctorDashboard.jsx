import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../Context/DoctorContext.jsx'
import { assets } from '../../assets/assets_admin/assets.js';

function DoctorDashboard() {
  const {slotFormat,dToken,docDashData,setDocDashData,getDocDashData,getAppointments,cancelAppointment,completeAppointment} = useContext(DoctorContext);

  useEffect(() => {
    if(dToken){
      getDocDashData();
    }
  },[])

  const handleCancel = (appointmentId) => {
    if(dToken){
      cancelAppointment(appointmentId);
      getAppointments()
    }
  }

  const handleComplete = (appointmentId) => {
    if(dToken){
      completeAppointment(appointmentId);
      getAppointments()
    }
  }

  return docDashData && (
    <div className='m-5 w-full'>
      <div className='flex flex-wrap gap-3 w-full'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>${docDashData.earning}</p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{docDashData.appointments}</p>
            <p className='text-gray-400'>Appointmentss</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' 
          src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{docDashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white '>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img  src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {
            docDashData.latestAppointments.map((item,idx) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={idx}>
                <img className='flex rounded-full w-10' src={item.userData.image} alt="" />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                  <p className='text-gray-600'>{slotFormat(item.slotDate)}</p>
                </div>

                {
                  item.cancelled
                  ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                  : item.isCompleted 
                    ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                    : <div className='flex '>
                        <img onClick={() => handleCancel(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                        <img onClick={() => handleComplete(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                      </div>
                }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard