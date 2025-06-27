import React,{useContext, useState} from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import { DoctorContext } from '../Context/DoctorContext.jsx';

function Login() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const {setDToken,backendUrl} = useContext(DoctorContext)

    const onSubmitHandler = async(e) => {
      e.preventDefault();

      try{
          const {data} = await axios.post(backendUrl + '/api/doctor/login',{email,password});
          if(data.success){
            localStorage.setItem('dToken',data.token);
            setDToken(data.token)
          }else{
            toast.error(data.message)
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
                <span className='text-primary'>Doctor</span> Login
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

            <button className='bg-blue-400 text-white w-full py-2 rounded-md text-base'>Login</button>
        </div>
    </form>
  )
}

export default Login