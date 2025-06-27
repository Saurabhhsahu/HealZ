import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
    userId:{
        type: String,
        required:true
    },
    name: { 
        type: String, 
        required: true },
    dosage: { 
        type: String, 
        required: true },
    frequency: { 
        type: String, 
        required: true },
    startDate: { 
        type: Date, 
        required: true },
    refillDate: { 
        type: Date, 
        required: true },
    instructions: { 
        type: String 
    }
}, { timestamps: true });

const Medication = mongoose.model("Medication", medicationSchema);
export default Medication;