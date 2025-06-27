import validator from 'validator'
import bcrypt from 'bcrypt'
import cloudinary from 'cloudinary'
import jwt from 'jsonwebtoken'

import doctorModel from '../models/doctorModel.js'
import appointmentsModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'

//api for adding doctor
const addDoctor = async(req,res) => {
    try{
        const {name,email,password,speciality,degree,experience,about,fees,address,education} = req.body;
        const imageFile = req.file
        
        //checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || education){
            return res.json({success: false,message: "Missing details"});
        }

        //validating the email format
        if(!validator.isEmail(email)){
            return res.json({success: false,message: "Please enter valid email"});
        }

        //validate password
        if(password.length < 8){
            return res.json({success: false,message: "Please enter a strong password"});
        }

        //hashing the doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.v2.uploader.upload(imageFile.path,{resource_type:"image"});
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now(),
            education,
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true,message:"doctor added"});
    }
    catch(err){
        console.log("error in adding data by admin : ",err);
        res.json({success:false,message:err.message})
    }
}

//api for the admin login
const loginAdmin = async(req,res) => {
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.json({success: false,message: "Missing details"});
        }

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid credentials"})
        }
    }
    catch(err){
        console.log("error in login by admin : ",err);
        res.json({success:false,message:err.message})
    }
}

const allDoctors = async(req,res) => {
    try{
        const doctors = await doctorModel.find({}).select('-password');
        res.json({success:true,doctors})
    }   
    catch(err){
        console.log("error in getting data of all doctors by admin : ",err);
        res.json({success:false,message:err.message})
    }
}

const appointmentsAdmin = async(req,res) => {
    try{
        const appointments = await appointmentsModel.find({})
        res.json({success:true,appointments});
    }
    catch(err){
        console.log("error in getting data of all doctors by admin : ",err);
        res.json({success:false,message:err.message})
    }
}

const appointmentCancel = async(req,res) => {
    try{
        const {appointmentId} = req.body

        const appointmentData = await appointmentsModel.findById(appointmentId)

        await appointmentsModel.findByIdAndUpdate(appointmentId,{cancelled:true});

        const {docId,slotDate,slotTime} = appointmentData;
        
        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;
        slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);

        await doctorModel.findByIdAndUpdate(docId,{slots_booked});

        res.json({success:true,message:"Appointment cancelled"})
    }
    catch(err){
        console.log(err);   
        res.json({success:false,message:err});
    }
}

//api to get dashboard data for admin panel
const adminDashboard = async(req,res) => {
    try{
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentsModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData});
    }
    catch(err){
        console.log(err);   
        res.json({success:false,message:err});
    }
}

export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard}