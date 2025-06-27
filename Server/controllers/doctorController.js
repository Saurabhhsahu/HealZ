import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const changeAvailability = async(req,res) => {
    try{
        const {docId} = req.body;

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
        res.json({success:true,message:'availability change'});
    }
    catch(err){
        console.log(err);
        res.json({success:false,message:err.message})
    }
}

const doctorList = async(req,res) => {
    try{
        const doctors = await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    }   
    catch(err){
        res.json({success:false,message:err.message})
        console.log(err.message);     
    }
}

const loginDoctor = async(req,res) => {
    try{
        const {email,password} = req.body

        if(!email || !password){
            return res.json({success:false,message:"Missing data"});
        }

        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Enter valid email"})
        }
        
        console.log(email);
        console.log(password);
        
        const doctor = await doctorModel.findOne({email});
        // console.log(doctor);
        
        if(!doctor){
            return res.json({success:false,message:"User does not exist"})
        }

        const isMatch = await bcrypt.compare(password,doctor.password)

        if(!isMatch){
            return res.json({success:false,message:"Invalid Password"});
        }

        const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET);

        res.json({success:true,token});
    }
    catch(err){
        res.json({success:false,message:err.message})
        console.log(err.message);     
    }
}

const allAppointments = async(req,res) => {
    try{
        const {docId} = req.body
        // console.log(docId);
        
        const appointmentData = await appointmentModel.find({docId});

        res.json({success:true,appointmentData});
    }
    catch(err){
        res.json({success:false,message:err.message})
        console.log(err.message);     
    }
}

const appointmentComplete = async(req,res) => {
    try{
        const {docId,appointmentId} = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        
        if(appointmentData && appointmentData.docId !== docId){
            return res.json({success:false,message:"Error in compliting"})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true});

        res.json({success: true,message:"Appointment completed"})
    }
    catch(err){
        res.json({success:false,message:err.message})
        console.log(err.message);     
    }
}

const appointmentCancel = async(req,res) => {
    try{
        const {docId,appointmentId} = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        
        if(appointmentData && appointmentData.docId !== docId){
            return res.json({success:false,message:"Error in deleting"})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});

        const {slotDate,slotTime} = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;
        slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e != slotTime);

        await doctorModel.findByIdAndUpdate(docId,{slots_booked});

        res.json({success: true,message:"Appointment cancelled"})
    }
    catch(err){
        res.json({success:false,message:err.message})
        console.log(err.message);     
    }
}

const dashboardData = async(req,res) => {
    try{
        const {docId} = req.body
        const appointments = await appointmentModel.find({docId});

        let earning = 0

        appointments.map((item) => {
            if(item.isCompleted || item.payment)    earning += item.amount;
        })

        let patients = []

        appointments.map((item) => {
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        const dashData = {
            earning,
            appointments:appointments.length,
            patients: patients.length,
            latestAppointments : appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData});
    }
    catch(err){
        res.json({success:false,message:err.message})
        console.log(err.message);     
    }
}

const doctorProfile = async(req,res) => {
    try{
        const {docId} = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({success:true,profileData})
    }
    catch(err){
        res.json({success:false,message:err.message})
        console.log(err.message);     
    }
}

const updateDoctorProfile = async(req,res) => {
    try{
        const {docId,fees,address,available} = req.body

        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})

        res.json({success:true,message:"Profile updated"})
    }
    catch(err){
        res.json({success:false,message:err.message})
        console.log(err.message);     
    }
}

export {changeAvailability,doctorList,loginDoctor,allAppointments,appointmentCancel,appointmentComplete,dashboardData,doctorProfile,updateDoctorProfile};