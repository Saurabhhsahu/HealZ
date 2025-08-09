import express from "express";
import { getUserDetail,signup,storeUserDetail,signin,getQRData,bookAppointment,listAppointments,updateProfile } from "../controllers/profileController.js";
import {authMiddleware,qrMiddleware} from '../middlewares/auth.js'
import upload from '../middlewares/multer.js'; // adjust path as needed

const userRouter = express.Router();

// Route to get user details
userRouter.post("/getUserDetail",authMiddleware, getUserDetail);
userRouter.post("/storeUserDetail",authMiddleware, storeUserDetail);
userRouter.post("/update-profile",authMiddleware,upload.single('profileImage'), updateProfile);
userRouter.get("/qr-data/:token",qrMiddleware, getQRData);
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

userRouter.post("/book-appointment",authMiddleware, bookAppointment);
userRouter.get("/list-appointment",authMiddleware,listAppointments);

export default userRouter;
