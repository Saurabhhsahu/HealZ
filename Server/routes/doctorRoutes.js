import express from 'express'
import { doctorList,loginDoctor,allAppointments,appointmentCancel,appointmentComplete,dashboardData,doctorProfile,updateDoctorProfile } from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router();

doctorRouter.get('/list',doctorList);
doctorRouter.post('/login',loginDoctor);
doctorRouter.get('/appointments',authDoctor,allAppointments)
doctorRouter.post('/cancelAppointment',authDoctor,appointmentCancel);
doctorRouter.post('/completeAppointment',authDoctor,appointmentComplete)
doctorRouter.get('/dashboard',authDoctor,dashboardData)
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/updateProfile',authDoctor,updateDoctorProfile)

export default doctorRouter