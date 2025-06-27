import React, { useContext, useEffect, useState } from 'react'
import { useUser } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';

function RelatedDoctors({speciality,docId}) {
    const {doctors} = useUser();
    const navigate = useNavigate();

    const [relDoc,setRelDoc] = useState([]);

    console.log(docId);
    

    useEffect(() => {
        if(doctors.length > 0 && speciality){
            const doctorsData = doctors.filter((item,index) => item.speciality === speciality && item._id !== docId)
            setRelDoc(doctorsData);
        }
    },[doctors,docId,speciality])

  return (
    <div className='flex flex-col justify-center items-center mt-16'>
        <p className='text-[25px] font-semibold'>Related Doctors</p>
        <p className='text-[15px] text-gray-600'>Simply browse through our extensive list of trusted doctors.</p>

        <div className='flex flex-col justify-center items-center'>
            <div className='flex flex-wrap items-center justify-center gap-6 pt-8'>
                {
                    relDoc.slice(0,5).map((item,index) => (
                        <div onClick={() => {navigate(`/appointment/${item._id}`);scrollTo(0,0)}} className='sm:w-[230px] rounded-lg border border-[#C9D8FF] cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                            <img src={item.image} alt="" className='bg-[#C9D8FF] w-full object-cover rounded-lg'/>
                            <div className='p-4'>
                                <div className='flex gap-2 items-center'>
                                    <div className={`w-[5px] h-[5px] ${item.available ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
                                    <p className={`text-[10px] ${item.available ? 'text-green-500' : 'text-red-500'} `}>{item.available ? 'Available' : 'Not Available'}</p>
                                </div>
                                
                                <p className='font-semibold'>{item.name}</p>
                                <p className='text-[10px] text-gray-800'>{item.speciality}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default RelatedDoctors