import { model } from "mongoose";
import Appointment from "../models/appointmentModel.js";
import GlucoseTrend from "../models/glucoseTrendModel.js";
import HealthMonitoring from "../models/healthMonitoringModel.js";
import Insurance from "../models/insuranceModel.js";
import LabReport from "../models/labReportModel.js";
import MedicalRecord from "../models/medicalRecordModel.js";
import Medication from "../models/medicationModel.js";
import User from '../models/userModel.js'
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const modelMap = {
    user: User,
    appointments: Appointment,
    glucoseTrends: GlucoseTrend,
    healthMonitorings: HealthMonitoring,
    insurance: Insurance,
    labReports: LabReport,
    medicalRecords: MedicalRecord,
    medications: Medication,
};

const signup = async (req, res) => {
    try {
        const { name, age, gender, bloodGroup, contact, email, password, emergencyContact, profileImage, pin } = req.body;
        console.log("Signup request body:", req.body);
        
        // Validate required fields
        if (!name || !age || !gender || !bloodGroup || !contact || !email || !password || !pin) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        console.log("existingUser : ", existingUser);
        
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        console.log("no user found with this email, proceeding to create a new user");
        

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("current before hashedPassword : ");
        const hashedPin = await bcrypt.hash(pin, 10);

        // Create new user
        const newUser = new User({
            name,
            age,
            gender,
            bloodGroup,
            contact,
            email,
            password: hashedPassword,
            emergencyContact,
            profileImage,
            pin: hashedPin
        });

        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (err) {
        console.error("Error in signup:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        console.log(token);

        return res.status(200).json({
            success: true,
            message: "Signin successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (err) {
        console.error("Error in signin:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getUserDetail = async (req, res) => {
    try {
        const userId = req.userId
        console.log(userId);

        const { detailType } = req.body; // Extract userId & detailType
        if (!userId || !detailType) {
            return res.status(400).json({
                success: false,
                message: "User ID and detail type are required",
            });
        }

        const Model = modelMap[detailType];

        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid detail type",
            });
        }

        let key
        if (detailType === 'user') {
            key = "_id"
        }
        else {
            key = "userId"
        }
        // console.log("key : ",key);

        // Fetch data based on userId
        const data = await Model.find({ [key]: userId });

        if (detailType === "user") console.log("user : ", data, userId);

        return res.status(200).json({
            success: true,
            message: `${detailType} fetched successfully`,
            data: data,
        });

    } catch (err) {
        console.error("Error in getting details:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const storeUserDetail = async (req, res) => {
    try {
        const { userId, detailType, data } = req.body;

        if (!userId || !detailType || !data) {
            return res.status(400).json({
                success: false,
                message: "User ID, detail type, and data are required",
            });
        }

        const Model = modelMap[detailType];
        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid detail type",
            });
        }

        data.userId = userId; // Ensure userId is assigned
        const newEntry = await Model.create(data);

        res.status(201).json({
            success: true,
            message: `${detailType} added successfully`,
            data: newEntry,
        });
    } catch (err) {
        console.error("Error in storing details:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getQRData = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id is missing",
            });
        }

        const qrData = {};

        for (const detailType of Object.keys(modelMap)) {
            const model = modelMap[detailType];
            let key = "userId"

            if (detailType === "user") {
                key = "_id"
            }

            const data = await model.find({ [key]: userId }); // Await inside a loop
            qrData[detailType] = data;
        }

        console.log(qrData);

        return res.status(200).json({
            success: true,
            message: "QR data retrieved successfully",
            data: qrData,
        });
    } catch (err) {
        console.error("Error in getting QR details:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const authToken = process.env.VITE_VIDEOSDK_AUTHTOKEN || 'your-default-auth-token'

const createMeeting = async ({ token = authToken }) => {
  try {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
      method: "POST",
      headers: {
        authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const { roomId } = await res.json()
    console.log("Created Room ID:", roomId)
    return roomId
  } catch (error) {
    console.error("Error creating meeting:", error)
    throw error
  }
}

const bookAppointment = async (req, res) => {
    try {
        const { docId, slotDate, slotTime } = req.body
        const userId = req.userId
        const docData = await doctorModel.findById(docId).select('-password')

        // console.log("docData : ",docData);

        if (!slotTime) {
            return res.json({ success: false, message: "select time" })
        }

        if (!slotDate) {
            return res.json({ success: false, message: "select date" })
        }

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor not available" })
        }

        let slots_booked = docData.slots_booked
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes[slotTime]) {
                return res.json({ success: false, message: "slot not available" });
            }
            else {
                slots_booked[slotDate].push(slotTime);
            }
        }
        else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await User.findById(userId).select('-password')
        const meetingId = await createMeeting({ token: process.env.VITE_VIDEOSDK_AUTHTOKEN });

        delete docData.slots_booked;

        const appointment = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
            meetingId
        }

        const newAppointment = new appointmentModel(appointment);
        newAppointment.save();

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: "appointment is booked" })
    }
    catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

const listAppointments = async (req, res) => {
    // console.log("Listing appointments for user");
    try {
        const userId = req.userId
        // console.log("userId : ",userId);

        const appointments = await Appointment.find({ userId })

        res.json({ success: true, appointments });
    }
    catch (err) {
        console.log(err);
        res.json({ success: false, message: err });
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.userId; // assuming authentication middleware adds this
        const {
            name,
            age,
            gender,
            bloodGroup,
            contact,
            email,
            pin,
            emergencyContact,
            profileImage
        } = req.body;

        // console.log("Updating profile for userId:", userId);

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (age) user.age = age;
        if (gender) user.gender = gender;
        if (bloodGroup) user.bloodGroup = bloodGroup;
        if (contact) user.contact = contact;
        if (email) user.email = email;
        if (pin) user.pin = pin;
        if (profileImage) user.profileImage = profileImage;

        if (emergencyContact) {
            user.emergencyContact.name = emergencyContact.name || user.emergencyContact.name;
            user.emergencyContact.relation = emergencyContact.relation || user.emergencyContact.relation;
            user.emergencyContact.phone = emergencyContact.phone || user.emergencyContact.phone;
        }

        await user.save();

        console.log("Profile updated successfully for userId:", userId);
        

        res.status(200).json({ success: true, message: "Profile updated successfully", user });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export { getUserDetail, signup, signin, storeUserDetail, getQRData, bookAppointment, listAppointments, updateProfile };
