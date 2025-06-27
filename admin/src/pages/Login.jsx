import React,{useContext, useState} from 'react'
import {assets} from '../assets/assets_admin/assets.js'
import {AdminContext} from '../context/AdminContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext.jsx';

function Login() {
    const [state,setState] = useState('Admin');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const {setAToken,backendUrl} = useContext(AdminContext);
    const {setDToken} = useContext(DoctorContext)

    const onSubmitHandler = async(e) => {
      e.preventDefault();

      try{
        if(state === 'Admin'){
          console.log("adming is called");
          
          const {data} = await axios.post(backendUrl + '/api/admin/login',{email,password});
          if(data.success){
            localStorage.setItem('aToken',data.token);
            setAToken(data.token)
          }else{
            toast.error(data.message)
          }
        }
        else if(state === 'Doctor'){
          const {data} = await axios.post(backendUrl + '/api/doctor/login',{email,password});
          if(data.success){
            localStorage.setItem('dToken',data.token);
            setDToken(data.token)
          }else{
            toast.error(data.message)
          }
        }
      }
      catch(err){
        console.log(err);
        toast.error(err.message)
      }
    } 

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
            <p className='text-2xl font-semibold m-auto'>
                <span className='text-primary'>{state}</span> Login
            </p>

            <div className='w-full'>
              <p>Email</p>
              <input 
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="email" 
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <div className='w-full'>
              <p>password</p>
              <input 
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="password" 
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>

            <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
            {
              state === "Admin"
              ? <p>Doctor Login? <span className='cursor-pointer text-primary underline' onClick={() => setState("Doctor")}>Click here</span></p>
              : <p>Admin Login? <span className='cursor-pointer text-primary underline' onClick={() => setState("Admin")}>Click here</span></p>
            }
        </div>
    </form>
  )
}

export default Login