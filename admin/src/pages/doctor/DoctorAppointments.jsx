import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { AdminContext } from '../../context/AdminContext'
import {assets} from '../../assets/assets_admin/assets.js'

function DoctorAppointments() {
  const {appointments,dToken,getAppointments,cancelAppointment,completeAppointment} = useContext(DoctorContext)
  const {calculateAge,slotFormat} = useContext(AppContext)

  useEffect(() => {
    if(dToken){
      getAppointments()
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

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 p-3 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {
          appointments.reverse().map((item,idx) => (
            <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={idx}>
              <p className='max-sm:hidden'>{idx+1}</p>
              <div className='flex items-center gap-2 flex-col lg:flex-row'>
                <img className='w-12 rounded-full' src={item.userData.image} alt="" />
                <p>{item.userData.name}</p>
              </div>
              <p className='text-xs inline border border-primary px-2 rounded-full'>
                {item.payment ? 'ONILINE' : 'CASH'}
              </p>
              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
              <p>{slotFormat(item.slotDate)},{item.slotTime}</p>
              <p>${item.docData.fees}</p>
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
  )
}

export default DoctorAppointments