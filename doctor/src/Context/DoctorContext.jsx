import { createContext, useState } from "react";
import {toast} from 'react-toastify'
import axios from 'axios'

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const [dToken,setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken') : '')
    const [appointments,setAppointments] = useState([])
    const [docDashData,setDocDashData] = useState();
    const [profileData,setProfileData] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const getAppointments = async() => {
        try{
            const {data} = await axios.get(backendUrl+'/api/doctor/appointments',{headers:{dToken}});
            console.log(data);
            
            if(data.success){
                setAppointments(data.appointmentData)
                console.log(data.appointmentData);
            }
            else{
                toast.error(data.message)
            }
        }
        catch(err){
            console.log(err);
            toast.error(err.message);
        }
    }

    const cancelAppointment = async(appointmentId) => {
        try{
            const {data} = await axios.post(backendUrl+'/api/doctor/cancelAppointment',{appointmentId},{headers:{dToken}})
            if(data.success){
                toast.success(data.message);
            }
            else{
                toast.error(data.message);
            }
        }
        catch(err){
            console.log(err);
            toast.error(err.message);
        }
    }

    const completeAppointment = async(appointmentId) => {
        try{
            const {data} = await axios.post(backendUrl+'/api/doctor/completeAppointment',{appointmentId},{headers:{dToken}})
            if(data.success){
                toast.success(data.message);
            }
            else{
                toast.error(data.message);
            }
        }
        catch(err){
            console.log(err);
            toast.error(err.message);
        }
    }

    const getDocDashData = async() => {
        try{
            const {data} = await axios.get(backendUrl+'/api/doctor/dashboard',{headers:{dToken}});
            // console.log(data);
            if(data.success){
                setDocDashData(data.dashData)
                console.log(data.dashData);
            }
            else{
                toast.error(data.message)
            }
        }
        catch(err){
            console.log(err);
            toast.error(err.message);
        }
    }

    const getProfileData = async() => {
        try{
            const {data} = await axios.get(backendUrl+'/api/doctor/profile',{headers:{dToken}});
            if(data.success){
                setProfileData(data.profileData)
                console.log(data.profileData);
            }
            else{
                toast.error(data.message)
            }
        }
        catch(err){
            console.log(err);
            toast.error(err.message);
        }
    }

    const calculateAge = (dob) => {
        const today = new Date()
        const birthDate = new Date(dob)

        let age = today.getFullYear() - birthDate.getFullYear();

        return age;
    }

    const slotFormat = (slotDate) => {
        const dateArray = slotDate.split('_');
        const day = dateArray[0];
        const monthIndex = Number(dateArray[1]); // Month is in 1-based index
        const year = dateArray[2];

        return `${day} ${months[monthIndex]} ${year}`;
    };


    const value = {
        dToken,setDToken,
        backendUrl,
        appointments,setAppointments,getAppointments,
        cancelAppointment,completeAppointment,
        docDashData,setDocDashData,getDocDashData,
        profileData,setProfileData,getProfileData,
        calculateAge,
        slotFormat
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider;