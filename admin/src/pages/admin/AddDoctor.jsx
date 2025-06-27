import React,{useState,useContext} from 'react'
import { assets } from '../../assets/assets_admin/assets.js'
import { AdminContext } from '../../context/AdminContext.jsx'
import { toast } from 'react-toastify'
import axios from 'axios'

function AddDoctor() {
    const [docImg,setDocImg] = useState(false)
    const [name,setName] = useState('')
    const [email,setEmail] = useState('@gmail.com')
    const [password,setPassword] = useState('12345678')
    const [experience,setExperience] = useState('1Year')
    const [fees,setFees] = useState('')
    const [about,setAbout] = useState('')
    const [speciality,setSpeciality] = useState('General physician')
    const [degree,setDegree] = useState('MBBS')
    const [education,setEducation] = useState('')
    const [address1,setAddress1] = useState('')
    const [address2,setAddress2] = useState('')

    const {backendUrl,aToken} = useContext(AdminContext)

    const onSubmitHandler = async(e) => {
        e.preventDefault();

        try{
            if(!docImg){
                return toast.error('Image not selected')
            }

            const formData = new FormData()

            formData.append('imageFile',docImg)
            formData.append('name',name)
            formData.append('email',email)
            formData.append('password',password)
            formData.append('experience',experience)
            formData.append('fees',Number(fees))
            formData.append('about',about)
            formData.append('speciality',speciality)
            formData.append('degree',degree)
            formData.append('education',education)
            formData.append('address',JSON.stringify({line1:address1,line2:address2}))

            //console log formdata
            formData.forEach((value,key) => {
                console.log(`${key} : ${value}`);
            })

            const {data} = await axios.post(backendUrl+'/api/admin/addDoctor',formData,{headers :{aToken}});
            console.log(data);

            if(data.success){
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setEmail('@gmail.com')
                setPassword('12345678')
                setExperience('1Year')
                setFees('')
                setAbout('')
                setSpeciality('General physician')
                setDegree('MBBS')
                setAddress1('')
                setAddress2('')
                setEducation('')
            }else{
                console.log("cant");
                toast.error(data.message)
            } 
        }
        catch(err){
            toast.error(err.message)
            console.log("error in sending data for the doctor from frontend : ",err);
        }
    }

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
        <p className='mb-3 text-lg font-medium'>Add Doctor</p>

        <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
            <div className='flex items-center gap-4 mb-8 text-gray-500'>
                <label htmlFor='doc-img'>
                    <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                </label>
                <input 
                    type="file" 
                    id="doc-img"
                    onChange={(e) => setDocImg(e.target.files[0])}
                    hidden
                />
                <p>Upload Doctor <br /> picture</p>
            </div>

            <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                <div className='w-full lg:flex-1 flex flex-col gap-4'>
                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Doctor name</p>
                        <input 
                            className='border rouned px-3 py-2'
                            type="text" 
                            placeholder='name'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />
                    </div>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Doctor Email</p>
                        <input 
                            className='border rouned px-3 py-2'
                            type="email" 
                            placeholder='Email'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />
                    </div>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Doctor Password</p>
                        <input 
                            className='border rouned px-3 py-2'
                            type="password" 
                            placeholder='password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                    </div>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Experience</p>
                        <select  className='border rouned px-3 py-2' name="" id="" onChange={(e) => setExperience(e.target.value)} value={experience}>
                            <option value="1 Year">1Year</option>
                            <option value="2 Year">2Year</option>
                            <option value="3 Year">3Year</option>
                            <option value="4 Year">4Year</option>
                            <option value="5 Year">5Year</option>
                            <option value="6 Year">6Year</option>
                            <option value="7 Year">7Year</option>
                            <option value="8 Year">8Year</option>
                            <option value="9 Year">9Year</option>
                            <option value="10 Year">10Year</option>
                        </select>
                    </div>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Fees</p>
                        <input 
                            className='border rouned px-3 py-2'
                            type="number" 
                            placeholder='fees'
                            onChange={(e) => setFees(e.target.value)}
                            value={fees}
                            required
                        />
                    </div>
                </div>

                <div className='w-full lg:flex-1 flex flex-col gap-4'>
                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Speciality</p>
                        <select className='border rouned px-3 py-2' name="" id="" onChange={(e) => setSpeciality(e.target.value)} value={speciality}>
                            <option value="General physician">General physician</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatricians">Pediatricians</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Gastroenterologist">Gastroenterologist</option>
                        </select>
                    </div>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Education</p>
                        <input 
                            className='border rouned px-3 py-2'
                            type="text" 
                            placeholder='Education'
                            onChange={(e) => setDegree(e.target.value)}
                            value={degree}
                            required
                        />
                    </div>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p>
                            Address
                        </p>
                        <input 
                            className='border rouned px-3 py-2'
                            type="text" 
                            placeholder='Address 1'
                            onChange={(e) => setAddress1(e.target.value)}
                            value={address1}
                            required
                        />
                        <input 
                            className='border rouned px-3 py-2'
                            type="text" 
                            placeholder='Address 2'
                            onChange={(e) => setAddress2(e.target.value)}
                            value={address2}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
                <p className='mt-4 mb-2'>About Doctor</p>
                <textarea 
                    className='w-full px-4 pt-2 border rouned'
                    type="text" 
                    placeholder='Write about doctor'
                    onChange={(e) => setAbout(e.target.value)}
                    value={about}
                    rows = {5}
                    required
                />
            </div>

            <button className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add doctor</button>
        </div>
    </form>
  )
}

export default AddDoctor